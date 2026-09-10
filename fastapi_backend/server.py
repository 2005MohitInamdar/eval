# server.py
import uvicorn
import logging
from pydantic import BaseModel, Field
from fastapi import FastAPI, BackgroundTasks, HTTPException, status, Request, Depends, Response, APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from resume_evaluation.evaluation import resume_evaluation
from supabase_integration.auth import supabase, get_scoped_client, url, publishable_key
from resume_evaluation.resume_extraction import resume_Parser
from mock_interview.qg import genenrate_questions, evaluate_answer
from mock_interview.schemas import NextQt 
from authentication.authenticator import create_supabase_user, login_supabase_user, get_supabase_user, refresh_supabase_session
import asyncio
from config import COOKIE_SETTINGS
import os
from supabase_integration.dependencies import get_current_user
from typing import Optional, List, Any
import time
import uuid
from datetime import datetime, timezone

app = FastAPI() 
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "http://localhost:4200")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

class RequestQuestions(BaseModel):
    frontend_data: str

class SignupRequest(BaseModel):
    name:str
    email:str
    password: str

class LoginRequest(BaseModel):
    login_email:str
    login_password:str

class ResetPasswordRequest(BaseModel):
    user_email:str

class UpdateUserEmail(BaseModel):
    user_email:str

class UpdateUserPassword(BaseModel):
    password:str

class uploadedResume(BaseModel):
    file_path:str
    file_name:str
    mime_type:str


class ResumeSaveRequest(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    soft_skills: List[str] = Field(default_factory=list)
    technical_skills: List[str] = Field(default_factory=list)
    experience: List[dict[str, Any]] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)
    education: List[dict[str, Any]] = Field(default_factory=list)
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    selected_company: str = Field(min_length=1, max_length=200)
    desired_role: str = Field(min_length=1, max_length=200)


class interview(BaseModel):
    interview_type:str
    interview_role:str
    intensity_level:str

class OAuthCallbackRequest(BaseModel):
    code: str

# class NextQt(BaseModel):
#     first_question:str
#     answer:str
#     loggedUserID:str
#     interview_type:str
#     interview_role:str
#     intensity_level:str

protected_router = APIRouter(dependencies=[Depends(get_current_user)])

@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc)},
    )

@app.exception_handler(Exception)
async def universal_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unhandled error: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred."},
    )

@app.get("/health")
def home():
    return {"message": "Backend health 🟢"}



@app.post("/api/auth/oauth/callback")
def oauth_callback(payload: OAuthCallbackRequest, response: Response):
    try:
        result = supabase.auth.exchange_code_for_session({"auth_code": payload.code})
        user = result.user
        session = result.session

        if session is None:
            raise ValueError("Could not establish session from OAuth code")
        response.set_cookie(
            key="access_token",
            value=session.access_token,
            max_age=60 * 60,
            **COOKIE_SETTINGS,
        )
        response.set_cookie(
            key="refresh_token",
            value=session.refresh_token,
            max_age=60 * 60 * 24 * 30,
            **COOKIE_SETTINGS,
        )
        return {
            "message": "OAuth login successful",
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.user_metadata.get("username") or user.user_metadata.get("full_name")
            }
        }
    except Exception as e:
        print("Error during OAuth callback:", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.post("/api/auth/signupUser")
def signup(payload: SignupRequest):
    try:
        result = create_supabase_user(payload.name, payload.email, payload.password)
        return result
    except Exception as e:
        print("Error during signup:", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.post("/api/auth/login")
def login(payload: LoginRequest, response: Response):
    try:
        result = login_supabase_user(payload.login_email, payload.login_password)

        response.set_cookie(
            key="access_token",
            value=result["access_token"],
            max_age=60 * 60,
            **COOKIE_SETTINGS,
        )
        response.set_cookie(
            key="refresh_token",
            value=result["refresh_token"],
            max_age=60 * 60 * 24 * 30,
            **COOKIE_SETTINGS,
        )

        # Don't send tokens in the JSON body once they're in cookies
        result.pop("access_token", None)
        result.pop("refresh_token", None)

        return result

    except Exception as e:
        print("Error during login:", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )




@app.post("/api/auth/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out successfully"}



@app.get("/api/auth/me")
def me(current_user: dict = Depends(get_current_user)):
    return {"user": current_user}


@app.post("/api/auth/refresh")
def refresh(request: Request, response: Response):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No refresh token found"
        )

    try:
        result = refresh_supabase_session(refresh_token)

        response.set_cookie(
            key="access_token",
            value=result["access_token"],
            max_age=60 * 60,
            **COOKIE_SETTINGS,
        )
        response.set_cookie(
            key="refresh_token",
            value=result["refresh_token"],
            max_age=60 * 60 * 24 * 30,
            **COOKIE_SETTINGS,
        )

        return {"message": "Session refreshed"}

    except Exception as e:
        print("Error refreshing session:", e)
        # If refresh itself fails, the refresh token is dead too — clear everything
        response.delete_cookie(key="access_token", path=COOKIE_SETTINGS["path"])
        response.delete_cookie(key="refresh_token", path=COOKIE_SETTINGS["path"])
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired, please log in again"
        )


