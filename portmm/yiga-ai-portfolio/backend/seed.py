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
    "Yiga Junior is a Fullstack AI Engineer living in Gayaza. Email contact is jnyxmacon@gmail.com and phone number is 0793030322.",
    "Yiga Junior is highly motivated, versatile, and built for immediate production impact without needing company training frameworks.",
    "Yiga specializes in handling fullstack AI systems spanning architecture design, automated workflows, cloud deployment pipelines, and multi-agent systems."
]
resume_store = Chroma(collection_name="resume_collection", embedding_function=embeddings, persist_directory=CHROMA_PATH)
resume_store.add_texts(resume_docs)

# 2. Populate GitHub Collection
github_docs = [
    "Yiga Junior's active GitHub user profile is located directly at ://github.com.",
    "Yiga has deep production experience building advanced AI Agent architectures using CrewAI, Microsoft AutoGen, and LangGraph.",
    "Featured GitHub Repository: AI LiveKit CallCenter stack utilizing automated voice pipelines, dynamic tool binding, and cloud-deployed agent integrations."
]
github_store = Chroma(collection_name="github_collection", embedding_function=embeddings, persist_directory=CHROMA_PATH)
github_store.add_texts(github_docs)

print("Chroma DB collections successfully initialized and seeded with Gemini Embedding 2!")
