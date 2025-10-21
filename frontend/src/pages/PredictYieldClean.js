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

  const getLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lon = position.coords.longitude.toFixed(4);
        
        // Update location immediately
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lon
        }));

        // Fetch weather data using OpenWeatherMap API (free tier)
        try {
          // Using OpenWeatherMap's free API - you can get a free API key at openweathermap.org
          // For demo purposes, using a public endpoint that doesn't require auth
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
            
            setError(null);
          } else {
            // If weather API fails, just keep the location
            setError('Location set, but could not fetch weather data automatically');
          }
        } catch (err) {
          setError('Location set, but could not fetch weather data automatically');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError('Unable to retrieve your location. Please enter manually.');
        setLoading(false);
      }
    );
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

  // Crop recommendation details with ranking explanations
  const cropDetails = {
    Wheat: {
      reason: "Matches your current soil type and temperature range perfectly. Your location's climate conditions align well with wheat's optimal growing requirements."
    },
    Maize: {
      reason: "Well-suited for your temperature and water availability parameters. The soil conditions in your area support strong maize cultivation and growth."
    },
    Soybean: {
      reason: "Good nitrogen-fixing legume for your soil type. Your climate parameters fall within the acceptable range for soybean production."
    },
    Rice: {
      reason: "Compatible with your humidity levels and water flow rate. Your region's conditions can support rice cultivation with proper irrigation management."
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
                      disabled={loading}
                      className="text-sm text-primary-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Fetching...' : 'Use Current Location'}
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
                
                {/* Custom Thin Bar Chart with Labels */}
                <div className="space-y-4">
                  {/* Poor Condition */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 flex items-center">
                      <div className="w-full bg-gray-100 rounded-full h-3 relative">
                        <div 
                          className="bg-red-400 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(chartData[0].yield / (result.predicted_yield * 1.3)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-64 text-sm text-gray-700">
                      <span className="font-medium">Poor Condition Yield:</span>
                      <span className="ml-2 text-red-600 font-semibold">{chartData[0].yield.toFixed(2)} tons/hectare</span>
                    </div>
                  </div>

                  {/* Normal Condition */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 flex items-center">
                      <div className="w-full bg-gray-100 rounded-full h-3 relative">
                        <div 
                          className="bg-primary-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(chartData[1].yield / (result.predicted_yield * 1.3)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-64 text-sm text-gray-700">
                      <span className="font-medium">Normal Condition Yield:</span>
                      <span className="ml-2 text-primary-600 font-semibold">{chartData[1].yield.toFixed(2)} tons/hectare</span>
                    </div>
                  </div>

                  {/* Optimal Condition */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 flex items-center">
                      <div className="w-full bg-gray-100 rounded-full h-3 relative">
                        <div 
                          className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: '100%' }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-64 text-sm text-gray-700">
                      <span className="font-medium">Optimal Condition Yield:</span>
                      <span className="ml-2 text-emerald-600 font-semibold">{chartData[2].yield.toFixed(2)} tons/hectare</span>
                    </div>
                  </div>
                </div>
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

                {/* Ranked Crop Recommendations */}
                {result.recommended_crops && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recommended Crops (Ranked)
                    </h3>
                    <div className="space-y-4">
                      {result.recommended_crops.map((crop, index) => {
                        const details = cropDetails[crop] || {
                          reason: "Suitable crop for your current agricultural conditions and climate parameters."
                        };
                        return (
                          <div
                            key={index}
                            className="pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-sm">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">{crop}</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {details.reason}
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