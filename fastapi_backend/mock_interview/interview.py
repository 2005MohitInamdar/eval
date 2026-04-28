from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI
from langchain.tools import tool
from dotenv import load_dotenv
from typing_extensions import TypedDict
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
    userid:str
    interview_type:str
    interview_role:str
    checking_value:str
    continue_or_not:str
    val: str

async def check_data(state:State) -> State:
    """Check if the written role is actually a valid role or fake"""
    interview_type = state["interview_type"]
    interview_role = state["interview_role"]
    response = await model.ainvoke(f"""
        You are a strict validator.
        A valid role must be a real-world professional job title (e.g., Software Engineer, Data Analyst).
        If the input is nonsense, random text, or not a job title → return 0.
        If it is a valid job role → return 1.
        ONLY return 0 or 1. No explanation.
        Input: 
            Interview type: {interview_type}
        interview role: {interview_role}
        """)
    
    result = response.content.strip()
    if(result not in ["0", "1"]):
        return {"checking_value": "0", "continue_or_not":"end"}
    if(response.content == "0"):
        return {"checking_value": response.content, "continue_or_not":"end"}
    else: 
        print("continue!")
        return {"checking_value": response.content, "continue_or_not":"continue"}

@tool 
def getResumeData(state:State):
    """Search the supabase database with the resume data of the provided uuid of a authenticated user!
    Args:
        query: Search a row of resume data with provided uuid
        limit:1 row
    """
    userid = state["userid"]
    if(userid):
        print("yes user id is presene this is from backend: ", userid)


def should_continue(state : State) -> str:
    value = state["checking_value"]
    if(value == "0"):
        return "end"
    else:
        return "continue"

def continue_node(state:State) -> State:
    """workd after confirming data"""
    return {"val": "Yes its working!"}


workflow = StateGraph(State)

workflow.add_node("check_data", check_data)
workflow.add_node("continue_node", continue_node)

tools = [getResumeData]

model_with_tool = model.bind_tools(tools)
workflow.add_edge(START, "check_data")
workflow.add_conditional_edges(
    "check_data",
    should_continue,
    {
        "continue": "continue_node",
        "end" : END
    }
)
workflow.add_edge("continue_node", END)

chain = workflow.compile()

async def run_chain(userid:str, interview_type:str, interview_role:str):
    async for state_update in chain.astream_events({"userid": userid, "interview_type": interview_type, "interview_role":interview_role}, version="v2"):
        
        updates = state_update["event"]
        name = state_update.get("name")
        if(updates == "on_chat_model_stream"):
            content = state_update["data"]["chunk"].content
            if(content):
                yield f"data:{content}\n\n"
        
        # if(updates == "on_chain_stream"):
        #     chunk = state_update["data"].get("chunk")
        #     if(chunk):
        #         print(chunk)
                # val = chunk.get("val")
                # if val is not null:
                #     print(val)

        if(updates == "on_chain_end") and name == "LangGraph":
            output = state_update["data"].get("output", {})
            if isinstance(output, dict):
                continue_or_not=output.get("continue_or_not")
                if(continue_or_not == "end"):
                    yield "data: Error:Invalid job role!\n\n"
                    
        
# asyncio.run(run_chain("Hard", "Backend Developer"))