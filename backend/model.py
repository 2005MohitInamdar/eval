import requests
import os
from dotenv import load_dotenv

load_dotenv()
url = "https://openrouter.ai/api/v1/models"

headers = {"Authorization": f"Bearer {os.getenv("OPENROUTER_API_KEY")}"}

response = requests.get(url, headers=headers)
data=response.json()
get_data = data["data"]
for c in get_data:
    print(c["id"])