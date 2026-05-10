const GEOAPIFY_API_KEY = "6d723ee6434f4004baa52ff6b26a1702"; // ⚠️ replace this

async function searchRestaurants() {
    const city = document.getElementById("cityInput").value.trim();
    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = "<p>Loading...</p>";

    if (!city) {
        resultsDiv.innerHTML = "<p>Please enter a city</p>";
        return;
    }

    try {
        // Step 1: Get coordinates from city name
        const geoRes = await fetch(
            `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&apiKey=${GEOAPIFY_API_KEY}`
        );

        if (!geoRes.ok) {
            throw new Error("Invalid API key or Geocoding failed");
        }

        const geoData = await geoRes.json();

        if (!geoData.features || geoData.features.length === 0) {
            resultsDiv.innerHTML = "<p>No location found</p>";
            return;
        }

        const { lat, lon } = geoData.features[0].properties;

        // Step 2: Get restaurants near location
        const placesRes = await fetch(
            `https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=circle:${lon},${lat},5000&limit=10&apiKey=${GEOAPIFY_API_KEY}`
        );

        if (!placesRes.ok) {
            throw new Error("Places API failed");
        }

        const placesData = await placesRes.json();

        if (!placesData.features || placesData.features.length === 0) {
            resultsDiv.innerHTML = "<p>No restaurants found</p>";
            return;
        }

        // Step 3: Render UI
        resultsDiv.innerHTML = "";

        placesData.features.forEach(place => {
            const p = place.properties;

            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <h3>${p.name || "Unnamed Restaurant"}</h3>
                <p>${p.address_line2 || "Address not available"}</p>
                <p>🍽️ ${p.categories ? p.categories.join(", ") : "Restaurant"}</p>
            `;

            resultsDiv.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        resultsDiv.innerHTML = `<p style="color:red;">Something went wrong. Check API key.</p>`;
    }
}
