import { TrendingUp, Users, Award, Zap } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: TrendingUp,
      value: "98%",
      label: "Prediction Accuracy",
      description: "Industry-leading precision in yield forecasting"
    },
    {
      icon: Users,
      value: "50K+",
      label: "Active Farmers",
      description: "Trusted by farmers worldwide"
    },
    {
      icon: Award,
      value: "24/7",
      label: "AI Monitoring",
      description: "Continuous crop health surveillance"
    },
    {
      icon: Zap,
      value: "5x",
      label: "Faster Decisions",
      description: "Accelerate your farming operations"
    }
  ];

  return (
    <section className="py-24 bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Proven Results That Matter
          </h2>
          <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of farmers who have transformed their operations with our AI-powered platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-secondary to-secondary-light rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <stat.icon size={32} className="text-white" />
              </div>
              <div className="font-display text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="font-heading text-lg font-semibold text-gray-900 mb-3">
                {stat.label}
              </div>
              <div className="font-body text-gray-600">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-8 px-8 py-4 bg-gray-50 rounded-2xl">
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-gray-900">$2.5M+</div>
              <div className="font-body text-sm text-gray-600">Cost Savings</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-gray-900">15%</div>
              <div className="font-body text-sm text-gray-600">Yield Increase</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-gray-900">99.9%</div>
              <div className="font-body text-sm text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;