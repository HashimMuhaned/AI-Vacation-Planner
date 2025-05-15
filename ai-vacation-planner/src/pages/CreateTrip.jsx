import React, { useState, useEffect } from "react";
// import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Button } from "@/components/ui/button";
import { SelectBudgetList, SelectTravelesList } from "../constants/options";
import { showToast } from "@/components/ui/sonner";
import { createChatSession } from "@/services/AIModel.jsx";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useLoadGoogleMaps } from "@/services/GooglePlaceAutoComplete.jsx";
import LoginDialog from "@/components/custom/Dialog";
import { useAuth } from "@/context/GoogleAuth";
import { motion } from "motion/react";
// import LocationIQAutocomplete from "@/services/LocationIQAutoComplete";
// import GeoapifyAutocomplete from "@/services/GeoApifyAutoComplete";
// import OpenCageAutocomplete from "@/services/OpenCageAutoComplete";
import GeoNamesAutocomplete from "@/services/GeoNamesAutoComplete";
import { Calendar } from "@/components/ui/calendar";

const container = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

// calculate the number of days between two dates, typically used to determine the duration of a trip.
const calculateTripDays = (startDate, endDate) => {
  if (!startDate || !endDate) return "";

  // they are converted into JavaScript Date object
  const start = new Date(startDate);
  const end = new Date(endDate);

  // This resets the time portion of the dates to midnight (00:00:00)
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // The difference in time between the two dates is calculated in milliseconds
  // method returns the number of milliseconds for each date.
  // Subtracting the start date's time from the end date's time gives the total difference in milliseconds.
  const diff = end.getTime() - start.getTime();

  // The conversion factor (1000 * 60 * 60 * 24) represents the number of milliseconds in a day.
  //  function is used to round up to the nearest whole number, ensuring that partial days are counted as full days.
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  // If the number of days is zero or greater, it converts the result to a string and returns it.
  // If the result is negative (indicating that the end date is earlier than the start date), it returns an empty string ("").
  return days >= 0 ? days.toString() : "";
};

