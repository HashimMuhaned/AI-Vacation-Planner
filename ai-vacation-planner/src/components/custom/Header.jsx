import React, { useState, useEffect } from "react";
import Logo from "/logo.svg";
import { Button } from "@/components/ui/button";
import { removeLocalStorageItem } from "@/utils/localStorage"; // adjust path as needed
import { showToast } from "@/components/ui/sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/GoogleAuth";
import LoginDialog from "./Dialog";
import { Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import { Menu, X, Globe } from "lucide-react";
import { motion, useAnimation } from "motion/react";
import { useLocation } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";
import { GrTechnology } from "react-icons/gr";
import { FaRegCircleQuestion } from "react-icons/fa6";

const Header = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const plusControls = useAnimation();
  const mapControls = useAnimation();
  const location = useLocation();
  const techControls = useAnimation();
  const howItWorkControls = useAnimation();
  const userPicture = user?.picture || "https://via.placeholder.com/150"; // Fallback image
  const userName = user?.name;
  const userEmail = user?.email;

  const handleLogout = () => {
    setLoading(true);
    googleLogout();
    removeLocalStorageItem("user");
    setUser(null);
    showToast("white", "green", "Logged out successfully");
    setLoading(false);
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`px-10 p-3 flex justify-between items-center md:px-20 fixed top-0 left-0 right-0 transition-all duration-300 z-99 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <Link to="/" className="md:flex md:items-center gap-2">
        <img src={Logo} alt="logo" height={40} width={40} />
      </Link>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-5">
          {location.pathname !== "/" ? (
            <Link to={"/"}>
              <Button variant="outline">Back to Home</Button>
            </Link>
          ) : (
            <div className="hidden md:flex items-center gap-5">
              {location.pathname === "/" ? (
                <div className="flex items-center gap-5">
                  <motion.div
                    onHoverStart={() => techControls.start({ y: 0 })}
                    onHoverEnd={() => techControls.start({ y: 40 })}
                    className="flex items-center gap-2 relative overflow-hidden font-medium hover:text-orange-500 transition-colors cursor-pointer"
                  >
                    <a href="/#features" className="flex items-center gap-2">
                      <motion.div
                        initial={{ y: 40 }}
                        animate={techControls}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <GrTechnology />
                      </motion.div>
                      <span>Features</span>
                    </a>
                  </motion.div>
                  <motion.div
                    onHoverStart={() => howItWorkControls.start({ y: 0 })}
                    onHoverEnd={() => howItWorkControls.start({ y: 40 })}
                    className="flex items-center gap-2 relative overflow-hidden font-medium hover:text-orange-500 transition-colors cursor-pointer"
                  >
                    <a
                      href="/#how-it-works"
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        initial={{ y: 40 }}
                        animate={howItWorkControls}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <FaRegCircleQuestion />
                      </motion.div>
                      <span>How it Works</span>
                    </a>
                  </motion.div>
                </div>
              ) : null}
            </div>
          )}
        </div>
        {user ? (
          <div className="flex items-center gap-5">
            {/* <Button variant="outline" className="rounded-full"> */}
            {location.pathname !== "/create-trip" ? (
              <motion.div
                onHoverStart={() => plusControls.start({ y: 0 })}
                onHoverEnd={() => plusControls.start({ y: 40 })}
                className="hidden md:flex items-center gap-2 relative overflow-hidden font-medium hover:text-orange-500 transition-colors cursor-pointer"
              >
                <Link to="/create-trip" className="flex items-center gap-2">
                  <motion.div
                    initial={{ y: 40 }}
                    animate={plusControls}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <FaPlus />
                  </motion.div>
                  <span>Create Trip</span>
                </Link>
              </motion.div>
            ) : null}

            {/* My Trips */}
            {location.pathname !== "/my-trips" ? (
              <motion.div
                onHoverStart={() => mapControls.start({ y: 0 })}
                onHoverEnd={() => mapControls.start({ y: 40 })}
                className="hidden md:flex items-center gap-2 relative overflow-hidden font-medium hover:text-orange-500 transition-colors cursor-pointer"
              >
                <Link to="/my-trips" className="flex items-center gap-2">
                  <motion.div
                    initial={{ y: 40 }}
                    animate={mapControls}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <FaMapMarkedAlt />
                  </motion.div>
                  <span>My Trips</span>
                </Link>
              </motion.div>
            ) : null}
            <Popover>
              <PopoverTrigger>
                <img
                  src={userPicture}
                  alt="user"
                  height={35}
                  width={35}
                  className="rounded-full cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-2 p-2">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-sm font-semibold">{userName}</p>
                      <p className="text-sm text-gray-500">{userEmail}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleLogout}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <AiOutlineLoading3Quarters className="h-5 w-5 animate-spin" />
                      </div>
                    ) : (
                      "Logout"
                    )}
                  </Button>
                  <Button variant="outline" className="w-full">
                    Switch Account
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <div>
            {location.pathname === "/create-trip" && !user ? (
              <Button
                variant="outline"
                className="hidden md:block ml-5"
                onClick={() => setOpenDialog(true)}
              >
                Login
              </Button>
            ) : (
              <Link to="/create-trip">
                <Button className="hidden md:block ml-5 bg-orange-500 text-white hover:bg-orange-600">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
      <LoginDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />

      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full border-t shadow-lg px-10">
          <div className="flex flex-col container-custom py-4 space-y-4">
            {location.pathname !== "/" ? (
              <Link
                to={"/"}
                className="flex items-center gap-2 font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            ) : null}
            <a
              href="#features"
              className="py-2 font-medium hover:text-orange transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="py-2 font-medium hover:text-orange transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            {user ? (
              <div className="flex flex-col gap-5">
                {location.pathname !== "/create-trip" ? (
                  <div className="hover:text-orange-500 transition-colors cursor-pointer">
                    <Link
                      to="/create-trip"
                      className="flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Create Trip</span>
                    </Link>
                  </div>
                ) : null}
                {location.pathname !== "/my-trips" ? (
                  <div className="hover:text-orange-500 transition-colors cursor-pointer">
                    <Link
                      to="/my-trips"
                      className="flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>My Trips</span>
                    </Link>
                  </div>
                ) : null}
              </div>
            ) : (
              <div>
                {location.pathname === "/create-trip" && !user ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setOpenDialog(true)}
                  >
                    Login
                  </Button>
                ) : (
                  <Button
                    className="bg-orange-500 text-white hover:bg-orange-600 w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to="/create-trip">Get Started</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
