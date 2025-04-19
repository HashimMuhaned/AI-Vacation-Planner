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

const ViewTrip = () => {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true); // Initially true

  console.log(tripData);

  useEffect(() => {
    const fetchTripData = async () => {
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
        setLoading(false);
      }
    };

    if (tripId) {
      fetchTripData();
    }
  }, [tripId]);

  const cleanedTriptDateTravelPlan = tripData?.tripData?.tripData?.travelPlan;
  const cleanedTripDateHotelsInfo =
    tripData?.tripData?.tripData?.travelPlan?.hotels;
  // const cleanedTripDatePlacesToVisit = tripData?.tripData?.tripData?.travelPlan;

  return (
    <div className="mt-25 p-5 md:px-20 lg:px-44 xl:px-56 md:mt-25">
      <InfoSection tripData={tripData} loading={loading} />
      <HotelsInfo hotels={cleanedTripDateHotelsInfo} loading={loading} />
      <PlacesToVisit
        travelPlan={cleanedTriptDateTravelPlan}
        loading={loading}
      />
      <Footer />
    </div>
  );
};

export default ViewTrip;
