from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv
import edge_tts
from playsound3 import playsound
import asyncio
load_dotenv()
# async def edge_tts_voice(text:str):
#     # str_text = str(text)
#     type(text)
#     voice = "en-US-JennyNeural"
#     output = "sample.mp3"

#     communnication = edge_tts.Communicate(text, voice)
#     await communnication.save(output)
#     return output


client = ChatOpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
    model = "openai/gpt-oss-120b",
    streaming=True
)
c1 = ChatOpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
    model = "openai/gpt-oss-120b",
)


# async def genenrate_questions(user_prompt:str):
def genenrate_questions(user_prompt:str):
    response = client.invoke(user_prompt)
    # str_text = str(response.content)
    # voice_response = await edge_tts_voice(str_text)
    # return {
    #     "text": str(response.content),
    #     "audio_path": voice_response
    # }
    return response.content

# async def evaluate_answer(question:str, answer:str):
def evaluate_answer(question:str, answer:str):
    response = c1.invoke(f"""This is an interveiew question: {question} and an answer: {answer}, you have to evaluate this and suggest some improvements return the improvements in a json format, each and every recommendation on improvement should be written in json format""")
    print(response.content)

# asyncio.run(genenrate_questions("Hello how are you?"))