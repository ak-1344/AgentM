# Web Crawler API Keys Setup Guide

## Overview
Configuration guide for external APIs used by Agent M's web scraping system.

---

## 1. GOOGLE CUSTOM SEARCH API

### Purpose:
- Find companies by domain/industry
- Discover career pages and contact information
- Search for startup databases

### Setup Steps:

#### 1.1 Enable Custom Search API
1. Go to https://console.cloud.google.com
2. Select your Agent-M project
3. Navigate to "APIs & Services" → "Library"
4. Search for "Custom Search API"
5. Click "Enable"

#### 1.2 Create API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API key
4. Click "Restrict Key" (recommended)
5. Under "API restrictions":
   - Select "Restrict key"
   - Choose "Custom Search API"
6. Save

```env
GOOGLE_SEARCH_API_KEY=AIzaSyC...
```

#### 1.3 Create Custom Search Engine
1. Go to https://programmablesearchengine.google.com
2. Click "Add" or "Create"
3. Configure:
   ```
   Name: Agent M Company Finder
   What to search: Search the entire web
   ```
4. Click "Create"
5. Go to "Setup" → Copy "Search engine ID"

```env
GOOGLE_SEARCH_ENGINE_ID=a1b2c3d4e5f6g7h8i
```

#### 1.4 Rate Limits (Free Tier)
- **Queries per day**: 100
- **Cost after free tier**: $5 per 1,000 queries
- **Rate limit**: 1 query per second

#### 1.5 Usage Example
```python
import os
import requests

API_KEY = os.getenv("GOOGLE_SEARCH_API_KEY")
SEARCH_ENGINE_ID = os.getenv("GOOGLE_SEARCH_ENGINE_ID")

def google_search(query: str, num_results: int = 10):
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": API_KEY,
        "cx": SEARCH_ENGINE_ID,
        "q": query,
        "num": num_results
    }
    
    response = requests.get(url, params=params)
    return response.json()

# Example: Find robotics startups
results = google_search("robotics startup careers site:careers OR site:jobs")
```

---

## 2. SERPAPI (Alternative to Google CSE)

### Purpose:
- More reliable search results
- Better rate limits
- Easier to use

### Setup Steps:

#### 2.1 Create Account
1. Go to https://serpapi.com
2. Sign up for free account
3. Go to "Dashboard" → "API Key"
4. Copy API key

```env
SERPAPI_API_KEY=abc123...
```

#### 2.2 Rate Limits (Free Tier)
- **Searches per month**: 100
- **Paid plans**: Starting at $50/month for 5,000 searches

#### 2.3 Usage Example
```python
from serpapi import GoogleSearch
import os

def serpapi_search(query: str):
    params = {
        "api_key": os.getenv("SERPAPI_API_KEY"),
        "engine": "google",
        "q": query,
        "num": 10
    }
    
    search = GoogleSearch(params)
    results = search.get_dict()
    return results.get("organic_results", [])
```

---

## 3. LINKEDIN SCRAPING (Unofficial)

### ⚠️ WARNING:
LinkedIn's Terms of Service prohibit automated scraping. Use at your own risk.

### Alternative: Official LinkedIn API

#### 3.1 LinkedIn API Setup (Recommended)
1. Go to https://www.linkedin.com/developers
2. Create new app
3. Request access to relevant APIs
4. **Note**: Access is limited and requires approval

#### 3.2 Unofficial Scraping (Use with caution)
```python
# Using Playwright for dynamic content
from playwright.async_api import async_playwright

async def scrape_linkedin_company(company_url: str):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Set headers to avoid detection
        await page.set_extra_http_headers({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        
        await page.goto(company_url)
        
        # Extract company info
        company_name = await page.locator("h1").text_content()
        # ... more extraction logic
        
        await browser.close()
```

**Best Practice**: Use rate limiting and respect robots.txt

---

## 4. CRUNCHBASE API

### Purpose:
- Find startup information
- Get funding details
- Discover company contacts

### Setup Steps:

#### 4.1 Get API Access
1. Go to https://www.crunchbase.com
2. Navigate to "Solutions" → "Crunchbase API"
3. Sign up (Free tier available with limitations)
4. Get API key from dashboard

```env
CRUNCHBASE_API_KEY=abc123...
```

#### 4.2 Rate Limits
- **Free tier**: Very limited (200 requests/day)
- **Basic plan**: $29/month (1,000 requests/day)
- **Pro plan**: $99/month (5,000 requests/day)

#### 4.3 Usage Example
```python
import requests
import os

CRUNCHBASE_API_KEY = os.getenv("CRUNCHBASE_API_KEY")

def get_organization(name: str):
    url = f"https://api.crunchbase.com/api/v4/entities/organizations/{name}"
    headers = {
        "X-cb-user-key": CRUNCHBASE_API_KEY
    }
    
    response = requests.get(url, headers=headers)
    return response.json()
```

---

## 5. CLEARBIT API (Company Enrichment)

### Purpose:
- Enrich company data
- Find company logos, descriptions
- Get contact information

### Setup Steps:

#### 5.1 Create Account
1. Go to https://clearbit.com
2. Sign up for free trial
3. Get API key from dashboard

