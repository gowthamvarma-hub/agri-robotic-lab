
import feedparser
import json
import re
import html
import requests

from datetime import datetime, timezone
from pathlib import Path

# Google News RSS feeds
RSS_URLS = [
    "https://news.google.com/rss/search?q=agriculture&hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/search?q=agricultural+robotics&hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/search?q=farming+technology&hl=en-IN&gl=IN&ceid=IN:en"
]

articles = []
seen_links = set()

# Request settings
HEADERS = {
    "User-Agent": "Mozilla/5.0 AGRM-Laboratory-NewsBot/1.0"
}

# Fetch news from each RSS feed
for url in RSS_URLS:

    try:
        response = requests.get(
            url,
            headers=HEADERS,
            timeout=20
        )

        response.raise_for_status()

        feed = feedparser.parse(response.content)

        if not feed.entries:
            print(f"No articles found in feed: {url}")
            continue

        for entry in feed.entries:

            link = entry.get("link", "").strip()

            if not link or link in seen_links:
                continue

            seen_links.add(link)

            title = html.unescape(
                entry.get("title", "Agriculture News")
            )

            summary = html.unescape(
                entry.get("summary", "")
            )

            # Remove HTML tags
            summary = re.sub(r"<[^>]+>", " ", summary)

            # Remove extra spaces
            summary = re.sub(r"\s+", " ", summary).strip()

            articles.append({
                "title": title,
                "link": link,
                "published": entry.get("published", ""),
                "summary": summary[:350]
            })

        print(f"Successfully fetched feed: {url}")

    except requests.RequestException as error:
        print(f"Unable to fetch feed: {url}")
        print(f"Error: {error}")

    except Exception as error:
        print(f"Unexpected error: {error}")


# Keep only 12 articles
articles = articles[:12]

# Prepare news data
data = {
    "updated": datetime.now(timezone.utc).isoformat(),
    "articles": articles
}

# Save news.json in the same folder as this Python file
output_file = Path.cwd() / "news.json"

with open(output_file, "w", encoding="utf-8") as file:
    json.dump(
        data,
        file,
        ensure_ascii=False,
        indent=4
    )

print("--------------------------------")
print(f"Successfully saved {len(articles)} agriculture news articles.")
print(f"News file location: {output_file}")
print("--------------------------------")
