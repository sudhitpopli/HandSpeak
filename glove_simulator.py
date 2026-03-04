import requests
import time
import sys
import argparse

def serve_baseline(server_url):
    print("\n[Simulator] Triggering single baseline calibration...")
    try:
        res = requests.post(f"{server_url}/api/calibrate", timeout=5)
        if res.status_code == 200:
            # Send resting neutral state (Downward, Straight Finger)
            baseline = {"index": 524, "accel": [9.87, 1.82, -1.42], "gyro": [-0.08, -0.02, 0.01]}
            requests.post(f"{server_url}/api/sensor", json=baseline, timeout=5)
            print("   Successfully set resting hardware baseline (Downward, Straight).")
        else:
            print(f"   Failed to start calibration. Status: {res.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"   Error: {e}")

def get_telemetry_offset(word):
    """
    Returns specific sensor offsets designed to reliably trigger the 
    hardcoded mathematical thresholds in backend/app.py's prediction logic.
    """
    # Create the baseline structure (Downward, Straight)
    base = {"index": 524, "accel": [9.87, 1.82, -1.42], "gyro": [-0.08, -0.02, 0.01]}
    
    if word == "good morning":
        # Orientation 1: Downward + Straight
        base["index"] = 524
        base["accel"] = [ 9.87,  1.82, -1.42]
    elif word == "welcome to our shop":
        # Orientation 1: Downward + Bent
        base["index"] = 498
        base["accel"] = [ 9.87,  1.82, -1.42]
    elif word == "how are you":
        # Orientation 2: Upward + Straight
        base["index"] = 521
        base["accel"] = [-8.81,  0.51, -3.74]
    elif word == "here is your bill":
        # Orientation 2: Upward + Bent
        base["index"] = 498
        base["accel"] = [-8.81,  0.51, -3.74]
    elif word == "visit us again":
        # Orientation 3: Horizontal + Straight
        base["index"] = 520
        base["accel"] = [  1.06,   2.74,  -9.30]
    elif word == "thank you":
        # Orientation 3: Horizontal + Bent
        base["index"] = 498
        base["accel"] = [  1.06,   2.74,  -9.30]
        
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
     telemetry = {"index": 524, "accel": [9.87, 1.82, -1.42], "gyro": [-0.08, -0.02, 0.01]}
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
    print("Supported logic phrases to simulate: 'good morning', 'how are you', 'welcome to our shop', 'here is your bill', 'visit us again', 'thank you'")
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
