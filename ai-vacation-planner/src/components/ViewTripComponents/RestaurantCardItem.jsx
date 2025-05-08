import React, { useState, useEffect } from "react";
import placeholderimg from "../../assets/placeholder.jpg";
import { Link } from "react-router-dom";
import { getPlaceImageWikiMedia } from "@/services/GglPlaceImgApi";
import { useLoading } from "@/context/ViewTripLoadingContext"; // ✅ Import loading context

const RestaurantCardItem = ({ restaurant = {}, filterRestaurant }) => {
  const [placePhotos, setPlacePhotos] = useState({});
  const [hasError, setHasError] = useState(false);
  const { showLoading, hideLoading } = useLoading(); // ✅ Use loading context

  useEffect(() => {
    const fetchPhotos = async () => {
      const newPhotos = {};
      showLoading(); // ✅ Show global loader
      try {
        for (const r of restaurant?.restaurants || []) {
          try {
            const photoURL = await getPlaceImageWikiMedia(r.restaurantName);
            newPhotos[r.restaurantName] = photoURL || placeholderimg;
          } catch (err) {
            console.error(
              `Error fetching Wikimedia image for ${r.restaurantName}`,
              err
            );
            newPhotos[r.restaurantName] = placeholderimg;
          }
        }
        setPlacePhotos(newPhotos);
      } catch (err) {
        console.error("Error in photo fetching logic:", err);
        setHasError(true);
      } finally {
        hideLoading(); // ✅ Always hide loader
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
    setHasError(true);
    return null;
  }

  return (
    <div>
      {filteredRestaurants.map((r) => (
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
              <p className="text-sm text-gray-400">{r.restaurantDetails}</p>
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
      ))}
    </div>
  );
};

export default RestaurantCardItem;
