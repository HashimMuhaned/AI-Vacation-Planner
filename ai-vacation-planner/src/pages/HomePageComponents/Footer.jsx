import {
  Mail,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import Logo from "/logo.svg";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <img src={Logo} alt="Logo" className="h-10 mr-2" />
              <span className="font-bold text-xl">AI Vacation Planner</span>
            </div>
            <p className="hsl(var(20 5% 60%)) mb-4">
              Your AI-powered travel assistant for creating personalized trip
              itineraries and discovering amazing destinations.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hsl(var(20 5% 60%)) hover:text-orange-500"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hsl(var(20 5% 60%)) hover:text-orange-500"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hsl(var(20 5% 60%)) hover:text-orange-500"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hsl(var(20 5% 60%)) hover:text-orange-500"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="hsl(var(20 5% 60%)) hover:text-orange-500"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hsl(var(20 5% 60%)) hover:text-orange-500"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hsl(var(20 5% 60%)) hover:text-orange-500"
                >
                  How it Works
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="hsl(var(20 5% 60%)) hover:text-orange-500"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hsl(var(20 5% 60%)) hover:text-orange-500"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Travel Destinations */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Popular Destinations</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="hsl(var(20 5% 60%)) hover:text-orange-500"
                >
                  Bali, Indonesia
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hsl(var(20 5% 60%)) hover:text-orange-500"
                >
                  Paris, France
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hsl(var(20 5% 60%)) hover:text-orange-500"
                >
                  Tokyo, Japan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hsl(var(20 5% 60%)) hover:text-orange-500"
                >
                  New York, USA
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hsl(var(20 5% 60%)) hover:text-orange-500"
                >
                  Santorini, Greece
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-orange-500 mr-2" />
                <a
                  href="mailto:info@tripwizard.ai"
                  className="hsl(var(20 5% 60%)) hover:text-orange-500"
                >
                  info@tripwizard.ai
                </a>
              </li>
              <li className="flex items-center">
                <MessageCircle className="h-5 w-5 text-orange-500 mr-2" />
                <span className="hsl(var(20 5% 60%))">24/7 Support Chat</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border- text-center">
          <p className="hsl(var(20 5% 60%)) text-sm">
            © {new Date().getFullYear()} AI Vacation Planner. All rights
            reserved.
          </p>
          <div className="flex justify-center space-x-8 mt-4">
            <a
              href="#"
              className="text-sm hsl(var(20 5% 60%)) hover:text-orange-500"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm hsl(var(20 5% 60%)) hover:text-orange-500"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm hsl(var(20 5% 60%)) hover:text-orange-500"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
