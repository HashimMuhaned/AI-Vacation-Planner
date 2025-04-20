import React from "react";
import PlaceCardItem from "./PlaceCardItem";
import RestauratCardItem from "./RestaurantCardItem";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const PlacesToVisit = ({ travelPlan }) => {
  console.log(travelPlan);
  console.log("travelPlan:", travelPlan);
  const [filterRestaurant, setFilterRestaurant] = useState(["all"]);

  return (
    <div className="mt-10">
      <div className="flex-column md:flex md:justify-between md:items-center mt-5">
        <h2 className="hidden md:block md:font-bold md:text-lg">
          Places and Restaurants
        </h2>
        <div className="flex-column md:flex gap-2 md:items-center">
          <h2 className="font-bold text-lg">Filter Restaurants</h2>
          <ToggleGroup
            type="multiple"
            value={filterRestaurant}
            onValueChange={(value) => {
              if (value.length === 0) {
                setFilterRestaurant(["all"]);
              } else {
                setFilterRestaurant(
                  value.includes("all") && value.length > 1
                    ? value.filter((v) => v !== "all")
                    : value
                );
              }
            }}
            className="flex gap-2"
          >
            {["all", "veg", "halal", "dessert"].map((option) => (
              <ToggleGroupItem
                key={option}
                value={option}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors
        ${
          filterRestaurant.includes(option)
            ? "bg-gray-200 border-black text-black"
            : "bg-white border-gray-300 text-black"
        }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div> 

      <div className="mt-2">
        {travelPlan?.itinerary?.map((day, index) => (
          <div key={index}>
            <hr className="mt-3" />
            <h2 className="font-medium text-lg mt-4">{day.day}</h2>
            <h2 className="font-bold text-lg mt-5">Places</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {day?.plan?.map((place, index) => (
                <div key={index} className="my-3">
                  <h2 className="font-medium text-sm text-orange-600">
                    best time to visit: {place.bestTimeToVisit}
                  </h2>
                  <PlaceCardItem place={place} />
                </div>
              ))}
            </div>

            {/* ✅ Updated Restaurants Section */}
            <h2 className="font-bold text-lg mt-5">Restaurants</h2>
            {/* // Immediately Invoked Function Expression (IIFE) used to run logic inside JSX. */}
            {(() => {
              const filtered = day.plan.filter((place) => {
                //  Create a filtered list of restaurant places from the day.plan.
                if (filterRestaurant.includes("all")) return true; //  If "all" is selected, we include all restaurants, no filtering needed.

                // Extract types from the restaurant’s restaurantType object where the value is true.
                const types = Object.entries(place.restaurantType || {}) // This converts the object into an array of key-value pairs.
                  .filter(([_, val]) => val) // Now we filter out only those where the value is true.
                  // The _ means we're ignoring the key during the filter — we only care about the val.
                  .map(([key]) => key); // Now we extract just the keys ("veg", "dessert") from the filtered results:

                //  Include this restaurant only if at least one type matches the selected filters.
                return types.some((type) => filterRestaurant.includes(type));
              });

              // If no restaurants match the filters, display a friendly message instead of an empty list.
              if (filtered.length === 0) {
                return (
                  <div className="text-center text-gray-500 my-10">
                    😔 No restaurants were found.
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filtered.map((place, index) => (
                    <div key={index} className="my-3">
                      <h2 className="font-medium text-sm text-orange-600">
                        {place.time}
                      </h2>
                      <RestauratCardItem
                        restaurant={place}
                        filterRestaurant={filterRestaurant}
                      />
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacesToVisit;
