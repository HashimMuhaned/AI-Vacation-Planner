import React, { useState, useEffect } from "react";
import placeholderimg from "../../assets/placeholder.jpg"; // Placeholder image
import { Link } from "react-router-dom";
import { getPlaceImage } from "@/services/GglPlaceImgApi";

const PlaceCardItem = ({ place }) => {
  const [placePhoto, setPlacePhoto] = useState(null);
  console.log(place);
  useEffect(() => {
    const getPlacePhoto = async () => {
      try {
        const placeName = place.placeName;
        const response = await getPlaceImage(placeName);

        const photoName = response.data.places[0].photos[4].name;
        console.log(photoName);

        const PhotoURL = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&maxWidthPx=400&key=${
          import.meta.env.VITE_MAPS_API_KEY
        }`;

        setPlacePhoto(PhotoURL);

        console.log(PhotoURL);
      } catch (error) {
        console.error("Error fetching place phsoto:", error);
      }
    };

    if (place?.placeName) {
      getPlacePhoto();
    }
  }, [place]);
  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${place?.placeName}`}
      target="_blank"
    >
      <div className="border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all shadow-md cursor-pointer">
        <img
          src={placePhoto}
          alt={place.placeName}
          className="w-[130px] h-[130px] object-cover rounded-xl"
        />

        <div>
          <h2 className="font-bold text-lg">{place.placeName}</h2>
          <p className="text-sm text-gray-400">{place.placeDetails}</p>
          <h2 className="mt-2">⏰ {place.travelTime}</h2>
          <h2 className="mt-2">🎟️ {place.ticketPricing}</h2>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCardItem;
