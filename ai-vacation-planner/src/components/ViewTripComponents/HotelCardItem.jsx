import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPlaceImage } from "@/services/GglPlaceImgApi";
import placeholderimg from "../../assets/placeholder.jpg"; // Placeholder image

const HotelCardItem = ({ hotel }) => {
  const [placePhoto, setPlacePhoto] = useState(null);
  useEffect(() => {
    const getPlacePhoto = async () => {
      try {
        const hotelName = hotel.hotelName || hotel.hotelAddress;
        const response = await getPlaceImage(hotelName);

        const photoName = response.data.places[0].photos[9].name;
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
          <h2 h2 className="text-sm">
            💲{hotel.price}
          </h2>
          <h2 className="text-sm text-gray-500">⭐{hotel.rating}</h2>
        </div>
      </div>
    </Link>
  );
};

export default HotelCardItem;
