import { useCallback, useState } from "react";
import axios from "axios";
import {
  Upload,
  Shield,
  AlertTriangle,
  CheckCircle,
  Download,
  Share,
  Image as ImageIcon,
  Leaf,
  Bug,
  Droplets,
  Sun,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function DiseaseDetection() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [expandedTreatment, setExpandedTreatment] = useState(null);

  const sampleImages = [
    { name: "Healthy Tomato Leaf", url: "/api/placeholder/200/200", disease: "healthy" },
    { name: "Bacterial Spot", url: "/api/placeholder/200/200", disease: "bacterial_spot" },
    { name: "Early Blight", url: "/api/placeholder/200/200", disease: "early_blight" },
    { name: "Late Blight", url: "/api/placeholder/200/200", disease: "late_blight" },
  ];

  const handleFile = useCallback((selectedFile) => {
    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }, []);

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post(`${API_BASE_URL}/disease`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data);
    } catch (apiError) {
      const message = apiError?.response?.data?.error || apiError.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!result) return;

    const report = {
      image: file?.name,
      diagnosis: result,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `disease-diagnosis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareReport = async () => {
    if (!result) return;

    const text = `Disease Detection Report:
Disease: ${result.disease}
Confidence: ${result.confidence}%
Timestamp: ${new Date().toLocaleString()}`;

    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy report');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-[#0F1F17]' : 'bg-cloud'}`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="leaves-disease" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M20,50 Q30,30 50,40 Q70,30 80,50 Q70,70 50,60 Q30,70 20,50" fill="#1B4332" opacity="0.3"/>
              <circle cx="30" cy="30" r="3" fill="#2D6A4F"/>
              <circle cx="70" cy="70" r="2" fill="#2D6A4F"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#leaves-disease)"/>
        </svg>
      </div>

      <section className="relative mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-charcoal'} animate-fade-in`}>
              🛡️ Disease Detection
            </h1>
            <p className={`mt-2 text-lg ${darkMode ? 'text-mint' : 'text-slate'}`}>
              Advanced plant disease identification using AI vision
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition-all duration-300 ${
              darkMode
                ? 'bg-primary-light hover:bg-primary text-yellow-400'
                : 'bg-white hover:bg-primary/10 text-charcoal shadow-soft'
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={24} /> : <Shield size={24} />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div
              className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
                darkMode
                  ? 'border-primary-light/50 bg-[#1B4332]/50 hover:border-primary-lighter hover:bg-[#1B4332]/70'
                  : 'border-slate/30 bg-white/50 hover:border-primary hover:bg-primary/5'
              } backdrop-blur-sm`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="p-8 text-center">
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full transition-all duration-300 ${
                  darkMode ? 'bg-[#1B4332]' : 'bg-primary/10'
                } flex items-center justify-center group-hover:scale-110`}>
                  <Upload size={48} className={darkMode ? 'text-mint' : 'text-primary'} />
                </div>

                <p className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-charcoal'}`}>
                  Upload Plant Image
                </p>
                <p className={`text-sm mb-6 ${darkMode ? 'text-mint/80' : 'text-slate'}`}>
                  Drag & drop or click to select a clear image of the plant leaf
                </p>

                <label className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
                  darkMode
                    ? 'bg-primary-lighter hover:bg-primary text-white'
                    : 'bg-primary hover:bg-primary-light text-white'
                }`}>
                  <ImageIcon size={20} />
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleFile(event.target.files?.[0])}
                  />
                </label>

                <div className="mt-4 text-xs text-slate/60">
                  Supported formats: JPG, PNG, WebP • Max size: 10MB
                </div>
              </div>

              {/* Animated border effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-primary-lighter opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>

            {/* Image Preview */}
            {preview && (
              <div className={`rounded-2xl overflow-hidden ${
                darkMode ? 'bg-[#1B4332]/80' : 'bg-white'
              } backdrop-blur-sm shadow-soft`}>
                <div className="relative">
                  <img
                    src={preview}
                    alt="Selected leaf"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => handleFile(null)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      aria-label="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 p-4 ${
                    darkMode ? 'bg-[#1B4332]/90' : 'bg-white/90'
                  } backdrop-blur-sm`}>
                    <p className={`text-sm font-medium ${darkMode ? 'text-mint' : 'text-charcoal'}`}>
                      {file?.name}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-mint/60' : 'text-slate'}`}>
                      {(file?.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                darkMode
                  ? 'bg-primary-lighter hover:bg-primary text-white shadow-glow disabled:bg-[#1B4332]'
                  : 'bg-gradient-to-r from-primary to-primary-light text-white shadow-soft hover:shadow-glow disabled:bg-slate/60'
              } disabled:cursor-not-allowed transform hover:scale-105`}
              aria-label="Analyze image for diseases"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield size={24} />
                  Detect Disease
                </>
              )}
            </button>

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
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <div className="space-y-6 animate-slide-up">
                {/* Main Diagnosis Card */}
                <div className={`rounded-3xl backdrop-blur-md ${
                  darkMode
                    ? 'bg-gradient-to-br from-primary/20 to-primary-light/20 border border-primary/30'
                    : 'bg-gradient-to-br from-primary to-primary-light border border-white/20'
                } p-8 shadow-glow text-white text-center relative overflow-hidden`}>
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
                      <h2 className="text-xl font-semibold opacity-90">Diagnosis Complete</h2>
                    </div>

                    <div className={`bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6`}>
                      <h3 className="text-2xl font-bold mb-2">{result.disease}</h3>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        result.severity === 'high' ? 'bg-red-500/20 text-red-300' :
                        result.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        <AlertTriangle size={14} />
                        {result.severity?.toUpperCase() || 'LOW'} RISK
                      </div>
                    </div>

                    {/* Confidence Meter */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Confidence</span>
                        <span>{result.confidence || 85}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-lighter to-primary transition-all duration-1000 ease-out rounded-full"
                          style={{ width: `${result.confidence || 85}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={exportReport}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200"
                        aria-label="Download diagnosis report"
                      >
                        <Download size={16} />
                        Export
                      </button>
                      <button
                        onClick={shareReport}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200"
                        aria-label="Share diagnosis report"
                      >
                        <Share size={16} />
                        Share
                      </button>
                    </div>
                  </div>
                </div>

                {/* Treatment Recommendations */}
                <div className={`rounded-2xl backdrop-blur-md ${
                  darkMode
                    ? 'bg-[#1B4332]/80 border border-primary-light/30'
                    : 'bg-white/80 border border-white/20'
                } p-6 shadow-soft`}>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-charcoal'}`}>
                    <Leaf size={18} />
                    Treatment Recommendations
                  </h3>

                  <div className="space-y-4">
                    {/* Organic Solutions */}
                    <div className={`border rounded-xl overflow-hidden ${
                      darkMode ? 'border-primary-light/30' : 'border-slate/20'
                    }`}>
                      <button
                        onClick={() => setExpandedTreatment(expandedTreatment === 'organic' ? null : 'organic')}
                        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                          darkMode ? 'hover:bg-[#1B4332]/50' : 'hover:bg-slate/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Leaf size={16} className="text-green-500" />
                          <span className={`font-medium ${darkMode ? 'text-mint' : 'text-charcoal'}`}>
                            Organic Solutions
                          </span>
                        </div>
                        {expandedTreatment === 'organic' ?
                          <ChevronUp size={16} /> : <ChevronDown size={16} />
                        }
                      </button>
                      {expandedTreatment === 'organic' && (
                        <div className={`px-4 pb-4 ${darkMode ? 'text-mint/80' : 'text-slate'}`}>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Neem oil spray (5ml per liter of water)</li>
                            <li>Copper-based fungicide application</li>
                            <li>Remove and destroy infected leaves</li>
                            <li>Improve air circulation around plants</li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Chemical Treatments */}
                    <div className={`border rounded-xl overflow-hidden ${
                      darkMode ? 'border-primary-light/30' : 'border-slate/20'
                    }`}>
                      <button
                        onClick={() => setExpandedTreatment(expandedTreatment === 'chemical' ? null : 'chemical')}
                        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                          darkMode ? 'hover:bg-[#1B4332]/50' : 'hover:bg-slate/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Bug size={16} className="text-accent-clay" />
                          <span className={`font-medium ${darkMode ? 'text-mint' : 'text-charcoal'}`}>
                            Chemical Treatments
                          </span>
                        </div>
                        {expandedTreatment === 'chemical' ?
                          <ChevronUp size={16} /> : <ChevronDown size={16} />
                        }
                      </button>
                      {expandedTreatment === 'chemical' && (
                        <div className={`px-4 pb-4 ${darkMode ? 'text-mint/80' : 'text-slate'}`}>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Mancozeb fungicide (2g per liter)</li>
                            <li>Chlorothalonil spray application</li>
                            <li>Systemic fungicide for severe cases</li>
                            <li>Follow safety instructions and wait times</li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Preventive Measures */}
                    <div className={`border rounded-xl overflow-hidden ${
                      darkMode ? 'border-primary-light/30' : 'border-slate/20'
                    }`}>
                      <button
                        onClick={() => setExpandedTreatment(expandedTreatment === 'preventive' ? null : 'preventive')}
                        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                          darkMode ? 'hover:bg-[#1B4332]/50' : 'hover:bg-slate/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Shield size={16} className="text-primary-lighter" />
                          <span className={`font-medium ${darkMode ? 'text-mint' : 'text-charcoal'}`}>
                            Preventive Measures
                          </span>
                        </div>
                        {expandedTreatment === 'preventive' ?
                          <ChevronUp size={16} /> : <ChevronDown size={16} />
                        }
                      </button>
                      {expandedTreatment === 'preventive' && (
                        <div className={`px-4 pb-4 ${darkMode ? 'text-mint/80' : 'text-slate'}`}>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Plant disease-resistant varieties</li>
                            <li>Maintain proper plant spacing</li>
                            <li>Avoid overhead watering</li>
                            <li>Regular field monitoring and scouting</li>
                            <li>Crop rotation practices</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Similar Diseases Gallery */}
                <div className={`rounded-2xl backdrop-blur-md ${
                  darkMode
                    ? 'bg-[#1B4332]/80 border border-primary-light/30'
                    : 'bg-white/80 border border-white/20'
                } p-6 shadow-soft`}>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-charcoal'}`}>
                    Similar Conditions
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {sampleImages.slice(1, 5).map((img, index) => (
                      <div key={index} className={`rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 ${
                        darkMode ? 'bg-[#1B4332]/50' : 'bg-slate/5'
                      }`}>
                        <div className="aspect-square bg-slate/20 flex items-center justify-center">
                          <ImageIcon size={32} className={darkMode ? 'text-mint/60' : 'text-slate/40'} />
                        </div>
                        <div className="p-2">
                          <p className={`text-xs font-medium ${darkMode ? 'text-mint' : 'text-charcoal'}`}>
                            {img.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`flex items-center justify-center h-full min-h-[400px] rounded-2xl border-2 border-dashed ${
                darkMode ? 'border-primary-light/50 bg-[#1B4332]/50' : 'border-slate/20 bg-slate/5'
              } backdrop-blur-sm`}>
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${
                    darkMode ? 'bg-[#1B4332]' : 'bg-white'
                  } flex items-center justify-center`}>
                    <Shield size={32} className={darkMode ? 'text-mint' : 'text-primary'} />
                  </div>
                  <p className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-charcoal'}`}>
                    Analysis results will appear here
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-mint/80' : 'text-slate'}`}>
                    Upload an image and click Detect Disease to get detailed diagnosis
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sample Images Section */}
        {!result && (
          <div className="mt-12">
            <h3 className={`text-xl font-semibold mb-6 text-center ${darkMode ? 'text-white' : 'text-charcoal'}`}>
              Try These Sample Images
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sampleImages.map((img, index) => (
                <div
                  key={index}
                  className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 ${
                    darkMode ? 'bg-[#1B4332]/80' : 'bg-white'
                  } shadow-soft`}
                  onClick={() => {
                    // In a real app, this would load the actual sample image
                    console.log(`Loading sample: ${img.name}`);
                  }}
                >
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center">
                    <Leaf size={32} className={darkMode ? 'text-mint' : 'text-primary'} />
                  </div>
                  <div className="p-3">
                    <p className={`text-sm font-medium text-center ${darkMode ? 'text-mint' : 'text-charcoal'}`}>
                      {img.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default DiseaseDetection;
