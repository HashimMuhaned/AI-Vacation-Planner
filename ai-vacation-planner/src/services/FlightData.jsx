export const getFlightData = async (
  origin,
  destination,
  departureDate,
  returnDate
) => {
  try {
    const apiKey = process.env.VITE_AMADEUS_API_KEY; // or your way of storing keys
    const apiSecret = process.env.VITE_AMADEUS_SECRET_KEY;

    // First: Get an access token (Amadeus uses OAuth2)
    const tokenRes = await fetch(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: apiKey,
          client_secret: apiSecret,
        }),
      }
    );

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Second: Call flight offers API
    const params = new URLSearchParams({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: "1", // you can make this dynamic
      ...(returnDate && { returnDate }), // only add if exists
      max: "10", // limit results
      currencyCode: "USD", // optional
    });

    const flightRes = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const flightData = await flightRes.json();
    return flightData;
  } catch (error) {
    console.error("Failed to fetch flight data:", error);
    throw new Error("Error fetching flight information");
  }
};


