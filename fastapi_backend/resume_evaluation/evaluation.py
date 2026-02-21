from dotenv import load_dotenv
import os
import asyncio
from langchain_openai import ChatOpenAI
import logging

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

model = ChatOpenAI(
    model="liquid/lfm-2.5-1.2b-thinking:free",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    temperature=0.8,
    base_url="https://openrouter.ai/api/v1",
    streaming=True
)

async def resume_evaluation(user_input):
    "Generator function streams tokens from AI model"
    try:
        async for token in model.astream(user_input):
            content = token.content
            yield f"data: {content}\n\n"
    except Exception as e:
        logging.error(f"Stream interrupted by error", exc_info=True)
        yield f"Server Error: {str(e)}"
    