```env
CLEARBIT_API_KEY=sk_abc123...
```

#### 5.2 Rate Limits
- **Free tier**: 50 lookups/month
- **Growth plan**: $99/month (2,500 lookups)

#### 5.3 Usage Example
```python
import requests
import os

CLEARBIT_API_KEY = os.getenv("CLEARBIT_API_KEY")

def enrich_company(domain: str):
    url = f"https://company.clearbit.com/v2/companies/find?domain={domain}"
    headers = {
        "Authorization": f"Bearer {CLEARBIT_API_KEY}"
    }
    
    response = requests.get(url, headers=headers)
    return response.json()

# Example
company_data = enrich_company("stripe.com")
```

---

## 6. HUNTER.IO (Email Finder)

### Purpose:
- Find company email addresses
- Verify email formats
- Domain search

### Setup Steps:

#### 6.1 Create Account
1. Go to https://hunter.io
2. Sign up
3. Get API key from dashboard

```env
HUNTER_IO_API_KEY=abc123...
```

#### 6.2 Rate Limits
- **Free tier**: 25 searches/month
- **Starter plan**: $49/month (500 searches)

#### 6.3 Usage Example
```python
import requests
import os

HUNTER_API_KEY = os.getenv("HUNTER_IO_API_KEY")

def find_company_emails(domain: str):
    url = "https://api.hunter.io/v2/domain-search"
    params = {
        "domain": domain,
        "api_key": HUNTER_API_KEY
    }
    
    response = requests.get(url, params=params)
    return response.json()
```

---

## 7. RATE LIMITING STRATEGY

### Implement Smart Rate Limiting:

```python
import time
from functools import wraps
from collections import defaultdict

class RateLimiter:
    def __init__(self):
        self.calls = defaultdict(list)
    
    def limit(self, max_calls: int, period: int):
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                now = time.time()
                calls = self.calls[func.__name__]
                
                # Remove old calls
                calls[:] = [c for c in calls if c > now - period]
                
                if len(calls) >= max_calls:
                    sleep_time = period - (now - calls[0])
                    time.sleep(sleep_time)
                
                calls.append(time.time())
                return func(*args, **kwargs)
            
            return wrapper
        return decorator

# Usage
limiter = RateLimiter()

@limiter.limit(max_calls=10, period=60)  # 10 calls per minute
def search_companies(query: str):
    # API call here
    pass
```

---

## 8. PROXY SERVICES (For Heavy Scraping)

### When to Use:
- Scraping at scale
- Avoiding IP blocks
- Geographic distribution

### Options:

#### 8.1 ScraperAPI
```env
SCRAPERAPI_KEY=abc123...
```

```python
import requests

SCRAPERAPI_KEY = os.getenv("SCRAPERAPI_KEY")

def scrape_with_proxy(url: str):
    params = {
        "api_key": SCRAPERAPI_KEY,
        "url": url,
        "render": "true"  # Enable JavaScript rendering
    }
    
    response = requests.get("http://api.scraperapi.com", params=params)
    return response.text
```

#### 8.2 Bright Data (formerly Luminati)
- Enterprise solution
- More expensive but very reliable

---

## 9. ENVIRONMENT CONFIGURATION

### Backend `.env`:
```env
# Google Search
GOOGLE_SEARCH_API_KEY=AIzaSyC...
GOOGLE_SEARCH_ENGINE_ID=a1b2c3d4e5f6g7h8i

# Alternative Search
SERPAPI_API_KEY=abc123...

# Company Data
CRUNCHBASE_API_KEY=abc123...
CLEARBIT_API_KEY=sk_abc123...
HUNTER_IO_API_KEY=abc123...

# Proxy/Scraping
SCRAPERAPI_KEY=abc123...

# Rate Limiting
MAX_SEARCHES_PER_DAY=90  # Stay under free tier limit
SEARCH_DELAY_SECONDS=2   # Delay between searches
```

---

## 10. COST OPTIMIZATION

### Strategy:
1. **Cache Results**: Store company data in database
2. **Batch Requests**: Group API calls
3. **Fallback Chain**: Try free APIs first
4. **Schedule Wisely**: Spread searches throughout the day

### Example Caching:
```python
from functools import lru_cache
import hashlib

@lru_cache(maxsize=1000)
def cached_search(query: str):
    return google_search(query)
```

---

## 11. TESTING CHECKLIST

- [ ] Google Custom Search API enabled
- [ ] Search Engine ID created
- [ ] API keys stored in `.env`
- [ ] Rate limiting implemented
- [ ] Test search working
- [ ] Error handling implemented
- [ ] Caching configured
- [ ] Cost monitoring set up

---

## 12. MONITORING & ALERTS

### Track API Usage:
```python
import logging

class APIUsageTracker:
    def __init__(self):
        self.usage = defaultdict(int)
    
    def track(self, api_name: str):
        self.usage[api_name] += 1
        
        if self.usage[api_name] > 80:  # 80% of free tier
            logging.warning(f"{api_name} approaching rate limit!")
```

---

## Next Steps
After API setup:
1. Test each API endpoint
2. Implement rate limiting
3. Set up usage monitoring
4. Configure fallback strategies
5. Proceed to crawler implementation
