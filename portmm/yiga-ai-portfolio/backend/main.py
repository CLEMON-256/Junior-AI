import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing_extensions import TypedDict
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_groq import ChatGroq
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

PORTFOLIO_PROFILE = """\
Yiga Junior is a Full-Stack AI Engineer based in Gayaza, Uganda.
Education: Yiga studied at YMCA. He has a bachelor's degree in Information Technology (IT). The portfolio does not specify whether YMCA awarded the degree.
Skills listed on his portfolio:
- React (Frontend)
- TypeScript (Language)
- Go (Backend), including the Gin Go framework
- Django (Backend Framework)
- C# (Backend)
- Docker (DevOps)
- DevOps and MLOps
- AI and parallel computing
- PyTorch and TensorFlow for machine learning models
- CUDA and GPU kernels for accelerated computing
- Computer vision
- Cybersecurity
- Cloud computing
- LangGraph, CrewAI, and Microsoft AutoGen (AI frameworks)
His About section also describes using GPUs and CUDA to accelerate machine-learning workloads, working with GPU kernels, integrating AI agents into Django and React full-stack applications and React Native mobile apps, and providing AI security and automation.
He has 74+ GitHub repositories. His GitHub profile is https://github.com/CLEMON-256.
His email is junioryiga91@gmail.com and his phone number is +256 793 030 322.
"""

PORTFOLIO_FAQ = """\
Common questions and grounded answers:
Q: Who is Yiga Junior, and where is he based?
A: Yiga Junior is a Full-Stack AI Engineer based in Gayaza, Uganda.
Q: Where did Yiga study, and what degree does he hold?
A: He studied at YMCA and has a bachelor's degree in Information Technology (IT). The portfolio does not specify where the degree was awarded.
Q: What kind of engineer is Yiga?
A: He describes himself as a Full-Stack AI Engineer focused on full-stack software and AI-agent systems.
Q: What technologies and frameworks does Yiga work with?
A: React, TypeScript, Go and Gin, Django, C#, Docker, PyTorch, TensorFlow, CUDA, computer vision, LangGraph, CrewAI, and Microsoft AutoGen. His portfolio also lists DevOps, MLOps, AI and parallel computing, cybersecurity, and cloud computing.
Q: How does Yiga use AI agents in web and mobile applications?
A: He integrates AI agents into Django and React full-stack applications and React Native mobile apps.
Q: What does Yiga work on with GPU kernels and parallel computing?
A: He builds machine-learning models using PyTorch and TensorFlow and uses GPUs and CUDA to accelerate machine-learning workloads. His listed areas include GPU kernels, computer vision, AI, and parallel computing. The portfolio does not specify particular model or kernel projects or performance results.
Q: Which machine-learning tools does Yiga use?
A: His portfolio lists PyTorch, TensorFlow, CUDA, GPU kernels, and computer vision.
Q: What are Yiga's interests in cloud, DevOps, MLOps, and cybersecurity?
A: His portfolio lists cloud computing, DevOps, MLOps, and cybersecurity as skills and focus areas.
Q: What roles could fit Yiga's skills?
A: Based on his portfolio, relevant roles could include Full-Stack AI Engineer, AI Engineer focused on agent integrations, or Full-Stack Developer. These are role suggestions based on listed skills, not claims about past job titles.
Q: How could Yiga contribute to a team building AI-powered products?
A: His portfolio describes building full-stack applications and integrating AI agents, automation, and security into web and mobile products, with cloud-deployed pipelines.
Q: How can someone contact Yiga about a job opportunity?
A: Email junioryiga91@gmail.com, call +256 793 030 322, or visit https://github.com/CLEMON-256.
Q: What kinds of projects has Yiga built?
A: His portfolio data highlights an AI LiveKit CallCenter stack with automated voice pipelines, dynamic tool binding, and cloud-deployed agent integrations. Do not add unsupported project details.
Q: Where can someone see Yiga's GitHub repositories?
A: Visit https://github.com/CLEMON-256. His portfolio states that he has 74+ repositories.
Q: What is Yiga's employment history or how many years of experience does he have?
A: The portfolio does not specify employers, job titles, or years of professional experience.
Q: Is Yiga available for hire?
A: The portfolio does not specify current availability. Contact him directly to discuss opportunities.
"""

PROFILE_GROUNDING_INSTRUCTIONS = """\
Answer questions about Yiga Junior using the portfolio profile and retrieved documents below.
The portfolio profile is the authoritative source if retrieved documents conflict with it.
Describe him as a Full-Stack AI Engineer, matching his portfolio; do not replace his profile with a generic or invented biography.
Use the FAQ below as prepared answers to common questions. Treat Yiga's listed technologies and areas as skills he says he does well.
Do not invent employment history, years of experience, job titles, credentials, project details, performance results, or availability.
For education, say that he studied at YMCA and has a bachelor's degree in Information Technology (IT). Do not claim YMCA awarded the degree; the portfolio does not specify where it was awarded.
For facts not present in the profile or retrieved documents, say the portfolio does not specify them.
Be direct and concise, and answer the question asked.
"""

class AgentState(TypedDict):
    messages: list
    user_query: str
    next_agent: str
    final_output: str

def _get_llm():
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not configured.")

    model_name = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b").strip()
    return ChatGroq(model=model_name, temperature=0.1, api_key=api_key)


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


def _invoke_groq(system_prompt: str, user_prompt: str) -> str:
    llm = _get_llm()
    response = llm.invoke([SystemMessage(content=system_prompt), HumanMessage(content=user_prompt)])
    return response.content


def resume_agent(state: AgentState):
    query = state["user_query"]
    docs = resume_vectorstore.similarity_search(query, k=2)
    context = "\n".join([d.page_content for d in docs])
    system_prompt = (
        f"You are Yiga Junior's Personal Portfolio Assistant.\n"
        f"{PROFILE_GROUNDING_INSTRUCTIONS}\n"
        f"Authoritative portfolio profile:\n{PORTFOLIO_PROFILE}\n"
        f"Prepared FAQ:\n{PORTFOLIO_FAQ}\n"
        f"Additional retrieved context:\n{context}"
    )
    response_text = _invoke_groq(system_prompt=system_prompt, user_prompt=query)
    return {"final_output": response_text}


def github_agent(state: AgentState):
    query = state["user_query"]
    docs = github_vectorstore.similarity_search(query, k=2)
    context = "\n".join([d.page_content for d in docs])
    system_prompt = (
        f"You are Yiga Junior's Technical Portfolio Assistant.\n"
        f"{PROFILE_GROUNDING_INSTRUCTIONS}\n"
        f"Authoritative portfolio profile:\n{PORTFOLIO_PROFILE}\n"
        f"Prepared FAQ:\n{PORTFOLIO_FAQ}\n"
        f"Additional retrieved context:\n{context}"
    )
    response_text = _invoke_groq(system_prompt=system_prompt, user_prompt=query)
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
