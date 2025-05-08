import React from "react";
import { cn } from "@/lib/utils";

const FeatureCard = ({ icon, title, description, className }) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center p-6 rounded-lg bg-white border border-gray-100",
        "shadow-sm hover:shadow-md transition-all duration-300",
        "hover:-translate-y-1 cursor-pointer",
        className
      )}
    >
      <div className="text-purple-500 mb-4 p-3 bg-purple-50 rounded-full">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 text-center">{description}</p>
    </div>
  );
};

export default FeatureCard;
