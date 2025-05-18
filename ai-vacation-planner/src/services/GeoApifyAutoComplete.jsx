// It is not in use, but it is a good example of how to use the Geoapify API for autocomplete functionality.

import { useState, useEffect, useRef } from "react";
import axios from "axios";

const GeoapifyAutocomplete = ({ value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState(value?.label || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const wrapperRef = useRef(null);

  const GEOAPIFY_API_KEY = process.env.VITE_GEOAPIFY_API_KEY;

  useEffect(() => {
    // This debounce mechanism ensures that the API call is only made after the user has stopped typing for 300ms
    const delayDebounce = setTimeout(() => {
      // The hook first checks whether the input field has been interacted with (touched) and whether a valid value already exists (value?.label)
      if (!touched && value?.label) return;

      if (inputValue.length > 2) {
        setLoading(true);
        axios
          .get("https://api.geoapify.com/v1/geocode/autocomplete", {
            params: {
              text: inputValue, // The query string (user's input).
              apiKey: GEOAPIFY_API_KEY,
              limit: 5, // Limits the number of results to 5.
              lang: "en",
            },
          })
          .then((res) => {
            // On a successful response, the setSuggestions function updates the state with the list of suggestions
            setSuggestions(res.data.features || []);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Geoapify Error:", err);
            setLoading(false);
          });
      } else {
        // If the input value is less than three characters long, the suggestions are cleared
        setSuggestions([]);
      }
    }, 300);

    // The clearTimeout function in the cleanup function ensures that any pending timeout is canceled if the component re-renders before the delay is complete
    return () => clearTimeout(delayDebounce);
  }, [inputValue, touched]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setTouched(true);
  };

  const handleSelect = (place) => {
    const placeObj = {
      label: place.properties.formatted, //  A human-readable, formatted address for the location, retrieved from place.properties.formatted
      value: place.properties.place_id, // A unique identifier for the location, retrieved from place.properties.place_id
      coordinates: place.geometry.coordinates, // his can be used for further lookups or API calls.coordinates
    };
    onChange(placeObj);
    setInputValue(place.properties.formatted); // Update the input value to the selected suggestion
    setTouched(false);
    setSuggestions([]); // Clear suggestions after selection
  };

  // The handleClickOutside function is used to close the suggestions list when a click occurs outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current && // refers to the DOM element that wraps the autocomplete component (the input field and dropdown).
        !wrapperRef.current.contains(event.target)
      ) {
        // If the clicked element is outside the wrapperRef
        setSuggestions([]); // the setSuggestions([]) function is called to clear the list of suggestions.
      }
    };
    document.addEventListener("mousedown", handleClickOutside); // This allows the component to detect clicks anywhere on the page
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        className="w-full border border-gray-300 px-4 py-2 rounded"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
      {loading && (
        <div className="absolute left-2 top-full mt-1 text-sm">Loading...</div>
      )}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border mt-1 w-full max-h-60 overflow-auto rounded shadow">
          {suggestions.map((sugg, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(sugg)}
            >
              {sugg.properties.formatted}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GeoapifyAutocomplete;
