import React from "react";
import HotelCardItem from "./HotelCardItem";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

const HotelsInfo = ({ hotels }) => {
  const [displayedHotels, setDisplayedHotels] = useState([]);

  useEffect(() => {
    if (hotels?.length > 0) {
      // Initially set the first batch
      setDisplayedHotels(getRandomHotels(hotels, 3)); // e.g., 6 hotels
    }
  }, [hotels]);

  const handleRefreshHotels = () => {
    const newHotels = getRandomHotels(hotels, 6);
    setDisplayedHotels(newHotels);
  };

  const getRandomHotels = (allHotels, count = 6) => {
    const shuffled = [...allHotels].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-5">
        <h2 className="font-bold text-xl mt-5">Hotel Recommendations</h2>
        <Button
          onClick={handleRefreshHotels}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Show more Hotels
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lx:grid-cols-4 gap-5 my-5">
        {displayedHotels?.map((hotel, index) => (
          <HotelCardItem key={index} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default HotelsInfo;
