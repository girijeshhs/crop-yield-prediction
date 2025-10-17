import Hero from "../components/Hero";
import StatsSection from "../components/StatsSection";
import FeatureCards from "../components/FeatureCards";

function Home() {
  return (
    <div className="min-h-screen bg-background-primary">
      <Hero />
      <StatsSection />
      <FeatureCards />
    </div>
  );
}

export default Home;
