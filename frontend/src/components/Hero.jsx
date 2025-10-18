import { useState, useEffect } from "react";
import { ArrowRight, Sprout, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden scroll-snap-align-start">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)] animate-pulse"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-500/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Content */}
      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Glass-morphism Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8 animate-pulse-slow">
          <Sparkles size={16} className="animate-spin-slow" />
          AI-Powered Agricultural Solutions
        </div>

        {/* Hero Title */}
        <h1 className="font-['Inter'] font-extrabold tracking-tight leading-tight mb-6">
          <span className="block text-white text-5xl sm:text-6xl md:text-7xl mb-2">
            Revolutionize Your
          </span>
          <span className="block text-6xl sm:text-7xl md:text-8xl bg-gradient-to-r from-amber-500 via-emerald-500 to-green-600 bg-clip-text text-transparent">
            Crop Production
          </span>
        </h1>

        {/* Subheadline */}
        <p className="font-['Inter'] text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-12">
          Harness the power of AI and data analytics to optimize your farming operations,
          predict yields with precision, and detect diseases before they spread.
        </p>

        {/* Modern Button Group */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          {/* Primary Button - Gradient with Shimmer */}
          <Link
            to="/predict"
            className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900 overflow-hidden"
            aria-label="Predict Yield"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
            <span className="relative flex items-center gap-2">
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              Predict Yield
            </span>
          </Link>

          {/* Secondary Button - Glass-morphism */}
          <Link
            to="/disease"
            className="group px-8 py-4 rounded-xl backdrop-blur-sm bg-white/5 border-2 border-emerald-500/50 text-emerald-400 font-semibold hover:bg-emerald-500/10 hover:border-emerald-400 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label="Disease Detection"
          >
            <span className="flex items-center gap-2">
              <Sprout size={20} className="group-hover:rotate-12 transition-transform" />
              Disease Detection
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;