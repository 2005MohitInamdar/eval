# qg.py

from langchain_openai import ChatOpenAI
import os
import requests
import logging
import json
from dotenv import load_dotenv
import edge_tts
from supabase_integration.auth import get_scoped_client
from .schemas import NextQt
from datetime import datetime, timezone
import uuid
from fastapi import HTTPException
import httpx 
load_dotenv()

async def edge_tts_voice(text: str, user_id: str):
    voice = "en-US-JennyNeural"
    output = f"sample_{user_id}_{uuid.uuid4().hex}.mp3"
    communnication = edge_tts.Communicate(text, voice)
    await communnication.save(output)
    return output

client = ChatOpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
    model="openai/gpt-oss-120b",
    streaming=True
)
c1 = ChatOpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
    model="openai/gpt-oss-120b",
)


async def create_signed_url(bucket: str, path: str, access_token: str, expires_in: int = 900):
    url = os.getenv("SUPABASE_PROJECT_URL")
    publishable_key = os.getenv("SUPABASE_PUBLISHABLE_KEY")
    signed_url_endpoint = f"{url}/storage/v1/object/sign/{bucket}/{path}"
    headers = {
        "apikey": publishable_key,
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(signed_url_endpoint, json={"expiresIn": expires_in}, headers=headers)
    if resp.status_code >= 400:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    data = resp.json()
    return f"{url}/storage/v1{data['signedURL']}"



async def upload_audio_raw(local_path: str, filename: str, access_token: str):
    """
    Raw HTTP upload against the Storage REST API, authenticated as the
    specific user via their access token (publishable key + user JWT).
    """
    url = os.getenv("SUPABASE_PROJECT_URL")
    publishable_key = os.getenv("SUPABASE_PUBLISHABLE_KEY")

    upload_url = f"{url}/storage/v1/object/question_audios/{filename}"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "apikey": publishable_key,
        "Content-Type": "audio/mpeg",
        "x-upsert": "true"
    }

    with open(local_path, "rb") as f:
        response = requests.post(upload_url, headers=headers, data=f.read())

    if response.status_code not in (200, 201):
        raise Exception(f"Upload failed: {response.status_code} - {response.text}")

    return response.json()


async def genenrate_questions(user_prompt: str, user_id: str, access_token: str):
    response = await client.ainvoke(user_prompt)
    str_text = str(response.content)
    
    local_path = await edge_tts_voice(str_text, user_id)
    voice_fileName = f"{user_id}/question.mp3"   # fixed path per user — always overwritten
    voice_fileName = f"{user_id}/{uuid.uuid4().hex}.mp3"

    await upload_audio_raw(local_path, voice_fileName, access_token)


    audio_url = await create_signed_url("question_audios", voice_fileName, access_token)

    if os.path.exists(local_path):
        os.remove(local_path)

    return {
        "text": str(response.content),
        "audio_path": audio_url
    }

async def evaluate_answer(next_qt: NextQt, user_id: str, access_token: str):
    response = c1.invoke(f"""This is an interveiew question: {next_qt.first_question} and an answer: {next_qt.answer}, you have to evaluate this and suggest some improvements return the improvements in a json format, each and every recommendation on improvement should be written in json format 
    
    RULES YOU MUST ABSOLUTELY FOLLOW: 
    - Under any condition the answer that you pass should be in json format
    - include the pain point first as to what is missing or somewhat weak concept in the asnwer and provide a feedback based on it
    - all the points of correction should come under 2 to 4 points. Write the feedback in clear, simple English. Avoid overly dense academic jargon or research-paper terminology while keeping the core technical concepts and industry-standard tools accurate and actionable.
    """)

    data = {
        "session_id": str(next_qt.session_id),
        "user_id": user_id,
        "question": next_qt.first_question,
        "answer": next_qt.answer,
        "feedback": parse_feedback(response.content),
        "time_stamp": datetime.now(timezone.utc).isoformat()
    }
    try:
        scoped_client, _ = get_scoped_client(access_token)
        res = scoped_client.table("mock_interview").insert(data).execute()
        scoped_client.table("interview_sessions").update({
            "updated_at": datetime.now(timezone.utc).isoformat()
        }).eq("session_id", str(next_qt.session_id)).eq("user_id", user_id).execute()
    except Exception as e:
        logging.error("Error: ", e)


def parse_feedback(content: object) -> object:
    """Ensure feedback is valid JSON for the JSONB feedback column."""
    raw_feedback = str(content).strip()
    if raw_feedback.startswith("```"):
        raw_feedback = raw_feedback.split("\n", 1)[-1].rsplit("```", 1)[0].strip()
    try:
        return json.loads(raw_feedback)
    except json.JSONDecodeError:
        return {"feedback": raw_feedback}

