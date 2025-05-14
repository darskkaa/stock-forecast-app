# PowerShell script to run Stock Forecast Application

# Backend Configuration
$BackendPath = "C:\Users\darkz\CascadeProjects\stock-forecast-app\backend"
$FrontendPath = "C:\Users\darkz\CascadeProjects\stock-forecast-app\frontend\stock-forecast-frontend"

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $BackendPath; .\venv\Scripts\Activate; uvicorn main:app --reload --port 8000" -WorkingDirectory $BackendPath

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $FrontendPath; npm run dev" -WorkingDirectory $FrontendPath

Write-Host "Stock Forecast Application is starting..."
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:3000"
