# LogSense — Log Analysis Platform

LogSense is a web platform that analyses real-time logs from a deployed website on a Virtual Machine. It consists of a Python Flask backend that fetches and parses Nginx logs via SSH, and a React frontend that visualises the data.

---

## Project Structure

```
LogSense/
├── logsense-backend/       # Python Flask API
│   ├── app.py              # Main Flask application
│   ├── fetch_logs.py       # SSH log fetching
│   └── config.py           # VM connection config
│
└── logsense-frontend/      # React frontend (Lovable)
    ├── src/
    ├── public/
    └── package.json
```

---

## Infrastructure

The project uses a **VirtualBox VM** running **Debian 13** to host the witness website:

- **OS:** Debian 13
- **Web server:** Nginx (reverse proxy on port 80 → Next.js on port 3000)
- **Website:** Next.js coaching site (5 pages: Home, Blog, Prestations, Team, Contact)
- **Logs location:** `/var/log/nginx/access.log`
- **VM IP:** `192.168.56.101` (Host-Only network)

---

## Prerequisites

### On the VM
- Debian 13 with Nginx installed
- Next.js coaching site running via PM2 on port 3000
- Nginx configured as reverse proxy
- Log file readable: `chmod o+r /var/log/nginx/access.log`

### On your machine
- Python 3.8+
- Node.js 18+
- Git

---

## Backend Setup (Flask API)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/logsense.git
cd logsense/logsense-backend
```

### 2. Create a virtual environment
```bash
python -m venv venv

# Windows (Git Bash)
source venv/Scripts/activate

# Mac/Linux
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install flask flask-cors paramiko
```

### 4. Configure VM connection
Edit `config.py` with your VM details:
```python
VM_HOST = "192.168.56.101"   # Your VM IP
VM_USER = "your_username"     # Your VM username
VM_PASSWORD = "your_password" # Your VM password
VM_LOG_PATH = "/var/log/nginx/access.log"
LOCAL_LOG_PATH = "access.log"
```

### 5. Run the Flask server
```bash
python app.py
```

The API will be available at `http://localhost:5000`

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/dashboard` | Global stats: total requests, error rate, top pages, errors over time |
| `GET /api/logs` | List of log entries with timestamp, level, page, message |
| `GET /api/logs?level=ERROR` | Filter logs by level (ERROR, WARNING, INFO) |
| `GET /api/alerts` | Auto-generated alerts based on thresholds |

### Example response — `/api/dashboard`
```json
{
  "total_requests": 342,
  "error_rate": 2.4,
  "active_pages": 5,
  "open_alerts": 1,
  "top_pages": [
    { "page": "/blog", "count": 120 },
    { "page": "/", "count": 98 }
  ],
  "errors_over_time": [
    { "hour": "12:00", "count": 4 }
  ]
}
```

---

## Frontend Setup (React)

### 1. Navigate to the frontend folder
```bash
cd logsense/logsense-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure the API URL
In the source code, make sure the API base URL points to your Flask backend:
```
http://localhost:5000
```

### 4. Run the development server
```bash
npm run dev
```

The frontend will be available at `http://localhost:8080`

---

## VM Setup Guide

### 1. Create the VM
- Software: Oracle VirtualBox
- OS: Debian 13
- RAM: 2048 MB / CPUs: 2 / Storage: 20 GB
- Network Adapter 1: NAT
- Network Adapter 2: Host-Only Adapter

### 2. Install Nginx
```bash
apt update && apt install nginx -y
systemctl start nginx
systemctl enable nginx
```

### 3. Install Node.js
```bash
apt install curl -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install nodejs -y
```

### 4. Deploy the coaching website
Transfer the Next.js project to the VM:
```bash
# On Windows (PowerShell/Git Bash)
scp -r app content public api emails contentlayer.config.js next.config.js package.json package-lock.json postcss.config.js tailwind.config.js jsconfig.json user@192.168.56.101:/home/user/coaching-site
```

Then on the VM:
```bash
cd /home/user/coaching-site
npm install
npm run build
```

### 5. Run with PM2
```bash
npm install -g pm2
pm2 start npm --name "coaching" -- start
pm2 save
```

### 6. Configure Nginx as reverse proxy
Edit `/etc/nginx/sites-available/default`:
```nginx
server {
    listen 80;
    server_name 192.168.56.101;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then reload Nginx:
```bash
nginx -t
systemctl reload nginx
```

---

## How It Works

```
Browser
   ↓
http://192.168.56.101 (port 80)
   ↓
Nginx ← writes logs to /var/log/nginx/access.log
   ↓
http://localhost:3000
   ↓
Next.js ← generates the page
   ↓
[LogSense Backend]
   ↓ SSH (Paramiko)
Fetches access.log from VM
   ↓ Regex parsing
Extracts: IP, timestamp, page, status code
   ↓ REST API
http://localhost:5000/api/dashboard
http://localhost:5000/api/logs
http://localhost:5000/api/alerts
   ↓
[LogSense Frontend]
   ↓
Displays real-time dashboard, logs & alerts
```

---

## Built With

- **Python** — Flask, Paramiko, Regex
- **React** — Frontend dashboard
- **Nginx** — Reverse proxy & log generation
- **Next.js** — Witness coaching website
- **Debian 13** — VM operating system
- **Oracle VirtualBox** — Virtualisation
