import os
import urllib.request

output_dir = "frontend/public/images"
os.makedirs(output_dir, exist_ok=True)

# Using a reliable placeholder image service
images = {
    "hero_placeholder.png": "https://cr-skills.s3.amazonaws.com/placeholders/600x400.png",
    "service_1.png": "https://cr-skills.s3.amazonaws.com/placeholders/200x200.png",
    "service_2.png": "https://cr-skills.s3.amazonaws.com/placeholders/200x200.png",
    "service_3.png": "https://cr-skills.s3.amazonaws.com/placeholders/200x200.png",
    "service_4.png": "https://cr-skills.s3.amazonaws.com/placeholders/200x200.png",
    "team_1.png": "https://cr-skills.s3.amazonaws.com/placeholders/150x150.png",
    "team_2.png": "https://cr-skills.s3.amazonaws.com/placeholders/150x150.png",
    "contact_illustration.png": "https://cr-skills.s3.amazonaws.com/placeholders/300x300.png",
}

for name, url in images.items():
    path = os.path.join(output_dir, name)
    try:
        # We can just write a basic raw transparent 1x1 png if internet fails, but let's try downloading
        urllib.request.urlretrieve(url, path)
        print(f"Downloaded {name}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")
        # Fallback to extremely basic valid 1x1 transparent PNG bytes
        with open(path, "wb") as f:
            f.write(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\x0bIDAT\x08\xd7c\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82')
        print(f"Created fallback 1x1 PNG for {name}")
