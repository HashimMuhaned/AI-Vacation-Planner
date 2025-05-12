import React from "react";
import { Bot, Clock, Filter, Globe, Map, Star, Wallet } from "lucide-react";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      icon: <Bot className="h-6 w-6 text-orange-500" />,
      title: "AI Trip Planner",
      description:
        "Our AI analyzes thousands of data points to create custom itineraries tailored to your preferences.",
    },
    {
      icon: <Filter className="h-6 w-6 text-orange-500" />,
      title: "Personalized Recommendations",
      description:
        "Get personalized suggestions for attractions, restaurants, and activities based on your interests.",
    },
    {
      icon: <Wallet className="h-6 w-6 text-orange-500" />,
      title: "Budget Optimization",
      description:
        "Our AI helps you make the most of your budget with smart spending recommendations.",
    },
    {
      icon: <Clock className="h-6 w-6 text-orange-500" />,
      title: "Time-Saving",
      description:
        "Plan a complete trip in minutes instead of hours with our intelligent assistant.",
    },
    {
      icon: <Map className="h-6 w-6 text-orange-500" />,
      title: "Interactive Maps",
      description:
        "Visualize your entire journey with interactive maps showing your daily routes and activities.",
    },
    {
      icon: <Globe className="h-6 w-6 text-orange-500" />,
      title: "Global Coverage",
      description:
        "Plan trips to over 500 destinations worldwide with local insights and recommendations.",
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="w-full max-w-7xl mx-auto lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center bg-orange-500/10 px-4 py-2 rounded-full mb-4">
            <Star className="h-5 w-5 text-orange-500 mr-2" />
            <span className="font-medium text-sm">AI-Powered Features</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Personal AI Travel Assistant
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover how our AI transforms your travel planning experience with
            these powerful features
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-light p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-transparent hover:border-orange-500/20 transition-all duration-300 hover:scale-[1.03]"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            >
              <div className="bg-orange/10 p-3 rounded-lg inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
