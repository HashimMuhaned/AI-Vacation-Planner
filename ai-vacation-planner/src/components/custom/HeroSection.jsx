import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Calendar, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
      stiffness: 90,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120 },
  },
};

const HeroSection = () => {
  return (
    <motion.section
      id="hero"
      className="mt-30 md:mt-20 md:pt-9 md:pb-20 overflow-hidden bg-gradient-to-b from-light to-white"
      initial="hidden"
      animate="show"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={containerVariants}
    >
      <motion.div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Side */}
          <motion.div className="flex flex-col space-y-6" variants={fadeInUp}>
            <motion.div
              className="inline-flex items-center self-start bg-orange-500/10 px-4 py-2 rounded-full"
              variants={fadeInUp}
            >
              <Sparkles className="h-5 w-5 text-orange-500 mr-2" />
              <span className="font-medium text-sm">
                AI-Powered Trip Planning
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              variants={fadeInUp}
            >
              Plan Your Perfect Trip with{" "}
              <span className="text-orange-500">AI</span> Assistance
            </motion.h1>

            <motion.p
              className="text-lg text-muted-foreground"
              variants={fadeInUp}
            >
              Let our AI create personalized travel itineraries based on your
              preferences, budget, and schedule. Experience travel planning
              reimagined.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              variants={fadeInUp}
            >
              <Button className="bg-orange-500 hover:bg-orange-400">
                Plan My Trip
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-400">
                Learn More
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 pt-4"
              variants={fadeInUp}
            >
              <div className="flex items-center">
                <div className="bg-orange-500/10 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-orange-500" />
                </div>
                <span className="ml-3 font-medium">500+ destinations</span>
              </div>

              <div className="flex items-center">
                <div className="bg-orange-500/10 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-orange-500" />
                </div>
                <span className="ml-3 font-medium">
                  Personalized itineraries
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative z-10 rounded-2xl overflow-hidden card-shadow animate-float">
              <img
                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=687&ixlib=rb-4.0.3"
                alt="Travel destination"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark/80 to-transparent p-6">
                <h3 className="text-white font-bold text-xl">
                  Santorini, Greece
                </h3>
                <p className="text-white/80">Personalized adventure</p>
              </div>
            </div>

            <div className="absolute -top-8 -right-8 w-36 h-36 bg-orange rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-orange rounded-full opacity-20 blur-3xl"></div>
          </motion.div>
        </div>
      </motion.div>

      {/* Trusted By */}
      <motion.div className="container-custom mt-20" variants={fadeInUp}>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-70">
          <p className="text-lg font-semibold">Trusted by travelers from:</p>
          <span className="font-bold text-xl">airbnb</span>
          <span className="font-bold text-xl">Booking.com</span>
          <span className="font-bold text-xl">Expedia</span>
          <span className="font-bold text-xl">TripAdvisor</span>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
