import socket
from sqlalchemy import create_engine

print("--- DNS RESOLUTION ---")
try:
    print('aws-1-eu-central-1:', socket.gethostbyname('aws-1-eu-central-1.pooler.supabase.com'))
except Exception as e:
    print('aws-1-eu-central-1 DNS failed:', e)

try:
    print('aws-0-us-east-1:', socket.gethostbyname('aws-0-us-east-1.pooler.supabase.com'))
except Exception as e:
    print('aws-0-us-east-1 DNS failed:', e)

print("\n--- DB CONNECTION TESTS ---")
for host in ['aws-1-eu-central-1.pooler.supabase.com', 'aws-0-us-east-1.pooler.supabase.com']:
    for port in [5432, 6543]:
        uri = f'postgresql://postgres.znkyrvifzbjoeqibpcjn:bayodele124@{host}:{port}/postgres'
        print(f'Testing {host}:{port}...')
        try:
            # Short timeout to avoid hanging
            engine = create_engine(uri, connect_args={'connect_timeout': 3})
            with engine.connect() as conn:
                print(' -> SUCCESS!')
        except Exception as e:
            err_msg = str(e).split('\n')[0]
            print(f' -> FAILED: {err_msg}')
