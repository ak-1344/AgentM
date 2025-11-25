# Web Scraper

Company discovery and information extraction for Agent M.

## ⚠️ Phase 2+ Feature

This module is planned for **Phase 2** and beyond. Current implementation provides structure and interfaces.

## Components

### 1. Company Scraper (`company_scraper.py`)
- **Purpose**: Extract company information from websites
- **Technology**: Playwright (Phase 2)
- **Features** (Planned):
  - Website content scraping
  - Contact email extraction
  - Careers page parsing
  - Social media links
  - Company descriptions

**Usage (Phase 2):**
```python
from scraper.company_scraper import CompanyScraper

scraper = CompanyScraper(headless=True)
await scraper.initialize()

# Scrape company website
info = await scraper.scrape_company_website("https://example.com")

# Find contact emails
emails = await scraper.find_contact_emails("https://example.com")

await scraper.close()
```

### 2. LinkedIn Scraper (`company_scraper.py`)
- **Purpose**: Extract company data from LinkedIn
- **Technology**: LinkedIn API or web scraping (Phase 3)
- **Features** (Planned):
  - Company search
  - Detailed company profiles
  - Employee information
  - Job postings

### 3. Company Discovery (`company_discovery.py`)
- **Purpose**: Discover companies matching user criteria
- **Technology**: Google Custom Search API (Phase 2)
- **Features** (Planned):
  - Keyword-based company search
  - Industry filtering
  - Location filtering
  - Company size filtering

**Usage (Phase 2):**
```python
from scraper.company_discovery import CompanyDiscovery

discovery = CompanyDiscovery(
    google_api_key="your-api-key",
    google_search_engine_id="your-engine-id"
)

# Search for companies
companies = await discovery.search_companies(
    keywords=["AI", "startup", "hiring"],
    industry="Technology",
    location="San Francisco",
    max_results=50
)

# Filter results
filtered = discovery.filter_companies(
    companies,
    min_size=10,
    max_size=500,
    industries=["Technology", "SaaS"]
)
```

## Installation (Phase 2)

```bash
pip install playwright beautifulsoup4 requests aiohttp
playwright install chromium
```

## Configuration

### Google Custom Search API
1. Create project in Google Cloud Console
2. Enable Custom Search API
3. Create API key
4. Create Custom Search Engine
5. Add to `.env`:
```bash
GOOGLE_SEARCH_API_KEY=your-api-key
GOOGLE_SEARCH_ENGINE_ID=your-engine-id
```

### LinkedIn API (Optional - Phase 3)
```bash
LINKEDIN_API_KEY=your-api-key
```

## Phase Implementation

### Phase 2: Web Crawling
- ✅ Structure created
- ⏳ Playwright integration
- ⏳ Google Custom Search API
- ⏳ Basic website scraping
- ⏳ Email extraction

### Phase 3: Deep Crawling
- ⏳ LinkedIn integration
- ⏳ Careers page deep scraping
- ⏳ Contact form detection
- ⏳ Advanced filtering

### Phase 4: Automated Scraping
- ⏳ Periodic scraping
- ⏳ Priority scoring
- ⏳ Data enrichment
- ⏳ Cache management

### Phase 5: Multi-Source
- ⏳ Multiple data sources
- ⏳ Data aggregation
- ⏳ Real-time updates
- ⏳ ML-based ranking

## Legal & Ethical Considerations

- ✅ Respect robots.txt
- ✅ Rate limiting
- ✅ User-agent identification
- ✅ Terms of service compliance
- ✅ No aggressive scraping
- ✅ Personal data protection

## Anti-Detection Measures

- Random delays between requests
- Rotating user agents
- IP rotation (if needed)
- Session management
- CAPTCHA handling (manual)

## Data Storage

Scraped data will be stored in:
- Database table: `companies`
- Fields: name, website, industry, size, description, contact_emails, etc.
- Caching to avoid re-scraping

## Error Handling

- Network failures
- Parsing errors
- Rate limiting
- Authentication issues
- Content changes

## Future Features

- Chrome extension for manual discovery
- CrunchBase integration
- AngelList integration
- GitHub organization scraping
- Product Hunt integration
- Y Combinator company directory

## Current Status

**Status:** 🟡 Structure ready, implementation pending Phase 2

**Available Now:**
- Module structure
- Interface definitions
- Documentation

**Coming in Phase 2:**
- Full implementation
- Playwright integration
- Google Search API
- Testing suite
