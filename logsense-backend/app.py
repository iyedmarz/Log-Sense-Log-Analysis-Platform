from flask import Flask, jsonify, request
from flask_cors import CORS
from fetch_logs import fetch_logs
import re
from datetime import datetime
from collections import defaultdict

app = Flask(__name__)
CORS(app)

LOG_PATTERN = re.compile(
    r'(?P<ip>\S+) - - \[(?P<time>[^\]]+)\] '
    r'"(?P<method>\S+) (?P<path>\S+) \S+" '
    r'(?P<status>\d+) (?P<size>\d+)'
)

def parse_logs():
    fetch_logs()
    entries = []
    try:
        with open("access.log", "r") as f:
            for line in f:
                m = LOG_PATTERN.match(line)
                if m:
                    entries.append({
                        "ip": m.group("ip"),
                        "time": m.group("time"),
                        "method": m.group("method"),
                        "path": m.group("path"),
                        "status": int(m.group("status")),
                        "size": int(m.group("size"))
                    })
    except FileNotFoundError:
        pass
    return entries

@app.route("/api/dashboard")
def dashboard():
    entries = parse_logs()
    
    # Patterns à exclure (ressources statiques)
    excluded_patterns = [
        "/_next/",
        "/images/",
        ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".css", ".js", ".woff", ".woff2"
    ]
    
    # Filtrer les entrées pour exclure les ressources statiques
    filtered_entries = [e for e in entries if not any(pattern in e["path"] for pattern in excluded_patterns)]
    
    total = len(filtered_entries)
    errors = [e for e in filtered_entries if e["status"] >= 400]
    error_rate = round(len(errors) / total * 100, 1) if total > 0 else 0

    # Pages les plus visitées
    page_counts = defaultdict(int)
    for e in filtered_entries:
        # Enlever les paramètres de requête (query string)
        clean_path = e["path"].split("?")[0]
        page_counts[clean_path] += 1
    top_pages = sorted(page_counts.items(), key=lambda x: x[1], reverse=True)[:6]

    # Erreurs par heure
    hourly = defaultdict(int)
    for e in errors:
        try:
            dt = datetime.strptime(e["time"], "%d/%b/%Y:%H:%M:%S %z")
            hour = dt.strftime("%H:00")
            hourly[hour] += 1
        except:
            pass

    return jsonify({
        "total_requests": total,
        "error_rate": error_rate,
        "active_pages": len(page_counts),
        "open_alerts": len([e for e in errors if e["status"] >= 500]),
        "top_pages": [{"page": p, "count": c} for p, c in top_pages],
        "errors_over_time": [{"hour": h, "count": c} for h, c in sorted(hourly.items())]
    })

@app.route("/api/logs")
def logs():
    entries = parse_logs()
    level_filter = request.args.get("level", "all")
    result = []
    
    # Patterns à exclure (ressources statiques)
    excluded_patterns = [
        "/_next/",
        "/images/",
        ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".css", ".js", ".woff", ".woff2"
    ]
    
    for e in entries[-200:][::-1]:  # Augmenter le nombre pour compenser les filtres
        # Vérifier si le chemin doit être exclu
        should_exclude = any(pattern in e["path"] for pattern in excluded_patterns)
        if should_exclude:
            continue
            
        if e["status"] >= 500:
            level = "ERROR"
        elif e["status"] >= 400:
            level = "WARNING"
        else:
            level = "INFO"
        if level_filter != "all" and level != level_filter.upper():
            continue
        result.append({
            "timestamp": e["time"],
            "level": level,
            "service": e["path"],
            "message": f'http://192.168.56.101{e["path"].split("?")[0]}',
            "ip": e["ip"]
        })
    return jsonify(result)

@app.route("/api/alerts")
def alerts():
    entries = parse_logs()
    alerts_list = []
    errors = [e for e in entries if e["status"] >= 500]
    not_found = [e for e in entries if e["status"] == 404]
    total = len(entries)

    if total > 0 and len(errors) / total > 0.05:
        alerts_list.append({
            "title": "Error rate spike",
            "severity": "CRITICAL",
            "condition": "errors > 5%",
            "status": "FIRING",
            "count": len(errors)
        })

    if len(not_found) > 10:
        alerts_list.append({
            "title": "High 404 rate",
            "severity": "HIGH",
            "condition": "404s > 10",
            "status": "FIRING",
            "count": len(not_found)
        })

    if total > 1000:
        alerts_list.append({
            "title": "High traffic volume",
            "severity": "LOW",
            "condition": "requests > 1000",
            "status": "ACKNOWLEDGED",
            "count": total
        })

    return jsonify(alerts_list)

if __name__ == "__main__":
    app.run(debug=True, port=5000)