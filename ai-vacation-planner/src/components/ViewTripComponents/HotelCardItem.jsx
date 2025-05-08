import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPlaceImageWikiMedia } from "@/services/GglPlaceImgApi";
import { useLoading } from "@/context/ViewTripLoadingContext"; // ✅ import context
import placeholderimg from "../../assets/placeholder.jpg";

const HotelCardItem = ({ hotel }) => {
  const [placePhoto, setPlacePhoto] = useState(null);
  const { showLoading, hideLoading } = useLoading(); // ✅ use loading context

  useEffect(() => {
    const getPlacePhoto = async () => {
      showLoading(); // ✅ show global loading
      try {
        const hotelName = hotel.hotelName || hotel.hotelAddress;
        const photoUrl = await getPlaceImageWikiMedia(hotelName);
        setPlacePhoto(photoUrl);
      } catch (error) {
        console.error("Error fetching Wikimedia photo:", error);
      } finally {
        hideLoading(); // ✅ hide global loading
      }
    };

    if (hotel?.hotelName || hotel?.hotelAddress) {
      getPlacePhoto();
    }
  }, [hotel]);

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${
        hotel?.hotelName || hotel?.hotelAddress
      }`}
      target="_blank"
    >
      <div className="hover:scale-105 transition-all cursor-pointer">
        <img
          src={placePhoto || placeholderimg}
          alt={hotel.name}
          className="h-[200px] w-full object-cover rounded-xl"
          loading="lazy"
        />
        <div className="my-3">
          <h2 className="font-medium">{hotel.hotelName}</h2>
          <h2 className="text-xs text-gray-500">📍 {hotel.address}</h2>
          <h2 className="text-sm">💲{hotel.price}</h2>
          <h2 className="text-sm text-gray-500">⭐{hotel.rating}</h2>
        </div>
      </div>
    </Link>
  );
};

export default HotelCardItem;
