import React, { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectBudgetList, SelectTravelesList } from "../constants/options";
import { showToast } from "@/components/ui/sonner";
import { chatSession } from "@/services/AIModel.jsx";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/services/FirebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useLoadGoogleMaps } from "@/services/GooglePlaceAutoComplete.jsx";
import LoginDialog from "@/components/custom/Dialog";
import { useAuth } from "@/context/GoogleAuth";

const CreateTrip = () => {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { scriptLoaded, scriptError } = useLoadGoogleMaps();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email && formData !== null) {
      localStorage.setItem(`formData-${user.email}`, JSON.stringify(formData));
    }
  }, [formData, user]);

  useEffect(() => {
    if (user?.email && place !== null) {
      localStorage.setItem(`place-${user.email}`, JSON.stringify(place));
    }
  }, [place, user]);

  useEffect(() => {
    if (user?.email) {
      const savedFormData = localStorage.getItem(`formData-${user.email}`);
      const savedPlace = localStorage.getItem(`place-${user.email}`);

      if (savedFormData) {
        setFormData(JSON.parse(savedFormData));
      }

      if (savedPlace) {
        setPlace(JSON.parse(savedPlace));
      }

      setDataLoaded(true); // allow rendering
    }
  }, [user]);

  const handleInputChange = (name, value) => {
    if (name === "days" && value > 5) {
      showToast(
        "white",
        "red",
        "Please select a maximum of 5 days for your trip."
      );
      return;
    }

    setFormData({ ...formData, [name]: value }); // Update formData with the new input value
  };

  // Google recommends loading the Maps JavaScript API asynchronously for better performance. Below is the approach
  // if the script is not loaded or there is an error, show an error message
  if (scriptError) {
    return (
      <div>Failed to load Google Maps. Please refresh or try again later.</div>
    );
  }

  if (!scriptLoaded || !dataLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  const saveTrip = async (tripData) => {
    try {
      const docId = Date.now().toString(); // Generate a unique document ID

      // Ensure tripData is stored as an object
      await setDoc(doc(db, "Trips", docId), {
        docId: docId,
        userSelection: formData,
        tripData,
        userEmail: user?.email,
      });

      showToast("white", "green", "Trip saved successfully!");
      navigate(`/view-trip/${docId}`);

      console.log("Trip saved successfully!");
      localStorage.removeItem(`formData-${user.email}`);
      localStorage.removeItem(`place-${user.email}`);
      setFormData({});
      setPlace(null);
    } catch (error) {
      console.error("Error saving trip:", error);
    }
  };

  const generateTrip = async () => {
    setLoading(true);

    const userString = localStorage.getItem("user");
    if (!userString) {
      setOpenDialog(true);
      showToast("white", "red", "Please login to continue.");
      setLoading(false);
      return;
    }

    const AI_PROMPT = `Generate Travel Plan for Location: ${formData?.place} for ${formData?.days} Days for ${formData?.travelers} with a ${formData?.budget} budget.
      Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, 
      and Time to travel each of the location for ${formData?.days} days with each day plan with best time to visit.
      Respond with only the JSON. Do not include any explanation or text outside the JSON.
      Respond with ONLY valid JSON matching this structure:
      {
        "docId",
        "tripData": {
            "travelPlan": {
                "budget",
                "duration",
                "hotels": [
                    {
                        "address",
                        "description",
                        "hotelName",
                        "imageUrl",
                        "price",
                        "rating"
                    }
                ],
                "itinerary": [
                    {
                        "day",
                        "plan": [
                            {
                                "imageUrl",
                                "placeDetails",
                                "placeName",
                                "rating",
                                "ticketPricing",
                                "travelTime"
                            }
                        ]
                    }
                ],
                "location",
                "travelers"
            }
        },
        "userEmail",
        "userSelection": {
            "budget",
            "days",
            "place",
            "travelers"
        }
    }`;

    try {
      const result = await chatSession.sendMessage(AI_PROMPT);
      const rawTripData = result?.response?.text();

      // Clean the raw trip data by removing unnecessary parts
      // and parse it into a JSON object
      const cleaned = rawTripData
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      console.log("✅ Raw Trip Data:", cleaned);
      console.log(JSON.stringify(cleaned, null, 2));
      const parsedTripData = JSON.parse(rawTripData);
      console.log("✅ Cleaned & Parsed Trip Data:", parsedTripData);

      await saveTrip(parsedTripData); // Save trip to Firestore
    } catch (error) {
      console.error("❌ Failed to generate or parse trip data:", error);
      showToast("white", "red", "Something went wrong generating the trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:px-10 md:px-20 lg:px-56 xl:px-72 px-5 my-10">
      <h2 className="font-bold text-3xl">
        Tell us your travel preferences 🏕️🌴
      </h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      <div className="mt-20 flex flex-col gap-9">
        <h2 className="text-xl my-3 font-medium">
          What is your destination of choice ?
        </h2>
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
              value: place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange("place", v.label);
              },
              placeholder: "Search for a place",
            }}
          />
        )}
        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning your trip ?
          </h2>
          <Input
            type="number"
            placeholder="Example: 3"
            className="w-full max-w p-5"
            min="1"
            max="5"
            required
            onChange={(e) => handleInputChange("days", e.target.value)} // Update formData with the number of days
            value={formData?.days || ""} // Set the value of the input to formData.days
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            What is your travel budget?
          </h2>
          <div className="grid grid-cols-2 md:grid-3 gap-5 mt-5">
            {SelectBudgetList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("budget", item.title)} // Update formData with the selected budget
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg ${
                  formData?.budget === item.title && "shadow-lg border-black"
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="text-lg font-bold">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            Who do you plan on traveling with on your next adventure?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-5">
            {SelectTravelesList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("travelers", item.people)} // Update formData with the selected travelers
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg ${
                  formData?.travelers === item.people &&
                  "shadow-lg border-black"
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="text-lg font-bold">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.desc}</p>
                <p className="text-sm text-gray-500 font-bold">{item.people}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="my-10 flex justify-end">
        <Button onClick={generateTrip}>
          {loading ? (
            <div className="flex justify-center items-center">
              <AiOutlineLoading3Quarters className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            "Generate Itinerary"
          )}
        </Button>
      </div>
      <LoginDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </div>
  );
};

export default CreateTrip;
