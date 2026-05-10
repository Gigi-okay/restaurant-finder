async function searchRestaurants() {
  const query = document.getElementById("search").value;

  if (!query) {
    alert("Please enter a city");
    return;
  }

  const API_KEY = "6d723ee6434f4004baa52ff6b26a1702";

  try {
    // Step 1: Get coordinates
    const geoRes = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${query}&apiKey=${API_KEY}`
    );

    const geoData = await geoRes.json();

    if (!geoData.features.length) {
      alert("City not found");
      return;
    }

    const { lat, lon } = geoData.features[0].properties;

    // Step 2: Get restaurants
    const placesRes = await fetch(
      `https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=circle:${lon},${lat},5000&limit=10&apiKey=${API_KEY}`
    );

    const placesData = await placesRes.json();

    displayResults(placesData.features);

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
}

function displayResults(places) {
  const container = document.getElementById("results");
  container.innerHTML = "";

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
