import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";
import { getPlaceImageWikiMedia } from "@/services/GglPlaceImgApi";
import { useLoading } from "@/context/ViewTripLoadingContext"; // ✅ make sure this is correct
import placeholderImg from "@/assets/placeholder.jpg";

export const FlightDisplayCard = ({ flightData, tripDocId }) => {
  const origin = flightData?.departurePlace?.label || "Unknown Origin";
  const destination = flightData?.destination?.label || "Unknown Destination";
  const departureDate = flightData?.departureDate
    ? new Date(flightData.departureDate.seconds * 1000).toLocaleDateString()
    : "Unknown Departure Date";
  const returnDate = flightData?.return
    ? new Date(flightData.return.seconds * 1000).toLocaleDateString()
    : "Unknown Return Date";

  // const { user } = useAuth();
  const [flightDataCard, setFlightDataCard] = useState(null);
  const { tripId } = useParams();
  const [airlineImages, setAirlineImages] = useState({});

  const { loading, showLoading, hideLoading } = useLoading(); // ✅ using global loading context

  useEffect(() => {
    const fetchFlightDetails = async () => {
      if (!tripDocId) return;
      showLoading();

      try {
        const docRef = doc(db, "FlightDetails", tripId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFlightDataCard(data);

          // Fetch images
          const airlineImageMap = {};
          const flightOptions = data?.flightDetails?.flights[0]?.options || [];

          await Promise.all(
            flightOptions.map(async (opt) => {
              const airline = opt.airline_name;
              if (!airlineImageMap[airline]) {
                try {
                  const imgUrl = await getPlaceImageWikiMedia(airline);
                  airlineImageMap[airline] = imgUrl || placeholderImg;
                } catch {
                  airlineImageMap[airline] = placeholderImg;
                }
              }
            })
          );

          setAirlineImages(airlineImageMap);
        } else {
          console.warn("No flight details found for this tripDocId.");
          setFlightDataCard(null);
        }
      } catch (error) {
        console.error("Error fetching flight details:", error);
      } finally {
        hideLoading();
      }
    };

    fetchFlightDetails();
  }, [tripDocId]);

  if (loading) return <p>Loading flight details...</p>;

  if (!flightDataCard || !flightDataCard.flightDetails?.flights?.[0]?.options)
    return <p>No flight options found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {flightDataCard.flightDetails.flights[0].options.map((option, index) => (
        <Link
          to={option.booking_link}
          target="_blank"
          key={index}
          className="border rounded-xl p-3 mt-2 hover:scale-105 transition-all shadow-md cursor-pointer"
        >
          <div className="flex gap-5">
            <img
              src={airlineImages[option.airline_name] || placeholderImg}
              alt={option.airline_name}
              className="w-[230px] h-[170px] object-fit rounded-xl"
            />
            <div className="text-sm text-gray-700">
              <p>
                ✈️ <strong>Airline:</strong> {option.airline_name}
              </p>
              <p>
                🕒 <strong>Departure:</strong> {option.departure_time}
              </p>
              <p>
                🛬 <strong>Arrival:</strong> {option.arrival_time}
              </p>
              <p>
                💵 <strong>Price:</strong> {option.estimated_ticket_price}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FlightDisplayCard;
