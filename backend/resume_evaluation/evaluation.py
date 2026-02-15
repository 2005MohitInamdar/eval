from dotenv import load_dotenv
import os
import asyncio
from langchain_openai import ChatOpenAI
load_dotenv()
openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
print("Initiallizing project!")
user_input=input("Enter a prompt: ")

model = ChatOpenAI(
    model="liquid/lfm-2.5-1.2b-thinking:free",
    api_key=openrouter_api_key,
    temperature=0.8,
    base_url="https://openrouter.ai/api/v1",
    streaming=True
)
try:
    async def resume_evaluation():
        async for token in model.astream(user_input):
            print(token.content, flush=True, end="")
except Exception as e:
    print(e)
except KeyboardInterrupt:
    print("Goodbye!")
    
if __name__ =="__main__":
    asyncio.run(resume_evaluation())