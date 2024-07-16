const api = {
    key: "d526e036b44cee32800c1ab7e714478c",
    base: "https://api.openweathermap.org/data/2.5/"
}
var longitude;
var latitude;

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

//FUNCTION TO CALL API CALL FUNCTION WHEN ENTER IS PRESSED
function setQuery(evt) {
    if (evt.keyCode == 13) {
        getWeather(searchbox.value);
    }
}

// FUNCTION TO GET CURRENT WEATHER RESULTS BY USER INPUT
function getWeather(query) {
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(response => response.json())
        .then(weather => {
            displayWeather(weather);
            getForecast(weather.coord.lat, weather.coord.lon);
        });
}

// FUNCTION TO GET 5-DAY FORECAST RESULTS BY LATITUDE AND LONGITUDE
function getForecast(lat, lon) {
    fetch(`${api.base}forecast?lat=${lat}&lon=${lon}&units=metric&appid=${api.key}`)
        .then(response => response.json())
        .then(forecast => {
            displayForecast(forecast);
            console.log(forecast);
        });
}

// FUNCTION TO DISPLAY CURRENT WEATHER RESULTS
function displayWeather(weather) {
    
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    // Get the image element
    let image = document.querySelector('.current .weather__image img');

    // Set the image source based on the weather condition
    let weatherIcon = weather.weather[0].icon;
    image.src = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;

    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `Max / Min: ${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C`;

    let humidity = document.querySelector('.current .humidity');
    humidity.innerHTML = `Humidity: ${weather.main.humidity}%`;
}

// FUNCTION TO DISPLAY 5-DAY FORECAST
function displayForecast(forecast) {
    let forecastItems = document.querySelectorAll('.weather__forecast .weather__forecast__item');
  
    for (let i = 0; i < forecastItems.length; i++) {
        let forecastItem = forecastItems[i];
        let forecastData = forecast.list[i * 8]; // Get forecast for every 24 hours (8 data points per day)

        let date = new Date(forecastData.dt * 1000); // Convert UNIX timestamp to JavaScript timestamp

        let day = forecastItem.querySelector('.weather__forecast__day');
        day.innerText = getDayOfWeek(date);

        let icon = forecastItem.querySelector('.forecast__image');
        icon.innerHTML = `<img src="https://openweathermap.org/img/wn/${forecastData.weather[0].icon}@2x.png" alt="Weather Icon">`;
        console.log("forecast__image");
        console.log(forecastData.weather[0].icon);

        let temp = forecastItem.querySelector('.weather__forecast__temp');
        temp.innerHTML = `${Math.round(forecastData.main.temp)}<span>°C</span>`;

    }
}

//FUNCTION TO BUILD DATE FROM THE API DATA
function dateBuilder(d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}

// FUNCTION TO GET DAY OF WEEK FROM THE API DATA
function getDayOfWeek(date) {
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
}

// FUNCTION TO GET WEATHER DATA BY GEOLOCATION
function getLocationWeather() {
    // Check if geolocation is available
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            // Get latitude and longitude
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            // API key and endpoint
            var apiKey = "d526e036b44cee32800c1ab7e714478c";
            var apiUrl = `${api.base}weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

            // Make API request
            fetch(apiUrl)
                .then(response => response.json())
                .then(weather => {
                    displayWeather(weather);
                    getForecast(weather.coord.lat, weather.coord.lon);
                });
        });
    }
}