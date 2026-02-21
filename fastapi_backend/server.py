from fastapi import FastAPI
from pydantic import BaseModel
from resume_evaluation.evaluation import resume_evaluation
from fastapi.responses import StreamingResponse
import uvicorn
import logging
from app import run_chain
app = FastAPI()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
class EvaluationRequest(BaseModel):
    user_input: str

class RequestQuestions(BaseModel):
    frontend_data: str

@app.get("/")
def home():
    return "Hello world"

output = []
@app.post("/resume_analysis")
async def resume_analysis(request: EvaluationRequest):
    generator = resume_evaluation(request.user_input)
    output.append(generator)
    # print(output)
    return StreamingResponse(generator, media_type="text/event-stream")

@app.post("/generate_questions")
async def generate_questions(request: RequestQuestions):
    generator = run_chain(request.frontend_data)
    # print(generator)
    return StreamingResponse(generator, media_type="text/event-stream")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)