import { Link } from 'react-router-dom';
import { Leaf, TrendingUp, Shield, BarChart, CheckCircle, ArrowRight } from 'lucide-react';

function HomeClean() {
  const features = [
    {
      icon: <TrendingUp className="h-6 w-6 text-primary-500" />,
      title: "Accurate Predictions",
      description: "Machine learning models with 95% accuracy for crop yield forecasting"
    },
    {
      icon: <Shield className="h-6 w-6 text-primary-500" />,
      title: "Disease Detection",
      description: "AI-powered plant disease identification from leaf images"
    },
    {
      icon: <BarChart className="h-6 w-6 text-primary-500" />,
      title: "Data Analytics",
      description: "Comprehensive insights and visualizations for informed decisions"
    },
    {
      icon: <Leaf className="h-6 w-6 text-primary-500" />,
      title: "Crop Recommendations",
      description: "Personalized suggestions based on soil and climate conditions"
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-6">
                <CheckCircle className="h-4 w-4 mr-2" />
                Trusted by 10,000+ farmers
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Optimize Your Harvest with AI
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Advanced crop yield prediction and disease detection powered by machine learning. 
                Make data-driven decisions for better agricultural outcomes.
              </p>

              <div className="flex space-x-4">
                <Link
                  to="/predict"
                  className="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Start Predicting
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/disease"
                  className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Disease Detection
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-3xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Predictions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">Available</div>
                </div>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">© 2024 CropPredict. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomeClean;