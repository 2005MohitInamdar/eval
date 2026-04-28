import uvicorn
import logging
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException, status, Request, Depends
from fastapi.responses import StreamingResponse
from resume_evaluation.evaluation import resume_evaluation
from supabase_integration.auth import supabase
from urllib.parse import unquote
from resume_evaluation.resume_extraction import resume_Parser
from mock_interview.interview import run_chain

app = FastAPI() 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()


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


class interview(BaseModel):
    loggedUserID:str
    interview_type:str
    interview_role:str



@app.get("/health")
def home():
    return {"message": "Backend health 🟢"}


# auth api endpoints start

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




async def download_file(filePath):
    fileBytes = supabase.storage.from_('resumes').download(filePath)
    return fileBytes
    
@app.post("/uploadedResume")
async def analyzeResume(payload: uploadedResume):
    print("File name: ", payload.file_path)
    try:
        source = await download_file(payload.file_path)
        structured_resposnse = await resume_Parser(source, payload.file_name)
        print("structured_data: ", structured_resposnse)
        return {
            "status":"success",
            "message": "metadata synched", 
            "path_received": payload.file_path,
            "extracted_resume_details": structured_resposnse
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/mock_interview")
async def mock_interview(interview_data: interview):
    # print("interview data: ", interview_data)

    return StreamingResponse(
            run_chain(interview_data.loggedUserID, interview_data.interview_type, interview_data.interview_role), 
            media_type="text/event-stream"
        )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)