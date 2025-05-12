import React from "react";
import HotelCardItem from "./HotelCardItem";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

const HotelsInfo = ({ hotels }) => {
  const [displayedHotels, setDisplayedHotels] = useState([]);

  // The useEffect hook is used to perform side effects in functional components, 
  // such as fetching data, updating the DOM, or managing state.
  useEffect(() => {
    if (hotels?.length > 0) {
      // Initially set the first batch
      setDisplayedHotels(getRandomHotels(hotels, 3)); // essentially 3 hotels
    }
  }, [hotels]);

  const handleRefreshHotels = () => {
    const newHotels = getRandomHotels(hotels, 6); // if the user click more hotels, show 6 hotels
    // Check if the new hotels are the same as the displayed ones
    setDisplayedHotels(newHotels);
  };


  //  function is designed to provide a random subset of hotels from a larger list. 
  // This is particularly useful in scenarios where you want to display a limited number of hotels to the user
  const getRandomHotels = (allHotels, count = 6) => {
    const shuffled = [...allHotels].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return (
    <div>
      <div className="flex justify-between items-end mt-5">
        <h2 className="font-bold textl-sm md:text-xl mt-5">Hotel Recommendations</h2>
        <Button
          onClick={handleRefreshHotels}
          className="px-2 text-sm bg-blue-500 text-white md:px-4 md:py-2 rounded hover:bg-blue-600 transition"
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
