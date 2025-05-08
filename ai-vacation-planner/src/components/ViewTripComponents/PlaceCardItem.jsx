import React, { useState, useEffect } from "react";
import placeholderimg from "../../assets/placeholder.jpg";
import { Link } from "react-router-dom";
import { getPlaceImageWikiMedia } from "@/services/GglPlaceImgApi";
import { useLoading } from "@/context/ViewTripLoadingContext"; // ✅ Import loading context

const PlaceCardItem = ({ place }) => {
  const [placePhoto, setPlacePhoto] = useState(null);
  const { showLoading, hideLoading } = useLoading(); // ✅ Use context

  useEffect(() => {
    const getPlacePhoto = async () => {
      showLoading(); // ✅ Trigger global loading
      try {
        const placeName = place.placeName;
        const photoURL = await getPlaceImageWikiMedia(placeName);
        setPlacePhoto(photoURL);
        console.log("Wikimedia photo URL:", photoURL);
      } catch (error) {
        console.error("Error fetching Wikimedia place photo:", error);
      } finally {
        hideLoading(); // ✅ Hide loading when done
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
          src={placePhoto || placeholderimg}
          alt={place.placeName}
          className="w-[130px] h-[170px] object-cover rounded-xl"
        />
        <div>
          <h2 className="font-bold text-lg">{place.placeName}</h2>
          <p className="text-sm text-gray-400">{place.placeDetails}</p>
          <h2 className="mt-2">⏰ {place.travelTime}</h2>
          <h2 className="mt-2">🎟️ {place.ticketPricing}</h2>
          <h2 className="mt-2">⭐ {place.rating}</h2>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCardItem;
