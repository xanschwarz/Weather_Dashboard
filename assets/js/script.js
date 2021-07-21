// ----------------------------------------------- User Story and Acceptance Criteria -----------------------------------------------
// Want to see the weather outlook for multiple cities.

// Weather dashboard w/form inputs, can search for a city, results will be current and future conditions for that city and city is 
// added to the search history.

// Current conditions for city shows city name, date, icon representation of conditions, the temp, humidity, wind speed, and UV index.

// UV index displays with color indicating conditions are favorable, moderate, or severe.

// Future conditions are presented as 5-day forecast. Each card has date, icon rep of conditions, the temp, wind speed, and humidity.

// Clicking on city in search history again presents current and future conditions for that city.
// ----------------------------------------------------------------------------------------------------------------------------------

// 1. When search is pressed, get and display todays forecast and date for searched city

// 2. Get and display 5-Day Forecast

// 3. Save and display search history on load

// 4. Clicking on search history displays results for that search


var theMoment = moment();
var weatherAPIKey = '5d05df2b34ff9a1707887594fcb9ee83';
var searchCity = $('#city')
var searchButton = $('#search-primary')
var resultsGroup = $('#results-group')
var searchCityTitle = $('#searched-city-title')
var currentTemp = $('#current-temp')
var currentWind = $('#current-wind')
var currentHumidity = $('#current-humidity')
var currentUVIndex = $('#current-UV-index')
var weatherIcon = $('#weather-icon')
var forecastDate = $('.forecast-date')
var forecastIcon = $('.forecast-icon')
var forecastTemp = $('.forecast-temp')
var forecastWind = $('.forecast-wind')
var forecastHumidity = $('.forecast-humidity')
var searchLon
var searchLat
var weatherIconSRC
// var searchedCityID

function getWeather(event) {
    event.preventDefault();
    var citySearched = searchCity.val().toUpperCase();
    localStorage.setItem('searches', citySearched)
    resultsGroup.removeClass('d-none');
    var date = theMoment.format('(M/D/Y)');
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + citySearched + '&appid=' + weatherAPIKey + '&units=imperial';
    $.ajax({
        url: queryURL,
        method: 'GET',
    })
    .then(function (response) {
        searchCityTitle.text(response.name + ' ' + date);
        currentTemp.text(response.main.temp + ' °F');
        currentWind.text(response.wind.speed + ' MPH');
        currentHumidity.text(response.main.humidity + '%');
        searchLon = response.coord.lon;
        searchLat = response.coord.lat;
        var queryURLOneCall = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + searchLat + '&lon=' + searchLon + '&exclude=minutely,hourly&appID=' + weatherAPIKey + '&units=imperial';
        $.ajax({
            url: queryURLOneCall,
            method: 'GET',
        })
        .then(function (responseOneCall) {
            currentUVIndex.text(responseOneCall.current.uvi)
            if (currentUVIndex.text() <= 2) {
                $(currentUVIndex).css('background-color', 'green').css('color', 'white')
            }
            else if (currentUVIndex.text() <= 5)
                $(currentUVIndex).css('background-color', 'yellow')
            else if (currentUVIndex.text() <= 7)
                $(currentUVIndex).css('background-color', 'orange')
            else if (currentUVIndex.text() <= 10)
                $(currentUVIndex).css('background-color', 'red')
            else {
                $(currentUVIndex).css('background-color', 'purple').css('color', 'white')
            }
            weatherIconSRC = 'https://openweathermap.org/img/w/' + responseOneCall.current.weather[0].icon + '.png';
            weatherIcon.attr('src', weatherIconSRC).attr('alt', responseOneCall.current.weather[0].description);

            // get, display 5 day forecast
            for (i = 0; i < 5; i++) {
                var thisDate = theMoment.add(1, 'd').format('(M/D/Y)');
                forecastDate[i].innerHTML = thisDate;
                var thisWeatherIconSRC = 'https://openweathermap.org/img/w/' + responseOneCall.daily[i].weather[0].icon + '.png'
                forecastIcon[i].setAttribute('src', thisWeatherIconSRC);
                forecastIcon[i].setAttribute('alt', responseOneCall.daily[i].weather[0].description);
                forecastTemp[i].innerHTML = responseOneCall.daily[i].temp.day + ' °F';
                forecastWind[i].innerHTML = responseOneCall.daily[i].wind_speed + ' MPH';
                forecastHumidity[i].innerHTML = responseOneCall.daily[i].humidity + '%';
            }
        })
        
    })
    
    searchCity.val('');
}

searchButton.on('click', getWeather)

// search history persists