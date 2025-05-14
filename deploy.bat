@echo off
start powershell -Command "cd C:\Users\darkz\CascadeProjects\stock-forecast-app\backend; python -m venv venv; .\venv\Scripts\Activate; pip install -r requirements.txt; uvicorn main:app --reload --port 8000"
start powershell -Command "cd C:\Users\darkz\CascadeProjects\stock-forecast-app\frontend\stock-forecast-frontend; npm install; npm run dev"
echo Stock Forecast Application is starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
