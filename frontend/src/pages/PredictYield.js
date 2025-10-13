import { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";

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
        <section className="rounded-lg bg-white p-6 shadow space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Prediction Result</h2>
          <p className="text-sm text-slate-700">
            Expected yield: <span className="font-semibold text-primary">{result.predicted_yield.toFixed(2)}</span>
          </p>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Recommended Crops</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {result.recommended_crops.map((crop) => (
                <li key={crop}>{crop}</li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </section>
  );
}

export default PredictYield;
