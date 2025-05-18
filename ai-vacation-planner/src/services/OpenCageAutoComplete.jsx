// it is not used in the project.

import { useState, useEffect, useRef } from "react";
import axios from "axios";

const OpenCageAutocomplete = ({ value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState(value?.label || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const wrapperRef = useRef(null); // For detecting outside clicks

  const OPENCAGE_API_KEY = process.env.VITE_OPENCAGE_API_KEY; // Replace this with your API key

  useEffect(() => {
    // This debounce mechanism ensures that the API call is only made after the user has stopped typing for 300ms
    const delayDebounce = setTimeout(() => {
      // The hook first checks whether the input field has been interacted with (touched) and whether a valid value already exists (value?.label)
      if (!touched && value?.label) return;
      if (inputValue.length > 2) {
        setLoading(true);
        axios
          .get("https://api.opencagedata.com/geocode/v1/json", {
            params: {
              key: OPENCAGE_API_KEY,
              q: inputValue, // The query string (user's input).
              limit: 5,
              language: "en",
            },
          })
          .then((res) => {
            // On a successful response, the setSuggestions function updates the state with the list of suggestions
            setSuggestions(res.data.results || []);
            setLoading(false);
          })
          .catch((err) => {
            console.error("OpenCage error:", err);
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
      label: place.formatted,
      value: `${place.geometry.lat},${place.geometry.lng}`, // Concatenate latitude and longitude
    };
    onChange(placeObj);
    setInputValue(place.formatted);
    setTouched(false);
    setSuggestions([]);
  };

  // 🔍 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current && // refers to the DOM element that wraps the autocomplete component (the input field and dropdown).
        !wrapperRef.current.contains(event.target) // If the clicked element is outside the wrapperRef
      ) {
        // the setSuggestions([]) function is called to clear the list of suggestions.
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
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
              {sugg.formatted}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OpenCageAutocomplete;
