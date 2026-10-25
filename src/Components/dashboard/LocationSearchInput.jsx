import { useState, useEffect, useRef } from "react";

const LocationSearchInput = ({
  value,
  onChange,
  placeholder,
  useOpenStreetMap,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchSavedLocations = async (searchText) => {
    if (!searchText || searchText.length < 1) {
      setSuggestions([]);
      return;
    }
    try {
      const apiUrl = process.env.REACT_APP_API_URL
        ? (process.env.REACT_APP_API_URL.endsWith("/api")
            ? process.env.REACT_APP_API_URL + "/locations"
            : process.env.REACT_APP_API_URL + "/api/locations")
        : "https://transporterbt-2.onrender.com/api/locations";

      const response = await fetch(apiUrl);
      const data = await response.json();
      if (Array.isArray(data)) {
        const filteredLocations = data.filter((location) =>
          (location.LOCATION_NAME || location.location_name || "")
            ?.toLowerCase()
            .includes(searchText.toLowerCase())
        );
        setSuggestions(filteredLocations);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Saved locations search error:", error);
      // Fallback search in major Indian cities
      const fallbackCities = [
        "JAIPUR", "DELHI", "NOIDA", "FARIDABAD", "KANPUR",
        "GURUGRAM", "GHAZIABAD", "MUMBAI", "AHMEDABAD", "BENGALURU",
        "CHENNAI", "HYDERABAD", "KOLKATA", "PUNE", "LUCKNOW"
      ];
      const filtered = fallbackCities
        .filter((c) => c.toLowerCase().includes(searchText.toLowerCase()))
        .map((c, i) => ({ location_id: i + 1, location_name: c }));
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    }
  };

  const searchOpenStreetMap = async (searchText) => {
    if (!searchText || searchText.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchText
        )}&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("OpenStreetMap search error:", error);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (useOpenStreetMap) {
      searchOpenStreetMap(val);
    } else {
      searchSavedLocations(val);
    }
  };

  // Handle pressing Enter or leaving input field
  const handleInputConfirm = () => {
    if (inputValue && inputValue.trim()) {
      onChange(inputValue.trim());
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const locationString = useOpenStreetMap
      ? suggestion.display_name
      : (suggestion.LOCATION_NAME || suggestion.location_name);

    setInputValue(locationString);
    onChange(locationString);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const renderSuggestion = (suggestion) =>
    useOpenStreetMap ? (
      <div className="p-2 hover:bg-gray-100 cursor-pointer text-sm">
        {suggestion.display_name}
      </div>
    ) : (
      <div className="p-2 hover:bg-blue-50 cursor-pointer text-sm flex items-center justify-between">
        <span className="font-medium text-gray-800">
          {suggestion.LOCATION_NAME || suggestion.location_name}
        </span>
        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
          City
        </span>
      </div>
    );

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        className="w-full h-10 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputConfirm}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleInputConfirm();
        }}
        placeholder={placeholder}
        required
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, idx) => (
            <div
              key={
                useOpenStreetMap
                  ? suggestion.place_id
                  : (suggestion.LOCATION_ID || suggestion.location_id || idx)
              }
              onClick={() => handleSuggestionClick(suggestion)}
              className="cursor-pointer"
            >
              {renderSuggestion(suggestion)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearchInput;
