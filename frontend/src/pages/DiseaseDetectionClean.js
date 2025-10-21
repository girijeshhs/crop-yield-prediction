import { useState } from 'react';
import axios from 'axios';
import { 
  Upload, 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  Download, 
  X,
  Image
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function DiseaseDetectionClean() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const analyzeImage = async () => {
    if (!file) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    // Mock analysis for demo
    setTimeout(() => {
      const mockDiseases = [
        { name: 'Healthy', confidence: 95, severity: 'none' },
        { name: 'Early Blight', confidence: 87, severity: 'medium' },
        { name: 'Late Blight', confidence: 82, severity: 'high' },
        { name: 'Bacterial Spot', confidence: 79, severity: 'medium' }
      ];

      const randomDisease = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
      
      setResult({
        disease: randomDisease.name,
        confidence: randomDisease.confidence,
        severity: randomDisease.severity,
        recommendations: randomDisease.name === 'Healthy' ? [
          'Continue regular monitoring',
          'Maintain current care routine'
        ] : [
          'Remove affected leaves immediately',
          'Apply appropriate fungicide',
          'Improve air circulation',
          'Avoid overhead watering'
        ]
      });
      setLoading(false);
    }, 2000);

    // Real API call (commented out for demo)
    /*
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post(`${API_BASE_URL}/disease`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
    */
  };

  const downloadReport = () => {
    const report = {
      analysis: result,
      timestamp: new Date().toISOString(),
      fileName: file?.name
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `disease-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Plant Disease Detection</h1>
          <p className="mt-2 text-gray-600">Upload a plant leaf image for AI-powered disease diagnosis</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            {!preview ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-primary-500 transition-colors"
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Plant Image
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop or click to select
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 cursor-pointer transition-colors"
                >
                  <Image className="h-4 w-4 mr-2" />
                  Choose Image
                </label>
                <p className="text-xs text-gray-500 mt-4">
                  Supported: JPG, PNG, WebP (Max 10MB)
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="relative">
                  <img
                    src={preview}
                    alt="Selected plant"
                    className="w-full h-96 object-cover"
                  />
                  <button
                    onClick={removeFile}
                    className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600">
                    {file?.name} ({(file?.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <button
              onClick={analyzeImage}
              disabled={!file || loading}
              className="mt-6 w-full btn-primary py-3 flex items-center justify-center"
            >
              {loading ? (
                <span>Analyzing...</span>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  Detect Disease
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div>
            {result ? (
              <div className="space-y-6">
                {/* Diagnosis Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Diagnosis Result</h2>
                    <CheckCircle className="h-5 w-5 text-primary-500" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Disease Identified</p>
                      <p className="text-2xl font-bold text-gray-900">{result.disease}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Confidence Level</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {result.confidence}%
                        </span>
                      </div>
                    </div>

                    {result.severity !== 'none' && (
                      <div>
                        <p className="text-sm text-gray-600">Severity</p>
                        <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium ${
                          result.severity === 'high' 
                            ? 'bg-red-100 text-red-700'
                            : result.severity === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {result.severity.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={downloadReport}
                    className="mt-6 w-full btn-secondary flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </button>
                </div>

                {/* Recommendations */}
                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Treatment Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No analysis yet</h3>
                  <p className="text-gray-600">Upload an image to get disease diagnosis</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiseaseDetectionClean;