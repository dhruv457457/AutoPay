import React from "react";
import HeroSection from "../components/HeroSection";
import InteractiveFeatures from "../components/InteractiveFeatures";
import SubscriptionTiers from "../components/SubscriptionTiers";


const Home: React.FC = () => {
  return (
    <div className="w-full min-h-screen">
      <HeroSection />
      <InteractiveFeatures />
    
      <SubscriptionTiers />
    </div>
  );
};

export default Home;
