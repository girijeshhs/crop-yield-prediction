import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Thermometer, 
  Droplets, 
  MapPin, 
  Wheat, 
  Navigation,
  Download,
  Copy,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function PredictYieldCompact() {
  const [formData, setFormData] = useState({
    temperature: '25',
    humidity: '65',
    soil_type: 'loamy',
    crop_type: 'wheat',
    water_flow: '45',
    latitude: '28.6139',
    longitude: '77.2090'
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isAutoPredict, setIsAutoPredict] = useState(false);

  const soilTypes = [
    { value: 'clay', label: 'Clay' },
    { value: 'sandy', label: 'Sandy' },
    { value: 'loamy', label: 'Loamy' },
    { value: 'peaty', label: 'Peaty' }
  ];

  const cropTypes = [
    { value: 'wheat', label: 'Wheat' },
    { value: 'rice', label: 'Rice' },
    { value: 'maize', label: 'Maize' },
    { value: 'soybean', label: 'Soybean' }
  ];

  const cropDetails = {
    Wheat: {
      description: "Ideal for moderate climates (15-25°C) with loamy soil and 50-75cm rainfall",
      icon: "🌾"
    },
    Maize: {
      description: "Thrives in warm conditions (18-27°C) with fertile, well-drained soil",
      icon: "🌽"
    },
    Soybean: {
      description: "Adaptable legume (20-30°C) that enriches soil nitrogen",
      icon: "🫘"
    },
    Rice: {
      description: "Water-intensive crop (20-35°C) requiring flooded conditions",
      icon: "🌾"
    }
  };

  // Auto-predict when form data changes
  useEffect(() => {
    if (isAutoPredict && isFormValid()) {
      const timer = setTimeout(() => {
        handlePredict();
      }, 800); // Debounce for 800ms
      return () => clearTimeout(timer);
    }
  }, [formData, isAutoPredict]);

  const isFormValid = () => {
    return Object.values(formData).every(val => val !== '' && val !== null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePredict = async () => {
    if (!isFormValid()) return;
    
    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, {
        ...formData,
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        water_flow: parseFloat(formData.water_flow),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      });
      
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed');
      setResult(null);
    }
  };

  const getLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lon = position.coords.longitude.toFixed(4);
        
        setFormData(prev => ({ ...prev, latitude: lat, longitude: lon }));

        try {
          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m&temperature_unit=celsius`
          );
          
          if (weatherResponse.ok) {
            const weatherData = await weatherResponse.json();
            setFormData(prev => ({
              ...prev,
              temperature: weatherData.current.temperature_2m.toFixed(1),
              humidity: weatherData.current.relative_humidity_2m.toFixed(1),
              latitude: lat,
              longitude: lon
            }));
          }
        } catch (err) {
          console.error('Weather fetch failed');
        }
      }
    );
  };

  const downloadReport = () => {
    if (!result) return;
    const report = { inputs: formData, result, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yield-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyResults = () => {
    if (!result) return;
    const text = `Predicted Yield: ${result.predicted_yield.toFixed(2)} tons/hectare`;
    navigator.clipboard.writeText(text);
  };

  const chartData = result ? [
    { name: 'Poor', yield: result.predicted_yield * 0.6 },
    { name: 'Normal', yield: result.predicted_yield },
    { name: 'Optimal', yield: result.predicted_yield * 1.3 }
  ] : [];

  // Initial prediction on mount
  useEffect(() => {
    if (isFormValid()) {
      handlePredict();
      setIsAutoPredict(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Compact Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Crop Yield Prediction</h1>
          <p className="text-sm text-gray-600 mt-1">Real-time predictions as you adjust parameters</p>
        </div>

        {/* 60/40 Layout */}
        <div className="grid grid-cols-5 gap-6">
          {/* Left Column - Input Parameters (60%) */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              {/* Auto-predict toggle */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Input Parameters</span>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAutoPredict}
                    onChange={(e) => setIsAutoPredict(e.target.checked)}
                    className="rounded text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-xs text-gray-600">Auto-predict</span>
                </label>
              </div>

              {/* Compact Two-Column Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {/* Temperature */}
                <div>
                  <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                    <Thermometer className="h-3 w-3 mr-1 text-gray-400" />
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                {/* Humidity */}
                <div>
                  <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                    <Droplets className="h-3 w-3 mr-1 text-gray-400" />
                    Humidity (%)
                  </label>
                  <input
                    type="number"
                    name="humidity"
                    value={formData.humidity}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                {/* Soil Type */}
                <div>
                  <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                    <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                    Soil Type
                  </label>
                  <select
                    name="soil_type"
                    value={formData.soil_type}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    {soilTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Crop Type */}
                <div>
                  <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
                    <Wheat className="h-3 w-3 mr-1 text-gray-400" />
                    Crop Type
                  </label>
                  <select
                    name="crop_type"
                    value={formData.crop_type}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    {cropTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Water Flow */}
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Water Flow (L/min)
                  </label>
                  <input
                    type="number"
                    name="water_flow"
                    value={formData.water_flow}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                {/* Location - Side by Side */}
                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="flex items-center text-xs font-medium text-gray-700">
                      <Navigation className="h-3 w-3 mr-1 text-gray-400" />
                      Location
                    </label>
                    <button
                      type="button"
                      onClick={getLocation}
                      className="text-xs text-primary-500 hover:text-primary-600"
                    >
                      Auto-detect
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      step="0.0001"
                      placeholder="Latitude"
                      className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      step="0.0001"
                      placeholder="Longitude"
                      className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Manual Predict Button (if auto-predict is off) */}
              {!isAutoPredict && (
                <button
                  onClick={handlePredict}
                  className="w-full mt-4 bg-primary-500 text-white text-sm py-2 rounded hover:bg-primary-600 transition-colors"
                >
                  Predict Yield
                </button>
              )}

              {error && (
                <div className="mt-3 flex items-center text-xs text-red-600 bg-red-50 p-2 rounded">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {error}
                </div>
              )}
            </div>

            {/* Yield Comparison Chart - Below Form */}
            {result && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Yield Comparison</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="yield" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Right Column - Results (40%) */}
          <div className="col-span-2 space-y-4">
            {result ? (
              <>
                {/* Compact Predicted Yield */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-semibold text-gray-900">Predicted Yield</h2>
                    <div className="flex space-x-1">
                      <button
                        onClick={downloadReport}
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        title="Download report"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={copyResults}
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-center py-4">
                    <div className="text-4xl font-bold text-primary-500">
                      {result.predicted_yield.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">tons per hectare</div>
                  </div>
                </div>

                {/* Compact Crop Recommendations */}
                {result.recommended_crops && (
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Recommended Crops
                    </h3>
                    
                    {/* Show top 2 crops with brief descriptions */}
                    <div className="space-y-2">
                      {result.recommended_crops.slice(0, 2).map((crop, index) => {
                        const details = cropDetails[crop] || {
                          icon: "🌱",
                          description: "Suitable for your conditions"
                        };
                        return (
                          <div
                            key={index}
                            className="flex items-start space-x-2 p-2 bg-primary-50 rounded border border-primary-100"
                          >
                            <span className="text-xl">{details.icon}</span>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900">{crop}</h4>
                              <p className="text-xs text-gray-600 leading-tight mt-0.5">
                                {details.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Show remaining crops as compact pills with tooltips */}
                    {result.recommended_crops.length > 2 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-2">Also suitable:</p>
                        <div className="flex flex-wrap gap-2">
                          {result.recommended_crops.slice(2).map((crop, index) => {
                            const details = cropDetails[crop] || { icon: "🌱" };
                            return (
                              <div
                                key={index}
                                className="group relative"
                              >
                                <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700 cursor-help">
                                  <span>{details.icon}</span>
                                  <span>{crop}</span>
                                  <Info className="h-3 w-3 text-gray-400" />
                                </div>
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-48">
                                  <div className="bg-gray-900 text-white text-xs rounded p-2 shadow-lg">
                                    {details.description}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="text-center">
                  <CheckCircle className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Ready to predict</h3>
                  <p className="text-xs text-gray-600">
                    {isAutoPredict ? 'Adjust parameters to see predictions' : 'Click Predict Yield'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PredictYieldCompact;