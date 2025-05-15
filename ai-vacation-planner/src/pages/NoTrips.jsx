import React from "react";
import { Globe } from "lucide-react";
import EmptyState from "@/components/EmptyState";

const NoTrip = () => {
  const handleCreateTrip = () => {
    console.log("Create trip clicked");
    // This would normally navigate to trip creation page
  };

  return (
    <div>
      <div className="mx-auto px-4 pb-16 max-w-6xl">
        <div className="mb-20 mt-12">
          <EmptyState
            title="No trips created yet"
            description="Start planning your dream trip with our AI-powered trip planner"
            ctaText="Create Your First Trip"
            ctaAction={handleCreateTrip}
            illustration={
              <div className="relative w-46 h-46 md:w-64 md:h-64">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-orange-100 rounded-full opacity-50"></div>
                <div className="relative flex items-center justify-center h-full">
                  <Globe className="w-18 h-18 md:w-24 md:h-24 text-orange-500" />
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
