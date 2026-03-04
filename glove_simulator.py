import requests
import time
import sys
import argparse

def send_word(word, server_url):
    print(f"Sending hardware signal: '{word}' -> {server_url}/api/sensor")
    try:
        response = requests.post(f"{server_url}/api/sensor", json={"text": word}, timeout=5)
        if response.status_code == 200:
            print(f"   Success: {response.json()}")
        else:
            print(f"   Failed to send telemetry. Status code: {response.status_code}")
            print(f"   Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"   Error sending telemetry: {e}")

def main():
    parser = argparse.ArgumentParser(description="Glove Hardware Simulation Script")
    parser.add_argument('--url', type=str, default='http://localhost:8000', help='URL of the backend server')
    args = parser.parse_args()

    server_url = args.url

    print("="*50)
    print(" HandSpeak Glove Hardware Simulator")
    print(f" Target Server: {server_url}")
    print("="*50)
    print("Type a sentence to send it word-by-word with a delay (simulating glove actions).")
    print("Type 'exit' to quit.")

    while True:
        try:
            user_input = input("\nEnter sentence to simulate: ")
            if user_input.lower() == 'exit':
                break
            
            if not user_input.strip():
                continue

            words = user_input.strip().split()
            print(f"\n[Glove] Translating sequence of {len(words)} movements...")
            for word in words:
                send_word(word, server_url)
                # Realistic gap between signing words
                time.sleep(1.2)
                
            print("[Glove] Sequence complete.")

        except KeyboardInterrupt:
            print("\nExiting hardware simulator.")
            sys.exit(0)

if __name__ == "__main__":
    main()