const CreateTrip = () => {
  const [place, setPlace] = useState(() => {
    const savedPlace = localStorage.getItem("place");
    return savedPlace ? JSON.parse(savedPlace) : null;
  });

  const [from, setFrom] = useState(() => {
    const savedFrom = localStorage.getItem("from");
    return savedFrom ? JSON.parse(savedFrom) : null;
  });
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("formData");
    return saved ? JSON.parse(saved) : {};
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFlight, setLoadingFlight] = useState(false);
  const [date, setDate] = useState(() => {
    try {
      const saved = localStorage.getItem("date");
      if (saved) {
        const parsed = new Date(JSON.parse(saved)); // Sun Oct 01 2023 00:00:00 GMT+0000

        // if it not a number, it means the date is invalid
        return isNaN(parsed.getTime()) ? null : parsed;
      }
    } catch (error) {
      console.error("Invalid date in localStorage", error);
    }
    return null;
  });
  const [returnDate, setReturnDate] = useState(() => {
    try {
      const saved = localStorage.getItem("returnDate");
      if (saved) {
        const parsed = new Date(JSON.parse(saved));

        // if it not a number, it means the date is invalid
        return isNaN(parsed.getTime()) ? null : parsed;
      }
    } catch (error) {
      console.error("Invalid returnDate in localStorage", error);
    }
    return null;
  });
  const navigate = useNavigate();
  const { scriptLoaded, scriptError } = useLoadGoogleMaps();
  const { user } = useAuth();

  useEffect(() => {
    // This function calculates the number of days between the two dates and returns the result.
    const days = calculateTripDays(date, returnDate);
    // { ...prev } copies all key-value pairs from prev into a new object.
    //  Then days is added or updated:
    setFormData((prev) => ({ ...prev, days }));

    localStorage.setItem("date", JSON.stringify(date));
    localStorage.setItem("returnDate", JSON.stringify(returnDate));

    if (days && Number(days) > 5) {
      showToast(
        "white",
        "red",
        "Please select a maximum of 5 days for your trip."
      );
    }
  }, [date, returnDate]);

  useEffect(() => {
    if (place) {
      localStorage.setItem("place", JSON.stringify(place));
    }
    if (from) {
      localStorage.setItem("from", JSON.stringify(from));
    }
  }, [place, from]);

  useEffect(() => {
    if (date) {
      localStorage.setItem("date", JSON.stringify(date));
    } else {
      localStorage.removeItem("date");
    }
  }, [date]);

  useEffect(() => {
    if (returnDate) {
      localStorage.setItem("returnDate", JSON.stringify(returnDate));
    } else {
      localStorage.removeItem("returnDate");
    }
  }, [returnDate]);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Google recommends loading the Maps JavaScript API asynchronously for better performance. Below is the approach
  // if the script is not loaded or there is an error, show an error message
  if (scriptError) {
    return (
      <div>Failed to load Google Maps. Please refresh or try again later.</div>
    );
  }

  if (!scriptLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  const saveTrip = async (tripData, docId) => {
    if (!user) {
      showToast("white", "red", "You must be logged in to save a trip.");
      return;
    }

    try {
      await setDoc(doc(db, "Trips", docId), {
        docId,
        userSelection: formData,
        tripData,
        userEmail: user.email,
        userId: user.uid,
        FlightDetailes: {
          departurePlace: from,
          destination: place,
          departureDate: date,
          return: returnDate,
        },
      });

      console.log("✅ Trip saved:", docId);
      showToast("white", "green", "Trip saved successfully!");
      navigate(`/view-trip/${docId}`);

      // Cleanup
      localStorage.setItem("tripDocId", docId);
      localStorage.removeItem("formData");
      localStorage.removeItem("place");
      localStorage.removeItem("from");
      localStorage.removeItem("date");
      localStorage.removeItem("returnDate");
      setFormData({});
      setPlace(null);
      setFrom(null);
    } catch (error) {
      console.error("❌ Error saving trip:", error);
    }
  };

  // Function to clean the JSON string by removing invisible characters and formatting issues that is coming from the AI response
  function cleanJsonString(str) {
    if (!str || typeof str !== "string") return str;

    let cleaned = str
      .replace(/^\uFEFF/, "") // Remove BOM if it exists
      .normalize("NFKC") // Normalize characters
      .replace(
        /[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202F\uFEFF\u00A0]/g,
        ""
      ) // Remove hidden junk
      .replace(/“|”/g, '"') // Convert curly quotes
      .replace(/‘|’/g, "'") // Convert curly apostrophes
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 🧠 Smart fix: Remove last brace if too many
    const openCount = (cleaned.match(/{/g) || []).length;
    const closeCount = (cleaned.match(/}/g) || []).length;

    if (closeCount > openCount) {
      cleaned = cleaned.replace(/}$/, ""); // Just one extra? Trim it off.
      console.warn("⚠️ Auto-fixed extra closing brace at the end.");
    }

    return cleaned;
  }

  // Want to see what exactly is breaking your JSON?
  function logWeirdChars(str) {
    const weirdChars = [...str].filter(
      (c) => c.charCodeAt(0) < 0x20 || c.charCodeAt(0) > 0x7e
    );
    const unique = [...new Set(weirdChars)];
    if (unique.length === 0) {
      console.log("✅ No weird characters found.");
    } else {
      console.log(
        "⚠️ Weird characters found:",
        unique.map((c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`)
      );
    }
  }

  function testJsonParsing(rawStr) {
    const cleaned = cleanJsonString(rawStr);
    console.log("🔍 CLEANED STRING START ---\n", cleaned, "\n--- END");

    try {
      const parsed = JSON.parse(cleaned);
      console.log("✅ JSON is valid!");
      return parsed;
    } catch (err) {
      console.error("❌ JSON Parse Error:", err.message);

      // Log the character near the error
      const errMatch = err.message.match(/position (\d+)/);
      if (errMatch) {
        const pos = parseInt(errMatch[1]);
        const snippet = cleaned.slice(pos - 10, pos + 10);
        console.log(`📍 Problem near position ${pos}: ...${snippet}...`);
      }
    }
  }

  function safeParseJson(input) {
    if (typeof input !== "string") {
      console.warn(
        "⚠️ You passed a non-string to JSON.parse. Auto-stringifying it..."
      );
      input = JSON.stringify(input);
    }

    try {
      return JSON.parse(input);
    } catch (err) {
      console.error("❌ JSON Parse Error:", err.message);
      const pos = err.message.match(/position (\d+)/);
      if (pos) {
        const i = parseInt(pos[1]);
        console.log(`📍 Around error:`, input.slice(i - 10, i + 10));
      }
      throw err;
    }
  }

  const generateTrip = async (docId) => {
    setLoading(true);

    const userString = localStorage.getItem("user");
    if (!userString) {
      setOpenDialog(true);
      showToast("white", "red", "Please login to continue.");
      setLoading(false);
      return;
    }

    const AI_PROMPT = `
      You are an expert travel planner AI.

You are given the following user preferences:
- Location: ${formData?.place}
- Duration: ${formData?.days} days
- Budget: ${formData?.budget}
- Number of travelers: ${formData?.travelers}

Your task is to generate a complete and detailed travel plan **in valid JSON format only** (no explanations or non-JSON output).

---

📌 **What to Include:**

1. **Hotel Suggestions** (5-7 options):
   Each hotel must include:
   - hotelName (string)
   - address (string)
   - price (string, e.g., "$50/night")
   - imageUrl (string)
   - rating (string, e.g., "4.2")
   - description (string)

2. **Daily Itinerary** (for ${formData?.days} days):
   For each day, include a (4-6 options) of places to visit. Each place must contain:
   - placeName (string)
   - placeDetails (string)
   - imageUrl (string)
   - ticketPricing (string)
   - rating (string)
   - travelTime (string, e.g., "20 mins")
   - bestTimeToVisit (string)

   Each place must also list 3-6 nearby restaurants with:
   - restaurantName (string)
   - restaurantDetails (string)
   - restaurantRating (string)
   - restaurantType (an array of 1 object with 4 boolean flags):
     - Vegetarian (boolean)
     - Halal (boolean)
     - Non-Vegetarian (boolean)
     - Dessert (boolean)

---

📌 **Important Notes:**
- Respond with **ONLY valid JSON** — no extra text or explanations.
- Ensure the output is **parsable** and syntactically valid.
- Double-check for:
  - Balanced braces '{}' (equal opening and closing)
  - Valid JSON structure and property types
  - No trailing commas or syntax errors
- If the output has an extra closing brace at the end, **trim it**.
- All strings must be wrapped in double quotes '" "'.

---

📦 **Expected Output Format (strictly follow this):**

        json
        {
          "docId": "id",
          "tripData": {
            "travelPlan": {
              "budget": NUMBER,
              "duration": NUMBER,
              "hotels": [
                {
                  "hotelName": "STRING",
                  "address": "STRING",
                  "price": "STRING",
                  "imageUrl": "STRING",
                  "rating": "STRING",
                  "description": "STRING"
                }
              ],
              "itinerary": [
                {
                  "day": "STRING",
                  "plan": [
                    {
                      "placeName": "STRING",
                      "placeDetails": "STRING",
                      "imageUrl": "STRING",
                      "ticketPricing": "STRING",
                      "rating": "STRING",
                      "travelTime": "STRING",
                      "bestTimeToVisit": "STRING",
                      "restaurants": [
                        {
                          "restaurantName": "STRING",
                          "restaurantDetails": "STRING",
                          "restaurantRating": "STRING",
                          "restaurantType": {
                              "Vegetarian": BOOLEAN,
                              "Halal": BOOLEAN,
                              "Non-Vegetarian": BOOLEAN,
                              "Dessert": BOOLEAN
                            }
                        }
                      ]
                    }
                  ]
                }
              ],
              "location": "STRING",
              "travelers": "STRING"
            }
          },
          "userEmail": ${user.email},
          "userSelection": {
            "budget": NUMBER,
            "days": "STRING",
            "place": "STRING",
            "travelers": "STRING",
            "startingDate": ${formData?.date},
            "returnDate": ${formData?.returnDate},
            "origin": "${formData?.label}",
            "destination": "${place?.label}"
          }
        }
  
    `;

    try {
      const chatSession = await createChatSession("gemini-2.0-flash");
      const result = await chatSession.sendMessage(AI_PROMPT);
      const rawTripData = result?.response?.text();

      // Debugging: Check for weird characters and JSON parsing issues
      logWeirdChars(rawTripData); // Optional debug
      // Debugging: Check for JSON parsing issues
      testJsonParsing(rawTripData); // Optional debug

      // Clean the JSON string to remove any unwanted characters and format it correctly
      const cleaned = cleanJsonString(rawTripData);

      console.log("✅ Raw Trip Data:", cleaned);

      // Parse the cleaned JSON string into a JavaScript object
      const parsedTripData = await safeParseJson(cleaned);
      console.log("✅ Cleaned & Parsed Trip Data:", parsedTripData);
      // Save the trip data to Firestore
      await saveTrip(parsedTripData, docId); // Save trip data to Firestore
    } catch (error) {
      console.error("❌ Failed to generate or parse trip data:", error);
      showToast("white", "red", "Something went wrong generating the trip.");
    } finally {
      setLoading(false);
    }
  };

  const saveFlightDetails = async (flightDetailsData, tripDocId) => {
    try {
      // Check if the tripDocId is available
      if (!tripDocId) {
        console.error("Trip ID not found in localStorage");
        throw new Error("Trip must be generated before saving flight details.");
      }

      await setDoc(doc(db, "FlightDetails", tripDocId), {
        tripId: tripDocId,
        userEmail: user.email,
        userId: user.uid,
        flightDetails: flightDetailsData,
        createdAt: new Date().toISOString(),
      });

      console.log("✅ Flight details saved successfully!");
    } catch (error) {
      console.error("❌ Error saving flight details:", error);
      throw error;
    }
  };

  const generateFLightDetails = async (docId) => {
    setLoadingFlight(true);

    const userString = localStorage.getItem("user");
    if (!userString) {
      showToast("white", "red", "Please login to continue.");
      setLoading(false);
      return;
    }

    const AI_PROMPT = `
        You are an expert Flight Deals.
  
        You are given the following user preferences:
        - Origin: ${from}
        - Destination: ${place}
        - Departure Date: ${date}
        - Return Date: ${returnDate}
        
        I am traveling from ${from} to ${place} on the Date ${date}, and I am coming back at ${returnDate}. I want you to give me 4 different Flight options with the timing, airport name, ticket price, and the link to book from.
        
        
        **Expected Output Format (strictly follow this):**
        
        {
        "flights": [
          {
            "departure_date": ${date},
            "return_date": ${returnDate},
            "origin": ${from},
            "destination": ${place},
            "options": [
              {
                "airline_name": "string",
                "departure_airport": "string",
                "arrival_airport": "string",
                "departure_time": "string",
                "arrival_time": "string",
                "return_departure_time": "string",
                "return_arrival_time": "string",
                "estimated_ticket_price": "string",
                "stops": "string",
                "booking_link": "string",
                "notes": "string"
              }
            ]
          }
        ],
      }
      `;

    try {
      const chatSession = await createChatSession("gemini-1.5-flash-8b");
      const result = await chatSession.sendMessage(AI_PROMPT);
      const rawTripData = result?.response?.text();

      // Debugging: Check for weird characters and JSON parsing issues
      const cleaned = cleanJsonString(rawTripData); // optional debug

      // Debugging: Check for JSON parsing issues
      const parsedFlightData = safeParseJson(cleaned); // optional debug

      await saveFlightDetails(parsedFlightData, docId); // ✅ use same docId
      // setHasGenerated(true);
    } catch (error) {
      console.error("❌ Failed to generate or parse trip data:", error);
      showToast("white", "red", "Something went wrong generating the trip.");
    } finally {
      setLoadingFlight(false);
    }
  };

  return (
    <motion.div
      className="sm:px-10 md:px-20 lg:px-56 xl:px-72 px-5 my-30"
      variants={container} // animation variants
      initial="hidden" // initial state for the animation
      animate="visible" // animate to the visible state
    >
      <motion.h2 variants={item} className="font-bold text-3xl">
        Tell us your travel preferences 🏕️🌴
      </motion.h2>

      <motion.p variants={item} className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </motion.p>

      <div className="mt-20 flex flex-col gap-9">
        {/* <motion.div variants={item}>
          <h2 className="text-xl my-3 font-medium">From Where ?</h2>
          {scriptError ? (
            <div className="text-red-500">
              Failed to load Google Maps. Please refresh the page or check your
              connection.
            </div>
          ) : !scriptLoaded ? (
            <div className="text-gray-600">Loading Google Places...</div>
          ) : (
            <GooglePlacesAutocomplete
              selectProps={{
                value: from,
                onChange: (v) => {
                  setFrom(v);
                  handleInputChange("from", v.label);
                },
                placeholder: "Search for a place",
              }}
            />
          )}
        </motion.div> */}
        {/* <motion.div variants={item}>
          <h2 className="text-xl my-3 font-medium">
            From Where ? (LocationIQ)
          </h2>
          <LocationIQAutocomplete
            value={from}
            onChange={(v) => {
              setFrom(v);
              handleInputChange("from", v.label);
            }}
            placeholder="Search for a place"
          />
        </motion.div> */}
        <motion.div variants={item}>
          <h2 className="text-xl my-3 font-medium">From Where ? (GeoNames)</h2>
          {/* place names autocomplete API, (GeoNames) */}
          <GeoNamesAutocomplete
            value={from}
            onChange={(v) => {
              setFrom(v);
              handleInputChange("from", v.label);
            }}
            placeholder="Search for a place"
          />
        </motion.div>
        {/* <motion.div variants={item}>
          <h2 className="text-xl my-3 font-medium">From Where ? (GeoApify)</h2>
          <GeoapifyAutocomplete
            value={from}
            onChange={(v) => {
              setFrom(v);
              handleInputChange("from", v.label);
            }}
            placeholder="Search for a place"
          />
        </motion.div> */}
        {/* <motion.div variants={item}>
          <h2 className="text-xl my-3 font-medium">From Where ? (OpenCage)</h2>
          <OpenCageAutocomplete
            value={from}
            onChange={(v) => {
              setFrom(v);
              handleInputChange("from", v.label);
            }}
            placeholder="Search for a place"
          />
        </motion.div> */}

        <motion.div variants={item}>
          <h2 className="text-xl my-3 font-medium">
            What is your destination of choice ?
          </h2>
          {/* place names autocomplete API, (GeoNames) */}
          <GeoNamesAutocomplete
            value={place}
            onChange={(v) => {
              setPlace(v);
              handleInputChange("place", v.label);
            }}
            placeholder="Search for a place"
          />
        </motion.div>

        <motion.div variants={item}>
          <h2 className="text-xl my-3 font-medium">
            {formData?.days
              ? `total trip days: ${formData?.days}`
              : "select start and end date from the calendar below"}
          </h2>
        </motion.div>

        <motion.div>
          <div className="flex flex-col md:flex-row gap-20 items-center">
            <motion.div variants={item}>
              <h2 className="text-xl my-3 font-medium">starting Date</h2>
              {/* chadcn component Calender */}
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </motion.div>
            <motion.div variants={item}>
              <h2 className="text-xl my-3 font-medium">Ending Date</h2>
              {/* chadcn component Calender */}
              <Calendar
                mode="single"
                selected={returnDate}
                onSelect={setReturnDate}
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <h2 className="text-xl my-3 font-medium">
            What is your travel budget?
          </h2>
          <div className="grid grid-cols-2 md:grid-3 gap-5 mt-5">
            {SelectBudgetList.map((item, index) => (
              <motion.div
                variants={item}
                key={index}
                onClick={() => handleInputChange("budget", item.title)} // update the budget in formData
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg ${
                  // if the budget in formData matches the current item title, apply additional styles
                  formData?.budget === item.title && "shadow-lg border-black" // highlight selected budget
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="text-lg font-bold">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item}>
          <h2 className="text-xl my-3 font-medium">
            Who do you plan on traveling with on your next adventure ?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {SelectTravelesList.map((item, index) => (
              <motion.div
                variants={item}
                key={index}
                onClick={() => handleInputChange("travelers", item.people)} // update the travelers in formData
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg ${
                  formData?.travelers === item.people && // highlight selected travelers
                  // if the travelers in formData matches the current item people, apply additional styles
                  "shadow-lg border-black"
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="text-lg font-bold">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.desc}</p>
                <p className="text-sm text-gray-500 font-bold">{item.people}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div variants={item} className="my-10 flex justify-end">
        <Button
          onClick={async () => {
            const newTripDocId = Date.now().toString(); // always generate a fresh ID
            await generateTrip(newTripDocId); // passing the new ID to generateTrip
            await generateFLightDetails(newTripDocId); // passing the new ID to generateFLightDetails
          }}
          disabled={loading}
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <AiOutlineLoading3Quarters className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            "Generate Itinerary"
          )}
        </Button>
      </motion.div>

      <LoginDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </motion.div>
  );
};

export default CreateTrip;
