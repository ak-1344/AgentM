# Job Discovery Service

## What this project does

Job discovery using Adzuna API. Uses LangChain tools without LLM. Returns real-time job data.

## How Adzuna API works

Query parameters + location search. API returns job listings as JSON.

## Setup steps

1. Create virtual environment
2. Install requirements
3. Create .env file with ADZUNA_APP_ID and ADZUNA_APP_KEY
4. Run server

## How to run

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload
```

## How to call API

Example curl command:

```bash
curl -X POST http://127.0.0.1:8000/discover \
-H "Content-Type: application/json" \
-d '{
  "search_constraints": {
    "target_role": "Data Scientist",
    "job_type": "internship",
    "internship_paid": true,
    "work_mode": "remote",
    "locations": ["India"],
    "experience_level": "fresher"
  },
  "skill_keywords": ["python", "machine learning", "sql"]
}'
```
