import socket

for host in ['aws-1-eu-central-1.pooler.supabase.com', 'aws-0-us-east-1.pooler.supabase.com']:
    for port in [5432, 6543]:
        print(f"Testing {host}:{port}")
        s = socket.socket(socket.AF_INET, socket.socket.SOCK_STREAM)
        s.settimeout(2.0)
        try:
            s.connect((host, port))
            print("Connected!")
            s.close()
        except Exception as e:
            print("Failed:", e)
