import { Link, useLocation } from 'react-router-dom';
import { Leaf, BarChart, Shield } from 'lucide-react';

function NavbarClean() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-semibold text-gray-900">CropPredict</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-primary-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/predict"
              className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/predict')
                  ? 'text-primary-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart className="h-4 w-4" />
              <span>Predict Yield</span>
            </Link>
            <Link
              to="/disease"
              className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/disease')
                  ? 'text-primary-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>Disease Detection</span>
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              to="/predict"
              className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarClean;