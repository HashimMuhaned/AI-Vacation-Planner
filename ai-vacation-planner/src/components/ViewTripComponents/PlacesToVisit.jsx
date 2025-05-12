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
    <div>
      <h2 className="font-bold text-lg">Places To Vist</h2>
      <div className="mt-10">
        <div className="flex-column md:flex md:justify-between md:items-center mt-5">
          <h2 className="hidden md:block md:font-bold md:text-lg">
            Places and Restaurants
          </h2>
          <div className="flex-column md:flex gap-2 md:items-center">
            <h2 className="font-bold text-lg">Filter Restaurants</h2>
            {/*  filter system for restaurants using a toggle group. 
            This allows users to select multiple filter options ("all," "veg," "halal," "dessert") to refine the displayed results */}
            <ToggleGroup
              type="multiple" // multiple options can be selected simultaneously.
              value={filterRestaurant} // The current state of selected filters, stored in the filterRestaurant variable.
              onValueChange={(value) => {
                // A callback function triggered whenever the selection changes. It updates the filterRestaurant state based on the user's input.
                if (value.length === 0) {
                  // If the user deselects all options (i.e., value.length === 0), the filter resets to ["all"]
                  setFilterRestaurant(["all"]);
                } else {
                  setFilterRestaurant(
                    value.includes("all") && value.length > 1 //If the user selects "all" along with other options,
                      ? value.filter((v) => v !== "all") // the function removes "all" from the selection
                      : value
                  );
                }
              }}
              className="flex gap-2"
            >
              {["all", "veg", "halal", "dessert"].map((option) => (
                <ToggleGroupItem
                  key={option} // A unique key for React to identify each item in the list.
                  value={option} // The value of the toggle item, which corresponds to the filter option.
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors
         ${
           // If the option is selected (filterRestaurant.includes(option) will have gray background and black text)
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
                      {place.time}
                      best time to visit: {place.bestTimeToVisit}
                    </h2>
                    <PlaceCardItem place={place} />
                  </div>
                ))}
              </div>
              <h2 className="font-bold text-lg mt-5">Restaurants</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {day?.plan?.map((place, index) => (
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacesToVisit;
