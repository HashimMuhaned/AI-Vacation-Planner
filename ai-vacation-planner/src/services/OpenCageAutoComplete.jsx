// it is not used in the project.

import { useState, useEffect, useRef } from "react";
import axios from "axios";

const OpenCageAutocomplete = ({ value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState(value?.label || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const wrapperRef = useRef(null); // For detecting outside clicks

  const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY; // Replace this with your API key

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!touched && value?.label) return;
      if (inputValue.length > 2) {
        setLoading(true);
        axios
          .get("https://api.opencagedata.com/geocode/v1/json", {
            params: {
              key: OPENCAGE_API_KEY,
              q: inputValue,
              limit: 5,
              language: "en",
            },
          })
          .then((res) => {
            setSuggestions(res.data.results || []);
            setLoading(false);
          })
          .catch((err) => {
            console.error("OpenCage error:", err);
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
      label: place.formatted,
      value: `${place.geometry.lat},${place.geometry.lng}`,
    };
    onChange(placeObj);
    setInputValue(place.formatted);
    setTouched(false);
    setSuggestions([]);
  };

  // 🔍 Close dropdown on outside click
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
              {sugg.formatted}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OpenCageAutocomplete;
