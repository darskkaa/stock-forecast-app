import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const [ticker, setTicker] = useState('');
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState('');

  const fetchStockData = async () => {
    try {
      // Validate ticker input
      if (!ticker || ticker.trim() === '') {
        setError('Please enter a valid stock ticker');
        return;
      }

      const response = await axios.get(`http://localhost:8000/forecast/${ticker}`, {
        timeout: 10000 // 10-second timeout
      });
      
      // Additional validation of response data
      if (!response.data || !response.data.historical_data || !response.data.forecast_data) {
        throw new Error('Invalid response format');
      }

      setStockData(response.data);
      setError('');
    } catch (err) {
      console.error('Stock data fetch error:', err);
      
      // More specific error messages
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(err.response.data.detail || 'Failed to fetch stock data');
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Error in request setup. Please try again.');
      }
      
      setStockData(null);
    }
  };

  const prepareChartData = () => {
    if (!stockData) return null;

    const historicalPrices = stockData.historical_data.map(item => item.Close);
    const historicalDates = stockData.historical_data.map(item => new Date(item.Date).toLocaleDateString());
    const forecastPrices = stockData.forecast_data.map(item => item.yhat);
    const forecastDates = stockData.forecast_data.map(item => new Date(item.ds).toLocaleDateString());

    return {
      labels: [...historicalDates, ...forecastDates],
      datasets: [
        {
          label: 'Historical Prices',
          data: historicalPrices,
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
        },
        {
          label: 'Forecast Prices',
          data: [...Array(historicalPrices.length).fill(null), ...forecastPrices],
          borderColor: 'green',
          backgroundColor: 'rgba(0, 255, 0, 0.1)',
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Stock Price Forecast</h1>
        <div className="flex mb-4">
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Enter Stock Ticker (e.g., AAPL)"
            className="flex-grow p-2 border rounded-l-md"
          />
          <button
            onClick={fetchStockData}
            className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
          >
            Forecast
          </button>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {stockData && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">{ticker} Stock Forecast</h2>
            <Line 
              data={prepareChartData()}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: `${ticker} Price Forecast` }
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
