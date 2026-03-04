import os
import requests
import base64
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="HandSpeak API", description="Backend for translating HandSpeak sensor data and generating TTS")

# Allow CORS so the frontend can easily communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage of the latest translated word
latest_translation = "Awaiting connection..."

# HuggingFace API setup
# Defaulting to a high-quality free TTS model on HuggingFace Hub
HF_API_URL = "https://api-inference.huggingface.co/models/espnet/kan-bayashi_ljspeech_vits"
HF_API_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN", "")

class SensorData(BaseModel):
    sensor_value: str
    
class TTSRequest(BaseModel):
    text: str

@app.post("/api/sensor")
async def receive_sensor_data(data: SensorData):
    """
    Endpoint for the ESP Wi-Fi module to POST sensor data.
    Simulates a translation model logic.
    """
    global latest_translation
    
    # Mock translation dictionary mapping sensor input to words
    mock_translations = {
        "1": "Hello",
        "2": "Welcome",
        "3": "Help",
        "4": "Yes",
        "5": "No",
        "6": "Thank You",
        "7": "Good Morning",
        "8": "HandSpeak",
    }
    
    # Update the global translation state
    latest_translation = mock_translations.get(data.sensor_value, f"Word_{data.sensor_value}")
    
    return {
        "status": "success",
        "message": "Data received and translated",
        "translated_word": latest_translation
    }


@app.get("/api/translation")
async def get_latest_translation():
    """
    Endpoint for the frontend to poll the latest translated word.
    """
    return {"text": latest_translation}


@app.post("/api/tts")
async def convert_text_to_speech(req: TTSRequest):
    """
    Endpoint that requests audio from HuggingFace and returns it as a Base64 string to the frontend.
    """
    if not HF_API_TOKEN:
        # Fallback if no token is provided: throw 500 or return placeholder
        raise HTTPException(status_code=500, detail="HuggingFace API token is missing. Please set HUGGINGFACE_API_TOKEN in backend/.env")

    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    payload = {"inputs": req.text}

    try:
        # Send post request to HuggingFace Inference API
        response = requests.post(HF_API_URL, headers=headers, json=payload)
        response.raise_for_status() # Raise exception for 4xx/5xx errors
        
        # Audio response comes as bytes, let's base64 encode it so JSON can easily transport it
        audio_b64 = base64.b64encode(response.content).decode("utf-8")
        
        # We prefix it with data URL scheme for the browser
        audio_data_url = f"data:audio/flac;base64,{audio_b64}"
        
        return {"audio_url": audio_data_url}
        
    except requests.exceptions.RequestException as e:
        print(f"HF Error: {e}")
        # Could be rate-limited, model loading, or bad token.
        raise HTTPException(status_code=502, detail="Failed to retrieve audio from HuggingFace. Ensure your token is valid and model is not loading.")
