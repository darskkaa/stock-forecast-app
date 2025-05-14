import logging
import yfinance as yf
import numpy as np
import pandas as pd
from prophet import Prophet
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/forecast/{ticker}")
async def get_stock_forecast(ticker: str):
    try:
        logger.info(f"Fetching forecast for ticker: {ticker}")
        # Fetch historical stock data
        stock_data = yf.Ticker(ticker)
        
        # Log additional information about the stock data
        logger.info(f"Stock info: {stock_data.info}")
        
        hist = stock_data.history(period="90d")
        
        logger.info(f"History DataFrame: {hist}")
        logger.info(f"History DataFrame shape: {hist.shape}")
        
        if hist.empty:
            logger.warning(f"No data found for ticker: {ticker}")
            raise HTTPException(status_code=404, detail=f"No stock data found for {ticker}")
        
        # Prepare data for Prophet
        # Remove timezone and convert to datetime without timezone
        df = hist.reset_index()
        df['Date'] = df['Date'].dt.tz_localize(None)  # Remove timezone
        df = df[['Date', 'Close']].rename(columns={'Date': 'ds', 'Close': 'y'})
        
        # Create and fit Prophet model
        model = Prophet()
        model.fit(df)
        
        # Create future dataframe for forecast
        future = model.make_future_dataframe(periods=7)
        future['ds'] = future['ds'].dt.tz_localize(None)  # Remove timezone from future dates
        forecast = model.predict(future)
        
        # Prepare response
        # Remove timezone from historical data
        hist_reset = hist.reset_index()
        hist_reset['Date'] = hist_reset['Date'].dt.tz_localize(None)
        historical_data = hist_reset.to_dict(orient='records')
        
        # Remove timezone from forecast data
        forecast['ds'] = forecast['ds'].dt.tz_localize(None)
        forecast_data = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(7).to_dict(orient='records')
        
        logger.info(f"Successfully generated forecast for {ticker}")
        return {
            "ticker": ticker,
            "historical_data": historical_data,
            "forecast_data": forecast_data
        }
    
    except Exception as e:
        logger.error(f"Error generating forecast for {ticker}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
