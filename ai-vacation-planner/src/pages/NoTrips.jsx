import React from "react";
import { Sparkles, Compass, Globe, MessageSquareX } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import FeatureCard from "@/components/FeatureCard";

const NoTrip = () => {
  const handleCreateTrip = () => {
    console.log("Create trip clicked");
    // This would normally navigate to trip creation page
  };

  return (
    <div className="">
      <div className="container mx-auto px-4 pb-16 max-w-6xl">
        <div className="mb-20 mt-12">
          <EmptyState
            title="No trips created yet"
            description="Start planning your dream trip with our AI-powered trip planner"
            ctaText="Create Your First Trip"
            ctaAction={handleCreateTrip}
            illustration={
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-orange-100 rounded-full opacity-50"></div>
                <div className="relative flex items-center justify-center h-full">
                  <Globe className="w-24 h-24 text-orange-500" />
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default NoTrip;
