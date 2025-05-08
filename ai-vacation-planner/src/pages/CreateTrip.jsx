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
import LocationIQAutocomplete from "@/services/LocationIQAutoComplete";
import GeoapifyAutocomplete from "@/services/GeoApifyAutoComplete";
import OpenCageAutocomplete from "@/services/OpenCageAutoComplete";
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

const calculateTripDays = (startDate, endDate) => {
  if (!startDate || !endDate) return "";

  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diff = end.getTime() - start.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

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
        const parsed = new Date(JSON.parse(saved));
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
    const days = calculateTripDays(date, returnDate);
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
    try {
      await setDoc(doc(db, "Trips", docId), {
        docId,
        userSelection: formData,
        tripData,
        userEmail: user.email,
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

  const saveEverything = async (tripData, flightData) => {
    setLoading(true);
    const tripDocId = Date.now().toString(); // One consistent ID

    try {
      await saveTrip(tripData, tripDocId); // Use same ID
      await saveFlightDetails(flightData, tripDocId); // Use same ID
      showToast("white", "green", "Trip and flight saved successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error saving:", error);
      showToast("white", "red", "Something went wrong saving your data.");
    } finally {
      setLoading(false);
    }
  };

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

      logWeirdChars(rawTripData); // Optional debug
      testJsonParsing(rawTripData); // Optional debug

      const cleaned = cleanJsonString(rawTripData);

      console.log("✅ Raw Trip Data:", cleaned);

      const parsedTripData = await safeParseJson(cleaned); // ✅ Use safeParseJson here
      console.log("✅ Cleaned & Parsed Trip Data:", parsedTripData);
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
      if (!tripDocId) {
        console.error("Trip ID not found in localStorage");
        throw new Error("Trip must be generated before saving flight details.");
      }

      await setDoc(doc(db, "FlightDetails", tripDocId), {
        tripId: tripDocId,
        userEmail: "hashimcode123@gmail.com",
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
            "departure_date": $${date},
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
      const chatSession = await createChatSession("gemini-1.5-pro");
      const result = await chatSession.sendMessage(AI_PROMPT);
      const rawTripData = result?.response?.text();

      const cleaned = cleanJsonString(rawTripData);
      const parsedFlightData = safeParseJson(cleaned);

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
      variants={container}
      initial="hidden"
      animate="visible"
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
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </motion.div>
            <motion.div variants={item}>
              <h2 className="text-xl my-3 font-medium">Ending Date</h2>
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
                onClick={() => handleInputChange("budget", item.title)}
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg ${
                  formData?.budget === item.title && "shadow-lg border-black"
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
                onClick={() => handleInputChange("travelers", item.people)}
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg ${
                  formData?.travelers === item.people &&
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
            // localStorage.setItem("tripDocId", newTripDocId);
            await generateTrip(newTripDocId);
            await generateFLightDetails(newTripDocId);
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
