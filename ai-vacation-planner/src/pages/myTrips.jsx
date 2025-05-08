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
          return (
            <div className="flex flex-col items-center justify-center h-screen">
              <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
            </div>
          );
        }

        if (!authLoading && !user) {
          return (
            <>
              <LoginDialog
                openDialog={true}
                setOpenDialog={() => navigate("/")}
              />
            </>
          );
        }
        setLoading(true);
        const getDataQuery = query(
          collection(db, "Trips"),
          where("userEmail", "==", user.email)
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
            ...prevTrips,
            { id: doc.id, ...doc.data() },
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

  useEffect(() => {
    if (userTrips.length === 0) {
      setImagesLoaded(true);
      return;
    }

    let loadedCount = 0;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === userTrips.length) {
        setImagesLoaded(true);
      }
    };

    // Timeout fallback in case some images fail to load
    const timeout = setTimeout(() => {
      setImagesLoaded(true);
    }, 5000);

    userTrips.forEach((trip) => {
      const img = new Image();
      img.src = trip.imageUrl; // Assuming trip.imageUrl is the image source used in UserTripCardItem
      img.onload = handleImageLoad;
      img.onerror = handleImageLoad;
    });

    return () => clearTimeout(timeout);
  }, [userTrips]);

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
      {authLoading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
        </div>
      ) : !user ? (
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
