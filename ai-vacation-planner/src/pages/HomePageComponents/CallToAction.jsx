import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120 },
  },
};

const CallToAction = () => {
  const benefits = [
    "Personalized AI trip recommendations",
    "Save hours of planning time",
    "Discover hidden gems and local favorites",
    "24/7 travel support during your journey",
  ];

  return (
    <motion.section
      className="py-16 md:py-24 bg-gradient-to-b"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={fadeInUp}
    >
      <div className="w-full max-w-7xl mx-auto lg:px-8">
        <div className="bg-gray-900 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Start Planning Your Dream Trip Today
              </h2>

              <p className="text-white/80 mb-6">
                Let our AI help you discover and plan the perfect vacation
                tailored to your preferences.
              </p>

              <div className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                    <span className="text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-6">
                  Try For Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button className="bg-transparent border-2 border-white/20 text-white hover:bg-white/10 px-8 py-6">
                  Learn More
                </Button>
              </div>
            </div>

            <div className="relative hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1035&ixlib=rb-4.0.3"
                alt="Travel destination"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-orange-500/30"></div>

              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg text-black shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <div className="font-semibold">Trip to Maldives</div>
                <div className="text-sm hsl(var(20 5% 60%))">
                  7 days · 5-star resort
                </div>
                <div className="mt-2 text-orange-500 font-bold">
                  Plan Generated ✓
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CallToAction;
