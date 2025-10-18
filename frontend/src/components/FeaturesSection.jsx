import { useState, useEffect, useRef } from "react";
import { Brain, Leaf, BarChart3, Shield, Zap, Cloud } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Predictions",
    description: "Advanced machine learning models analyze weather patterns, soil conditions, and historical data to provide accurate yield forecasts.",
    color: "emerald"
  },
  {
    icon: Leaf,
    title: "Disease Detection",
    description: "Computer vision technology identifies plant diseases early, allowing for timely intervention and crop protection.",
    color: "green"
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Comprehensive dashboards with actionable insights to optimize your farming decisions and maximize productivity.",
    color: "amber"
  }
];

const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden scroll-snap-align-start bg-slate-900"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-24">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="font-['Inter'] text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Cutting-Edge Features
          </h2>
          <p className="font-['Inter'] text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            Everything you need to transform your agricultural operations
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group relative transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Glass-morphism Card */}
                <div className="relative h-full p-8 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-emerald-500/20">
                  {/* Gradient Glow on Hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 to-green-500/0 group-hover:from-emerald-500/10 group-hover:to-green-500/10 transition-all duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Icon size={32} className="text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                    </div>

                    {/* Title */}
                    <h3 className="font-['Inter'] text-2xl font-semibold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="font-['Inter'] text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
