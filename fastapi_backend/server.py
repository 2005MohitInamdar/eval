import uvicorn
import logging
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import HTTPException, status
from fastapi.responses import StreamingResponse
from app import run_chain
from resume_evaluation.evaluation import resume_evaluation
from .supabase_integration.authentication.signup_functions import  signout_user, signup_user
from .supabase_integration.authentication.login_functions import login_user
from .supabase_integration.authentication.auth_extra_functions import reset_password_using_email,update_user_email
app = FastAPI()

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


def auth_action_function():
    try:
        pass
    except not auth_response["success"]:
        
    except Exception as e:
        return f"Error: {str(e)}"

@app.get("/health")
def home():
    return {"message": "Backend health 🟢"}


# auth api endpoints start
@app.post("/signup")
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
    return {"response": auth_response}

@app.post("/reset_password")
def password_reset(request: ResetPasswordRequest):
    auth_response = reset_password_using_email(request.user_email)
    return {"response": auth_response}

@app.post("/update_user_email")
def email_update(request: UpdateUserEmail):
    auth_response = update_user_email(request.user_email)
    return {"response": auth_response}
# auth api endpoints end


output = []
@app.post("/resume_analysis")
async def resume_analysis(request: EvaluationRequest):
    generator = resume_evaluation(request.user_input)
    output.append(generator)
    return StreamingResponse(generator, media_type="text/event-stream")


@app.post("/generate_questions")
async def generate_questions(request: RequestQuestions):
    generator = run_chain(request.frontend_data)
    return StreamingResponse(generator, media_type="text/event-stream")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)