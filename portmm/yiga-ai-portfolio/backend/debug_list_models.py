"""Debug helper to list available Gemini models.

Run from the backend directory:

  python debug_list_models.py

Requires `langchain-google-genai`.
"""

import os
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

# The ChatGoogleGenerativeAI wrapper internally uses the Google Generative Language API.
# Some SDKs expose model listing; if not, this script is kept for future debugging.

print("This script is a placeholder. Model listing is handled by the SDK in some versions.")
print("If your SDK supports listing, implement it here using the underlying client.")

# Note: We intentionally keep this lightweight so the main app doesn't require extra deps.

