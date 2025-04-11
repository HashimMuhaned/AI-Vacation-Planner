import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="m-5 flex flex-col items-center md:mx-56 gap-9">
      <h1 className="font-bold text-[40px] mt-10 md:font-extrabold md:text-[50px] text-center md:mt-16">
        <span className="text-[#f56551]">
          Discover Your Next Adventure with AI:
        </span>{" "}
        Personalized Itineraries at Your Fingertips
      </h1>
      <p className="text-xl text-grey-500 text-center">
        Your personal trip planner and travel curator, creating custom
        itineraries tailored to your interests and budget.
      </p>
      <Link to="/create-trip">
        <Button>Get Started, it's Free</Button>
      </Link>
    </div>
  );
};

export default HeroSection;
