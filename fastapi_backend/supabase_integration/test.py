import os
import requests
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_PROJECT_URL")
service_role = os.getenv("SUPABASE_SERVICE_ROLE")

upload_url = f"{url}/storage/v1/object/question_audios/test_raw_upload.mp3"

headers = {
    "Authorization": f"Bearer {service_role}",
    "apikey": service_role,
    "Content-Type": "audio/mpeg",
    "x-upsert": "true"
}

with open("sample.mp3", "rb") as f:
    response = requests.post(upload_url, headers=headers, data=f.read())

print("Status:", response.status_code)
print("Response:", response.text)