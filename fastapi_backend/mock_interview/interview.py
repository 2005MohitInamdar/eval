from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from typing import TypedDict
import asyncio
import os
load_dotenv()

model = ChatOpenAI(
    model = "openai/gpt-4o-mini",
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    temperature=0,
    streaming=True

)


class State(TypedDict, total=False):
    interview_type:str
    interview_role:str
    checking_value:str

async def check_data(state:State) -> State:
    """Check if the written role is actually a valid role or fake"""
    interview_role = state["interview_role"]
    response = await model.ainvoke(f"""
        You are a strict validator.
        A valid role must be a real-world professional job title (e.g., Software Engineer, Data Analyst).
        If the input is nonsense, random text, or not a job title → return 0.
        If it is a valid job role → return 1.
        ONLY return 0 or 1. No explanation.
        Input: {interview_role}
        """)
    
    result = response.content.strip()
    if(result not in ["0", "1"]):
        return {"checking_value": "0"}
    
    return {"checking_value": response.content}



workflow = StateGraph(State)
workflow.add_node("check_data", check_data)

workflow.add_edge(START, "check_data")
workflow.add_edge("check_data", END)

chain = workflow.compile()

async def run_chain(interview_type:str, interview_role:str):
    async for state_update in chain.astream_events({"interview_type": interview_type, "interview_role":interview_role}, version="v2"):
        updates = state_update["event"]
        if(updates == "on_chat_model_stream"):
            content = state_update["data"]["chunk"].content
            if(content):
                print(content)

asyncio.run(run_chain("Hard", "hahahhahaha"))