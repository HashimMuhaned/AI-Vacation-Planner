import React, { useEffect, useState } from "react";
import { getLocalStorageItem } from "@/utils/localStorage";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../services/FirebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/GoogleAuth";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import UserTripCardItem from "./components/UserTripCardItem";

const myTrips = () => {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    const getUserTrips = async () => {
      try {
        if (!user) {
          navigate("/");
          return;
        }
        setLoading(true);
        const getDataQuery = query(
          collection(db, "Trips"),
          where("userEmail", "==", user?.email)
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
        navigate("/");
      }
    };

    getUserTrips();
  }, [navigate]); // include navigate in deps
  return (
    <div className="sm:px-10 md:px-20 lg:px-56 xl:px-72 px-5 my-10">
      {loading ? (
        <div>
          <div className="flex flex-col items-center justify-center h-screen">
            <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
          </div>
        </div>
      ) : (
        <div>
          <h2 className="font-bold text-3xl">
            {userTrips.length > 0 ? (
              "Your Trips"
            ) : (
              <Link to={"/create-trip"} className="underline">
                No Trips Yet, Make One ?
              </Link>
            )}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-10">
            {userTrips?.map((trip, index) => (
              <UserTripCardItem key={index} trip={trip} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default myTrips;
