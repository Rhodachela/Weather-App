/* DOM Elements Selection */
const form = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");

const errorMsg = document.getElementById("errorMsg");
const loadingMsg = document.getElementById("loadingMsg");
const weatherInfo = document.getElementById("weatherInfo");

const temp = document.getElementById("temp");
const desc = document.getElementById("desc");
const icon = document.getElementById("icon");

const cityName = weatherInfo.querySelector("h2");

/* API Config */
const apiKey = "4489bdad0f5f9b47f7bddac9e0902950";
const baseURL = "https://api.openweathermap.org/data/2.5/weather";

/* Form Submit Handler */
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if(!city){
        showError("Please enter a city name.");
        return;
    }

    /* Clear previous message and show loading */
    resetMessages();
    loadingMsg.hidden = false;

    try {
        await getWeather(city);
    } catch (error){
        showError("Something went wrong. Add a valid city name.")
    } finally {
        loadingMsg.hidden = true;
    }
});

/* Fetch Weather Functions */
 async function getWeather(city) {
    const url = `${baseURL}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    
    const response = await fetch(url);

    if(!response.ok){
        if(response.status === 404){
            showError("City not found. Please check spelling and try again.");
        }
        else {
            showError("Unable to fetch data. Try again.");
        }
        throw new Error ("API Error");

    }

    const data = await response.json();
    console.log(data);
    displayWeather(data);

 }

    /*Display Weather data */
function displayWeather(data){
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const city = data.name;

    cityName.textContent = city.charAt(0).toUpperCase() + city.slice(1);
    temp.textContent = `${temperature}°C`;
    desc.textContent = description.charAt(0).toUpperCase() + description.slice(1);
    icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    icon.alt = description;

    weatherInfo.hidden = false;
    cityInput.value = "";
}

/* Error handling */
function showError(message){
    errorMsg.textContent = message;
    errorMsg.hidden = false;
    weatherInfo.hidden = true;
}

/* Reset Messages */
function resetMessages(){
    errorMsg.textContent = "";
    loadingMsg.hidden = true;
}