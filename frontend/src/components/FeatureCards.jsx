import { BarChart3, Shield, Zap, Eye, Cloud, Smartphone } from "lucide-react";

const FeatureCards = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get detailed insights into your crop performance with comprehensive analytics and predictive modeling.",
      gradient: "from-secondary to-secondary-light"
    },
    {
      icon: Shield,
      title: "Disease Detection",
      description: "Early identification of crop diseases using AI-powered image recognition and machine learning algorithms.",
      gradient: "from-accent to-accent-light"
    },
    {
      icon: Zap,
      title: "Real-time Monitoring",
      description: "24/7 monitoring of your fields with instant alerts and automated irrigation recommendations.",
      gradient: "from-success to-success-light"
    },
    {
      icon: Eye,
      title: "Yield Prediction",
      description: "Accurate yield forecasting based on historical data, weather patterns, and current field conditions.",
      gradient: "from-warning to-warning-light"
    },
    {
      icon: Cloud,
      title: "Cloud Integration",
      description: "Seamlessly integrate with existing farm management systems and cloud storage solutions.",
      gradient: "from-primary to-primary-light"
    },
    {
      icon: Smartphone,
      title: "Mobile Access",
      description: "Access your farm data anywhere, anytime with our responsive mobile application.",
      gradient: "from-danger to-danger-light"
    }
  ];

  return (
    <section className="py-24 bg-background-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for Modern Farming
          </h2>
          <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to optimize your agricultural operations and maximize your yields
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={32} className="text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="font-body text-gray-600 leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-6">
                <button className="text-secondary font-semibold hover:text-secondary-dark transition-colors duration-200 flex items-center gap-2 group">
                  Learn more
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-12 text-white">
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Farm?
            </h3>
            <p className="font-body text-xl mb-8 opacity-90">
              Join thousands of farmers who are already using CropCare to optimize their operations
            </p>
            <button className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300 hover:scale-105 inline-flex items-center gap-2">
              Start Your Free Trial
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;