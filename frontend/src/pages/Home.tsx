import React from "react";
import HeroSection from "../components/HeroSection";
import InteractiveFeatures from "../components/InteractiveFeatures";
import CTABanner from "../components/CTABanner";
import ApprovalsOverview from "../components/ApprovalsOverview";

const Home: React.FC = () => {
  return (
    <div className="w-full min-h-screen">
      <HeroSection />
  <ApprovalsOverview />
      <InteractiveFeatures />
      <CTABanner />
    </div>
  );
};

export default Home;