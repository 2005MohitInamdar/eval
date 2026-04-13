import requests

API_KEY = "AIzaSyDZqu5JMOqkQe1kQ4ncVw4odMlsybfz5jE"
SEARCH_ENGINE_ID = "f4a1744c106044cd9"
query = "test"

url = f"https://www.googleapis.com/customsearch/v1?key={API_KEY}&cx={SEARCH_ENGINE_ID}&q={query}"

response = requests.get(url)
print(response.json())