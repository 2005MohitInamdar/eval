import requests

API_KEY = ""
SEARCH_ENGINE_ID = ""
query = "test"

url = f"https://www.googleapis.com/customsearch/v1?key={API_KEY}&cx={SEARCH_ENGINE_ID}&q={query}"

response = requests.get(url)
print(response.json())
