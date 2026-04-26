from llama_cloud import LlamaCloud
from dotenv import load_dotenv

load_dotenv()
client = LlamaCloud()

files = client.files.list()

# for f in files:
#     print(f.id, f.name, f.external_file_id)

client.files.delete("cf322f1e-d229-4219-9458-5f95c7f45e08")