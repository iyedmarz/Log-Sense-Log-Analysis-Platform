import paramiko
from config import VM_HOST, VM_USER, VM_PASSWORD, VM_LOG_PATH, LOCAL_LOG_PATH

def fetch_logs():
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(VM_HOST, username=VM_USER, password=VM_PASSWORD)
        
        sftp = client.open_sftp()
        sftp.get(VM_LOG_PATH, LOCAL_LOG_PATH)
        sftp.close()
        client.close()
        print("Logs récupérés avec succès")
        return True
    except Exception as e:
        print(f"Erreur SSH: {e}")
        return False