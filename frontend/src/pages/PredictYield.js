import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area
} from "recharts";
import {
  Thermometer,
  Droplets,
  MapPin,
  Wheat,
  Zap,
  Navigation,
  RefreshCw,
  Download,
  Copy,
  Info,
  Sun,
  Moon,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2
} from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const soilOptions = [
  { label: "Clay", value: "clay", icon: "🪨" },
  { label: "Sandy", value: "sandy", icon: "🏖️" },
  { label: "Loamy", value: "loamy", icon: "🌱" },
  { label: "Peaty", value: "peaty", icon: "🌿" },
];

const cropOptions = [
  { label: "Wheat", value: "wheat", icon: "🌾" },
  { label: "Rice", value: "🌾", icon: "🌾" },
  { label: "Maize", value: "🌽", icon: "🌽" },
  { label: "Soybean", value: "🫘", icon: "🫘" },
];

const formValidation = {
  temperature: { min: -50, max: 60, unit: "°C", typical: "20-35°C" },
  humidity: { min: 0, max: 100, unit: "%", typical: "40-80%" },
  water_flow: { min: 0, max: 1000, unit: "L/min", typical: "10-100 L/min" },
  latitude: { min: -90, max: 90, unit: "°", typical: "-90 to 90" },
  longitude: { min: -180, max: 180, unit: "°", typical: "-180 to 180" },
};

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

  const [formErrors, setFormErrors] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [animatedYield, setAnimatedYield] = useState(0);

  // Auto-save form data
  useEffect(() => {
    const savedForm = localStorage.getItem('cropYieldForm');
    if (savedForm) {
      try {
        setForm(JSON.parse(savedForm));
      } catch (e) {
        console.warn('Failed to load saved form data');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cropYieldForm', JSON.stringify(form));
  }, [form]);

  // Animated yield counter
  useEffect(() => {
    if (result && showResults) {
      const targetYield = result.predicted_yield;
      const duration = 2000;
      const steps = 60;
      const increment = targetYield / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetYield) {
          setAnimatedYield(targetYield);
          clearInterval(timer);
        } else {
          setAnimatedYield(current);
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [result, showResults]);

  const validateField = useCallback((name, value) => {
    if (!value && value !== 0) return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;

    const validation = formValidation[name];
    if (validation) {
      const numValue = Number(value);
      if (isNaN(numValue)) return `Please enter a valid number`;
      if (numValue < validation.min || numValue > validation.max) {
        return `Value must be between ${validation.min} and ${validation.max}`;
      }
    }
    return null;
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    const error = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(4),
          longitude: position.coords.longitude.toFixed(4),
        }));
        setLoading(false);
      },
      (error) => {
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  const fillRandomData = () => {
    const randomData = {
      temperature: (Math.random() * 30 + 15).toFixed(1),
      humidity: (Math.random() * 40 + 40).toFixed(1),
      soil_type: soilOptions[Math.floor(Math.random() * soilOptions.length)].value,
      crop_type: cropOptions[Math.floor(Math.random() * cropOptions.length)].value,
      water_flow: (Math.random() * 50 + 20).toFixed(1),
      latitude: (Math.random() * 180 - 90).toFixed(4),
      longitude: (Math.random() * 360 - 180).toFixed(4),
    };
    setForm(randomData);
    setFormErrors({});
  };

  const resetForm = () => {
    setForm({
      temperature: "",
      humidity: "",
      soil_type: soilOptions[0].value,
      crop_type: cropOptions[0].value,
      water_flow: "",
      latitude: "",
      longitude: "",
    });
    setFormErrors({});
    setResult(null);
    setError(null);
    setShowResults(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate all fields
    const errors = {};
    Object.keys(form).forEach(key => {
      const error = validateField(key, form[key]);
      if (error) errors[key] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setShowResults(false);

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
      setPredictionHistory(prev => [{
        ...data,
        ...form,
        timestamp: new Date().toISOString(),
        id: Date.now()
      }, ...prev.slice(0, 4)]); // Keep last 5 predictions

      setTimeout(() => setShowResults(true), 100);
    } catch (apiError) {
      const message = apiError?.response?.data?.error || apiError.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const exportResults = () => {
    if (!result) return;

    const report = {
      prediction: result,
      inputs: form,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crop-yield-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyResults = async () => {
    if (!result) return;

    const text = `Crop Yield Prediction Results:
Yield: ${result.predicted_yield.toFixed(2)} tons/hectare
Inputs: ${Object.entries(form).map(([k, v]) => `${k}: ${v}`).join(', ')}
Generated on: ${new Date().toLocaleString()}`;

    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy results');
    }
  };

  // Chart data preparation
  const weatherComparisonData = result ? [
    { condition: "Extreme Weather", yield: result.predicted_yield * 0.6, percentage: 60 },
    { condition: "Normal Weather", yield: result.predicted_yield, percentage: 100 },
    { condition: "Optimal Weather", yield: result.predicted_yield * 1.3, percentage: 130 },
  ] : [];

  const parameterImpactData = result ? [
    { parameter: "Temperature", impact: Math.abs(form.temperature - 25) * -0.1 },
    { parameter: "Humidity", impact: Math.abs(form.humidity - 65) * -0.05 },
    { parameter: "Water Flow", impact: form.water_flow * 0.02 },
    { parameter: "Soil Quality", impact: soilOptions.find(s => s.value === form.soil_type) ? 0.8 : 0.5 },
    { parameter: "Location", impact: 0.3 },
  ] : [];

  const historicalData = predictionHistory.map((pred, index) => ({
    time: `Prediction ${predictionHistory.length - index}`,
    yield: pred.predicted_yield,
  }));

  const weatherSensitivityData = result ? [
    { temp: 15, yield: result.predicted_yield * 0.7 },
    { temp: 20, yield: result.predicted_yield * 0.9 },
    { temp: 25, yield: result.predicted_yield },
    { temp: 30, yield: result.predicted_yield * 1.1 },
    { temp: 35, yield: result.predicted_yield * 0.95 },
  ] : [];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-earth-900 text-white' : 'bg-gradient-to-br from-earth-50 to-earth-100'}`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="leaves" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M20,50 Q30,30 50,40 Q70,30 80,50 Q70,70 50,60 Q30,70 20,50" fill="#2D5016" opacity="0.3"/>
              <circle cx="30" cy="30" r="3" fill="#4A7C2C"/>
              <circle cx="70" cy="70" r="2" fill="#4A7C2C"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#leaves)"/>
        </svg>
      </div>

      <section className="relative mx-auto max-w-7xl px-4 py-8">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-earth-800'} animate-fade-in`}>
              🌾 Crop Yield Predictor
            </h1>
            <p className={`mt-2 text-lg ${darkMode ? 'text-earth-300' : 'text-earth-600'}`}>
              Advanced agricultural analytics powered by machine learning
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition-all duration-300 ${
              darkMode
                ? 'bg-earth-700 hover:bg-earth-600 text-yellow-400'
                : 'bg-white hover:bg-earth-50 text-earth-700 shadow-soft'
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <form
              onSubmit={handleSubmit}
              className={`rounded-2xl backdrop-blur-md ${
                darkMode
                  ? 'bg-earth-800/80 border border-earth-700'
                  : 'bg-white/80 border border-white/20'
              } p-8 shadow-soft space-y-6 animate-fade-in`}
            >
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Temperature */}
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-semibold ${darkMode ? 'text-earth-200' : 'text-earth-700'}`}>
                    <Thermometer size={16} />
                    Temperature
                    <span className="text-xs opacity-60">({formValidation.temperature.unit})</span>
                    <Info size={14} className="cursor-help" title={`Typical range: ${formValidation.temperature.typical}`} />
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    value={form.temperature}
                    onChange={handleChange}
                    required
                    step="0.1"
                    min={formValidation.temperature.min}
                    max={formValidation.temperature.max}
                    className={`w-full rounded-xl border px-4 py-3 transition-all duration-200 ${
                      darkMode
                        ? 'bg-earth-700 border-earth-600 text-white placeholder-earth-400 focus:border-primary focus:ring-2 focus:ring-primary/20'
                        : 'bg-white border-earth-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    } ${formErrors.temperature ? 'border-red-400' : ''}`}
                    placeholder="25.0"
                    aria-label="Temperature in Celsius"
                  />
                  {formErrors.temperature && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      {formErrors.temperature}
                    </p>
                  )}
                </div>

                {/* Humidity */}
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-semibold ${darkMode ? 'text-earth-200' : 'text-earth-700'}`}>
                    <Droplets size={16} />
                    Humidity
                    <span className="text-xs opacity-60">({formValidation.humidity.unit})</span>
                    <Info size={14} className="cursor-help" title={`Typical range: ${formValidation.humidity.typical}`} />
                  </label>
                  <input
                    type="number"
                    name="humidity"
                    value={form.humidity}
                    onChange={handleChange}
                    required
                    step="0.1"
                    min={formValidation.humidity.min}
                    max={formValidation.humidity.max}
                    className={`w-full rounded-xl border px-4 py-3 transition-all duration-200 ${
                      darkMode
                        ? 'bg-earth-700 border-earth-600 text-white placeholder-earth-400 focus:border-primary focus:ring-2 focus:ring-primary/20'
                        : 'bg-white border-earth-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    } ${formErrors.humidity ? 'border-red-400' : ''}`}
                    placeholder="65.0"
                    aria-label="Humidity percentage"
                  />
                  {formErrors.humidity && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      {formErrors.humidity}
                    </p>
                  )}
                </div>

                {/* Soil Type */}
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-semibold ${darkMode ? 'text-earth-200' : 'text-earth-700'}`}>
                    <MapPin size={16} />
                    Soil Type
                  </label>
                  <select
                    name="soil_type"
                    value={form.soil_type}
                    onChange={handleChange}
                    className={`w-full rounded-xl border px-4 py-3 transition-all duration-200 ${
                      darkMode
                        ? 'bg-earth-700 border-earth-600 text-white focus:border-primary focus:ring-2 focus:ring-primary/20'
                        : 'bg-white border-earth-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                    aria-label="Soil type selection"
                  >
                    {soilOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Crop Type */}
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-semibold ${darkMode ? 'text-earth-200' : 'text-earth-700'}`}>
                    <Wheat size={16} />
                    Crop Type
                  </label>
                  <select
                    name="crop_type"
                    value={form.crop_type}
                    onChange={handleChange}
                    className={`w-full rounded-xl border px-4 py-3 transition-all duration-200 ${
                      darkMode
                        ? 'bg-earth-700 border-earth-600 text-white focus:border-primary focus:ring-2 focus:ring-primary/20'
                        : 'bg-white border-earth-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                    aria-label="Crop type selection"
                  >
                    {cropOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Water Flow */}
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-semibold ${darkMode ? 'text-earth-200' : 'text-earth-700'}`}>
                    <Zap size={16} />
                    Water Flow
                    <span className="text-xs opacity-60">({formValidation.water_flow.unit})</span>
                    <Info size={14} className="cursor-help" title={`Typical range: ${formValidation.water_flow.typical}`} />
                  </label>
                  <input
                    type="number"
                    name="water_flow"
                    value={form.water_flow}
                    onChange={handleChange}
                    required
                    step="0.1"
                    min={formValidation.water_flow.min}
                    max={formValidation.water_flow.max}
                    className={`w-full rounded-xl border px-4 py-3 transition-all duration-200 ${
                      darkMode
                        ? 'bg-earth-700 border-earth-600 text-white placeholder-earth-400 focus:border-primary focus:ring-2 focus:ring-primary/20'
                        : 'bg-white border-earth-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    } ${formErrors.water_flow ? 'border-red-400' : ''}`}
                    placeholder="45.0"
                    aria-label="Water flow in liters per minute"
                  />
                  {formErrors.water_flow && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      {formErrors.water_flow}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2 sm:col-span-2">
                  <label className={`flex items-center justify-between text-sm font-semibold ${darkMode ? 'text-earth-200' : 'text-earth-700'}`}>
                    <span className="flex items-center gap-2">
                      <Navigation size={16} />
                      Location Coordinates
                    </span>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={loading}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        darkMode
                          ? 'bg-primary/20 text-primary hover:bg-primary/30'
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      } disabled:opacity-50`}
                      aria-label="Get current location"
                    >
                      <Navigation size={12} />
                      Get Location
                    </button>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="number"
                        name="latitude"
                        value={form.latitude}
                        onChange={handleChange}
                        required
                        step="0.0001"
                        min={formValidation.latitude.min}
                        max={formValidation.latitude.max}
                        className={`w-full rounded-xl border px-3 py-2 text-sm transition-all duration-200 ${
                          darkMode
                            ? 'bg-earth-700 border-earth-600 text-white placeholder-earth-400 focus:border-primary focus:ring-2 focus:ring-primary/20'
                            : 'bg-white border-earth-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                        } ${formErrors.latitude ? 'border-red-400' : ''}`}
                        placeholder="28.6139"
                        aria-label="Latitude"
                      />
                      <p className="text-xs opacity-60 mt-1">Latitude</p>
                    </div>
                    <div>
                      <input
                        type="number"
                        name="longitude"
                        value={form.longitude}
                        onChange={handleChange}
                        required
                        step="0.0001"
                        min={formValidation.longitude.min}
                        max={formValidation.longitude.max}
                        className={`w-full rounded-xl border px-3 py-2 text-sm transition-all duration-200 ${
                          darkMode
                            ? 'bg-earth-700 border-earth-600 text-white placeholder-earth-400 focus:border-primary focus:ring-2 focus:ring-primary/20'
                            : 'bg-white border-earth-200 focus:border-primary focus:ring-2 focus:ring-primary/20'
                        } ${formErrors.longitude ? 'border-red-400' : ''}`}
                        placeholder="77.2090"
                        aria-label="Longitude"
                      />
                      <p className="text-xs opacity-60 mt-1">Longitude</p>
                    </div>
                  </div>
                  {(formErrors.latitude || formErrors.longitude) && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      Please enter valid coordinates
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading || Object.keys(formErrors).length > 0}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    darkMode
                      ? 'bg-primary hover:bg-primary-light text-white shadow-glow disabled:bg-earth-600'
                      : 'bg-gradient-to-r from-primary to-primary-light text-white shadow-soft hover:shadow-glow disabled:bg-earth-300'
                  } disabled:cursor-not-allowed transform hover:scale-105`}
                  aria-label="Predict crop yield"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Predicting...
                    </>
                  ) : (
                    <>
                      <TrendingUp size={18} />
                      Predict Yield
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={fillRandomData}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    darkMode
                      ? 'bg-earth-700 hover:bg-earth-600 text-earth-200 border border-earth-600'
                      : 'bg-white hover:bg-earth-50 text-earth-700 border border-earth-200'
                  }`}
                  aria-label="Fill with random sample data"
                >
                  <RefreshCw size={16} />
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    darkMode
                      ? 'bg-red-900/50 hover:bg-red-900/70 text-red-300 border border-red-800'
                      : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                  }`}
                  aria-label="Reset form"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              {error && (
                <div className={`p-4 rounded-xl border ${
                  darkMode
                    ? 'bg-red-900/20 border-red-800 text-red-300'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} />
                    <span className="font-medium">Error</span>
                  </div>
                  <p className="text-sm mt-1">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-2 text-xs underline hover:no-underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {showResults && result ? (
              <div className="space-y-6 animate-slide-up">
                {/* Main Yield Display */}
                <div className={`rounded-3xl backdrop-blur-md ${
                  darkMode
                    ? 'bg-gradient-to-br from-primary/20 to-primary-light/20 border border-primary/30'
                    : 'bg-gradient-to-br from-primary to-primary-light border border-white/20'
                } p-8 shadow-glow text-white text-center relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                      <circle cx="20" cy="20" r="2" fill="white"/>
                      <circle cx="80" cy="30" r="1.5" fill="white"/>
                      <circle cx="40" cy="70" r="1" fill="white"/>
                      <circle cx="70" cy="80" r="2.5" fill="white"/>
                    </svg>
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <CheckCircle size={24} className="text-green-300" />
                      <h2 className="text-xl font-semibold opacity-90">Expected Yield</h2>
                    </div>
                    <div className={`bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10`}>
                      <p className="text-6xl font-extrabold mb-2 animate-pulse-slow">
                        {animatedYield.toFixed(2)}
                      </p>
                      <p className="text-xl font-medium opacity-90">tons/hectare</p>
                      <div className="mt-4 flex items-center justify-center gap-4">
                        <button
                          onClick={exportResults}
                          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200"
                          aria-label="Download results as JSON"
                        >
                          <Download size={16} />
                          Export
                        </button>
                        <button
                          onClick={copyResults}
                          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200"
                          aria-label="Copy results to clipboard"
                        >
                          <Copy size={16} />
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weather Comparison Chart */}
                <div className={`rounded-2xl backdrop-blur-md ${
                  darkMode
                    ? 'bg-earth-800/80 border border-earth-700'
                    : 'bg-white/80 border border-white/20'
                } p-6 shadow-soft`}>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-earth-800'}`}>
                    <TrendingUp size={18} />
                    Weather Condition Impact
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={weatherComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis
                        dataKey="condition"
                        stroke={darkMode ? '#9ca3af' : '#6b7280'}
                        fontSize={12}
                      />
                      <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#1f2937' : 'white',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar
                        dataKey="yield"
                        fill="#2D5016"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Parameter Impact Radar Chart */}
                <div className={`rounded-2xl backdrop-blur-md ${
                  darkMode
                    ? 'bg-earth-800/80 border border-earth-700'
                    : 'bg-white/80 border border-white/20'
                } p-6 shadow-soft`}>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-earth-800'}`}>
                    <Info size={18} />
                    Parameter Impact Analysis
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={parameterImpactData}>
                      <PolarGrid stroke={darkMode ? '#374151' : '#e5e7eb'} />
                      <PolarAngleAxis
                        dataKey="parameter"
                        tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 1]}
                        tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                      />
                      <Radar
                        name="Impact"
                        dataKey="impact"
                        stroke="#4A7C2C"
                        fill="#4A7C2C"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#1f2937' : 'white',
                          border: 'none',
                          borderRadius: '8px'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Historical Trends */}
                {predictionHistory.length > 1 && (
                  <div className={`rounded-2xl backdrop-blur-md ${
                    darkMode
                      ? 'bg-earth-800/80 border border-earth-700'
                      : 'bg-white/80 border border-white/20'
                  } p-6 shadow-soft`}>
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-earth-800'}`}>
                      <TrendingUp size={18} />
                      Prediction History
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                        <XAxis
                          dataKey="time"
                          stroke={darkMode ? '#9ca3af' : '#6b7280'}
                          fontSize={12}
                        />
                        <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: darkMode ? '#1f2937' : 'white',
                            border: 'none',
                            borderRadius: '8px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="yield"
                          stroke="#2D5016"
                          strokeWidth={3}
                          dot={{ fill: '#2D5016', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#2D5016', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Recommendations */}
                <div className={`rounded-2xl backdrop-blur-md ${
                  darkMode
                    ? 'bg-earth-800/80 border border-earth-700'
                    : 'bg-white/80 border border-white/20'
                } p-6 shadow-soft`}>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-earth-800'}`}>
                    <CheckCircle size={18} />
                    Farming Recommendations
                  </h3>
                  <div className="space-y-3">
                    {result.predicted_yield > 5 && (
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                        <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                          🌟 Excellent conditions! Consider expanding your crop area for maximum yield.
                        </p>
                      </div>
                    )}
                    {form.temperature > 35 && (
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                        <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                          ☀️ High temperature detected. Ensure adequate irrigation to prevent heat stress.
                        </p>
                      </div>
                    )}
                    {form.humidity < 40 && (
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                        <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                          💧 Low humidity. Monitor soil moisture closely and consider mulching.
                        </p>
                      </div>
                    )}
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-primary/10' : 'bg-primary/5'}`}>
                      <p className={`text-sm ${darkMode ? 'text-primary-200' : 'text-primary-700'}`}>
                        📊 Track these conditions weekly for optimal yield monitoring and early issue detection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`flex items-center justify-center h-full min-h-[400px] rounded-2xl border-2 border-dashed ${
                darkMode ? 'border-earth-600 bg-earth-800/50' : 'border-earth-200 bg-earth-50/50'
              } backdrop-blur-sm`}>
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${
                    darkMode ? 'bg-earth-700' : 'bg-white'
                  } flex items-center justify-center`}>
                    <TrendingUp size={32} className={darkMode ? 'text-earth-400' : 'text-earth-400'} />
                  </div>
                  <p className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-earth-700'}`}>
                    Results will appear here
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-earth-300' : 'text-earth-500'}`}>
                    Fill out the form and click Predict Yield to see detailed analytics
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default PredictYield;
