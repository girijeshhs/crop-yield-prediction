import { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const soilOptions = [
  { label: "Clay", value: "clay" },
  { label: "Sandy", value: "sandy" },
  { label: "Loamy", value: "loamy" },
  { label: "Peaty", value: "peaty" },
];

const cropOptions = [
  { label: "Wheat", value: "wheat" },
  { label: "Rice", value: "rice" },
  { label: "Maize", value: "maize" },
  { label: "Soybean", value: "soybean" },
];

function PredictYield() {
  const [form, setForm] = useState({
    temperature: "",
    humidity: "",
    soil_type: soilOptions[0].value,
    crop_type: cropOptions[0].value,
    water_flow: "",
    latitude: "",
    longitude: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await axios.post(`${API_BASE_URL}/predict`, {
        ...form,
        temperature: Number(form.temperature),
        humidity: Number(form.humidity),
        water_flow: Number(form.water_flow),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      });
      setResult(data);
    } catch (apiError) {
      const message = apiError?.response?.data?.error || apiError.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Crop Yield Predictor</h1>
        <p className="mt-2 text-sm text-slate-600">
          Provide current field conditions to estimate yield and receive crop recommendations.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg bg-white p-6 shadow space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col text-sm font-medium text-slate-700">
            Temperature (°C)
            <input
              type="number"
              name="temperature"
              value={form.temperature}
              onChange={handleChange}
              required
              step="0.1"
              className="mt-1 rounded-md border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-700">
            Humidity (%)
            <input
              type="number"
              name="humidity"
              value={form.humidity}
              onChange={handleChange}
              required
              step="0.1"
              className="mt-1 rounded-md border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-700">
            Soil Type
            <select
              name="soil_type"
              value={form.soil_type}
              onChange={handleChange}
              className="mt-1 rounded-md border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {soilOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-700">
            Crop Type
            <select
              name="crop_type"
              value={form.crop_type}
              onChange={handleChange}
              className="mt-1 rounded-md border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {cropOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-700">
            Water Flow (L/min)
            <input
              type="number"
              name="water_flow"
              value={form.water_flow}
              onChange={handleChange}
              required
              step="0.1"
              className="mt-1 rounded-md border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-700">
            Latitude
            <input
              type="number"
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              required
              step="0.0001"
              className="mt-1 rounded-md border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-700">
            Longitude
            <input
              type="number"
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              required
              step="0.0001"
              className="mt-1 rounded-md border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2 text-white font-semibold shadow hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/60"
        >
          {loading ? "Predicting..." : "Predict Yield"}
        </button>
        {loading && <Loader label="Calculating" />}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      {result && (
        <section className="space-y-6">
          {/* Main Result Card */}
          <div className="rounded-lg bg-gradient-to-br from-primary to-accent p-8 shadow-xl text-white">
            <h2 className="text-3xl font-bold mb-4">Prediction Results</h2>
            <div className="bg-white/20 backdrop-blur rounded-lg p-6">
              <p className="text-sm uppercase tracking-wide mb-2">Expected Yield</p>
              <p className="text-5xl font-extrabold">
                {result.predicted_yield.toFixed(2)}
                <span className="text-2xl ml-2">tons/hectare</span>
              </p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Yield Comparison Bar Chart */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Yield Comparison</h3>
              <Bar
                data={{
                  labels: ["Low", "Average", "Your Prediction", "High", "Optimal"],
                  datasets: [
                    {
                      label: "Yield (tons/hectare)",
                      data: [
                        result.predicted_yield * 0.6,
                        result.predicted_yield * 0.8,
                        result.predicted_yield,
                        result.predicted_yield * 1.2,
                        result.predicted_yield * 1.4,
                      ],
                      backgroundColor: [
                        "rgba(239, 68, 68, 0.8)",
                        "rgba(251, 146, 60, 0.8)",
                        "rgba(47, 133, 90, 0.9)",
                        "rgba(34, 197, 94, 0.8)",
                        "rgba(16, 185, 129, 0.8)",
                      ],
                      borderColor: [
                        "rgb(239, 68, 68)",
                        "rgb(251, 146, 60)",
                        "rgb(47, 133, 90)",
                        "rgb(34, 197, 94)",
                        "rgb(16, 185, 129)",
                      ],
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    y: { beginAtZero: true },
                  },
                }}
              />
            </div>

            {/* Recommended Crops Distribution */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Recommended Crops Distribution
              </h3>
              <Doughnut
                data={{
                  labels: result.recommended_crops,
                  datasets: [
                    {
                      data: result.recommended_crops.map((_, i) => 100 / result.recommended_crops.length),
                      backgroundColor: [
                        "rgba(47, 133, 90, 0.8)",
                        "rgba(56, 178, 172, 0.8)",
                        "rgba(34, 197, 94, 0.8)",
                        "rgba(16, 185, 129, 0.8)",
                        "rgba(20, 184, 166, 0.8)",
                      ],
                      borderColor: ["#fff"],
                      borderWidth: 3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "bottom" },
                  },
                }}
              />
            </div>
          </div>

          {/* Recommended Crops List */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              🌱 Top Recommended Crops for Your Conditions
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {result.recommended_crops.map((crop, index) => (
                <div
                  key={crop}
                  className="flex items-center gap-3 rounded-lg border-2 border-primary/20 bg-primary/5 p-4 transition hover:border-primary/40 hover:shadow-md"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-base font-semibold text-slate-800">{crop}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Input Summary */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Input Parameters Used</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
              <div className="rounded bg-slate-50 p-3">
                <p className="text-slate-500">Temperature</p>
                <p className="font-semibold text-slate-900">{form.temperature}°C</p>
              </div>
              <div className="rounded bg-slate-50 p-3">
                <p className="text-slate-500">Humidity</p>
                <p className="font-semibold text-slate-900">{form.humidity}%</p>
              </div>
              <div className="rounded bg-slate-50 p-3">
                <p className="text-slate-500">Soil Type</p>
                <p className="font-semibold text-slate-900 capitalize">{form.soil_type}</p>
              </div>
              <div className="rounded bg-slate-50 p-3">
                <p className="text-slate-500">Crop Type</p>
                <p className="font-semibold text-slate-900 capitalize">{form.crop_type}</p>
              </div>
              <div className="rounded bg-slate-50 p-3">
                <p className="text-slate-500">Water Flow</p>
                <p className="font-semibold text-slate-900">{form.water_flow} L/min</p>
              </div>
              <div className="rounded bg-slate-50 p-3">
                <p className="text-slate-500">Latitude</p>
                <p className="font-semibold text-slate-900">{form.latitude}</p>
              </div>
              <div className="rounded bg-slate-50 p-3">
                <p className="text-slate-500">Longitude</p>
                <p className="font-semibold text-slate-900">{form.longitude}</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}

export default PredictYield;
