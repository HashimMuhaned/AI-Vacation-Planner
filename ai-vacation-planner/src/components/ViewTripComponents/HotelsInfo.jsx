import React from "react";
import placeholderimg from "../../assets/placeholder.jpg"; // Placeholder image
import { Link } from "react-router-dom";
import HotelCardItem from "./HotelCardItem";

const HotelsInfo = ({ hotels }) => {
  // console.log(JSON.stringify(tripData, null, 2));
  // console.log("has travelPlan:", tripData?.travelPlan !== undefined);
  // console.log(tripData);
  // console.log(
  //   "is hotels an array: ?",
  //   Array.isArray(tripData?.travelPlan?.hotels)
  // );

  // console.log("hotels:", tripData?.travelPlan?.hotels);
  // console.log("type of hotels:", typeof tripData?.travelPlan?.hotels);

  // const hotels = tripData?.tripData?.travelPlan?.hotels;

  // console.log("is hotels an array?", Array.isArray(hotels));
  // console.log("hotels:", hotels);
  // console.log("type of hotels:", typeof hotels);

  return (
    <div>
      <h2 className="font-bold text-xl mt-5">Hotel Recommendations</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lx:grid-cols-4 gap-5 my-5">
        {hotels?.map((hotel, index) => (
          <HotelCardItem key={index} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default HotelsInfo;
