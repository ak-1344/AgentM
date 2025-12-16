"""
Job Discovery Agent with LangChain tools
Uses Adzuna API to search for jobs
"""

import os
import requests
from dotenv import load_dotenv
from langchain_core.tools import tool

# Load environment variables
load_dotenv()

# Get API credentials from environment
app_id = os.getenv("ADZUNA_APP_ID")
app_key = os.getenv("ADZUNA_APP_KEY")
base_url = "https://api.adzuna.com/v1/api/jobs/in/search"


@tool
def load_search_context(data: dict) -> dict:
    """
    Pass through search context data
    No validation or transformation needed
    """
    return data


@tool
def adzuna_search(data: dict) -> dict:
    """
    Search jobs using Adzuna API
    Adaptive broad → strict querying
    """

    # Extract data if wrapped
    if "data" in data:
        data = data["data"]
        if "data" in data:
            data = data["data"]

    # Extract search constraints
    constraints = data.get("search_constraints", {})
    skills = data.get("skill_keywords", [])

    target_role = constraints.get("target_role", "").strip()
    if not target_role:
        return {"count": 0, "results": []}

    # Location (default to india)
    locations = constraints.get("locations", [])
    where = locations[0].lower() if locations else "india"

    # ---- BUILD ADAPTIVE WHAT QUERIES ----
    what_attempts = []

    # 1. Broad
    what_attempts.append(target_role.lower())

    # 2. Role + top 1–2 skills
    if skills:
        what_attempts.append(
            f"{target_role} {' '.join(skills[:2])}".lower()
        )

    # 3. Role + all skills
    if len(skills) > 2:
        what_attempts.append(
            f"{target_role} {' '.join(skills)}".lower()
        )

    all_results = []
    final_what_used = None

    # ---- TRY EACH WHAT ATTEMPT ----
    for what in what_attempts:
        collected = []

        for page in range(1, 4):
            params = {
                "app_id": app_id,
                "app_key": app_key,
                "what": what,
                "where": where,
                "results_per_page": 10
            }

            url = f"{base_url}/{page}"

            try:
                response = requests.get(url, params=params)
                response.raise_for_status()
                result = response.json()

                results = result.get("results", [])
                if not results:
                    break

                collected.extend(results)

            except Exception:
                break

        # Stop once we get results
        if collected:
            all_results = collected
            final_what_used = what
            break

    return {
        "count": len(all_results),
        "results": all_results,
        "debug": {
            "what_used": final_what_used,
            "where": where
        }
    }
