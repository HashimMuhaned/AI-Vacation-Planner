// it is not used
import { useEffect, useState } from "react";

export const useLoadGoogleMaps = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    // check if a script element for the Google Maps API has already been added to the document.
    const scriptExists = document.querySelector(
      // The document.querySelector method is used to search the DOM for the first <script> element whose src attribute contains the substring "maps.googleapis.com"
      "script[src*='maps.googleapis.com']"
    );

    // The function ensures that the Google Maps API is fully initialized before the application attempts to use its features
    const handleScriptLoad = () => {
      if (window.google) {
        // check if the global google object is present
        // Sometimes the global `google` object is present but Maps API not fully initialized
        try {
          // The function attempts to create an instance of the AutocompleteService class from the Google Maps Places API
          new window.google.maps.places.AutocompleteService();
          console.log("Google Maps API initialized!");
          setScriptLoaded(true);
        } catch (error) {
          console.warn("Google object exists but Maps Places not ready yet");
          setTimeout(handleScriptLoad, 100); // retry until ready
        }
      }
    };

    // If no such script exists (scriptExists is null), 
    // the code proceeds to dynamically create and append the script to the document.
    if (!scriptExists) {
      const script = document.createElement("script");
      // The script's src attribute is set to the Google Maps API URL, including the API key and the places library.
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_MAPS_API_KEY 
      }&libraries=places`;
      script.async = true; // Ensures the script is loaded asynchronously, preventing it from blocking the page rendering.
      script.defer = true; // Ensures the script is executed after the document has been parsed.
      script.onload = handleScriptLoad; // Calls the handleScriptLoad function once the script has loaded successfully.
      script.onerror = () => {
        console.error("Google Maps API failed to load");
        setScriptError(true);
      };
      document.body.appendChild(script);
    } else {
      if (window.google) {
        handleScriptLoad();
      } else {
        scriptExists.addEventListener("load", handleScriptLoad);
        scriptExists.addEventListener("error", () => {
          console.error("Existing Google Maps script failed to load");
          setScriptError(true);
        });
      }
    }
  }, []);

  return { scriptLoaded, scriptError };
};
