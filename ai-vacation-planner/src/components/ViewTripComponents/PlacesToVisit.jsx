import React from "react";
import PlaceCardItem from "./PlaceCardItem";

const PlacesToVisit = ({ travelPlan }) => {
  console.log(travelPlan);
  console.log("travelPlan:", travelPlan);

  return (
    <div>
      <h2 className="font-bold text-lg">Places To Vist</h2>

      <div className="mt-2">
        {travelPlan?.itinerary?.map((day, index) => (
          <div key={index}>
            <h2 className="font-medium text-lg">{day.day}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {day?.plan?.map((place, index) => (
                <div key={index} className="my-3">
                  <h2 className="font-medium text-sm text-orange-600">
                    {place.time}
                  </h2>
                  <PlaceCardItem place={place} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacesToVisit;
