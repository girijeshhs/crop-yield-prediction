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
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">
            Powerful Features for Modern Farming
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to optimize your agricultural operations and maximize your yields
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-6">
                <feature.icon size={32} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-text mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-6">
                <button className="text-primary font-semibold hover:text-secondary transition-colors duration-200 flex items-center gap-2">
                  Learn more →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Farm?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of farmers who are already using CropCare to optimize their operations
            </p>
            <button className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;