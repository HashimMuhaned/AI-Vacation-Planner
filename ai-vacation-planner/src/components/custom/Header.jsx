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
import { Menu, X } from "lucide-react";
import { motion, useAnimation } from "motion/react";
import { useLocation } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";
import { GrTechnology } from "react-icons/gr";
import { FaRegCircleQuestion } from "react-icons/fa6";

const Header = () => {
  const [openDialog, setOpenDialog] = useState(false);
  // if the user is switching accounts, set the mode to "switch" and the text on the dialog to "Switch Account"
  // if the user is logging in, set the mode to "login" and the text on the dialog to "Login"
  const [loginMode, setLoginMode] = useState("login"); // "login" | "switch account"
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
  // const [userPicture, setUserPicture] = useState(
  //   user?.picture || "https://via.placeholder.com/150"
  // ); // Fallback image
  const [userName, setUserName] = useState(user?.name);
  const [userEmail, setUserEmail] = useState(user?.email);
  const userPicture = user?.picture || "https://via.placeholder.com/150"; // Fallback image

  const handleLogout = () => {
    setLoading(true);
    googleLogout();
    removeLocalStorageItem("user");
    setUser(null);
    showToast("white", "green", "Logged out successfully");
    setLoading(false);
    navigate("/");
  };

  // The useEffect hook is used to perform side effects in functional components.
  // In this case, it sets up and cleans up a scroll event listener on the window object.
  useEffect(() => {
    const handleScroll = () => {
      // It checks the vertical scroll position of the window using window.scrollY.
      if (window.scrollY > 10) {
        // If the user has scrolled more than 10 pixels vertically (window.scrollY > 10),
        // it sets the isScrolled state to true by calling setIsScrolled(true).
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // The window.addEventListener("scroll", handleScroll) line attaches the handleScroll function to the scroll event of the window object.
    // This ensures that the function is called whenever the user scrolls.
    window.addEventListener("scroll", handleScroll);
    // This removes the event listener when the component is unmounted, preventing memory leaks or unwanted behavior.
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // The empty dependency array ([]) ensures that this effect runs only once, when the component is mounted, and cleans up when the component is unmounted.

  useEffect(() => {
    if (user) {
      // setUserPicture(user.picture);
      setUserName(user.name);
      setUserEmail(user.email);
    }
  }, [user]);

  return (
    <nav
      className={`px-5 p-3 flex justify-between items-center md:px-40 fixed top-0 left-0 right-0 transition-all duration-300 z-99 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <Link to="/" className="md:flex md:items-center gap-2">
        <img src={Logo} alt="logo" height={40} width={40} />
      </Link>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-5">
          {location.pathname !== "/" ? ( // if not on the home page
            <Link to={"/"}>
              {" "}
              {/* show Link to home page */}
              <Button variant="outline">Back to Home</Button>
            </Link>
          ) : (
            // if on the home page
            <div className="hidden md:flex items-center gap-5">
              {location.pathname === "/" ? ( // if on the home page
                // show Links (Features and How it works)
                <div className="flex items-center gap-5">
                  {/* Features Link */}
                  <motion.div
                    // some animation for the features and how it works links
                    onHoverStart={() => techControls.start({ y: 0 })}
                    onHoverEnd={() => techControls.start({ y: 40 })}
                    className="flex items-center gap-2 relative overflow-hidden font-medium hover:text-orange-500 transition-colors cursor-pointer"
                  >
                    {/* it ill scroll down to Features Section */}
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
                  {/*  */}
                  <motion.div
                    onHoverStart={() => howItWorkControls.start({ y: 0 })}
                    onHoverEnd={() => howItWorkControls.start({ y: 40 })}
                    className="flex items-center gap-2 relative overflow-hidden font-medium hover:text-orange-500 transition-colors cursor-pointer"
                  >
                    {/* it ill scroll down to How it works Section */}
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
        {user ? ( // if user is logged in
          // show Create Trip and My Trips Links
          <div className="flex items-center gap-5">
            {/* <Button variant="outline" className="rounded-full"> */}
            {location.pathname !== "/create-trip" ? (
              // if not on the create trip page show Create Trip Link
              <motion.div
                // some animation for the create trip link
                onHoverStart={() => plusControls.start({ y: 0 })}
                onHoverEnd={() => plusControls.start({ y: 40 })}
                className="hidden md:flex items-center gap-3 relative overflow-hidden font-medium hover:text-orange-500 transition-colors cursor-pointer"
              >
                <Link to="/create-trip" className="flex items-center gap-2">
                  <motion.div
                    initial={{ y: 40 }}
                    animate={plusControls}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <FaPlus className="ml-2" />
                  </motion.div>
                  <span>Create Trip</span>
                </Link>
              </motion.div>
            ) : null}

            {/* My Trips */}
            {location.pathname !== "/my-trips" ? ( // if not on the my trips page show My Trips Link
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
            <div className="hidden md:block">
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
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setLoginMode("switch");
                        setOpenDialog(true);
                      }}
                    >
                      Switch Account
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ) : (
          <div>
            {location.pathname === "/create-trip" && !user ? (
              // if on the create trip page and user is not logged in
              // show Login button
              <Button
                variant="outline"
                className="hidden md:block ml-5"
                onClick={() => {
                  setOpenDialog(true);
                  setLoginMode("login");
                }}
              >
                Login
              </Button>
            ) : (
              // if not on the create trip page and user is not logged in
              // show Get Started button
              <Link to="/create-trip">
                <Button className="hidden md:block ml-5 bg-orange-500 text-white hover:bg-orange-600">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
      <LoginDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        mode={loginMode}
      />

      {/* Same logic of the Header is applied to the Header For Mobile */}
      {/* Mobile */}
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
        <motion.div
          className="md:hidden bg-white absolute top-full left-0 w-full border-t rounded-b-lg shadow-sm px-10 pb-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="flex flex-col container-custom py-4 space-y-4"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
          >
            {user ? (
              <div>
                <Popover>
                  <PopoverTrigger>
                    <div className="flex items-center gap-2 cursor-pointer w-full">
                      <img
                        src={userPicture}
                        alt="user"
                        height={35}
                        width={35}
                        className="rounded-full cursor-pointer"
                      />
                      <div className="flex flex-col items-start">
                        <p className="text-sm font-semibold">{userName}</p>
                        <p className="text-sm text-gray-500">{userEmail}</p>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="z-99">
                    <div className="flex flex-col gap-2 p-2">
                      {/* <div className="flex items-center gap-2">
                        <div>
                          <p className="text-sm font-semibold">{userName}</p>
                          <p className="text-sm text-gray-500">{userEmail}</p>
                        </div>
                      </div> */}
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
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setLoginMode("login");
                          setOpenDialog(true);
                        }}
                      >
                        Switch Account
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : null}
            {location.pathname !== "/" ? (
              <Link
                to={"/"}
                className="flex items-center gap-2 font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
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
              </div>
            )}
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
                    onClick={() => {
                      setOpenDialog(true);
                      setIsMenuOpen(false);
                    }}
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
          </motion.div>
        </motion.div>
      )}
    </nav>
  );
};

export default Header;
