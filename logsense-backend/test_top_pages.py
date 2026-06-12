"""
Test: Tri des Top Pages par nombre de visites
==============================================
Vérifie que les pages sont triées correctement (décroissant)
"""

from collections import defaultdict
import re

LOG_PATTERN = re.compile(
    r'(?P<ip>\S+) - - \[(?P<time>[^\]]+)\] '
    r'"(?P<method>\S+) (?P<path>\S+) \S+" '
    r'(?P<status>\d+) (?P<size>\d+)'
)

EXCLUDED_PATTERNS = ["/_next/", "/images/", ".png", ".jpg", ".css", ".js", ".ico", ".woff", ".woff2"]

def is_excluded(path):
    return any(pattern in path for pattern in EXCLUDED_PATTERNS)

# Test data
demo_logs = [
    '192.168.1.1 - - [02/Jun/2026:13:00:00 +0200] "GET / HTTP/1.1" 200 1024',
    '192.168.1.2 - - [02/Jun/2026:13:01:00 +0200] "GET /blog HTTP/1.1" 200 2048',
    '192.168.1.3 - - [02/Jun/2026:13:02:00 +0200] "GET /blog?_rsc=acgkz HTTP/1.1" 200 1500',
    '192.168.1.4 - - [02/Jun/2026:13:03:00 +0200] "GET /team HTTP/1.1" 200 3000',
    '192.168.1.5 - - [02/Jun/2026:13:04:00 +0200] "GET /team HTTP/1.1" 200 3000',
    '192.168.1.6 - - [02/Jun/2026:13:05:00 +0200] "GET /prestations HTTP/1.1" 200 2500',
    '192.168.1.7 - - [02/Jun/2026:13:06:00 +0200] "GET / HTTP/1.1" 200 1024',
    '192.168.1.8 - - [02/Jun/2026:13:07:00 +0200] "GET /contact HTTP/1.1" 200 1800',
]

print("=" * 60)
print(" TEST: Tri des Top Pages")
print("=" * 60)

# Filtrer et compter
page_counts = defaultdict(int)
for log in demo_logs:
    m = LOG_PATTERN.match(log)
    if m:
        path = m.group("path")
        if not is_excluded(path):
            clean_path = path.split("?")[0]
            page_counts[clean_path] += 1

top_pages = sorted(page_counts.items(), key=lambda x: x[1], reverse=True)

print("\n Top Pages (triées par visites décroissantes):")
for rank, (page, count) in enumerate(top_pages, 1):
    print(f"   {rank}. {page:20} | {count} visite(s)")

# Vérifier le tri
is_sorted = all(top_pages[i][1] >= top_pages[i+1][1] for i in range(len(top_pages)-1))
status = " PASS" if is_sorted else " FAIL"
print(f"\n{status}: Tri vérifié (ordre décroissant)")
print("=" * 60)

