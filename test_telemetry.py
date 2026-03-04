import requests
import sys

def send_telemetry():
    url = 'http://localhost:8000/api/sensor'
    try:
        if len(sys.argv) > 1:
            sensor_val = " ".join(sys.argv[1:])
        else:
            sensor_val = "Hello world"
            
        data = {"sensor_value": sensor_val}
        print(f"Sending ESP Telemetry: '{sensor_val}'")
        
        response = requests.post(url, json=data)
        
        if response.status_code == 200:
            print(f"Success! Response: {response.json()}")
        else:
            print(f"Failed. Status Code: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the backend.")
        print("Make sure your FastAPI server is running on port 8000!")

if __name__ == "__main__":
    send_telemetry()
