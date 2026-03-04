import os
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
app = FastAPI(title="HandSpeak API", description="Backend for translating HandSpeak sensor data and serving local TTS audio")
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Allow CORS so the frontend can communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Audio files are now served directly by the frontend

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
    

@app.post("/api/calibrate")
async def start_calibration():
    """
    Sets the backend in 'calibration mode' to capture a single resting baseline profile
    on the next sensor payload.
    """
    global is_calibrating
    is_calibrating = True
    print("\n[DEBUG] /api/calibrate hit -> Backend is now awaiting the next hardware payload to set the baseline.")
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
    
    print("\n[DEBUG] /api/reset hit -> Wiping all server memory states.")
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
    
    # Detect Finger Flex (Value drops by ~26 when bent)
    is_bent = idx_diff < -15
    
    print(f"   [Prediction Logic] Offsets -> idx_diff: {idx_diff:.2f}, ax_diff: {ax_diff:.2f}, is_bent: {is_bent}")
    
    # Orientation 1: Downward (Resting Baseline ~ 0 offset)
    if ax_diff > -5.0:
        if is_bent:
            return "Welcome To Our Shop"
        else:
            return "Good Morning"
            
    # Orientation 2: Upward (ax drops massively by ~ -18.6)
    elif ax_diff < -12.0:
        if is_bent:
            return "Here Is Your Bill"
        else:
            return "How Are You"
            
    # Orientation 3: Horizontal (ax drops by ~ -8.8, az drops by -7.8)
    elif ax_diff <= -5.0 and ax_diff >= -12.0:
        if is_bent:
            return "Thank You"
        else:
            return "Visit Us Again"
        
    return None

@app.post("/api/sensor")
async def receive_sensor_data(data: SensorData):
    """
    Endpoint for the ESP Wi-Fi module or Python simulator to POST sensor data.
    """
    global latest_translation, is_calibrating, baseline_data, hardware_connected
    
    if not hardware_connected:
        print("\n[DEBUG] PHYSICAL HARDWARE CONNECTION ESTABLISHED!")
        hardware_connected = True # First packet confirms physical hardware exists
        
    print(f"\n[DEBUG] POST /api/sensor -> Raw Payload Received: flex:{data.index}, accel:[{data.accel[0]:.2f}, {data.accel[1]:.2f}, {data.accel[2]:.2f}], gyro:[{data.gyro[0]:.2f}, {data.gyro[1]:.2f}, {data.gyro[2]:.2f}]")
    
    if is_calibrating:
        # Save the single raw telemetry baseline snapshot
        baseline_data = {"index": data.index, "accel": data.accel, "gyro": data.gyro}
        is_calibrating = False
        print(f"[DEBUG] Baseline Locked In! Saved configuration -> {baseline_data}")
        return {
            "status": "success",
            "message": "Successfully set baseline calibration from hardware.",
            "translated_word": latest_translation
        }
        
    if not baseline_data:
         print("[DEBUG] Payload ignored -> Server is waiting for the user to perform baseline calibration.")
         return {
            "status": "waiting",
            "message": "Waiting for single baseline calibration. Please hit the Calibrate button.",
            "translated_word": latest_translation
        }

    # Run predefined logic using the single calibration baseline
    prediction = predict_from_baseline(data, baseline_data)
    
    if prediction:
         if latest_translation != prediction:
              print(f"[DEBUG] Valid Gesture Detected! State updated from '{latest_translation}' to '{prediction}'")
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


