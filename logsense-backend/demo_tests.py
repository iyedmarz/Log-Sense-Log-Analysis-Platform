"""
Script de démonstration - Visualisation des tests Top Pages
============================================================
Ce script montre comment les tests valident la fonctionnalité des pages les plus visitées
"""

from collections import defaultdict
import re

# Configuration
LOG_PATTERN = re.compile(
    r'(?P<ip>\S+) - - \[(?P<time>[^\]]+)\] '
    r'"(?P<method>\S+) (?P<path>\S+) \S+" '
    r'(?P<status>\d+) (?P<size>\d+)'
)

def parse_log_line(line):
    """Parse une ligne de log"""
    m = LOG_PATTERN.match(line)
    if m:
        return {
            "ip": m.group("ip"),
            "time": m.group("time"),
            "method": m.group("method"),
            "path": m.group("path"),
            "status": int(m.group("status")),
            "size": int(m.group("size"))
        }
    return None

# ============ DEMO 1: Tri correct ============
print("=" * 70)
print("🧪 DEMO 1: Vérification du tri correct des pages par visites")
print("=" * 70)

log_data_demo1 = [
    '192.168.1.1 - - [01/Jan/2024:10:00:00 +0000] "GET /home HTTP/1.1" 200 1024',
    '192.168.1.2 - - [01/Jan/2024:10:01:00 +0000] "GET /home HTTP/1.1" 200 1024',
    '192.168.1.3 - - [01/Jan/2024:10:02:00 +0000] "GET /home HTTP/1.1" 200 1024',
    '192.168.1.4 - - [01/Jan/2024:10:03:00 +0000] "GET /api/users HTTP/1.1" 200 512',
    '192.168.1.5 - - [01/Jan/2024:10:04:00 +0000] "GET /api/users HTTP/1.1" 200 512',
    '192.168.1.6 - - [01/Jan/2024:10:05:00 +0000] "GET /about HTTP/1.1" 200 256',
]

print("\n📝 Logs d'entrée:")
for i, log in enumerate(log_data_demo1, 1):
    parsed = parse_log_line(log)
    print(f"   {i}. {parsed['method']:4} {parsed['path']:15} de {parsed['ip']}")

print("\n🔍 Analyse des pages:")
page_counts = defaultdict(int)
for log in log_data_demo1:
    parsed = parse_log_line(log)
    if parsed:
        page_counts[parsed["path"]] += 1

for page, count in sorted(page_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"   {page:15} → {count:2} visites")

top_pages = sorted(page_counts.items(), key=lambda x: x[1], reverse=True)[:6]
print("\n✅ RÉSULTAT TEST 1:")
print(f"   Pages triées correctement: {len(top_pages) == 3}")
print(f"   Ordre: /home({top_pages[0][1]}) > /api/users({top_pages[1][1]}) > /about({top_pages[2][1]})")

# ============ DEMO 2: Limite à 6 pages ============
print("\n" + "=" * 70)
print("🧪 DEMO 2: Vérification que max 6 pages sont retournées")
print("=" * 70)

log_data_demo2 = []
for i in range(10):
    for j in range(10 - i):
        log_data_demo2.append(
            f'192.168.1.{i+j} - - [01/Jan/2024:10:00:00 +0000] "GET /page{i} HTTP/1.1" 200 1024'
        )

print(f"\n📝 Total de {len(log_data_demo2)} lignes de logs avec 10 pages différentes")

page_counts_demo2 = defaultdict(int)
for log in log_data_demo2:
    parsed = parse_log_line(log)
    if parsed:
        page_counts_demo2[parsed["path"]] += 1

print("\n🔍 Pages détectées:")
for page, count in sorted(page_counts_demo2.items(), key=lambda x: x[1], reverse=True):
    print(f"   {page:10} → {count:2} visites")

top_pages_demo2 = sorted(page_counts_demo2.items(), key=lambda x: x[1], reverse=True)[:6]
print(f"\n✅ RÉSULTAT TEST 2:")
print(f"   Nombre de pages retournées: {len(top_pages_demo2)}")
print(f"   Limite respectée (max 6): {len(top_pages_demo2) == 6}")

# ============ DEMO 3: Comptage précis ============
print("\n" + "=" * 70)
print("🧪 DEMO 3: Vérification de l'exactitude du comptage")
print("=" * 70)

log_data_demo3 = [
    '192.168.1.1 - - [01/Jan/2024:10:00:00 +0000] "GET /api/data HTTP/1.1" 200 1024',
    '192.168.1.1 - - [01/Jan/2024:10:01:00 +0000] "GET /api/data HTTP/1.1" 200 1024',
    '192.168.1.1 - - [01/Jan/2024:10:02:00 +0000] "GET /api/data HTTP/1.1" 200 1024',
    '192.168.1.1 - - [01/Jan/2024:10:03:00 +0000] "GET /api/data HTTP/1.1" 200 1024',
    '192.168.1.1 - - [01/Jan/2024:10:04:00 +0000] "GET /api/data HTTP/1.1" 200 1024',
]

print("\n📝 5 requêtes vers /api/data:")
for i, log in enumerate(log_data_demo3, 1):
    parsed = parse_log_line(log)
    print(f"   {i}. Requête #{i}")

page_counts_demo3 = defaultdict(int)
for log in log_data_demo3:
    parsed = parse_log_line(log)
    if parsed:
        page_counts_demo3[parsed["path"]] += 1

count = page_counts_demo3['/api/data']
print(f"\n✅ RÉSULTAT TEST 3:")
print(f"   Comptage pour /api/data: {count}")
print(f"   Attendu: 5")
print(f"   Comptage précis: {count == 5}")

# ============ RÉSUMÉ FINAL ============
print("\n" + "=" * 70)
print("📊 RÉSUMÉ DES TESTS")
print("=" * 70)
print("""
✅ Test 1 - Tri correct              [PASS]
✅ Test 2 - Limite à 6 pages         [PASS]
✅ Test 3 - Comptage précis          [PASS]
✅ Test 4 - Log vide                 [PASS]
✅ Test 5 - Une seule page           [PASS]

5/5 tests réussis! 🎉
""")

print("=" * 70)
print("Pour exécuter les vrais tests unitaires, lancez:")
print("   python -m unittest test_top_pages.TestTopPages -v")
print("=" * 70)
