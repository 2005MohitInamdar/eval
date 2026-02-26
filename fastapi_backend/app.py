# THIS IS THE MAIN GENERATOR FOR LANGGRAPH
from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI
from openai import RateLimitError
from dotenv import load_dotenv
from typing import TypedDict
import operator
from typing import Annotated
import os
from typing import List
load_dotenv()

# user_prompt="Generate a prompt to feed to an llm for generating one soft skill only question no options or further any hints or help"

model = ChatOpenAI(
    model="liquid/lfm-2.5-1.2b-thinking:free",
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    temperature=0.8,
    streaming=True
)

class State(TypedDict, total=False):
    frontend_prompt: str
    question:Annotated[List[str], operator.add]
    prompt:str
    error:list[str]
    count: int

async def generate_prompt(state:State) -> State:
    """Generate a prompt for the interview questions"""
    print("\n \n \n")
    print("STARTING PROMPT GENERATION")
    print("\n \n \n")
    
    error=""
    user_prompt = state.get("frontend_prompt")
    try:
        response = await model.ainvoke(user_prompt)
        return {"prompt" : response.content, "count": 0}
    except RateLimitError as rate_limiter_error:
        print(rate_limiter_error)
        error = "Not any: {rate_limiter_error}"
        return {"error" : error, "prompt": "", "count": 0}
    except Exception as e:
        error = f"{e}"
        print(error)
        return {"error" : error, "prompt": "", "count": 0}



async def node1(state:State) -> State:
    """Generating questions for interview"""

    print("\n \n \n")
    print("STARTING QUESTION GENERATION NODE 1")
    print("\n \n \n")

    count=state["count"]
    interview_prompt = state["prompt"]  
    try:
        response = await model.ainvoke(interview_prompt)
        return {"question" : [response.content], "count": count+1}
    except RateLimitError as rate_limiter_error:
        print(rate_limiter_error)
        return {"error" : f"{rate_limiter_error}", "question" : []}
    except Exception as e:
        print(e)
        return {"error" : f"{e}", "question" : []}
    

def should_continue(state:State) -> int:
    """This node checks if the count is less than 11"""
    if(state["count"] < 4):
        print(f"Looping the question generator node count: {state["count"]}")
        return "loop"
    else:
        return "end_loop"
    

workflow = StateGraph(State)
workflow.add_node("generate_prompt", generate_prompt)
workflow.add_node("node1", node1)

workflow.add_edge(START, "generate_prompt")
workflow.add_edge("generate_prompt", "node1")

workflow.add_conditional_edges(
    "node1",
    should_continue,
    {
        "loop":"node1",
        "end_loop":END,
    }
)

chain = workflow.compile()

async def run_chain(frontend_data:str):
    final_state = {
        "question" : [],
        "error" : [],
        "prompt" : ""
    }
    async for state_update in chain.astream_events({"frontend_prompt" : frontend_data}, version="v2"):
        # print(state_update)
        kind = state_update["event"]
        if(kind == "on_chat_model_stream"):
            content = state_update['data']["chunk"].content
            if(content):
                yield f"data: {content}\n\n"
                # print(content, end = "", flush=True)

# asyncio.run(run_chain("Generate a prompt to feed to an llm for generating one soft skill only question no options or further any hints or help"))