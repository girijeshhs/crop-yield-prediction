import { Link } from "react-router-dom";
import { TrendingUp, Leaf, BarChart3, Shield, Users, Award, Zap } from "lucide-react";
import { useState, useEffect } from "react";

function Home() {
  const [stats, setStats] = useState({
    predictions: 0,
    accuracy: 0,
    farmers: 0,
    uptime: 0
  });

  // Animated counter effect
  useEffect(() => {
    const targetStats = {
      predictions: 10000,
      accuracy: 95,
      farmers: 2500,
      uptime: 99
    };

    const duration = 2000;
    const steps = 60;
    const increment = {
      predictions: targetStats.predictions / steps,
      accuracy: targetStats.accuracy / steps,
      farmers: targetStats.farmers / steps,
      uptime: targetStats.uptime / steps
    };

    let current = { ...stats };
    const timer = setInterval(() => {
      current.predictions += increment.predictions;
      current.accuracy += increment.accuracy;
      current.farmers += increment.farmers;
      current.uptime += increment.uptime;

      if (current.predictions >= targetStats.predictions) {
        setStats(targetStats);
        clearInterval(timer);
      } else {
        setStats({ ...current });
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-cloud">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-primary-lighter text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="leaves-hero" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M20,50 Q30,30 50,40 Q70,30 80,50 Q70,70 50,60 Q30,70 20,50" fill="white" opacity="0.3"/>
                <circle cx="30" cy="30" r="3" fill="white"/>
                <circle cx="70" cy="70" r="2" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#leaves-hero)"/>
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl animate-fade-in">
              Smart Farming with
              <span className="block bg-gradient-to-r from-accent-gold to-mint bg-clip-text text-transparent">
                AI-Powered Insights
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-mint">
              Predict crop yields with precision and detect plant diseases early using advanced machine learning.
              Make data-driven decisions for sustainable agriculture.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/predict"
                className="group rounded-full bg-white px-8 py-4 text-lg font-semibold text-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Start Predicting
                </span>
              </Link>
              <Link
                to="/disease"
                className="group rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-primary transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  <Shield size={20} />
                  Detect Diseases
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-4">
                <BarChart3 className="text-primary" size={24} />
              </div>
              <div className="text-3xl font-bold text-charcoal">{Math.floor(stats.predictions).toLocaleString()}+</div>
              <div className="text-sm text-slate">Predictions Made</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-accent-gold/10 rounded-xl mx-auto mb-4">
                <Award className="text-accent-gold" size={24} />
              </div>
              <div className="text-3xl font-bold text-charcoal">{Math.floor(stats.accuracy)}%</div>
              <div className="text-sm text-slate">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-lighter/10 rounded-xl mx-auto mb-4">
                <Users className="text-primary-lighter" size={24} />
              </div>
              <div className="text-3xl font-bold text-charcoal">{Math.floor(stats.farmers).toLocaleString()}+</div>
              <div className="text-sm text-slate">Farmers Served</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-accent-clay/10 rounded-xl mx-auto mb-4">
                <Zap className="text-accent-clay" size={24} />
              </div>
              <div className="text-3xl font-bold text-charcoal">{Math.floor(stats.uptime)}%</div>
              <div className="text-sm text-slate">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-mint/30 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal sm:text-4xl">
              Powerful Features for Modern Farming
            </h2>
            <p className="mt-4 text-lg text-slate">
              Everything you need to optimize your crop production and protect your harvest
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Feature Card 1 */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-soft hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary to-primary-light rounded-full -translate-y-16 translate-x-16 opacity-10 group-hover:scale-110 transition-transform duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-4">Yield Prediction</h3>
                <p className="text-slate leading-relaxed">
                  Leverage advanced CatBoost algorithms to predict crop yields based on environmental factors,
                  soil conditions, and historical data. Make informed decisions about planting and resource allocation.
                </p>
                <div className="mt-6">
                  <Link
                    to="/predict"
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-light transition-colors"
                  >
                    Start Predicting
                    <TrendingUp size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-soft hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-clay to-accent-gold rounded-full -translate-y-16 translate-x-16 opacity-10 group-hover:scale-110 transition-transform duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-clay to-accent-gold rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-4">Disease Detection</h3>
                <p className="text-slate leading-relaxed">
                  Upload plant images to instantly detect diseases using convolutional neural networks.
                  Get early warnings and treatment recommendations to protect your crops from devastating losses.
                </p>
                <div className="mt-6">
                  <Link
                    to="/disease"
                    className="inline-flex items-center gap-2 text-accent-clay font-semibold hover:text-accent-soil transition-colors"
                  >
                    Detect Diseases
                    <Shield size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-slate">Simple steps to smarter farming</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-4">Input Data</h3>
              <p className="text-slate">Enter environmental parameters or upload plant images for analysis</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-light rounded-full mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-4">AI Analysis</h3>
              <p className="text-slate">Our machine learning models process your data for accurate predictions</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-lighter rounded-full mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-4">Get Results</h3>
              <p className="text-slate">Receive actionable insights and recommendations for your farm</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-light text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-lg text-mint mb-8">
            Join thousands of farmers using AI-powered agriculture solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/predict"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-primary hover:bg-mint transition-colors"
            >
              <Leaf size={20} />
              Get Started Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
