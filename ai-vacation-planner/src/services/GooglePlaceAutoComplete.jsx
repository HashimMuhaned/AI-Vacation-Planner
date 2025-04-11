import { useEffect, useState } from "react";

export const useLoadGoogleMaps = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    const scriptExists = document.querySelector(
      "script[src*='maps.googleapis.com']"
    );

    const handleScriptLoad = () => {
      if (window.google) {
        // Sometimes the global `google` object is present but Maps API not fully initialized
        try {
          new window.google.maps.places.AutocompleteService();
          console.log("Google Maps API initialized!");
          setScriptLoaded(true);
        } catch (error) {
          console.warn("Google object exists but Maps Places not ready yet");
          setTimeout(handleScriptLoad, 100); // retry until ready
        }
      }
    };

    if (!scriptExists) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_MAPS_API_KEY
      }&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = handleScriptLoad;
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
