// Setting Variables //
var searchButton = $(".searchButton");
var clearButton = $(".clearButton");
var apiKey = '8f1a66a20deff7d941938a215df018a9';
var keyCount = 0;
var searchedCity = '';

for (var i = 0; i < localStorage.length; i++) {

    var city = localStorage.getItem(i);
    var cityName = $('.list-group').addClass('list-group-item');

    cityName.append('<li>' + city + '</li>');
}

// Search btn function // 
var currentDate = () => {
    var searchInput = $('.searchInput').val();
    var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=" + apiKey + "&units=metric";


    if (searchInput == "") {
        console.log(searchInput);
    }

    // Requesting API response using ajax to retrieve data //
    else {
        $.ajax({
            url: urlCurrent,
            method: "GET"
        })

            // Function for appending the required data //
            .then(function (response) {
                // console logging response to access data string //
                console.log(response);
                var cityName = $(".list-group").addClass("list-group-item");
                cityName.append("<li>" + response.name + "</li>");
                var local = localStorage.setItem(keyCount, response.name);
                keyCount = keyCount + 1;

                var currentCard = $(".currentCard").append("<div>").addClass("card-body");
                currentCard.empty();
                var currentName = currentCard.append("<p>");
                currentCard.append(currentName);

                var timeUTC = new Date(response.dt * 1000);
                currentName.append(response.name + " " + timeUTC.toLocaleDateString("en-US"));
                currentName.append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);
                var currentTemp = currentName.append("<p>");
                currentName.append(currentTemp);
                currentTemp.append("<p>" + "Temperature: " + response.main.temp + "</p>");
                currentTemp.append("<p>" + "Humidity: " + response.main.humidity + "%" + "</p>");
                currentTemp.append("<p>" + "Wind Speed: " + response.wind.speed + "</p>");

                // ADD function to get UV data for serached city //
                var urlUV = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + response.coord.lat + "&lon=" + response.coord.lon + "&appid=" + apiKey;

                // Pass through new url to get UV data //
                $.ajax({
                    url: urlUV,
                    method: 'GET'
                })

                    // Appending UV Data
                    .then(function (response) {
                        // console logging response to access data string //
                        console.log(response);
                        // changing font text based on UV reading
                        var x = JSON.stringify(response.daily[0].uvi);
                        if (x < 0) {
                            var currentUV = currentTemp.append('<p class = "UV-text1">' + 'Daily UV Index: ' + response.daily[0].uvi + "</p>").addClass("card-text");
                            currentTemp.append(currentUV);
                            currentUV.addClass('UV');
                        } else if (x >= 0 && x < 5) {
                            var currentUV = currentTemp.append('<p class = "UV-text2">' + 'Daily UV Index: ' + response.daily[0].uvi + "</p>").addClass("card-text");
                            currentTemp.append(currentUV);
                            currentUV.addClass('UV');
                        } else {
                            var currentUV = currentTemp.append('<p class = "UV-text3">' + 'Daily UV Index: ' + response.daily[0].uvi + "</p>").addClass("card-text");
                            currentTemp.append(currentUV);
                            currentUV.addClass('UV');
                        }
                    });

                // URL for five day forcast data //
                var urlFiveDays = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&appid=" + apiKey + "&units=metric";

                // Pass through new url to get Five Day Forecast Data //
                $.ajax({
                    url: urlFiveDays,
                    method: 'GET'
                })

                    // Appending Five Day Data //
                    .then(function (response) {
                        // console logging response to access data string //
                        console.log(response);
                        var day = [0, 8, 16, 24, 32];
                        var fiveDayCard = $(".fiveDayCard").addClass("card-body");
                        var fiveDayDiv = $(".fiveDayOne");
                        fiveDayDiv.empty();
                        day.forEach(function (i) {
                            var FiveDayTimeUTC1 = new Date(response.list[i].dt * 1000);
                            FiveDayTimeUTC1 = FiveDayTimeUTC1.toLocaleDateString("en-US");

                            //Appending data into div for Five Day forecast
                            fiveDayDiv.append("<div class=fiveDayColor>" + "<p>" + FiveDayTimeUTC1 + "</p>"
                                + `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">`
                                + "<p>" + "Temperature: " + response.list[i].main.temp + "</p>" + "<p>" + "Humidity: "
                                + response.list[i].main.humidity + "%" + "</p>" + "<p>" + "Wind Speed: " + response.list[i].wind.speed + "</p>" + "</div>");
                        });
                    });
            });
    }
}

$('.searchButton').on('click', (event) => {
    event.preventDefault();
    searchedCity = $('.searchInput').val();
    currentDate();
});

$('.list-group').on('click', (event) => {
    event.preventDefault();
    $('.searchInput').val(event.target.textContent);
    searchedCity = $('.searchInput').val();
    currentDate();
});

clearButton.click(function(){
    var cityName = $(".list-group").addClass("list-group-item");
    cityName.empty();
    localStorage.clear();
});