import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing_extensions import TypedDict
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langgraph.graph import StateGraph, END
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Update the target model parameter here 👇
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2")
CHROMA_PATH = "./chroma_db"

resume_vectorstore = Chroma(collection_name="resume_collection", embedding_function=embeddings, persist_directory=CHROMA_PATH)
github_vectorstore = Chroma(collection_name="github_collection", embedding_function=embeddings, persist_directory=CHROMA_PATH)

class AgentState(TypedDict):
    messages: list
    user_query: str
    next_agent: str
    final_output: str

def _get_llm(model_name: str):
    return ChatGoogleGenerativeAI(model=model_name, temperature=0.1)


DEFAULT_MODEL_CANDIDATES = [
    # User provided list (from model listing output)
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-3-flash",
]


def _route_router_deterministic(user_text: str) -> str:
    t = user_text.lower()

    resume_keywords = [
        "background",
        "contact",
        "experience",
        "hiring",
        "resume",
        "phone",
        "email",
        "skills",
        "portfolio",
    ]
    github_keywords = [
        "code",
        "github",
        "repository",
        "repo",
        "repos",
        "project",
        "projects",
        "tech",
        "stack",
        "implementation",
        "source",
        "agent",
        "langgraph",
        "autogen",
        "crewai",
        "livekit",
    ]

    if any(k in t for k in github_keywords) and not any(k in t for k in resume_keywords):
        return "github_agent"
    if any(k in t for k in resume_keywords) and not any(k in t for k in github_keywords):
        return "resume_agent"

    # If both match or neither matches, default to resume (safer for this portfolio demo).
    return "resume_agent"


def supervisor_router(state: AgentState):
    last_message = state["messages"][-1].content
    return {
        "next_agent": _route_router_deterministic(last_message),
        "user_query": last_message,
    }


def _invoke_with_fallback(system_prompt: str, user_prompt: str) -> str:
    # Primary model id is configurable via env var.
    configured = os.getenv("GOOGLE_GEMINI_MODEL", "").strip()
    # If the env var isn't set, try the supported candidates from the user's model list.
    candidates = ([configured] if configured else []) + DEFAULT_MODEL_CANDIDATES
    # If the configured candidate is a bad/unsupported model id, skip quickly rather than failing the whole request.
    candidates = [m for m in candidates if m]

    # De-dupe while preserving order.

    seen = set()
    candidates = [m for m in candidates if not (m in seen or seen.add(m))]

    last_err = None
    for model_name in candidates:
        try:
            llm = _get_llm(model_name)
            response = llm.invoke([SystemMessage(content=system_prompt), HumanMessage(content=user_prompt)])
            return response.content
        except Exception as e:
            last_err = e
            # The error you saw is a 404 NOT_FOUND for an unavailable model.
            if "NOT_FOUND" in str(e) or "404" in str(e):
                continue
            raise

    raise RuntimeError(f"All Gemini model candidates failed. Last error: {last_err}")


def resume_agent(state: AgentState):
    query = state["user_query"]
    docs = resume_vectorstore.similarity_search(query, k=2)
    context = "\n".join([d.page_content for d in docs])
    system_prompt = f"You are Yiga Junior's Personal Resume Assistant. Professionally answer using this context:\n\n{context}"
    response_text = _invoke_with_fallback(system_prompt=system_prompt, user_prompt=query)
    return {"final_output": response_text}


def github_agent(state: AgentState):
    query = state["user_query"]
    docs = github_vectorstore.similarity_search(query, k=2)
    context = "\n".join([d.page_content for d in docs])
    system_prompt = f"You are Yiga Junior's Technical Code Assistant. Deeply explain your repo implementations using this context:\n\n{context}"
    response_text = _invoke_with_fallback(system_prompt=system_prompt, user_prompt=query)
    return {"final_output": response_text}


workflow = StateGraph(AgentState)
workflow.add_node("router", supervisor_router)
workflow.add_node("resume_agent", resume_agent)
workflow.add_node("github_agent", github_agent)

workflow.set_entry_point("router")
workflow.add_conditional_edges("router", lambda state: state["next_agent"], {"resume_agent": "resume_agent", "github_agent": "github_agent"})
workflow.add_edge("resume_agent", END)
workflow.add_edge("github_agent", END)
graph = workflow.compile()

class QueryInput(BaseModel):
    text: str

@app.post("/api/chat")
async def chat_endpoint(data: QueryInput):
    result = await graph.ainvoke({"messages": [HumanMessage(content=data.text)]})
    return {"reply": result.get("final_output"), "agent_used": result.get("next_agent")}
