// this is the autocomplete component for GeoNames API. It provides a text input field that fetches location suggestions as the user types. The component uses the Geoapify API to get autocomplete suggestions based on the user's input. It also handles loading states and click events outside the component to close the suggestions list.

import { useState, useEffect, useRef } from "react";
import axios from "axios";

const GeoNamesAutocomplete = ({ value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState(value?.label || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const wrapperRef = useRef(null);

  const USERNAME = process.env.VITE_GEONAMES_USERNAME; // Required

  useEffect(() => {
    // This debounce mechanism ensures that the API call is only made after the user has stopped typing for 300ms
    const delayDebounce = setTimeout(() => {
      // The hook first checks whether the input field has been interacted with (touched) and whether a valid value already exists (value?.label)
      if (!touched && value?.label) return;

      if (inputValue.length > 2) {
        setLoading(true);
        axios
          .get("https://secure.geonames.org/searchJSON", {
            params: {
              q: inputValue, // The query string (user's input).
              maxRows: 5, // Limits the number of results to 5.
              username: USERNAME, // The GeoNames API username for authentication
              featureClass: "P", // Only populated places
              style: "FULL", // Specifies the level of detail in the response (FULL for detailed results).
            },
          })
          .then((res) => {
            // On a successful response, the setSuggestions function updates the state with the list of suggestions
            setSuggestions(res.data.geonames || []);
            setLoading(false);
          })
          .catch((err) => {
            console.error("GeoNames Error:", err);
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
    // The function begins by constructing a human-readable label for the selected location
    const label = `${place.name}, ${place.countryName}`;
    const placeObj = {
      label, // The formatted label for the location.
      value: place.geonameId, // The unique GeoNames ID of the location
      // coordinates: [parseFloat(place.lng), parseFloat(place.lat)],
    };
    onChange(placeObj);
    setInputValue(label);
    setTouched(false);
    setSuggestions([]); // The setSuggestions function is called with an empty array to clear the list of suggestions
  };

  // The handleClickOutside function is used to close the suggestions list when a click occurs outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current && // refers to the DOM element that wraps the autocomplete component (the input field and dropdown).
        !wrapperRef.current.contains(event.target) // If the clicked element is outside the wrapperRef
      ) {
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
          {suggestions.map((sugg) => (
            <li
              key={sugg.geonameId}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(sugg)}
            >
              {sugg.name}, {sugg.countryName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GeoNamesAutocomplete;
