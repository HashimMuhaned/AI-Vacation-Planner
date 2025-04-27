import React from "react";

export const FlightDisplayCard = ({ flightData }) => {
  // Firestore timestamps have a seconds field (which is Unix time in seconds).
  // JavaScript Date expects milliseconds, so you multiply by 1000.
  //.toLocaleDateString() formats it into a readable date like 4/25/2025
  const origin = flightData?.departurePlace?.label || "Unknown Origin";
  const destination = flightData?.destination?.label || "Unknown Destination";
  const departureDate = flightData?.departureDate
    ? new Date(flightData.departureDate.seconds * 1000).toLocaleDateString()
    : "Unknown Departure Date";
  const returnDate = flightData?.return
    ? new Date(flightData.return.seconds * 1000).toLocaleDateString()
    : "Unknown Return Date";

  return (
    <div>
      Destination: {destination} <br />
      Origin: {origin} <br />
      Departure Date: {departureDate} <br />
      Return Date: {returnDate} <br />
    </div>
  );
};

export default FlightDisplayCard;
