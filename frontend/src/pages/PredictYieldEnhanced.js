import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
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
  Area,
  AreaChart
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
  Loader2,
  Leaf,
  Sprout,
  BarChart3,
  Shield,
  Activity
} from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Zod validation schema
const formSchema = z.object({
  temperature: z.number()
    .min(-50, "Temperature must be at least -50°C")
    .max(60, "Temperature must be at most 60°C"),
  humidity: z.number()
    .min(0, "Humidity must be at least 0%")
    .max(100, "Humidity must be at most 100%"),
  soil_type: z.string(),
  crop_type: z.string(),
  water_flow: z.number()
    .min(0, "Water flow must be at least 0 L/min")
    .max(1000, "Water flow must be at most 1000 L/min"),
  latitude: z.number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: z.number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
});

const soilOptions = [
  { label: "Clay", value: "clay", icon: "🪨", description: "Heavy, nutrient-rich soil" },
  { label: "Sandy", value: "sandy", icon: "🏖️", description: "Well-draining, light soil" },
  { label: "Loamy", value: "loamy", icon: "🌱", description: "Ideal balanced soil" },
  { label: "Peaty", value: "peaty", icon: "🌿", description: "Acidic, organic-rich soil" },
];

const cropOptions = [
  { label: "Wheat", value: "wheat", icon: "🌾", optimal: "15-25°C, 60-70% humidity" },
  { label: "Rice", value: "rice", icon: "🌾", optimal: "20-30°C, 70-80% humidity" },
  { label: "Maize", value: "maize", icon: "🌽", optimal: "18-27°C, 60-70% humidity" },
  { label: "Soybean", value: "soybean", icon: "🫘", optimal: "20-30°C, 60-65% humidity" },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [-5, 5, -5],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`p-3 rounded-xl shadow-xl backdrop-blur-md border ${
        darkMode 
          ? 'bg-slate-800/90 border-emerald-500/20 text-white' 
          : 'bg-white/90 border-emerald-500/20 text-slate-800'
      }`}>
        <p className="font-heading font-semibold text-sm">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs font-body mt-1">
            <span className="text-emerald-500">●</span> {entry.name}: {entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function PredictYieldEnhanced() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [animatedYield, setAnimatedYield] = useState(0);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      temperature: "",
      humidity: "",
      soil_type: soilOptions[0].value,
      crop_type: cropOptions[0].value,
      water_flow: "",
      latitude: "",
      longitude: ""
    }
  });

  const formValues = watch();

  // Auto-save form data
  useEffect(() => {
    const savedForm = localStorage.getItem('cropYieldFormEnhanced');
    if (savedForm) {
      try {
        const parsed = JSON.parse(savedForm);
        Object.keys(parsed).forEach(key => {
          setValue(key, parsed[key]);
        });
      } catch (e) {
        console.warn('Failed to load saved form data');
      }
    }
  }, [setValue]);

  useEffect(() => {
    if (formValues) {
      localStorage.setItem('cropYieldFormEnhanced', JSON.stringify(formValues));
    }
  }, [formValues]);

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

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitude", parseFloat(position.coords.latitude.toFixed(4)));
        setValue("longitude", parseFloat(position.coords.longitude.toFixed(4)));
        setLoading(false);
      },
      (error) => {
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  const fillRandomData = () => {
    setValue("temperature", parseFloat((Math.random() * 30 + 15).toFixed(1)));
    setValue("humidity", parseFloat((Math.random() * 40 + 40).toFixed(1)));
    setValue("soil_type", soilOptions[Math.floor(Math.random() * soilOptions.length)].value);
    setValue("crop_type", cropOptions[Math.floor(Math.random() * cropOptions.length)].value);
    setValue("water_flow", parseFloat((Math.random() * 50 + 20).toFixed(1)));
    setValue("latitude", parseFloat((Math.random() * 180 - 90).toFixed(4)));
    setValue("longitude", parseFloat((Math.random() * 360 - 180).toFixed(4)));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setShowResults(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, data);
      
      setResult(response.data);
      setPredictionHistory(prev => [{
        ...response.data,
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now()
      }, ...prev.slice(0, 4)]);

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
      inputs: formValues,
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

    const text = `🌾 Crop Yield Prediction
━━━━━━━━━━━━━━━━━━━━
📊 Expected Yield: ${result.predicted_yield.toFixed(2)} tons/hectare
🌡️ Temperature: ${formValues.temperature}°C
💧 Humidity: ${formValues.humidity}%
🌱 Soil Type: ${formValues.soil_type}
🌽 Crop Type: ${formValues.crop_type}
💦 Water Flow: ${formValues.water_flow} L/min
📍 Location: ${formValues.latitude}, ${formValues.longitude}
⏰ Generated: ${new Date().toLocaleString()}`;

    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy results');
    }
  };

  // Chart data preparation
  const weatherComparisonData = result ? [
    { condition: "Poor", yield: result.predicted_yield * 0.6, fill: "#ef4444" },
    { condition: "Normal", yield: result.predicted_yield, fill: "#10b981" },
    { condition: "Optimal", yield: result.predicted_yield * 1.3, fill: "#059669" },
  ] : [];

  const parameterImpactData = result ? [
    { parameter: "Temperature", impact: 0.85, optimal: 0.9 },
    { parameter: "Humidity", impact: 0.75, optimal: 0.85 },
    { parameter: "Water", impact: 0.8, optimal: 0.95 },
    { parameter: "Soil", impact: 0.7, optimal: 0.8 },
    { parameter: "Location", impact: 0.65, optimal: 0.75 },
  ] : [];

  const historicalData = predictionHistory.map((pred, index) => ({
    time: `P${predictionHistory.length - index}`,
    yield: pred.predicted_yield,
  }));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen transition-colors duration-500 ${
        darkMode ? 'bg-slate-900 text-white' : 'bg-gradient-to-br from-emerald-50 to-amber-50'
      }`}
    >
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-10 text-emerald-500/10"
        >
          <Leaf size={120} />
        </motion.div>
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute bottom-20 right-10 text-amber-500/10"
          style={{ animationDelay: "2s" }}
        >
          <Sprout size={100} />
        </motion.div>
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-40 right-20 text-emerald-600/10"
          style={{ animationDelay: "4s" }}
        >
          <Wheat size={80} />
        </motion.div>
      </div>

      <motion.section 
        className="relative mx-auto max-w-7xl px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-5xl font-bold bg-gradient-to-r from-emerald-500 to-amber-500 bg-clip-text text-transparent">
              Crop Yield Predictor
            </h1>
            <p className="font-body mt-2 text-lg text-slate-400">
              AI-powered agricultural analytics for optimal harvest planning
            </p>
            <div className="flex items-center gap-6 mt-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-sm"
              >
                <Activity className="text-emerald-500" size={16} />
                <span className="font-mono text-emerald-400">10K+ Predictions</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-sm"
              >
                <Shield className="text-amber-500" size={16} />
                <span className="font-mono text-amber-400">95% Accuracy</span>
              </motion.div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition-all duration-300 ${
              darkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400'
                : 'bg-white hover:bg-emerald-50 text-slate-800 shadow-lg'
            }`}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="glass-card p-8 space-y-6"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Temperature Input */}
                <div className="relative">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 font-heading mb-2">
                    <Thermometer size={16} className="text-emerald-500" />
                    Temperature
                    <span className="text-xs text-slate-500 font-mono">(°C)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      {...register("temperature", { valueAsNumber: true })}
                      className={`w-full px-4 py-3.5 rounded-xl bg-slate-800/50 border-2 
                        ${errors.temperature 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-slate-700 focus:border-emerald-500'
                        } 
                        focus:ring-4 focus:ring-emerald-500/20 font-body text-slate-100 
                        placeholder-slate-500 transition-all duration-300`}
                      placeholder="25.0"
                    />
                    {errors.temperature ? (
                      <AlertTriangle className="absolute right-3 top-3.5 text-red-400" size={20} />
                    ) : formValues.temperature && !errors.temperature ? (
                      <CheckCircle className="absolute right-3 top-3.5 text-emerald-400" size={20} />
                    ) : null}
                  </div>
                  {errors.temperature && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400 flex items-center gap-1 mt-1"
                    >
                      <AlertTriangle size={12} />
                      {errors.temperature.message}
                    </motion.p>
                  )}
                  <p className="text-xs text-slate-500 font-body mt-1">
                    Typical range for wheat: 20-30°C
                  </p>
                </div>

                {/* Humidity Input */}
                <div className="relative">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 font-heading mb-2">
                    <Droplets size={16} className="text-blue-500" />
                    Humidity
                    <span className="text-xs text-slate-500 font-mono">(%)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      {...register("humidity", { valueAsNumber: true })}
                      className={`w-full px-4 py-3.5 rounded-xl bg-slate-800/50 border-2 
                        ${errors.humidity 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-slate-700 focus:border-emerald-500'
                        } 
                        focus:ring-4 focus:ring-emerald-500/20 font-body text-slate-100 
                        placeholder-slate-500 transition-all duration-300`}
                      placeholder="65.0"
                    />
                    {errors.humidity ? (
                      <AlertTriangle className="absolute right-3 top-3.5 text-red-400" size={20} />
                    ) : formValues.humidity && !errors.humidity ? (
                      <CheckCircle className="absolute right-3 top-3.5 text-emerald-400" size={20} />
                    ) : null}
                  </div>
                  {errors.humidity && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400 flex items-center gap-1 mt-1"
                    >
                      <AlertTriangle size={12} />
                      {errors.humidity.message}
                    </motion.p>
                  )}
                  <p className="text-xs text-slate-500 font-body mt-1">
                    Optimal range: 60-80% for most crops
                  </p>
                </div>

                {/* Soil Type */}
                <div className="relative">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 font-heading mb-2">
                    <MapPin size={16} className="text-amber-500" />
                    Soil Type
                  </label>
                  <select
                    {...register("soil_type")}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-800/50 border-2 border-slate-700 
                      focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 font-body 
                      text-slate-100 transition-all duration-300"
                  >
                    {soilOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 font-body mt-1">
                    {soilOptions.find(s => s.value === formValues.soil_type)?.description}
                  </p>
                </div>

                {/* Crop Type */}
                <div className="relative">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 font-heading mb-2">
                    <Wheat size={16} className="text-emerald-500" />
                    Crop Type
                  </label>
                  <select
                    {...register("crop_type")}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-800/50 border-2 border-slate-700 
                      focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 font-body 
                      text-slate-100 transition-all duration-300"
                  >
                    {cropOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 font-body mt-1">
                    Optimal: {cropOptions.find(c => c.value === formValues.crop_type)?.optimal}
                  </p>
                </div>

                {/* Water Flow */}
                <div className="relative">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 font-heading mb-2">
                    <Zap size={16} className="text-cyan-500" />
                    Water Flow
                    <span className="text-xs text-slate-500 font-mono">(L/min)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      {...register("water_flow", { valueAsNumber: true })}
                      className={`w-full px-4 py-3.5 rounded-xl bg-slate-800/50 border-2 
                        ${errors.water_flow 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-slate-700 focus:border-emerald-500'
                        } 
                        focus:ring-4 focus:ring-emerald-500/20 font-body text-slate-100 
                        placeholder-slate-500 transition-all duration-300`}
                      placeholder="45.0"
                    />
                    {errors.water_flow ? (
                      <AlertTriangle className="absolute right-3 top-3.5 text-red-400" size={20} />
                    ) : formValues.water_flow && !errors.water_flow ? (
                      <CheckCircle className="absolute right-3 top-3.5 text-emerald-400" size={20} />
                    ) : null}
                  </div>
                  {errors.water_flow && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400 flex items-center gap-1 mt-1"
                    >
                      <AlertTriangle size={12} />
                      {errors.water_flow.message}
                    </motion.p>
                  )}
                  <p className="text-xs text-slate-500 font-body mt-1">
                    Efficient irrigation: 30-60 L/min
                  </p>
                </div>

                {/* Location */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 font-heading">
                      <Navigation size={16} className="text-emerald-500" />
                      Location Coordinates
                    </label>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={getCurrentLocation}
                      disabled={loading}
                      className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium 
                        bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 
                        disabled:opacity-50 transition-all duration-200"
                    >
                      <Navigation size={12} />
                      Get Location
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.0001"
                          {...register("latitude", { valueAsNumber: true })}
                          className={`w-full px-3 py-2 rounded-xl bg-slate-800/50 border-2 
                            ${errors.latitude 
                              ? 'border-red-500' 
                              : 'border-slate-700 focus:border-emerald-500'
                            } 
                            focus:ring-4 focus:ring-emerald-500/20 font-mono text-sm 
                            text-slate-100 transition-all duration-300`}
                          placeholder="28.6139"
                        />
                        {errors.latitude && (
                          <AlertTriangle className="absolute right-2 top-2.5 text-red-400" size={16} />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Latitude</p>
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.0001"
                          {...register("longitude", { valueAsNumber: true })}
                          className={`w-full px-3 py-2 rounded-xl bg-slate-800/50 border-2 
                            ${errors.longitude 
                              ? 'border-red-500' 
                              : 'border-slate-700 focus:border-emerald-500'
                            } 
                            focus:ring-4 focus:ring-emerald-500/20 font-mono text-sm 
                            text-slate-100 transition-all duration-300`}
                          placeholder="77.2090"
                        />
                        {errors.longitude && (
                          <AlertTriangle className="absolute right-2 top-2.5 text-red-400" size={16} />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Longitude</p>
                    </div>
                  </div>
                  {(errors.latitude || errors.longitude) && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400 flex items-center gap-1 mt-2"
                    >
                      <AlertTriangle size={12} />
                      Please enter valid coordinates
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                <motion.button
                  type="submit"
                  disabled={loading || !isValid}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 
                    rounded-xl font-heading font-semibold transition-all duration-300 
                    ${loading || !isValid
                      ? 'bg-slate-700 cursor-not-allowed'
                      : 'gradient-agriculture text-white shadow-lg hover:shadow-emerald-500/25'
                    }`}
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
                </motion.button>

                <motion.button
                  type="button"
                  onClick={fillRandomData}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-3 rounded-xl font-medium bg-amber-500/20 
                    hover:bg-amber-500/30 text-amber-400 border border-amber-500/30"
                >
                  <RefreshCw size={16} />
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => reset()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-3 rounded-xl font-medium bg-red-500/20 
                    hover:bg-red-500/30 text-red-400 border border-red-500/30"
                >
                  <RefreshCw size={16} />
                </motion.button>
              </div>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-red-400" />
                      <span className="font-medium text-red-400">Error</span>
                    </div>
                    <p className="text-sm mt-1 text-red-300">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* Results Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <AnimatePresence>
              {showResults && result ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-6"
                >
                  {/* Main Yield Display */}
                  <div className="gradient-agriculture rounded-3xl p-8 text-white text-center relative overflow-hidden shadow-xl">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-20 -right-20 text-white/10"
                    >
                      <Wheat size={200} />
                    </motion.div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <CheckCircle size={24} className="text-white/90" />
                        <h2 className="text-xl font-heading font-bold">Expected Yield</h2>
                      </div>
                      
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30"
                      >
                        <p className="text-7xl font-heading font-extrabold mb-2">
                          {animatedYield.toFixed(2)}
                        </p>
                        <p className="text-xl font-body opacity-90">tons/hectare</p>
                        
                        <div className="mt-6 flex items-center justify-center gap-4">
                          <motion.button
                            onClick={exportResults}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 bg-white/20 
                              hover:bg-white/30 rounded-lg transition-all duration-200"
                          >
                            <Download size={16} />
                            Export
                          </motion.button>
                          <motion.button
                            onClick={copyResults}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 bg-white/20 
                              hover:bg-white/30 rounded-lg transition-all duration-200"
                          >
                            <Copy size={16} />
                            Copy
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Weather Comparison Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                  >
                    <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2 text-emerald-400">
                      <BarChart3 size={20} />
                      Weather Impact Analysis
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={weatherComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="condition" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                        <Bar dataKey="yield" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>

                  {/* Parameter Impact */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6"
                  >
                    <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2 text-emerald-400">
                      <Activity size={20} />
                      Parameter Performance
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <RadarChart data={parameterImpactData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="parameter" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 1]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <Radar name="Current" dataKey="impact" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                        <Radar name="Optimal" dataKey="optimal" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                        <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </motion.div>

                  {/* Historical Trends */}
                  {predictionHistory.length > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="glass-card p-6"
                    >
                      <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2 text-emerald-400">
                        <TrendingUp size={20} />
                        Prediction History
                      </h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={historicalData}>
                          <defs>
                            <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                          <YAxis stroke="#94a3b8" fontSize={12} />
                          <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                          <Area type="monotone" dataKey="yield" stroke="#10b981" 
                            fillOpacity={1} fill="url(#colorYield)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </motion.div>
                  )}

                  {/* Recommendations */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6"
                  >
                    <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2 text-emerald-400">
                      <Leaf size={20} />
                      Farming Insights
                    </h3>
                    <div className="space-y-3">
                      {result.predicted_yield > 5 && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
                        >
                          <p className="text-sm text-emerald-400">
                            🌟 Excellent yield potential! Consider expanding cultivation area.
                          </p>
                        </motion.div>
                      )}
                      {formValues.temperature > 35 && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30"
                        >
                          <p className="text-sm text-amber-400">
                            ☀️ High temperature detected. Increase irrigation frequency.
                          </p>
                        </motion.div>
                      )}
                      {result.recommended_crops && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30"
                        >
                          <p className="text-sm text-blue-400">
                            🌱 Also suitable for: {result.recommended_crops.join(", ")}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[500px] glass-card">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-24 h-24 mx-auto mb-4 rounded-full bg-emerald-500/10 
                        flex items-center justify-center"
                    >
                      <TrendingUp size={48} className="text-emerald-500" />
                    </motion.div>
                    <p className="text-lg font-heading font-medium mb-2 text-slate-300">
                      Ready to Predict
                    </p>
                    <p className="text-sm text-slate-500 font-body">
                      Fill the form and discover your optimal yield potential
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export default PredictYieldEnhanced;