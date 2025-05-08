// It is not in use, but it is a good example of how to use the Geoapify API for autocomplete functionality.

import { useState, useEffect, useRef } from "react";
import axios from "axios";

const GeoapifyAutocomplete = ({ value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState(value?.label || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const wrapperRef = useRef(null);

  const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!touched && value?.label) return;

      if (inputValue.length > 2) {
        setLoading(true);
        axios
          .get("https://api.geoapify.com/v1/geocode/autocomplete", {
            params: {
              text: inputValue,
              apiKey: GEOAPIFY_API_KEY,
              limit: 5,
              lang: "en",
            },
          })
          .then((res) => {
            setSuggestions(res.data.features || []);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Geoapify Error:", err);
            setLoading(false);
          });
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [inputValue, touched]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setTouched(true);
  };

  const handleSelect = (place) => {
    const placeObj = {
      label: place.properties.formatted,
      value: place.properties.place_id,
      coordinates: place.geometry.coordinates,
    };
    onChange(placeObj);
    setInputValue(place.properties.formatted);
    setTouched(false);
    setSuggestions([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
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
              {sugg.properties.formatted}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GeoapifyAutocomplete;
