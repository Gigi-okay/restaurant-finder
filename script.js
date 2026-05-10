const API_KEY = "YOUR_API_KEY_HERE";

async function searchRestaurants() {
  const query = document.getElementById("search").value.trim();
  const status = document.getElementById("status");
  const results = document.getElementById("results");

  results.innerHTML = "";
  status.innerText = "";

  if (!query) {
    alert("Please enter a city");
    return;
  }

  try {
    status.innerText = "🔍 Searching location...";

    // Step 1: Get coordinates
    const geoRes = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${query}&apiKey=${API_KEY}`
    );
    const geoData = await geoRes.json();

    if (!geoData.features.length) {
      status.innerText = "❌ City not found";
      return;
    }

    const { lat, lon } = geoData.features[0].properties;

    status.innerText = "🍽 Fetching restaurants...";

    // Step 2: Get restaurants
    const placesRes = await fetch(
      `https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=circle:${lon},${lat},5000&limit=10&apiKey=${API_KEY}`
    );

    const placesData = await placesRes.json();

    displayResults(placesData.features);

    status.innerText = `✅ Found ${placesData.features.length} restaurants`;

  } catch (error) {
    console.error(error);
    status.innerText = "❌ Something went wrong";
  }
}

function displayResults(places) {
  const container = document.getElementById("results");

  if (!places.length) {
    container.innerHTML = "<p>No restaurants found</p>";
    return;
  }

  places.forEach(place => {
    const p = place.properties;

    container.innerHTML += `
      <div class="card">
        <h3>${p.name || "No Name"}</h3>
        <p>${p.address_line1 || ""}</p>
        <p>${p.address_line2 || ""}</p>
      </div>
    `;
  });
}
