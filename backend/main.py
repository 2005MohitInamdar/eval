from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI
from openai import RateLimitError
from dotenv import load_dotenv
from typing import TypedDict
import operator
from typing import Annotated
import asyncio
import os
import json
load_dotenv()


user_prompt="Generate a prompt to feed to an llm for generating one soft skill only question no options or further any hints or help"

model = ChatOpenAI(
    model="liquid/lfm-2.5-1.2b-thinking:free",
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    temperature=0.8,
    streaming=True
)

# model2 = ChatOpenAI(
#     # model="nvidia/nemotron-3-nano-30b-a3b:free",
#     model="allenai/molmo-2-8b:free",
#     base_url="https://openrouter.ai/api/v1",
#     api_key=os.getenv("OPENROUTER_API_KEY"),
#     temperature=0.8,
#     streaming=True
# )



class State(TypedDict, total=False):
    question:Annotated[str, operator.add]
    prompt:str
    error:list[str]
    count: int



async def generate_prompt(state:State) -> State:
    """Generate a prompt for the interview questions"""
    print("\n \n \n")
    print("STARTING PROMPT GENERATION")
    print("\n \n \n")
    
    prompt=""
    error=""
    try:
        async for token in model.astream(user_prompt):
            prompt+=token.content

        print()
        return {"prompt" : prompt, "count": 0}
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
    question=""
    try:
        async for token in model.astream(interview_prompt):
            question+=token.content
        print()
        return {"question" : question, "count": count+1}
    except RateLimitError as rate_limiter_error:
        print(rate_limiter_error)
        return {"error" : f"{rate_limiter_error}", "question" : ""}
    except Exception as e:
        print(e)
        return {"error" : f"{e}", "question" : ""}
    

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
workflow.add_edge("node1", "END")


workflow.add_conditional_edges(
    "node1",
    should_continue,
    {
        "loop":"node1",
        "end_loop":END,
    }
)
chain = workflow.compile()



async def run_chain():
    final_state = {
        "question" : [],
        "error" : "",
        "prompt" : ""
    }


    async for state_update in chain.astream({}):
        if "generate_prompt" in state_update:
            prompt_node = state_update["generate_prompt"]
            final_prompt = prompt_node['prompt']
            final_state["prompt"] = "".join([final_state["prompt"], final_prompt])
            

        if "node1" in state_update:
            question_node = state_update["node1"]
            final_question=question_node["question"]
            final_state["question"].append(final_question)
    

    final_state_prompt = json.dumps(final_state, indent=4)
    print(final_state_prompt)
    return final_state


asyncio.run(run_chain())