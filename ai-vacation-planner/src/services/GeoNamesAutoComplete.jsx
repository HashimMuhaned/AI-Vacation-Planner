// this is the autocomplete component for GeoNames API. It provides a text input field that fetches location suggestions as the user types. The component uses the Geoapify API to get autocomplete suggestions based on the user's input. It also handles loading states and click events outside the component to close the suggestions list.

import { useState, useEffect, useRef } from "react";
import axios from "axios";

const GeoNamesAutocomplete = ({ value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState(value?.label || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const wrapperRef = useRef(null);

  const USERNAME = import.meta.env.VITE_GEONAMES_USERNAME; // Required

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!touched && value?.label) return;

      if (inputValue.length > 2) {
        setLoading(true);
        axios
          .get("https://secure.geonames.org/searchJSON", {
            params: {
              q: inputValue,
              maxRows: 5,
              username: USERNAME,
              // featureClass: "P", // Only populated places
              style: "FULL",
            },
          })
          .then((res) => {
            setSuggestions(res.data.geonames || []);
            setLoading(false);
          })
          .catch((err) => {
            console.error("GeoNames Error:", err);
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
    const label = `${place.name}, ${place.adminName1 || ""}, ${place.countryName}`;
    const placeObj = {
      label,
      value: place.geonameId,
      coordinates: [parseFloat(place.lng), parseFloat(place.lat)],
    };
    onChange(placeObj);
    setInputValue(label);
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
          {suggestions.map((sugg) => (
            <li
              key={sugg.geonameId}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(sugg)}
            >
              {sugg.name}, {sugg.adminName1}, {sugg.countryName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GeoNamesAutocomplete;
