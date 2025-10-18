import Hero from "../components/Hero";
import FeaturesSection from "../components/FeaturesSection";
import StatsSection from "../components/StatsSection";
import CTASection from "../components/CTASection";

function Home() {
  return (
    <div className="scroll-snap-y overflow-y-scroll h-screen">
      <Hero />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </div>
  );
}

export default Home;
