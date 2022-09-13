var apiKey = "75ce623957426941f4666814094bb92e"
var weatherURL = "https://api.openweathermap.org/data/2.5/"
var todaySearch = "weather?q="
var fiveDaySearch = "forecast?q="
var searchText
var todayData
var recentSearches

function buildRecents() {
    recentSearches = localStorage.getItem("recentCities")
    $("#recents").text("")
    if(recentSearches != null) {
        var recentArr = recentSearches.split(", ")
        for(var i=0; i<recentArr.length; i++) {
        var recentBtn = $("<button>")
        recentBtn.addClass("btn btn-secondary btn-block")
        recentBtn.val(recentArr[i])
        recentBtn.text(recentArr[i])
        $("#recents").append(recentBtn)
        }
    }
}

function startSearch(event) {
    event.preventDefault();
    var target = $(event.target)
   
    searchText = target.val()
    if(searchText === "search") {
        searchText = $("#searchInput").val();
        if(recentSearches == null) {
            recentSearches = searchText
            localStorage.setItem("recentCities", searchText)
        }
        else {
            recentSearches = recentSearches + ", " + searchText
            localStorage.setItem("recentCities", recentSearches)
        }
        buildRecents()
    }
    //clear screen
    $("#searchInput").val("")
    $("#forecast").text("")
    runTodaySearch();
    runFiveDaySearch();
}

function runTodaySearch() {
    var url
    url = weatherURL + todaySearch + searchText + "&APPID=" + apiKey +"&units=imperial"
    fetch(url)
    .then(function(response) {
        if(response.ok) {
            return response.json().then(function(data) {
                $("#city-display").text(searchText +  moment().format(" (MM/DD/YYYY)"));
                $("#city-img").attr("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png")
                $("#today-temp").text(data.main.temp + " ℉")
                $("#today-wind").text(data.wind.speed + " MPH")
                $("#today-humidity").text(data.main.humidity + " %")
        
            })
        }
        else {
            $("#city-display").text("An Error occured. " + response.status + " " + response.statusText)
            $("#city-img").attr("src", "")
        }
    })
}

function runFiveDaySearch() {
    var url
    url = weatherURL + fiveDaySearch + searchText + "&APPID=" + apiKey +"&units=imperial"
    fetch(url)
    .then(function(response) {
        if(response.ok) {
             return response.json().then(function(data) {
                //x=3 starts at noon day 1, each 8 records is 24 hours
                //so x=11 is noon day 2 etc.
                var x = 3
                //i=day 
                for(var i=1; i<=5; i++) {
                    var dayCard = $("<div>")
                    dayCard.addClass("card-body col-2 p-1 m-2 bg-secondary text-white forecast-card")
                    var cardHeader = $("<h6>")
                    cardHeader.addClass("card-title")
                    cardHeader.text(moment(data.list[x].dt_txt).format("MM/DD/YYYY"))
                    var cardIcon = $("<img>")
                    cardIcon.attr("src", "http://openweathermap.org/img/wn/" + data.list[x].weather[0].icon + ".png")
                    var tempText = $("<p>")
                    tempText.addClass("card-text")
                    tempText.text("Temp: " + data.list[x].main.temp + " ℉")
                    var windText = $("<p>")
                    windText.addClass("card-text")
                    windText.text("Wind: " + data.list[x].wind.speed + " MPH")
                    var humText = $("<p>")
                    humText.addClass("card-text")
                    humText.text("Hum: " + data.list[x].main.humidity + " %")
                    dayCard.append(cardHeader)
                    dayCard.append(cardIcon)
                    dayCard.append(tempText)
                    dayCard.append(windText)
                    dayCard.append(humText)
                    $("#forecast").append(dayCard)
        
                    x += 8
                }
        })
        }
        else {
            $("#forecast").text("An Error occured. " + response.status + " " + response.statusText)
        }
    })
}

buildRecents();

$("#search-container").on("click", "button", startSearch)