var apiURL = ""
var apiKey = "75ce623957426941f4666814094bb92e"
var weatherURL = "https://api.openweathermap.org/data/2.5/"
var todaySearch = "weather?q="
var fiveDaySearch = "forecast?q="


// api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=75ce623957426941f4666814094bb92e

function runSearch() {
    var url
    var searchText = document.querySelector("#searchInput").value;
    url = weatherURL + todaySearch + searchText + "&APPID=" + apiKey +"&units=imperial"
    fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data)
    })
}

// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
document.querySelector("#searchBtn").addEventListener("click", runSearch)