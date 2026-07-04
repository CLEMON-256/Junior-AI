# Todo - Fix Gemini model NOT_FOUND and stabilize routing

- [ ] Update `backend/main.py`:
  - [ ] Add env var `GOOGLE_GEMINI_MODEL` (default to a supported model from the user-provided list, e.g. `gemini-3.5-flash`)
  - [ ] Implement model fallback: if the configured model returns NOT_FOUND, retry with a secondary supported model
  - [ ] Replace LLM-based router with deterministic keyword routing to avoid a second model call failing
  - [ ] Keep agent outputs limited to `resume_agent` or `github_agent`
- [ ] (Optional) Update `backend/main.py` to add a dev endpoint for model listing (only if supported; otherwise skip)
- [ ] Restart backend and test `/api/chat` with resume-related and GitHub-related queries

