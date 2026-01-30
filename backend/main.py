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
    model="allenai/molmo-2-8b:free",
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    temperature=0.8,
    streaming=True
)

model2 = ChatOpenAI(
    # model="nvidia/nemotron-3-nano-30b-a3b:free",
    model="allenai/molmo-2-8b:free",
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    temperature=0.8,
    streaming=True
)



class State(TypedDict, total=False):
    question:list[str]
    # answer:str
    prompt:str
    error:str


# class State(TypedDict, total=False):
    # question:Annotated[list, operator.add]
    # answer:Annotated[list, operator.add]
    # prompt:Annotated[list, operator.add]
    # error:Annotated[list, operator.add]


async def generate_prompt(state:State) -> State:
    """Generate a prompt for the interview questions"""
    print("\n \n \n")
    print("STARTING PROMPT GENERATION")
    print("\n \n \n")

    prompt=""
    error=""
    try:
        async for token in model.astream(user_prompt):
            # print(token.content, end="", flush=True)
            prompt+=token.content
        # print("\n\n Printing Prompt: ", prompt, "type is: ", type(prompt))
        print()
        return {"prompt" : prompt}
    except RateLimitError as rate_limiter_error:
        print(rate_limiter_error)
        error = "Not any: {rate_limiter_error}"
        return {"error" : error, "prompt": ""}
    except Exception as e:
        error = f"{e}"
        print(type(error))
        return {"error" : error, "prompt": ""}




async def node1(state:State) -> State:
    """Generating questions for interview"""

    print("\n \n \n")
    print("STARTING QUESTION GENERATION NODE 1")
    print("\n \n \n")


    interview_prompt = state["prompt"]

    question=""
    try:
        async for token in model2.astream(interview_prompt):
            question+=token.content
        print()
        return {"question" : question}
    except RateLimitError as rate_limiter_error:
        print(rate_limiter_error)
        return {"error" : f"{rate_limiter_error}", "question" : ""}
    except Exception as e:
        print(e)
        return {"error" : f"{e}", "question" : ""}
    

async def node2(state:State) -> State:
    """Generating questions for interview"""
    
    
    print("\n \n \n")
    print("STARTING QUESTION GENERATION NODE 2")
    print("\n \n \n")

    interview_prompt = state["prompt"]
    question="\n"
    try:
        async for token in model2.astream(interview_prompt):
            print(token.content, flush=True, end="")
            question+=token.content
        print("Question2 -> ", question)
        print()
        return {"question" : question}
    except RateLimitError as rate_limit_error:
        print(rate_limit_error)
        return {"error" : f"{rate_limit_error}", "question" : ""}
    except Exception as e:
        print(e)
        return {"error" : f"{e}", "question" : ""}
    

# async def node3(state:State) -> State:
#     """Generating questions for interview"""
    
#     print("\n \n \n")
#     print("STARTING QUESTION GENERATION NODE 3")
#     print("\n \n \n")

#     interview_prompt="".join(state["prompt"])
#     question=[]
#     try:
#         async for token in model2.astream(interview_prompt):
#             # print(token.content, end="", flush=True)
#             question.append(token.content)
#         print()
#         return {"question" : question}
#     except RateLimitError as rate_limit_error:
#         print(rate_limit_error)
#         return{"error" : [str(rate_limit_error)], "question" : []}
#     except Exception as e:
#         print(e)
#         return {"error" : [str(e)], "question" : []}
     
workflow = StateGraph(State)
workflow.add_node("generate_prompt", generate_prompt)
workflow.add_node("node1", node1)
workflow.add_node("node2", node2)
# workflow.add_node("node3", node3)

workflow.add_edge(START, "generate_prompt")
workflow.add_edge("generate_prompt", "node1")
workflow.add_edge("generate_prompt", "node2")
workflow.add_edge("node1", END)
workflow.add_edge("node2", END)
# workflow.add_edge("generate_prompt", "node1")
# workflow.add_edge("generate_prompt", "node2")
# workflow.add_edge("generate_prompt", "node3")
# workflow.add_edge("node1", END)
# workflow.add_edge("node2", END)
# workflow.add_edge("node3", END)

chain = workflow.compile()
async def run_chain():
    final_state = {
        "question" : "",
        # "answer" : [],
        "error" : "",
        "prompt" : ""
    }

    async for state_update in chain.astream({}):
        if "generate_prompt" in state_update:
            prompt_node = state_update["generate_prompt"]
            final_prompt = prompt_node['prompt']
            final_state["prompt"] = "".join([final_state["prompt"], final_prompt])
            
            print(state_update)
        if "node1" in state_update:
            question_node = state_update["node1"]
            final_question=question_node["question"]
            final_state["question"] = "".join([final_state["question"], final_question])
    
    final_state_prompt = json.dumps(final_state, indent=4)
    print(final_state_prompt)
    return final_state

asyncio.run(run_chain())