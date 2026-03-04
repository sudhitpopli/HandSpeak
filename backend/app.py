import os
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI(title="HandSpeak API", description="Backend for translating HandSpeak sensor data and serving local TTS audio")

# Allow CORS so the frontend can communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure the audio directory exists
AUDIO_DIR = "audio_files"
os.makedirs(AUDIO_DIR, exist_ok=True)

# Mount the static files directory so the frontend can access the MP3 files via HTTP
app.mount("/audio", StaticFiles(directory=AUDIO_DIR), name="audio")

import math

# In-memory storage of the latest translated word
latest_translation = "Awaiting connection..."

# Hardware Connection State
hardware_connected = False

# Single Baseline Calibration state
baseline_data = None
is_calibrating = False

class SensorData(BaseModel):
    index: int
    accel: list[float]
    gyro: list[float]
    
class TTSRequest(BaseModel):
    text: str

@app.post("/api/calibrate")
async def start_calibration():
    """
    Sets the backend in 'calibration mode' to capture a single resting baseline profile
    on the next sensor payload.
    """
    global is_calibrating
    is_calibrating = True
    return {"status": "success", "message": "Waiting for next sensor reading to set hardware baseline."}

@app.get("/api/status")
async def get_hardware_status():
    """
    Endpoint for frontend to track hardware connection and calibration states.
    """
    return {
        "hardware_connected": hardware_connected,
        "is_calibrated": baseline_data is not None
    }

@app.post("/api/reset")
async def reset_backend_state():
    """
    Utility endpoint to reset the server memory so you don't have to restart the python terminal locally.
    """
    global hardware_connected, baseline_data, is_calibrating, latest_translation
    hardware_connected = False
    baseline_data = None
    is_calibrating = False
    latest_translation = "Awaiting connection..."
    return {"status": "success", "message": "Server state wiped."}

def predict_from_baseline(data: SensorData, baseline: dict) -> str:
    """
    Predefined logic: Generates the word output entirely based on offsets from the baseline calibration.
    """
    if not baseline:
        return None
        
    # Calculate offset deltas from the baseline state
    idx_diff = data.index - baseline["index"]
    ax_diff = data.accel[0] - baseline["accel"][0]
    ay_diff = data.accel[1] - baseline["accel"][1]
    az_diff = data.accel[2] - baseline["accel"][2]
    
    # Mathematical Threshold Predefined Rule-Set
    # Adjust these hardcoded values when you test with the real glove!
    if idx_diff > 150:
        return "Good Morning" # e.g. Index Finger curled
    elif ax_diff > 4.0:
        return "How Are You"   # e.g. Hand sweeping up
    elif ax_diff < -4.0:
        return "Welcome To Our Shop"    # e.g. Hand sweeping down
    elif ay_diff > 4.0:
        return "Here Is Your Bill"
    elif az_diff > 4.0:
        return "Visit Us Again"
        
    # No major deviations detected
    return None

@app.post("/api/sensor")
async def receive_sensor_data(data: SensorData):
    """
    Endpoint for the ESP Wi-Fi module or Python simulator to POST sensor data.
    """
    global latest_translation, is_calibrating, baseline_data, hardware_connected
    
    hardware_connected = True # First packet confirms physical hardware exists
    
    if is_calibrating:
        # Save the single raw telemetry baseline snapshot
        baseline_data = {"index": data.index, "accel": data.accel, "gyro": data.gyro}
        is_calibrating = False
        return {
            "status": "success",
            "message": "Successfully set baseline calibration from hardware.",
            "translated_word": latest_translation
        }
        
    if not baseline_data:
         return {
            "status": "waiting",
            "message": "Waiting for single baseline calibration. Please hit the Calibrate button.",
            "translated_word": latest_translation
        }

    # Run predefined logic using the single calibration baseline
    prediction = predict_from_baseline(data, baseline_data)
    
    if prediction:
         if latest_translation != prediction:
              latest_translation = prediction
         msg = f"Predicted offset gesture: {prediction}"
    else:
         msg = "Hardware returning to baseline rest state."

    return {
        "status": "success",
        "message": msg,
        "translated_word": latest_translation
    }


@app.get("/api/translation")
async def get_latest_translation():
    """
    Endpoint for the frontend to poll the latest translated word.
    """
    return {"text": latest_translation}


@app.post("/api/tts")
async def get_local_audio(req: TTSRequest):
    """
    Endpoint that maps a text string to a local audio file and returns its HTTP URL.
    """
    if not req.text:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    # Create a safe filename, e.g., "Thank You" -> "thank_you"
    safe_filename = "".join([c if c.isalnum() else "_" for c in req.text.strip().lower()])
    
    # Try multiple formats if you wish, defaulting to mp3
    file_path_mp3 = os.path.join(AUDIO_DIR, f"{safe_filename}.mp3")
    file_path_wav = os.path.join(AUDIO_DIR, f"{safe_filename}.wav")

    # Check if the file exists in the directory
    if os.path.exists(file_path_mp3):
        return {"audio_url": f"http://localhost:8000/audio/{safe_filename}.mp3"}
    elif os.path.exists(file_path_wav):
         return {"audio_url": f"http://localhost:8000/audio/{safe_filename}.wav"}
    else:
        # Missing file handler
        error_msg = f"Audio file missing! Please add either '{safe_filename}.mp3' or '{safe_filename}.wav' into backend/{AUDIO_DIR}/ to play audio for this word."
        raise HTTPException(status_code=404, detail=error_msg)
