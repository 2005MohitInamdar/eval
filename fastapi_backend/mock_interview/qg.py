from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv
import edge_tts
from supabase_integration.auth import supabase

load_dotenv()
async def edge_tts_voice(text:str):
    type(text)
    voice = "en-US-JennyNeural"
    output = "sample.mp3"

    communnication = edge_tts.Communicate(text, voice)
    await communnication.save(output)
    return output


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


async def genenrate_questions(user_prompt:str):
    response = client.invoke(user_prompt)
    str_text = str(response.content)
    local_path = await edge_tts_voice(str_text)
    voice_fileName = "question.mp3"
    
    with open(local_path, 'rb') as f:
        supabase.storage.from_("question_audios").upload(
                file=f,
                path=voice_fileName,
                file_options={
                    "content-type": "audio/mpeg",
                    "upsert": "true"
                }
            )
    signed_url_response = supabase.storage.from_("question_audios").create_signed_url(
        path=voice_fileName, 
        expires_in=900
    )
    
    audio_url = signed_url_response.get("signedURL", signed_url_response)

    if os.path.exists(local_path):
        os.remove(local_path)
    
    return {
        "text": str(response.content),
        "audio_path": audio_url
    }

def evaluate_answer(question:str, answer:str):
    response = c1.invoke(f"""This is an interveiew question: {question} and an answer: {answer}, you have to evaluate this and suggest some improvements return the improvements in a json format, each and every recommendation on improvement should be written in json format 
    
    RULES YOU MUST ABSOLUTELY FOLLOW: 
    - Under any condition the answer that you pass should be in json format
    - include the pain point first as to what is missing or somewhat weak concept in the asnwer and provide a feedback based on it
    - all the points of correction should come under 2 to 4 points. Write the feedback in clear, simple English. Avoid overly dense academic jargon or research-paper terminology while keeping the core technical concepts and industry-standard tools accurate and actionable.
    """)    
    print(response.content)
