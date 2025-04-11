import axios from "axios";

// const BASE_URL

export const getPlaceImage = async (textQuery) => {
  return axios.post(
    "https://places.googleapis.com/v1/places:searchText",
    {
      textQuery, // must be a key in an object
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": import.meta.env.VITE_MAPS_API_KEY,
        "X-Goog-FieldMask": "places.displayName,places.photos,places.id", // Should be a string, not an array
      },
    }
  );
};
