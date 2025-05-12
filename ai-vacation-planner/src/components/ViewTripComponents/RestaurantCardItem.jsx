import React, { useState, useEffect } from "react";
import placeholderimg from "../../assets/placeholder.jpg";
import { Link } from "react-router-dom";
import { getPlaceImageWikiMedia } from "@/services/GglPlaceImgApi";
import { useLoading } from "@/context/ViewTripLoadingContext"; // ✅ Import loading context

const RestaurantCardItem = ({ restaurant = {}, filterRestaurant }) => {
  const [placePhotos, setPlacePhotos] = useState({});
  const [hasError, setHasError] = useState(false);
  const { showLoading, hideLoading } = useLoading(); // ✅ Use loading context

  // hook in React that fetches photos for a list of restaurants when the restaurant?.restaurants dependency changes.
  // This hook ensures that the photos are retrieved asynchronously and updates the component's state accordingly
  useEffect(() => {
    // The fetchPhotos function is an asynchronous function responsible for fetching photos for each restaurant in the restaurant?.restaurants array.
    const fetchPhotos = async () => {
      const newPhotos = {}; // Initialize newPhotos: An empty object is created to store the fetched photos, with the restaurant names as keys.
      showLoading(); // ✅ Show global loader
      try {
        // The function iterates over the restaurant?.restaurants array using a for...of loop
        for (const r of restaurant?.restaurants || []) {
          try {
            // It calls the getPlaceImageWikiMedia function,
            // passing the restaurant's name (r.restaurantName) to fetch the photo URL from Wikimedia.
            const photoURL = await getPlaceImageWikiMedia(r.restaurantName);
            newPhotos[r.restaurantName] = photoURL || placeholderimg; // If a photo URL is successfully retrieved, it is stored in the newPhotos object {r.restauranName as key: photoURL as value}.
            // If no URL is found, a placeholder image (placeholderimg) is used instead.
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

  let filteredRestaurants = []; // an empty array. This will hold the filtered list of restaurants after applying the filtering logic.

  try {
    // filters a list of restaurants based on user-selected criteria (filterRestaurant).
    // It ensures that only restaurants matching the selected filters are included in the filteredRestaurants array
    filteredRestaurants = restaurant.restaurants.filter((r) => {
      // For each restaurant (r)
      // The restaurantType property of the restaurant is stored in the types variable
      const types = r.restaurantType || {};
      // If the filterRestaurant array includes "all", the function immediately returns true.
      // meaning all restaurants will be included in the filtered list.
      if (filterRestaurant.includes("all")) return true;

      // Otherwise, the .some() method is used to check if any of the selected filters match the restaurant's type.
      return filterRestaurant.some((filter) => {
        if (filter === "veg") return types["Vegetarian"]; // If the filter is "veg", the code checks if the types object has a Vegetarian property.
        if (filter === "halal") return types["Halal"]; // If the filter is "halal", it checks for the Halal property.
        if (filter === "dessert") return types["Dessert"]; // If the filter is "dessert", it checks for the Dessert property.

        // If none of these conditions are met, the function returns false, excluding the restaurant from the filtered list.
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
          <div className="flex flex-col border rounded-xl p-3 mt-2 md:flex md:flex-row gap-5 hover:scale-105 transition-all shadow-md cursor-pointer">
            <img
              src={placePhotos[r.restaurantName] || placeholderimg}
              alt={r.restaurantName}
              className="w-full h-[200px] md:w-[130px] md:h-[170px] object-cover rounded-xl"
            />
            <div>
              <h2 className="font-bold text-lg">{r.restaurantName}</h2>
              <p className="text-sm text-gray-400">{r.restaurantDetails}</p>
              <h2 className="mt-2">⏰ {r.restaurantRating}</h2>
              <h2 className="mt-2">
                🎟️{" "}
                {
                  Object.entries(r.restaurantType || {}) // Converts the restaurantType object into an array of key-value pairs.
                    // example: [["Vegetarian", true], ["Halal", false], ["Dessert", true]]
                    .filter(([_, value]) => value) // Filters the array to include only the entries where the value is true.
                    // example: [["Vegetarian", true], ["Dessert", true]]
                    .map(([key]) => key) // Extracts the keys (type names) from the filtered array.
                    // example: ["Vegetarian", "Dessert"]
                    .join(", ") // Joins the keys into a single string, separated by commas.
                  // example: "Vegetarian, Dessert"
                }
              </h2>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RestaurantCardItem;
