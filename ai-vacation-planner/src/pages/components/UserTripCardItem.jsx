import React, { useState, useEffect } from "react";
import placeholderimg from "../../assets/placeholder.jpg"; // Placeholder image
import { getCountryImagesUnSplash } from "@/services/GglPlaceImgApi";
import { Link } from "react-router-dom";

const UserTripCardItem = ({ trip }) => {
  const [placePhoto, setPlacePhoto] = useState(null);
  useEffect(() => {
    const getPlacePhotos = async () => {
      try {
        const placeName = trip?.userSelection?.place; // Ensure placeName is defined
        const photos = await getCountryImagesUnSplash(placeName); // passing placeName
        setPlacePhoto(photos); // Set the first photo as the place photo
      } catch (error) {
        console.error("Error fetching country photos:", error);
      }
    };

    if (trip?.userSelection?.place) {
      getPlacePhotos(); // call the function to fetch photos
    }
  }, [trip]);
  return (
    <Link to={`/view-trip/${trip?.id}`} className="cursor-pointer">
      <div className="hover:scale-105 transition-all">
        <img
          src={placePhoto || placeholderimg}
          alt=""
          className="object-cover rounded-xl h-[200px] w-full"
        />
        <div>
          <h2 className="font-bold text-lg">{trip?.userSelection?.place}</h2>
          <h2 className="text-sm text-gray-500">
            {trip?.userSelection?.days} Days tript with{" "}
            {trip?.userSelection?.budget} budget
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default UserTripCardItem;
