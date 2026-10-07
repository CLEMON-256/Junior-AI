import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv

load_dotenv()

# Update the target model parameter here 👇
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2")
CHROMA_PATH = "./chroma_db"

# 1. Populate Resume Collection
resume_docs = [
    "Yiga Junior is a Full-Stack AI Engineer based in Gayaza, Uganda. He studied at YMCA and has a bachelor's degree in Information Technology (IT). His portfolio does not specify where the degree was awarded.",
    "Yiga Junior's portfolio lists React (Frontend), TypeScript (Language), Go (Backend) with the Gin framework, Django (Backend Framework), and C# (Backend).",
    "Yiga Junior's portfolio lists Docker (DevOps), DevOps and MLOps, AI and parallel computing, cybersecurity, and cloud computing.",
    "Yiga Junior builds machine-learning models using PyTorch and TensorFlow and uses GPUs and CUDA to accelerate machine-learning workloads. His listed machine-learning and computing areas include GPU kernels, computer vision, AI, and parallel computing. His portfolio does not specify particular model or kernel projects or performance results.",
    "Yiga Junior says these listed technologies and areas are skills he does well. He works with LangGraph, CrewAI, and Microsoft AutoGen AI frameworks. His portfolio describes integrating AI agents into Django and React full-stack applications and React Native mobile apps, AI security, and automation.",
    "Yiga Junior has 74+ GitHub repositories. His GitHub profile is https://github.com/CLEMON-256. Contact: junioryiga91@gmail.com and +256 793 030 322."
]
resume_store = Chroma(collection_name="resume_collection", embedding_function=embeddings, persist_directory=CHROMA_PATH)
resume_ids = [
    "yiga-profile-education-location",
    "yiga-profile-core-technologies",
    "yiga-profile-engineering-skills",
    "yiga-profile-machine-learning-tools",
    "yiga-profile-ai-work",
    "yiga-profile-contact",
]
resume_store.delete(ids=resume_ids)
resume_store.add_texts(resume_docs, ids=resume_ids)

# 2. Populate GitHub Collection
github_docs = [
    "Yiga Junior's active GitHub user profile is https://github.com/CLEMON-256. He has 74+ repositories.",
    "Yiga's portfolio lists CrewAI, Microsoft AutoGen, and LangGraph as AI frameworks he works with.",
    "Featured GitHub Repository: AI LiveKit CallCenter stack utilizing automated voice pipelines, dynamic tool binding, and cloud-deployed agent integrations."
]
github_store = Chroma(collection_name="github_collection", embedding_function=embeddings, persist_directory=CHROMA_PATH)
github_ids = ["yiga-github-profile", "yiga-github-ai-frameworks", "yiga-github-livekit-project"]
github_store.delete(ids=github_ids)
github_store.add_texts(github_docs, ids=github_ids)

print("Chroma DB collections successfully initialized and seeded with Gemini Embedding 2!")
