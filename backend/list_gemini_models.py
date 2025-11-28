#!/usr/bin/env python3
"""List available Gemini models"""
from google import genai
from app.core.config import settings

client = genai.Client(api_key=settings.GOOGLE_API_KEY_GENERATOR)

print("Available models:")
print("-" * 50)

for model in client.models.list():
    print(f"✓ {model.name}")
    print(f"  Display name: {model.display_name}")
    print()
