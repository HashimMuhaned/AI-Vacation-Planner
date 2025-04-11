import React, { useState, useEffect } from "react";
import placeholderimg from "../../assets/placeholder.jpg"; // Placeholder image
import { getPlaceImage } from "@/services/GglPlaceImgApi";
import { Link } from "react-router-dom";

const UserTripCardItem = ({ trip }) => {
  const [placePhoto, setPlacePhoto] = useState(null);
  useEffect(() => {
    const getPlacePhoto = async () => {
      try {
        const placeName = trip?.userSelection?.place;
        const response = await getPlaceImage(placeName);

        const photoName = response.data.places[0].photos[6].name;
        console.log(photoName);

        const PhotoURL = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&maxWidthPx=400&key=${
          import.meta.env.VITE_MAPS_API_KEY
        }`;

        setPlacePhoto(PhotoURL);

        console.log(PhotoURL);
      } catch (error) {
        console.error("Error fetching place photo:", error);
      }
    };

    if (trip?.userSelection?.place) {
      getPlacePhoto();
    }
  }, [trip]);
  return (
    <Link to={`/view-trip/${trip?.id}`} className="cursor-pointer">
      <div className="hover:scale-105 transition-all">
        <img
          src={placePhoto}
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