import base64, json

import httpx
import os
async def upload_to_storage(bucket: str, path: str, contents: bytes, content_type: str, access_token: str):
    upload_url = f'{url}/storage/v1/object/{bucket}/{path}'
    headers = {
        "apikey": publishable_key,
        "Authorization": f"Bearer {access_token}",
        "Content-Type": content_type,
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(upload_url, content=contents, headers=headers)
    if resp.status_code >= 400:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    return resp.json()


@app.post("/uploadedResume")
async def analyzeResume(request: Request, file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A resume file is required")

    allowed_content_types = {
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }
    if file.content_type not in allowed_content_types:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only PDF and DOCX resumes are supported")

    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The uploaded file is empty")

        access_token = request.cookies.get("access_token")
        if not access_token:
            raise HTTPException(status_code=401, detail="Not authenticated")

        sanitized_name = "".join(c if c.isalnum() or c in "._-" else "_" for c in file.filename)
        name_of_file = f"{int(time.time() * 1000)}_{sanitized_name}"
        file_path = f"{current_user['id']}/{name_of_file}"

        await upload_to_storage("resumes", file_path, contents, file.content_type, access_token)

        structured_response = await resume_Parser(contents, file.filename)
        print("structured_data:", structured_response)

        return {
            "status": "success",
            "message": "metadata synced",
            "path_saved": file_path,
            "extracted_resume_details": structured_response
        }
    except HTTPException:
        raise
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

        
# @app.post("/uploadedResume")
# async def analyzeResume(request: Request, file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
#     if not file.filename:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A resume file is required")

#     allowed_content_types = {
#         "application/pdf",
#         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
#     }
#     if file.content_type not in allowed_content_types:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only PDF and DOCX resumes are supported")

#     try:
#         contents = await file.read()
#         if not contents:
#             raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The uploaded file is empty")

#         access_token = request.cookies.get("access_token")
#         if not access_token:
#             raise HTTPException(status_code=401, detail="Not authenticated")
#         scoped_client, storage_client = get_scoped_client(access_token)

#         payload = access_token.split(".")[1]
#         payload += "=" * (-len(payload) % 4)
#         decoded = json.loads(base64.urlsafe_b64decode(payload))
#         print(json.dumps(decoded, indent=2))
#         sanitized_name = "".join(c if c.isalnum() or c in "._-" else "_" for c in file.filename)
#         name_of_file = f"{int(time.time() * 1000)}_{sanitized_name}"
#         file_path = f"{current_user['id']}/{name_of_file}"

#         # scoped_client.storage.from_('resumes').upload(
#         #     file_path,
#         #     contents,
#         #     {"content-type": file.content_type}
#         # )
#         storage_client.from_('resumes').upload(
#             file_path,
#             contents,
#             {"content-type": file.content_type}
#         )

#         structured_response = await resume_Parser(contents, file.filename)
#         print("structured_data:", structured_response)

#         return {
#             "status": "success",
#             "message": "metadata synced",
#             "path_saved": file_path,
#             "extracted_resume_details": structured_response
#         }
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(e)
#         raise HTTPException(status_code=500, detail=str(e))
@app.post("/api/resume/save")
def save_resume_selection(payload: ResumeSaveRequest, request: Request, current_user: dict = Depends(get_current_user)):
    try:
        access_token = request.cookies.get("access_token")
        if not access_token:
            raise HTTPException(status_code=401, detail="Not authenticated")

        scoped_client, _ = get_scoped_client(access_token)   # unpack the tuple

        data_to_insert = payload.model_dump()
        data_to_insert["selected_company"] = data_to_insert["selected_company"].strip()
        data_to_insert["desired_role"] = data_to_insert["desired_role"].strip()
        if not data_to_insert["selected_company"] or not data_to_insert["desired_role"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Selected company and desired role are required",
            )
        data_to_insert["user_id"] = current_user["id"]

        result = scoped_client.table("resumes").insert(data_to_insert).execute()

        return {
            "status": "success",
            "message": "Resume selection saved",
            "data": result.data
        }
    except HTTPException:
        raise
    except Exception as e:
        print("Error saving resume selection:", e)
        raise HTTPException(status_code=500, detail=str(e))


# @app.post("/api/resume/save")
# def save_resume_selection(payload: ResumeSaveRequest, request: Request, current_user: dict = Depends(get_current_user)):
#     try:
#         access_token = request.cookies.get("access_token")
#         scoped_client = get_scoped_client(access_token)

#         data_to_insert = payload.model_dump()
#         data_to_insert["selected_company"] = data_to_insert["selected_company"].strip()
#         data_to_insert["desired_role"] = data_to_insert["desired_role"].strip()
#         if not data_to_insert["selected_company"] or not data_to_insert["desired_role"]:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Selected company and desired role are required",
#             )
#         data_to_insert["user_id"] = current_user["id"]  

#         result = scoped_client.table("resumes").insert(data_to_insert).execute()

#         return {
#             "status": "success",
#             "message": "Resume selection saved",
#             "data": result.data
#         }
#     except HTTPException:
#         raise
#     except Exception as e:
#         print("Error saving resume selection:", e)
#         raise HTTPException(status_code=500, detail=str(e))


def load_resume(user_id: str, access_token: str):
    scoped_client, _ = get_scoped_client(access_token)
    response = (
        scoped_client.table("resumes")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    if response.data:
        resume_data = response.data[0]
        print("Resume Data:", resume_data)
        return resume_data
    else:
        print("No resume found or error occurred.")
        return None
    








# @app.post("/api/resume/save")
# def save_resume_selection(payload: ResumeSaveRequest, request: Request, current_user: dict = Depends(get_current_user)):
#     try:
#         access_token = request.cookies.get("access_token")
#         if not access_token:
#             raise HTTPException(status_code=401, detail="Not authenticated")

#         scoped_client, _ = get_scoped_client(access_token)   # unpack the tuple

#         data_to_insert = payload.model_dump()
#         data_to_insert["selected_company"] = data_to_insert["selected_company"].strip()
#         data_to_insert["desired_role"] = data_to_insert["desired_role"].strip()
#         if not data_to_insert["selected_company"] or not data_to_insert["desired_role"]:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Selected company and desired role are required",
#             )
#         data_to_insert["user_id"] = current_user["id"]

#         result = scoped_client.table("resumes").insert(data_to_insert).execute()

#         return {
#             "status": "success",
#             "message": "Resume selection saved",
#             "data": result.data
#         }
#     except HTTPException:
#         raise
#     except Exception as e:
#         print("Error saving resume selection:", e)
#         raise HTTPException(status_code=500, detail=str(e))

@app.post("/mock_interview")
async def mock_interview(interview_data: interview, background_tasks: BackgroundTasks, request: Request, current_user: dict = Depends(get_current_user)):
    print("Mock Interview endpoint hit!")
    access_token = request.cookies.get("access_token")

    res_data = load_resume(current_user["id"], access_token)
    if not res_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Upload and save a resume before starting an interview")

    session_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    scoped_client, _ = get_scoped_client(access_token)
    scoped_client.table("interview_sessions").insert({
        "session_id": session_id,
        "user_id": current_user["id"],
        "interview_type": interview_data.interview_type,
        "interview_level": interview_data.intensity_level,
        "interview_role": interview_data.interview_role,
        "status": "ongoing",
        "started_at": now,
        "updated_at": now,
    }).execute()

    prompt = f"""
        You are an expert interviewer conducting an interview. Your task is to generate exactly ONE highly relevant, realistic interview question.

        Guidelines:
        1. Tailor the question specifically to the provided Interview Type and Interview Role.
        2. Strictly output ONLY the question itself. No introductory text, no conversational filler, no explanations, and no closing remarks.

        Input:
        - Interview Type: {interview_data.interview_type}
        - Interview Role: {interview_data.interview_role}
        - Interview Intensity: {interview_data.intensity_level}
        - based on this resume {res_data} see the skills and other resume related details and then ask questions accordingly. 
        """
    print("Starting the question generation!")
    response_qt = await genenrate_questions(prompt, current_user["id"], access_token)

    print("Exiting the mock interview endpoint!")
    return {
        "status": "success",
        "session_id": session_id,
        "question": response_qt["text"],
        "audio_url": response_qt["audio_path"]
    }

@app.post("/next_qt")
async def next_qt(next_qt: NextQt, background_tasks: BackgroundTasks, request: Request, current_user: dict = Depends(get_current_user)):
    access_token = request.cookies.get("access_token")
    scoped_client, _ = get_scoped_client(access_token)
    session = (
        scoped_client.table("interview_sessions")
        .select("session_id, interview_type, interview_role, interview_level, status")
        .eq("session_id", str(next_qt.session_id))
        .eq("user_id", current_user["id"])
        .limit(1)
        .execute()
    )
    if not session.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview session not found")
    session_data = session.data[0]
    if session_data["status"] != "ongoing":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This interview session is no longer active")

    res_dataForNext = load_resume(current_user["id"], access_token)
    if not res_dataForNext:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    print(res_dataForNext)
    user_prompt = f"""I am providing an interview question and the user's answer. Generate exactly one next interview question. If the answer is weak, ask one deeper question based on the previous question; otherwise move to the next relevant question. Here is the question: {next_qt.first_question}. Here is the answer: {next_qt.answer}. Interview intensity: {session_data['interview_level']}.
    IMPORTANT NOTE and RULES
    - Output only the question. Do not add explanations, feedback, labels, or conversational filler.
    - Keep the question focused on interview type {session_data['interview_type']} and role {session_data['interview_role']}.
    - Tailor the question to this resume: {res_dataForNext}.
    """

    background_tasks.add_task(evaluate_answer, next_qt, current_user["id"], access_token)
    response = await genenrate_questions(user_prompt, current_user["id"], access_token)
    scoped_client.table("interview_sessions").update({
        "updated_at": datetime.now(timezone.utc).isoformat()
    }).eq("session_id", str(next_qt.session_id)).eq("user_id", current_user["id"]).execute()

    return {
        "status": "success",
        "question": response["text"],
        "audio_url": response["audio_path"]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
