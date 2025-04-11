export const SelectTravelesList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A sole traveler seeking adventure and new experiences.",
    icon: "✈️",
    people: "1 person",
  },
  {
    id: 2,
    title: "Couple",
    desc: "A couple looking for a romantic getaway or a shared adventure.",
    icon: "💑",
    people: "2 people",
  },
  {
    id: 3,
    title: "Family",
    desc: "A family of 4 or more looking for a fun and memorable vacation.",
    icon: "👨‍👩‍👧‍👦",
    people: "3 to 5 people",
  },
  {
    id: 4,
    title: "Friends",
    desc: "A group of friends looking for a lively and exciting trip.",
    icon: "👯‍♂️",
    people: "5 to 10 people",
  },
];

export const SelectBudgetList = [
  {
    id: 1,
    title: "Cheap",
    desc: "Budget-friendly options for travelers on a tight budget.",
    icon: "💰",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Moderate options for travelers seeking a balance between affordability and comfort.",
    icon: "💸",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Luxury options for travelers looking for high-end experiences.",
    icon: "💎",
  },
];

export const AI_PROMPT =
  "Generate Travel Plan for Location: {Location} for {days} Days for {Couple} with a {budget} budget. Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time to travel each of the location for 3 days with each day plan with best time to visit in JSON format.";
