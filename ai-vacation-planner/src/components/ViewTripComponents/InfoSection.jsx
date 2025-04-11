import React, { useEffect, useState } from "react";
import placeholderimg from "../../assets/placeholder.jpg"; // Placeholder image
import { Button } from "../ui/button";
import { FaShare } from "react-icons/fa6";
import { getPlaceImage } from "@/services/GglPlaceImgApi";

const InfoSection = ({ tripData }) => {
  const [placePhoto, setPlacePhoto] = useState(null);
  useEffect(() => {
    const getPlacePhoto = async () => {
      try {
        const placeName = tripData?.userSelection?.place;
        const response = await getPlaceImage(placeName);

        const photoName = response.data.places[0].photos[2].name;
        console.log(photoName);

        const PhotoURL = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=900&maxWidthPx=900&key=${
          import.meta.env.VITE_MAPS_API_KEY
        }`;

        setPlacePhoto(PhotoURL);

        console.log(PhotoURL);
      } catch (error) {
        console.error("Error fetching place photo:", error);
      }
    };

    if (tripData?.userSelection?.place) {
      getPlacePhoto();
    }
  }, [tripData]);

  return (
    <div>
      <img
        src={placePhoto || placeholderimg}
        alt="Placeholder"
        className="h-[170px] md:h-[400px] w-full rounded-xl shadow-md border border-gray-200 object-cover"
        loading="lazy"
      />
      <div className="my-5 flex flex-col gap-2">
        <h2 className="font-bold text-sm md:text-2xl">
          {tripData?.userSelection?.place}
        </h2>
        <div className="flex justify-between items-center">
          <div className="flex flex-col md:flex-row gap-5">
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500">
              📅{tripData?.userSelection?.days}{" "}
              {Number(tripData?.userSelection?.days) > 1 ? "Days" : "Day"}
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500">
              💰{tripData?.userSelection?.budget} Budget
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500">
              🧍 No. Of travelers: {tripData?.userSelection?.travelers}{" "}
            </h2>
          </div>
          <Button>
            <FaShare />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
