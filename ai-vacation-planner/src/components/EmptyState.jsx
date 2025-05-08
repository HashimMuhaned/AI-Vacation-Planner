import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const EmptyState = ({
  title,
  description,
  ctaText,
  ctaAction,
  illustration,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 bg-white",
        "animate-fade-in max-w-lg mx-auto",
        className
      )}
    >
      <div className="mb-6 scale-in-center transition-all duration-500">
        {illustration}
      </div>
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      <Button onClick={ctaAction} className="bg-orange-500 hover:bg-orange-400">
        <Link to="/create-trip">{ctaText}</Link>
      </Button>
    </div>
  );
};

export default EmptyState;
