import { ArrowRight, Sprout } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <Sprout size={18} />
            Sustainable Agriculture Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-text mb-6 leading-tight">
            Revolutionize Your
            <span className="block text-primary">
              Crop Production
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Harness the power of AI and data analytics to optimize your farming operations,
            predict yields with precision, and detect diseases before they spread.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="px-8 py-4 rounded-xl font-semibold text-white bg-primary hover:bg-secondary transition-colors duration-300 flex items-center gap-2">
              <ArrowRight size={20} />
              Predict Yield
            </button>
            <button className="flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-xl bg-transparent hover:bg-primary hover:text-white transition-all duration-300 font-semibold">
              <Sprout size={20} />
              Disease Detection
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <Sprout size={32} className="text-primary mb-2 mx-auto" />
              <div className="text-3xl font-bold text-text mb-1">98%</div>
              <div className="text-gray-600">Prediction Accuracy</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <ArrowRight size={32} className="text-primary mb-2 mx-auto" />
              <div className="text-3xl font-bold text-text mb-1">24/7</div>
              <div className="text-gray-600">Monitoring</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <Sprout size={32} className="text-primary mb-2 mx-auto" />
              <div className="text-3xl font-bold text-text mb-1">50K+</div>
              <div className="text-gray-600">Farmers Served</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;