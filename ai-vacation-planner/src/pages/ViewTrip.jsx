import React from "react";
import { useParams } from "react-router-dom";
import { db } from "@/services/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { showToast } from "@/components/ui/sonner";
import InfoSection from "@/components/ViewTripComponents/InfoSection";
import HotelsInfo from "@/components/ViewTripComponents/HotelsInfo";
import PlacesToVisit from "@/components/ViewTripComponents/PlacesToVisit";
import Footer from "@/components/ViewTripComponents/Footer";
import { FlightDisplayCard } from "./components/FlightDisplayCard";
import { useLoading } from "@/context/ViewTripLoadingContext"; // ✅ Import global loading context

const ViewTrip = () => {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState(null);
  const { showLoading, hideLoading } = useLoading(); // ✅ Use loading context

  useEffect(() => {
    const fetchTripData = async () => {
      showLoading(); // ✅ Global spinner on
      try {
        const docRef = doc(db, "Trips", tripId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTripData(docSnap.data());
        } else {
          console.warn("No such document found.");
          showToast("white", "red", "Trip not found.");
        }
      } catch (error) {
        console.error("Error fetching trip data:", error);
        showToast("white", "red", "Error fetching trip data.");
      } finally {
        hideLoading(); // ✅ Global spinner off
      }
    };

    if (tripId) {
      fetchTripData();
    }
  }, [tripId]);

  const cleanedTriptDateTravelPlan = tripData?.tripData?.tripData?.travelPlan;
  const cleanedTripDateHotelsInfo =
    tripData?.tripData?.tripData?.travelPlan?.hotels;
  const cleanedFlightData = tripData?.FlightDetailes;

  // ✅ Wait until tripData is loaded
  if (!tripData) return null;

  return (
    <div className="mt-25 p-5 md:px-20 lg:px-44 xl:px-56 md:mt-25">
      <InfoSection tripData={tripData} />
      <FlightDisplayCard flightData={cleanedFlightData} tripDocId={tripId} />
      <HotelsInfo hotels={cleanedTripDateHotelsInfo} />
      <PlacesToVisit travelPlan={cleanedTriptDateTravelPlan} />
      <Footer />
    </div>
  );
};

export default ViewTrip;
