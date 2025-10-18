import { useState, useEffect, useRef } from "react";
import { TrendingUp, Clock, Users, Award } from "lucide-react";

const stats = [
  {
    icon: Award,
    value: 98,
    suffix: "%",
    label: "Prediction Accuracy",
    description: "Industry-leading precision"
  },
  {
    icon: Clock,
    value: 24,
    suffix: "/7",
    label: "Monitoring",
    description: "Round-the-clock support"
  },
  {
    icon: Users,
    value: 50,
    suffix: "K+",
    label: "Farmers Served",
    description: "Growing community"
  },
  {
    icon: TrendingUp,
    value: 35,
    suffix: "%",
    label: "Yield Increase",
    description: "Average improvement"
  }
];

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState(stats.map(() => 0));
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
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

  // Animated Counter Effect
  useEffect(() => {
    if (isVisible) {
      stats.forEach((stat, index) => {
        let start = 0;
        const end = stat.value;
        const duration = 2000;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCounters(prev => {
              const newCounters = [...prev];
              newCounters[index] = end;
              return newCounters;
            });
            clearInterval(timer);
          } else {
            setCounters(prev => {
              const newCounters = [...prev];
              newCounters[index] = Math.floor(start);
              return newCounters;
            });
          }
        }, 16);
      });
    }
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden scroll-snap-align-start bg-gradient-to-br from-slate-900 via-green-900/10 to-slate-900"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent_70%)] animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-24">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="font-['Inter'] text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Proven Results
          </h2>
          <p className="font-['Inter'] text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            Join thousands of farmers who trust CropCare
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`relative group transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Glass-morphism Card */}
                <div className="relative h-full p-8 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/0 to-emerald-500/0 group-hover:from-amber-500/10 group-hover:to-emerald-500/10 transition-all duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-amber-500/20 to-emerald-600/20 border border-amber-500/30">
                      <Icon size={24} className="text-amber-400" />
                    </div>

                    {/* Animated Value */}
                    <div className="mb-2">
                      <span className="font-['Inter'] text-5xl font-extrabold text-white">
                        {counters[index]}
                      </span>
                      <span className="font-['Inter'] text-3xl font-bold bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
                        {stat.suffix}
                      </span>
                    </div>

                    {/* Label */}
                    <h3 className="font-['Inter'] text-lg font-semibold text-slate-200 mb-1">
                      {stat.label}
                    </h3>

                    {/* Description */}
                    <p className="font-['Inter'] text-sm text-slate-400">
                      {stat.description}
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

export default StatsSection;