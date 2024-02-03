var apiKey = "0c5374c85cccf790bf1de24a84acfe1b";
var cityInput = document.getElementById('form-input');
var currentWeather = document.getElementById('current-weather');
var forecast = document.getElementById('forecast');
var searchForm = document.getElementById('search-form');

//var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`

searchForm.addEventListener('click', function (event) {
    event.preventDefault();
    getWeather();
});

function getWeather() {
    var city = cityInput.value.trim();
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
    if (city) {
        fetch(apiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                displayCurrentWeather(data);

                return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`);
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                displayForecast(data);
            })
    }
}

function displayCurrentWeather(data) {
    currentWeather.innerHTML = `
<h2>${data.name}, ${data.sys.country}</h2>
<p>Temperature: ${data.main.temp}</p>
<p>Humidity: ${data.main.humidity}</p>
<p>Wind Speed: ${data.wind.speed}</p>

`;
}

function displayForecast(data) {
    // Loops through the weather data & get info from data list array for wind speed, temp and humidity
    for (let i = 0; i < data.list.length; i += 8) {
        var date = new Date(data.list[i].dt * 1000).toLocaleDateString('en-US');
        var temperature = data.list[i].main.temp;
        var windSpeed = data.list[i].wind.speed;
        var humidity = data.list[i].main.humidity;

        // Create a new forecast item boxes
        var forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        //Set inner HTML for the forecast item information calling variables from above
        forecastItem.innerHTML = `
            <p>${date}</p>
            <p>Temperature: ${temperature}</p>
            <p>Wind Speed: ${windSpeed}</p>
            <p>Humidity: ${humidity}</p>
        `;

        //Appends the forecast item to the forecast squares
        forecast.appendChild(forecastItem);
    }
}


