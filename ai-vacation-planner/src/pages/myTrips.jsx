import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../services/FirebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/GoogleAuth";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import NoTrip from "./NoTrips";
import UserTripCardItem from "./components/UserTripCardItem";
import LoginDialog from "@/components/custom/Dialog";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

const myTrips = () => {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { user, authLoading } = useAuth();
  useEffect(() => {
    const getUserTrips = async () => {
      try {
        if (authLoading) {
          // Check if auth is still loading
          return (
            <div className="flex flex-col items-center justify-center h-screen">
              <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
            </div>
          );
        }

        if (!authLoading && !user) {
          // If user is not authenticated
          return (
            <>
              <LoginDialog
                openDialog={true}
                setOpenDialog={() => navigate("/")} // Redirect to login page
              />
            </>
          );
        }
        setLoading(true);
        const getDataQuery = query(
          collection(db, "Trips"),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(getDataQuery);

        if (querySnapshot.empty) {
          console.log("No trips found for user.");
          setLoading(false);
          return;
        }
        setUserTrips([]); // Clear previous trips
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          setUserTrips((prevTrips) => [
            // It uses the functional form of the state updater to ensure the previous state (prevTrips) is correctly preserved.
            ...prevTrips, // The spread operator (...prevTrips) adds all existing trips in the userTrips array to the new array.
            { id: doc.id, ...doc.data() },
            // A new object is created for the current document, combining:
            // The document's ID (id: doc.id).
            // The document's data (...doc.data()), which is spread into the new
            // This ensures that each trip in the userTrips array includes both the document's ID and its data.
          ]);
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user trips:", error);
        setLoading(false);
      }
    };

    getUserTrips();
  }, [authLoading, user, navigate]); // include navigate in deps

  // purpose:
  // The imagesLoaded state is set to true only after all images in the userTrips array have either loaded successfully or failed to load.
  // timeout fallback prevents the app from waiting indefinitely for images that fail to load.

  // benefit:
  // It ensures that the app waits for all images to load before displaying them, improving the user experience.
  // The timeout fallback ensures the app doesn't hang if some images fail to load.
  useEffect(() => {
    if (userTrips.length === 0) {
      setImagesLoaded(true); // This avoids unnecessary processing when there are no trips.
      return;
    }

    // A counter is initialized to track how many images have successfully loaded.
    let loadedCount = 0;

    const handleImageLoad = () => {
      loadedCount++; // It increments the loadedCount variable.
      if (loadedCount === userTrips.length) {
        setImagesLoaded(true);
      }
      // If the number of loaded images equals the total number of trips (userTrips.length),
      // it sets imagesLoaded to true, indicating that all images are ready.
    };

    // Timeout fallback in case some images fail to load
    const timeout = setTimeout(() => {
      setImagesLoaded(true);
    }, 5000); // 5 seconds timeout

    userTrips.forEach((trip) => {
      const img = new Image();
      img.src = trip.imageUrl; // Assuming trip.imageUrl is the image source used in UserTripCardItem
      img.onload = handleImageLoad; // when the image loads successfully.
      img.onerror = handleImageLoad; // if the image fails to load.
    });

    return () => clearTimeout(timeout);
    // This ensures that the timeout is canceled,
    // if the component is unmounted or the userTrips array changes before the timeout completes.
  }, [userTrips]);
  // The useEffect hook runs whenever the userTrips array changes.
  // This ensures that the logic is executed whenever new trips are added or the array is updated.

  const isReady = !loading && imagesLoaded;

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
      </div>
    );
  }

  // if user is still null after auth resolves, redirect manually
  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="sm:px-10 md:px-20 lg:px-56 xl:px-72 px-5 my-25">
      {authLoading ? ( // Check if auth is still loading
        <div className="flex flex-col items-center justify-center h-screen">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
        </div>
      ) : !user ? ( // If user is not authenticated, it opens the login dialog
        <>
          <LoginDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
        </>
      ) : !isReady ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 className="font-bold text-3xl" variants={itemVariants}>
            {userTrips.length > 0 ? (
              "Your Trips"
            ) : (
              <div>
                <NoTrip />
              </div>
            )}
          </motion.h2>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-10"
            variants={containerVariants}
          >
            {userTrips.map((trip, index) => (
              <motion.div key={index} variants={itemVariants}>
                <UserTripCardItem trip={trip} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default myTrips;
