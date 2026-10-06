// ==========================================
// Weather Dashboard - Weatherbit RapidAPI
// ==========================================

// RapidAPI credentials
const API_KEY = "0204d8fbf9mshe57a22026e22267p10aa87jsn3137cfba1207";
const API_HOST = "weatherbit-v1-mashape.p.rapidapi.com";

const API_URL =
    "https://weatherbit-v1-mashape.p.rapidapi.com/current";


// ==========================================
// HTML ELEMENTS
// ==========================================

const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const weatherResult = document.getElementById("weatherResult");

const cityName = document.getElementById("cityName");
const weatherDescription = document.getElementById("weatherDescription");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const cloudiness = document.getElementById("cloudiness");


// ==========================================
// SEARCH CITY
// ==========================================

weatherForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    await getWeather(city);
});


// ==========================================
// FETCH WEATHER
// ==========================================

async function getWeather(city) {

    setLoading(true);

    hideError();

    weatherResult.style.display = "none";

    try {

        // Create API URL with searched city
        const url =
            `${API_URL}?city=${encodeURIComponent(city)}&units=M&lang=en`;


        // Fetch request
        const response = await fetch(url, {

            method: "GET",

            headers: {
                "x-rapidapi-key": API_KEY,
                "x-rapidapi-host": API_HOST
            }

        });


        // ==========================================
        // ERROR HANDLING
        // ==========================================

        if (response.status === 404) {

            throw new Error(
                `City "${city}" was not found.`
            );

        }


        if (response.status === 401) {

            throw new Error(
                "Invalid RapidAPI key."
            );

        }


        if (response.status === 403) {

            throw new Error(
                "API access denied. Please check your RapidAPI subscription."
            );

        }


        if (response.status === 429) {

            throw new Error(
                "Too many API requests. Please try again later."
            );

        }


        if (!response.ok) {

            throw new Error(
                `Weather service error: ${response.status}`
            );

        }


        // Convert response to JSON
        const data = await response.json();


        // Display weather
        displayWeather(data);

    }


    // ==========================================
    // NETWORK / OTHER ERRORS
    // ==========================================

    catch (error) {

        console.error("Weather API Error:", error);


        if (error instanceof TypeError) {

            showError(
                "Network error. Please check your internet connection."
            );

        }

        else {

            showError(
                error.message || "Something went wrong."
            );

        }

    }


    finally {

        // Stop loading
        setLoading(false);

    }

}


// ==========================================
// DISPLAY WEATHER
// ==========================================

function displayWeather(data) {

    // Weatherbit returns weather data inside data array
    const weather = data.data[0];


    // City name
    cityName.textContent =
        `${weather.city_name}, ${weather.country_code}`;


    // Weather description
    weatherDescription.textContent =
        weather.weather.description;


    // Temperature
    temperature.textContent =
        `${Math.round(weather.temp)}°C`;


    // Feels like temperature
    feelsLike.textContent =
        `Feels like ${Math.round(weather.app_temp)}°C`;


    // Humidity
    humidity.textContent =
        `${weather.rh}%`;


    // Wind speed
    windSpeed.textContent =
        `${weather.wind_spd} m/s`;


    // Cloudiness
    cloudiness.textContent =
        `${weather.clouds}%`;


    // ==========================================
    // WEATHER ICON
    // ==========================================

    const iconCode =
        weather.weather.icon;


    weatherIcon.src =
        `https://www.weatherbit.io/static/img/icons/${iconCode}.png`;


    weatherIcon.alt =
        weather.weather.description;


    // Show result
    weatherResult.style.display = "block";

}


// ==========================================
// LOADING STATE
// ==========================================

function setLoading(isLoading) {

    if (isLoading) {

        loading.style.display = "block";

        searchButton.disabled = true;

        cityInput.disabled = true;

        searchButton.textContent = "Loading...";

    }

    else {

        loading.style.display = "none";

        searchButton.disabled = false;

        cityInput.disabled = false;

        searchButton.textContent = "Search";

    }

}


// ==========================================
// SHOW ERROR
// ==========================================

function showError(message) {

    errorMessage.textContent = message;

    errorMessage.style.display = "block";

}


// ==========================================
// HIDE ERROR
// ==========================================

function hideError() {

    errorMessage.textContent = "";

    errorMessage.style.display = "none";

}