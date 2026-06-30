from typing_extensions import TypedDict
from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv
from langgraph.graph import StateGraph, START, END
import asyncio
load_dotenv()

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


# this will generate the first question
async def genenrate_questions(user_prompt:str) :
    prompt = user_prompt
    async for chunk in client.astream(prompt):
        if chunk.content:
            yield f"data: {chunk.content}\n\n"




# class State(TypedDict):
#     question:str
#     answer:str
#     evaluation_result:str

# def evaluate(state: State) -> State:
#     question = state["question"]
#     answer = state["answer"]
#     result = c1.invoke(f"k dude am giving you an interview question and the answer that the user gave and you have to evaluate the answer as to how accurate/good the answer was and if the answer is not according to expectations then prompt me to ask a deeper question based on this one Here is the question {question} and this is the answer {answer} evaluate it also you just have to prompt if we have to ask a follow up qustion or not if we have to ask a follow up question then just say ask a follow up question and if the answer is good enough prompt okay moving to the next question, ask a follow up question if the answer is too bad!")

#     return {"evaluation_result": result.content}

# workflow = StateGraph(State)

# workflow.add_node("evaluate", evaluate)
# # workflow.add_node("genenrate_questions", )
# workflow.add_edge(START, "evaluate")
# workflow.add_edge("evaluate", END)

# app = workflow.compile()


# def run_evaluation(question:str, answer:str):
#     initial_val = {
#         "question":question,
#         "answer": answer,
#         "evaluation_result": ""
#     }
#     final_state = app.invoke(initial_val)
#     print(final_state["evaluation_result"])





