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

  // fetches flight details and associated airline images from firebase when the tripDocId dependency changes.
  useEffect(() => {
    const fetchFlightDetails = async () => {
      if (!tripDocId) return;
      showLoading();

      try {
        // The docRef is created using Firestore's doc function,
        // pointing to the FlightDetails collection and the specific document identified by tripId.
        const docRef = doc(db, "FlightDetails", tripId);
        // The getDoc function retrieves the document snapshot (docSnap) from Firestore.
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // If the document exists
          const data = docSnap.data(); // Get the data from the document
          setFlightDataCard(data); // Set the flight data to state

          // An empty object is initialized to store
          // airline names as keys and their corresponding image URLs as values.
          const airlineImageMap = {};
          const flightOptions = data?.flightDetails?.flights[0]?.options || []; // Ensure flightOptions is defined

          await Promise.all(
            //Promise.all method is used to fetch images for all airlines in parallel,
            flightOptions.map(async (opt) => {
              const airline = opt.airline_name; // Extract the airline name from the flight option
              // If the image URL is not found, it assigns a placeholder image.

              if (!airlineImageMap[airline]) {
                // If the airline name is not already in the airlineImageMap,
                try {
                  // it attempts to fetch the image URL using the getPlaceImageWikiMedia function.
                  const imgUrl = await getPlaceImageWikiMedia(airline);
                  airlineImageMap[airline] = imgUrl || placeholderImg; // it adds the {airlineName:imageURL}.
                } catch {
                  // If an error occurs during the image fetching process,
                  // it assigns a placeholder image to the airline in the airlineImageMap.
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
    <div className="pt-10">
      <p className="text-sm text-muted-foreground mt-2">
        Trip from <span className="font-medium text-primary">{origin}</span> to{" "}
        <span className="font-medium text-primary">{destination}</span>. <br />
        <span className="italic">
          {departureDate} &rarr; {returnDate}
        </span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {flightDataCard.flightDetails.flights[0].options.map(
          (option, index) => (
            <Link
              to={option.booking_link}
              target="_blank"
              key={index}
              className="border rounded-xl p-3 mt-2 hover:scale-105 transition-all shadow-md cursor-pointer"
            >
              <div className="flex flex-col md:flex gap-5">
                <img
                  src={airlineImages[option.airline_name] || placeholderImg}
                  alt={option.airline_name}
                  className="w-full md:w-[210px] md:h-[220px] object-fit rounded-xl"
                />
                <div className="text-sm text-gray-700">
                  <p>
                    <strong>Airline:</strong> {option.airline_name}
                  </p>
                  <p>
                    <strong>Departure Time:</strong> {option.departure_time}
                  </p>
                  <p>
                    <strong>Departure Airport:</strong>{" "}
                    {option.departure_airport}
                  </p>
                  <p>
                    <strong>Arrival Time:</strong> {option.arrival_time}
                  </p>
                  <p>
                    <strong>Arrival Airport:</strong> {option.arrival_airport}
                  </p>
                  <p>
                    <strong>Return Arrival Time:</strong>{" "}
                    {option.return_arrival_time}
                  </p>
                  <p>
                    <strong>Return Departure Time: </strong>{" "}
                    {option.return_departure_time}
                  </p>
                  <p>
                    <strong>Price:</strong> {option.estimated_ticket_price}
                  </p>
                  <p>
                    <strong>Note:</strong> {option.notes}
                  </p>
                </div>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default FlightDisplayCard;
