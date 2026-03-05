#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

// --- CONFIGURATION ---
const char* ssid = "YOUR_WIFI_SSID";         // Your home WiFi name
const char* password = "YOUR_WIFI_PASSWORD"; // Your home WiFi password
// IMPORTANT: Put your PC's local IPv4 address here. 
// Do NOT use localhost/127.0.0.1 on the ESP8266, use your PC's machine IP on the local network.
const char* serverUrl = "https://handspeak-hjzv.onrender.com/api/sensor"; 

const int FLEX_PIN = A0;

Adafruit_MPU6050 mpu;

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) { 
    delay(500); 
    Serial.print("."); 
  }
  Serial.println("\nWiFi Connected!");
  Serial.print("ESP8266 IP Address: ");
  Serial.println(WiFi.localIP());

  wire.begin(D1, D2); // SDA, SCL pins for MPU6050
  if (!mpu.begin()) { 
    Serial.println("MPU6050 Fail! Check D1/D2 wiring."); 
    while (1); 
  }
  Serial.println("MPU6050 Found!");
}

void loop() {
  // 1. Read the Single Flex Sensor
  int indexFinger = analogRead(FLEX_PIN);

  // 2. Read the MPU6050
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  // 3. Build the JSON Payload
  // Terminology: A "Payload" is the actual data you are carrying over the network.
  String json = "{";
  json += "\"index\":" + String(indexFinger) + ",";
  json += "\"accel\":[" + String(a.acceleration.x) + "," + String(a.acceleration.y) + "," + String(a.acceleration.z) + "],";
  json += "\"gyro\":[" + String(g.gyro.x) + "," + String(g.gyro.y) + "," + String(g.gyro.z) + "]";
  json += "}";
  Serial.println(json);
  // 4. Send the POST Request to the Server
    if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    
    Serial.print("[DEBUG] Attempting to POST to backend at: ");
    Serial.println(serverUrl);

    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json"); // Tells the server we are sending JSON
    
    Serial.println("[DEBUG] Transmitting payload...");
    int httpResponseCode = http.POST(json); // The moment of transmission
    
    if (httpResponseCode > 0) {
      Serial.print("Data sent. Server responded with code: ");
      Serial.println(httpResponseCode); // 200 means success!
    } else {
      Serial.print("Error sending POST: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  }
  
  delay(100); // 10Hz sampling rate. Don't go faster until your server proves it can handle it.
}