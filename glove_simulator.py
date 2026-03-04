import requests
import time
import sys
import argparse

def serve_baseline(server_url):
    print("\n[Simulator] Triggering single baseline calibration...")
    try:
        res = requests.post(f"{server_url}/api/calibrate", timeout=5)
        if res.status_code == 200:
            # Send resting neutral state
            baseline = {"index": 0, "accel": [0.0, 0.0, 0.0], "gyro": [0.0, 0.0, 0.0]}
            requests.post(f"{server_url}/api/sensor", json=baseline, timeout=5)
            print("   Successfully set resting hardware baseline (Values at 0).")
        else:
            print(f"   Failed to start calibration. Status: {res.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"   Error: {e}")

def get_telemetry_offset(word):
    """
    Returns specific sensor offsets designed to reliably trigger the 
    hardcoded mathematical thresholds in backend/app.py's prediction logic.
    """
    base = {"index": 0, "accel": [0.0, 0.0, 0.0], "gyro": [0.0, 0.0, 0.0]}
    
    # Mathematical Thresholds from app.py:
    # "Good Morning" -> idx > 150
    # "How Are You" -> accel_x > 4.0
    # "Welcome To Our Shop" -> accel_x < -4.0
    # "Here Is Your Bill" -> accel_y > 4.0
    # "Visit Us Again" -> accel_z > 4.0
    
    if word == "good morning":
        base["index"] = 200
    elif word == "how are you":
        base["accel"][0] = 5.0
    elif word == "welcome to our shop":
        base["accel"][0] = -5.0
    elif word == "here is your bill":
        base["accel"][1] = 5.0
    elif word == "visit us again":
        base["accel"][2] = 5.0
        
    return base

def send_telemetry(word_phrase, server_url):
    telemetry = get_telemetry_offset(word_phrase)
    print(f"[Simulator] Sending deviation signature -> index:{telemetry['index']}, accel_x:{telemetry['accel'][0]}...")
    try:
        response = requests.post(f"{server_url}/api/sensor", json=telemetry, timeout=5)
        if response.status_code == 200:
             msg = response.json().get('message')
             print(f"   Success -> Backend reported: {msg}")
        else:
            print(f"   Failed. Status code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"   Error sending telemetry: {e}")

def return_to_baseline(server_url):
     telemetry = {"index": 0, "accel": [0.0, 0.0, 0.0], "gyro": [0.0, 0.0, 0.0]}
     try:
         requests.post(f"{server_url}/api/sensor", json=telemetry, timeout=5)
     except:
         pass

def main():
    parser = argparse.ArgumentParser(description="Raw Sensor Glove Hardware Simulator")
    parser.add_argument('--url', type=str, default='http://localhost:8000', help='URL of the backend server')
    args = parser.parse_args()

    server_url = args.url

    print("="*60)
    print(" HandSpeak Predefined Logic Simulator (Shop Flow)")
    print(f" Target Server: {server_url}")
    print("="*60)
    print("Supported logic phrases to simulate: 'good morning', 'how are you', 'welcome to our shop', 'here is your bill', 'visit us again'")
    print("Type 'exit' to quit.")

    # 1. First ping the server with baseline
    serve_baseline(server_url)

    while True:
        try:
            user_input = input("\nEnter phrase to simulate: ").strip().lower()
            if user_input == 'exit':
                break
            
            if not user_input:
                continue

            print(f"\n[Glove] Translating physical movement...")
            send_telemetry(user_input, server_url)
            
            # Real hardware returns to a resting state between physical signs
            time.sleep(1)
            return_to_baseline(server_url)

        except KeyboardInterrupt:
            print("\nExiting hardware simulator.")
            sys.exit(0)

if __name__ == "__main__":
    main()
