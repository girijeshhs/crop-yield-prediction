import { useState } from 'react';
import axios from 'axios';
import { 
  Thermometer, 
  Droplets, 
  MapPin, 
  Wheat, 
  Navigation,
  TrendingUp,
  Download,
  Copy,
  AlertCircle,
  CheckCircle
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

function PredictYieldClean() {
  const [formData, setFormData] = useState({
    temperature: '',
    humidity: '',
    soil_type: 'loamy',
    crop_type: 'wheat',
    water_flow: '',
    latitude: '',
    longitude: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
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
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to predict yield');
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude.toFixed(4),
          longitude: position.coords.longitude.toFixed(4)
        });
      });
    }
  };

  const downloadReport = () => {
    const report = {
      inputs: formData,
      result: result,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yield-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyResults = () => {
    const text = `Predicted Yield: ${result.predicted_yield.toFixed(2)} tons/hectare`;
    navigator.clipboard.writeText(text);
  };

  const chartData = result ? [
    { name: 'Poor', yield: result.predicted_yield * 0.6 },
    { name: 'Normal', yield: result.predicted_yield },
    { name: 'Optimal', yield: result.predicted_yield * 1.3 }
  ] : [];

  // Crop recommendation details
  const cropDetails = {
    Wheat: {
      description: "Ideal for moderate climates with consistent moisture. Requires well-drained loamy soil and temperatures between 15-25°C. Best suited for regions with 50-75cm annual rainfall.",
      icon: "🌾"
    },
    Maize: {
      description: "Thrives in warm conditions with good sunlight. Needs fertile, well-drained soil and temperatures of 18-27°C. Requires adequate water during tasseling and grain filling stages.",
      icon: "🌽"
    },
    Soybean: {
      description: "Adaptable legume that enriches soil nitrogen. Grows best in warm climates with 20-30°C temperature. Prefers well-drained loamy soils with neutral pH levels.",
      icon: "🫘"
    },
    Rice: {
      description: "Water-intensive crop requiring flooded conditions. Optimal in humid climates with 20-35°C temperatures. Needs clayey or loamy soil with good water retention capacity.",
      icon: "🌾"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Crop Yield Prediction</h1>
          <p className="mt-2 text-gray-600">Enter your agricultural parameters to predict crop yield</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form and Chart */}
          <div className="space-y-6">
            {/* Form Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Temperature */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Thermometer className="h-4 w-4 mr-2 text-gray-400" />
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    required
                    step="0.1"
                    className="input-field"
                    placeholder="25.0"
                  />
                </div>

                {/* Humidity */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Droplets className="h-4 w-4 mr-2 text-gray-400" />
                    Humidity (%)
                  </label>
                  <input
                    type="number"
                    name="humidity"
                    value={formData.humidity}
                    onChange={handleChange}
                    required
                    step="0.1"
                    className="input-field"
                    placeholder="65.0"
                  />
                </div>

                {/* Soil Type */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    Soil Type
                  </label>
                  <select
                    name="soil_type"
                    value={formData.soil_type}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {soilTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Crop Type */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Wheat className="h-4 w-4 mr-2 text-gray-400" />
                    Crop Type
                  </label>
                  <select
                    name="crop_type"
                    value={formData.crop_type}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {cropTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Water Flow */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Water Flow (L/min)
                  </label>
                  <input
                    type="number"
                    name="water_flow"
                    value={formData.water_flow}
                    onChange={handleChange}
                    required
                    step="0.1"
                    className="input-field"
                    placeholder="45.0"
                  />
                </div>

                {/* Location */}
                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Navigation className="h-4 w-4 mr-2 text-gray-400" />
                      Location
                    </label>
                    <button
                      type="button"
                      onClick={getLocation}
                      className="text-sm text-primary-500 hover:text-primary-600"
                    >
                      Use Current Location
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      required
                      step="0.0001"
                      className="input-field"
                      placeholder="Latitude"
                    />
                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      required
                      step="0.0001"
                      className="input-field"
                      placeholder="Longitude"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 flex items-center justify-center"
                >
                  {loading ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Predict Yield
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Yield Comparison Chart - Below Form */}
            {result && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Yield Comparison</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="yield" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Right Column - Results and Recommendations */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* Predicted Yield Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Predicted Yield</h2>
                    <CheckCircle className="h-5 w-5 text-primary-500" />
                  </div>
                  
                  <div className="text-center py-8">
                    <div className="text-5xl font-bold text-primary-500">
                      {result.predicted_yield.toFixed(2)}
                    </div>
                    <div className="text-gray-600 mt-2">tons per hectare</div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={downloadReport}
                      className="flex-1 btn-secondary flex items-center justify-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                    <button
                      onClick={copyResults}
                      className="flex-1 btn-secondary flex items-center justify-center"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </button>
                  </div>
                </div>

                {/* Detailed Crop Recommendations */}
                {result.recommended_crops && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recommended Crops for Your Conditions
                    </h3>
                    <div className="space-y-4">
                      {result.recommended_crops.map((crop, index) => {
                        const details = cropDetails[crop] || {
                          icon: "🌱",
                          description: "A suitable crop for your current agricultural conditions and climate parameters."
                        };
                        return (
                          <div
                            key={index}
                            className="p-4 bg-primary-50 rounded-lg border border-primary-100 hover:border-primary-200 transition-colors"
                          >
                            <div className="flex items-start space-x-3">
                              <span className="text-2xl">{details.icon}</span>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-2">{crop}</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {details.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No predictions yet</h3>
                  <p className="text-gray-600">Fill out the form to see yield predictions</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PredictYieldClean;