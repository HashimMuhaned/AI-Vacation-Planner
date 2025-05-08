import React from "react";
import HeroSection from "@/components/custom/HeroSection";
import CallToAction from "./HomePageComponents/CallToAction";
import Footer from "./HomePageComponents/Footer";
import HowItWorks from "./HomePageComponents/HowItWorks";
import Features from "./HomePageComponents/Features";

const HomePage = () => {
  return (
    <div className="px-5 md:px-40">
      <HeroSection />
      <Features />
      <HowItWorks />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default HomePage;
