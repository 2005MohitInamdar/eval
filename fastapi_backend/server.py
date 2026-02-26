import uvicorn
import logging
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException, status, Request, Depends
from fastapi.responses import StreamingResponse
from app import run_chain
from resume_evaluation.evaluation import resume_evaluation
from supabase_integration.authentication.signup_functions import  signout_user, signup_user
from supabase_integration.authentication.login_functions import login_user
from supabase_integration.authentication.auth_extra_functions import reset_password_using_email,update_user_email, update_user_password
from supabase_integration.authentication.auth import supabase
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:4200"],
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Validates the JWT token sent in the Authorization header.
    """
    token = credentials.credentials
    try:
        # Ask Supabase to verify this specific JWT
        supabase.postgrest.auth(token)
        user_response = supabase.auth.get_user(token)
        
        if not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired session",
            )
        return user_response.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
        )

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
class EvaluationRequest(BaseModel):
    user_input: str

class RequestQuestions(BaseModel):
    frontend_data: str

class SignupRequest(BaseModel):
    user_name:str
    signup_email:str
    signup_password: str

class LoginRequest(BaseModel):
    login_email:str
    login_password:str

class ResetPasswordRequest(BaseModel):
    user_email:str


class UpdateUserEmail(BaseModel):
    user_email:str

class UpdateUserPassword(BaseModel):
    password:str

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



@app.post("/signup", status_code=status.HTTP_201_CREATED)
def create_user(request: SignupRequest):
    auth_response = signup_user(request.user_name, request.signup_email, request.signup_password)
    return {"response": auth_response}
    

@app.post("/logout")
def logout_current_user():
    auth_response = signout_user()
    return {"response": auth_response}




@app.post("/login")
def login(request: LoginRequest):
    auth_response = login_user(request.login_email, request.login_password)
    if not auth_response:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Email or password"
        )
    return {"response": auth_response}
    

@app.post("/reset_password")
def password_reset(request: ResetPasswordRequest):
    auth_response = reset_password_using_email(request.user_email)
    return {"response": auth_response}
    

@app.post("/update_user_email")
def email_update(request: UpdateUserEmail, user=Depends(get_current_user)):
    logging.info(f"User {user.id} is requesting to change email")
    auth_response = update_user_email(request.user_email)
    return {"response": auth_response}


@app.post("/update_user_password")
def email_update(request: UpdateUserPassword, user=Depends(get_current_user)):
    logging.info(f"User {user.id} is requesting to change password")
    auth_response = update_user_password(request.password)
    return {"response": auth_response}
# auth api endpoints end


# output = []
@app.post("/resume_analysis")
async def resume_analysis(request: EvaluationRequest, user=Depends(get_current_user)):
    logging.info(f"User {user.id} is requesting analysis")
    generator = resume_evaluation(request.user_input)
    # output.append(generator)
    return StreamingResponse(generator, media_type="text/event-stream")


@app.post("/generate_questions")
async def generate_questions(request: RequestQuestions, user=Depends(get_current_user)):
    logging.info(f"User {user.id} is requesting for interview questions")
    generator = run_chain(request.frontend_data)
    return StreamingResponse(generator, media_type="text/event-stream")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)