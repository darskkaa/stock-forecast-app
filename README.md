# Stock Price Forecast Application

## Overview
A web application that allows users to input a stock ticker symbol and receive a 7-day forecast based on historical stock price data.

## Technologies
- Backend: FastAPI, Prophet, yfinance
- Frontend: Next.js, Tailwind CSS, Chart.js
- Deployment: Render (Backend), Vercel (Frontend)

## Features
- Real-time stock price retrieval
- 7-day price forecast
- Interactive chart visualization
- Responsive design

## Setup

### Backend
1. Navigate to `backend` directory
2. Create a virtual environment
3. Install dependencies: `pip install -r requirements.txt`
4. Run server: `uvicorn main:app --reload`

### Frontend
1. Navigate to `frontend/stock-forecast-frontend`
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`

## Deployment
- Backend: Deploy on Render
- Frontend: Deploy on Vercel

## Note
Requires an active internet connection to fetch stock data.
