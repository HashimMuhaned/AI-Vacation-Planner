import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MessagesSquare,
  CalendarCheck,
  Briefcase,
} from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120 },
  },
};

const HowItWorks = () => {
  const steps = [
    {
      icon: <MessagesSquare className="h-6 w-6 text-white" />,
      title: "Share Your Preferences",
      description:
        "Tell our AI about your travel preferences, budget, and schedule. The more details you provide, the better your plan will be.",
    },
    {
      icon: <CalendarCheck className="h-6 w-6 text-white" />,
      title: "Review Your Itinerary",
      description:
        "Within minutes, receive a fully customized itinerary with daily activities, accommodations, and transportation options.",
    },
    {
      icon: <Briefcase className="h-6 w-6 text-white" />,
      title: "Enjoy Your Trip",
      description:
        "Approve or tweak your plan, then enjoy a perfectly organized trip with all the details in one place.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 relative">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white to-transparent"></div>

      <div className="w-full max-w-7xl mx-auto sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg hsl(var(20 5% 60%))">
            Planning your perfect trip has never been easier. Our AI handles the
            details so you can focus on creating memories.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInUp}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              className="pt-5 md:pt-0 flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center">
                  {step.icon}
                </div>
                <div className="absolute top-0 -z-10 w-16 h-16 bg-orange-500/30 rounded-full blur-lg"></div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-orange-500 to-orange-300/10"></div>
                )}
                <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full border-2 border-orange-500 bg-white"></div>
                <span className="absolute -top-13 left-1/2 -translate-x-1/2 text-xl font-bold text-orange-500">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="hsl(var(20 5% 60%))">{step.description}</p>
            </div>
          ))}
        </motion.div>

        <motion.div className="bg-gradient-to-r from-orange-500 to-orange-300 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Ready to Plan Your Next Adventure?
              </h3>
              <p className="text-white/90">
                Start your AI-powered trip planning experience now.
              </p>
            </div>
            <Button className="whitespace-nowrap bg-white text-orange-500 hover:bg-white/90 hover:text-orange-[#1A1A1A]">
              Start Planning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
