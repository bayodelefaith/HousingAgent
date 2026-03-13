echo starting backend develop
stat uvicorn app:main.py --reload


cd frontend/
echo stating frontend development
start npm run dev


