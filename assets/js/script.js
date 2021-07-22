// ----------------------------------------------- User Story and Acceptance Criteria -----------------------------------------------

// Searched city is added to the search history.

// Clicking on city in search history again presents current and future conditions for that city.
// ----------------------------------------------------------------------------------------------------------------------------------

// 3. Save and display search history on load

// 4. Clicking on search history displays results for that search

// Global variables
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
var searchHistoryStorage = JSON.parse(localStorage.getItem("searched")) || [];
var searchHistoryEl = $('#search-history')
var input
var searchLon
var searchLat
var weatherIconSRC

function searchHistoryButtons() {
    theMoment = moment();
    searchHistoryEl.text('');
    // Loop thro search history, making elements and adding attributes then appending

    
    for (i = 0; i <searchHistoryStorage.length; i++) {
        console.log(searchHistoryStorage[i])
        // jquery
        searchHistoryEl.append($("<button type='submit' class='btn btn-secondary text-black container-fluid search-button'></button>").text(searchHistoryStorage[i]))

        // // buttonAdd.addEventListener('click', getWeather(buttonAdd.value))
    }
}
searchHistoryButtons();

// Function to be called on button press. Gets and displays weather.
function getWeather(event) {
    event.preventDefault();
    input = searchCity.val()
    searchHistoryStorage.push(input);
    localStorage.setItem('searched', JSON.stringify(searchHistoryStorage));
    searchHistoryButtons()

    // Display results elements, initialize local variables.
    var citySearched = input.toUpperCase();
    var date = theMoment.format('(M/D/Y)');
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + citySearched + '&appid=' + weatherAPIKey + '&units=imperial';
    // Get and display today's conditions.
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

        // Get and display today's UV index and 5 day forecast. Style today's UV index based on severity.
        $.ajax({
            url: queryURLOneCall,
            method: 'GET',
        })
        .then(function (responseOneCall) {
            ifUV = responseOneCall.current.uvi;
            if (ifUV <= 2) {
                currentUVIndex.text(responseOneCall.current.uvi + ' Low')
                $(currentUVIndex).css('background-color', 'green').css('color', 'white')
            }
            else if (ifUV <= 5) {
                currentUVIndex.text(responseOneCall.current.uvi + ' Moderate')
                $(currentUVIndex).css('background-color', 'yellow')
            }
            else if (ifUV <= 7) {
                currentUVIndex.text(responseOneCall.current.uvi + ' High')
                $(currentUVIndex).css('background-color', 'orange')
            }
            else if (ifUV <= 10) {
                currentUVIndex.text(responseOneCall.current.uvi + ' Very high')
                $(currentUVIndex).css('background-color', 'red')
            }
            else {
                currentUVIndex.text(responseOneCall.current.uvi + ' Extreme')
                $(currentUVIndex).css('background-color', 'purple').css('color', 'white')
            }
            weatherIconSRC = 'https://openweathermap.org/img/w/' + responseOneCall.current.weather[0].icon + '.png';
            weatherIcon.attr('src', weatherIconSRC).attr('alt', responseOneCall.current.weather[0].description);

            // Get, display 5 day forecast.
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
            resultsGroup.removeClass('d-none');
        })
        
    })
    
    // Clear input area.
    searchCity.val('');
}

searchButton.on('click', getWeather)