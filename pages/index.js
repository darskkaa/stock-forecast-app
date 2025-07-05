import { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Home() {
  const [ticker, setTicker] = useState("");
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // TODO: Replace with your deployed backend URL when available
  const BACKEND_URL = "http://localhost:8000/forecast/";

  const fetchForecast = async (e) => {
    e.preventDefault();
    setError("");
    setForecast(null);
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}${ticker}`);
      setForecast(res.data);
    } catch (err) {
      setError("Could not fetch forecast. Please check the ticker and try again.");
    }
    setLoading(false);
  };

  // Prepare chart data
  let chartData = null;
  if (forecast) {
    chartData = {
      labels: [
        ...forecast.historical.map((d) => d.ds),
        ...forecast.forecast.map((d) => d.ds),
      ],
      datasets: [
        {
          label: "Historical",
          data: forecast.historical.map((d) => d.y),
          borderColor: "#3b82f6",
          backgroundColor: "#3b82f633",
          fill: false,
        },
        {
          label: "Forecast",
          data: [
            ...Array(forecast.historical.length).fill(null),
            ...forecast.forecast.map((d) => d.yhat),
          ],
          borderColor: "#f59e42",
          backgroundColor: "#f59e4233",
          borderDash: [5, 5],
          fill: false,
        },
      ],
    };
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-4">
      <h1 className="text-3xl font-bold my-6">Stock Forecast App</h1>
      <form className="flex gap-2 mb-6" onSubmit={fetchForecast}>
        <input
          className="border px-3 py-2 rounded shadow"
          type="text"
          placeholder="Enter stock ticker (e.g. AAPL)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          required
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Forecast"}
        </button>
      </form>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {forecast && chartData && (
        <div className="w-full max-w-2xl bg-white p-4 rounded shadow">
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: `7-Day Forecast for ${ticker}` },
              },
            }}
          />
        </div>
      )}
    </main>
  );
}

