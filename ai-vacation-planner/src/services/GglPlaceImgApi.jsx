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

export const getCountryImage = async (countryName) => {
  try {
    const enhancedQuery = `${countryName} top scenic tourist destinations`; // Add more context to the query

    const response = await axios.post(
      "https://places.googleapis.com/v1/places:searchText",
      {
        textQuery: enhancedQuery,
        maxResultCount: 5,
        languageCode: "en",
        includedType: "tourist_attraction",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": import.meta.env.VITE_MAPS_API_KEY,
          "X-Goog-FieldMask": "places.displayName,places.photos,places.id",
        },
      }
    );

    const places = response.data.places || [];

    // Extract photo URLs from results
    const photoUrls = places
      .flatMap((place) => place.photos || []) // For each place, this grabs the photos array.
      // If photos doesn't exist, it defaults to an empty array.
      // flattens the result into a single array of all photo objects from all places.
      .map((photo) => {
        return `https://places.googleapis.com/v1/${
          photo.name
        }/media?maxHeightPx=900&maxWidthPx=900&key=${
          import.meta.env.VITE_MAPS_API_KEY
        }`;
      });

    return photoUrls;
  } catch (error) {
    console.error("❌ Failed to fetch country images:", error);
    return [];
  }
};

export const getCountryImagesUnSplash = async (placeId) => {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    placeId
  )}&client_id=${
    import.meta.env.VITE_UNSPLASH_ACCESS_KEY
  }&per_page=10&orientation=landscape`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results.map(
        (result) => `${result.urls.raw}&w=800&h=400&fit=crop`
      );
    } else {
      console.warn("No images found for:", placeId);
      return [];
    }
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return [];
  }
};
