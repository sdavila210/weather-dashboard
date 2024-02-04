var apiKey = "0c5374c85cccf790bf1de24a84acfe1b";
var cityInput = document.getElementById('form-input');
var currentWeather = document.getElementById('current-weather');
var forecast = document.getElementById('forecast');
var searchForm = document.getElementById('search-form');
var weatherContainer = document.getElementById('weather-container');
var searchButton = document.getElementById('search-button');

//Adds event when you click the search button to get the weather
searchButton.addEventListener('click', function (event) {
    event.preventDefault();
    weatherContainer.style.display = 'block';
    getWeather();
});

//Function with the fetch request to retrieve weather data for current weather and future forecast
function getWeather() {
    var city = cityInput.value.trim();
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
    if (city) {
        fetch(apiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                addToCityHistory(city);
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

//Function to display the current weather data from pulling information from array of the API. Used URL from API to retrieve information for the icons
function displayCurrentWeather(data) {
    var icon = data.weather[0].icon;
    var iconUrl = `http://openweathermap.org/img/wn/${icon}.png`;

    currentWeather.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img src="${iconUrl}">
        <p>Temperature: ${data.main.temp} °F</p>
        <p>Wind Speed: ${data.wind.speed} MPH</p>
        <p>Humidity: ${data.main.humidity} %</p>
       
`;
}

//Function to display the 5 day forecast
function displayForecast(data) {
    //clears previous display data
    forecast.innerHTML = '';
    // Loops through the weather data & get info from data list array for wind speed, temp and humidity. Use URL from API to retrieve info for icons.
    for (let i = 0; i < data.list.length; i += 8) {
        var date = new Date(data.list[i].dt * 1000).toLocaleDateString('en-US');
        var temperature = data.list[i].main.temp;
        var windSpeed = data.list[i].wind.speed;
        var humidity = data.list[i].main.humidity;
        var icon = data.list[i].weather[0].icon;
        var iconUrl = `http://openweathermap.org/img/wn/${icon}.png`;

        //Create a new forecast item boxes
        var forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        //Sets inner HTML for the forecast item information calling variables from above
        forecastItem.innerHTML = `
            <p>${date}</p>
            <img src="${iconUrl}">
            <p>Temperature: ${temperature} °F</p>
            <p>Wind Speed: ${windSpeed} MPH</p>
            <p>Humidity: ${humidity} %</p>
            
        `;

        //Appends the forecast item to the forecast squares
        forecast.appendChild(forecastItem);
    }
}

//Initializes the city history array from local storage
var cityHistory = JSON.parse(localStorage.getItem('cityHistory'));

//Function to add city to history array, and save to local storage, then call the function to display
function addToCityHistory(city) {
    cityHistory.push(city);
    localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
    displayCityHistory();
}

//Function to clear existing history list, loop through the array and create clickable buttons as a list. The weather is called again for each city when the button is clicked
function displayCityHistory() {
    var cityHistoryList = document.getElementById('search-history');
    cityHistoryList.innerHTML = '';

    for (var i = 0; i < cityHistory.length; i++) {
        var cityButton = document.createElement('button');
        cityButton.textContent = cityHistory[i];
        cityButton.addEventListener('click', function (event) {
            cityInput.value = event.target.textContent;
            getWeather();
        });

        var cityListItem = document.createElement('li');
        cityListItem.appendChild(cityButton);
        cityHistoryList.appendChild(cityListItem);
    }
}

displayCityHistory();
