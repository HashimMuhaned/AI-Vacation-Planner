import React, { useState, useEffect } from "react";
import placeholderimg from "../../assets/placeholder.jpg"; // Placeholder image
import { Link } from "react-router-dom";
import { getPlaceImage } from "@/services/GglPlaceImgApi";

const RestaurantCardItem = ({ restaurant = {}, filterRestaurant }) => {
  const [placePhotos, setPlacePhotos] = useState({});
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      const newPhotos = {};

      try {
        for (const r of restaurant?.restaurants || []) {
          try {
            const response = await getPlaceImage(r.restaurantName);
            const place = response?.data?.places?.[0];
            const photoName = place?.photos?.[0]?.name;

            if (photoName) {
              const photoURL = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&maxWidthPx=400&key=${
                import.meta.env.VITE_MAPS_API_KEY
              }`;
              newPhotos[r.restaurantName] = photoURL;
            } else {
              newPhotos[r.restaurantName] = placeholderimg;
            }
          } catch (err) {
            console.error(`Error fetching photo for ${r.restaurantName}`, err);
            newPhotos[r.restaurantName] = placeholderimg;
          }
        }
        setPlacePhotos(newPhotos);
      } catch (err) {
        console.error("Error in photo fetching logic:", err);
        setHasError(true);
      }
    };

    if (restaurant?.restaurants?.length) {
      fetchPhotos();
    }
  }, [restaurant?.restaurants]);

  if (hasError) {
    return (
      <div className="text-red-500 font-semibold text-lg">
        Failed to display trip.
      </div>
    );
  }

  // If restaurants are not loaded yet
  if (!restaurant?.restaurants?.length) {
    return null;
  }

  let filteredRestaurants = [];

  try {
    filteredRestaurants = restaurant.restaurants.filter((r) => {
      const types = r.restaurantType || {};
      if (filterRestaurant.includes("all")) return true;

      return filterRestaurant.some((filter) => {
        if (filter === "veg") return types["Vegetarian"];
        if (filter === "halal") return types["Halal"];
        if (filter === "dessert") return types["Dessert"];
        return false;
      });
    });
  } catch (err) {
    console.error("Error filtering restaurants:", err);
    setHasError(true); // ⚠️ Avoid this during render — move to useEffect if needed
    return null;
  }
  return (
    <div>
      {hasError ? (
        <div className="text-red-500 font-semibold text-lg">
          Failed to display trip.
        </div>
      ) : (
        filteredRestaurants.map((r) => {
          try {
            return (
              <Link
                key={r.id}
                to={`https://www.google.com/maps/search/?api=1&query=${r.restaurantName}`}
                target="_blank"
              >
                <div className="border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all shadow-md cursor-pointer">
                  <img
                    src={placePhotos[r.restaurantName] || placeholderimg}
                    alt={r.restaurantName}
                    className="w-[130px] h-[130px] object-cover rounded-xl"
                  />

                  <div>
                    <h2 className="font-bold text-lg">{r.restaurantName}</h2>
                    <p className="text-sm text-gray-400">
                      {r.restaurantDetails}
                    </p>
                    <h2 className="mt-2">⏰ {r.restaurantRating}</h2>
                    <h2 className="mt-2">
                      🎟️{" "}
                      {Object.entries(r.restaurantType || {})
                        .filter(([_, value]) => value)
                        .map(([key]) => key)
                        .join(", ")}
                    </h2>
                  </div>
                </div>
              </Link>
            );
          } catch (error) {
            console.error("Error rendering restaurant:", error);
            setHasError(true);
            return null;
          }
        })
      )}
    </div>
  );
};

export default RestaurantCardItem;
