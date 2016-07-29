var geocoder;
var locationUnit;
var timeZone = "";
geocoder = new google.maps.Geocoder();

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
}

function successFunction(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  convertLatLng(lat, lng);
}

function errorFunction() {
  alert("Geocoder has failed");
  $("#fButton").click();
}

$(function() {
  $("form").submit(function() {
    return false;
  });
});

$("#search").on("autocompleteselect", function(event, ui) {
  $("#search").val(ui.item.label);
  searchCityInfo();
  $("#search").autocomplete("close");

});

$("#searchButton").click(function() {
  var searchValue = $("#search").val();
  var placeholder = document.getElementById("search").placeholder;
  if (searchValue === "" || searchValue.length < 3) {
    $("#search").val(placeholder);
  }
  searchCityInfo();
  $("#search").focus();
});
//runs when city is either selected from autocomplete, or search button is clicked
function searchCityInfo() {
  
    var searchCity = $("#search").val();
    $("#search").blur();
    var jsonURL = "http://autocomplete.wunderground.com/aq?query=" + searchCity + "&cb=?";
    var ajax1 = $.getJSON(jsonURL);
    return ajax1.then(function(data) {
      console.log(data);
      if(searchCity.trim()==="") return;
      if(data.RESULTS.length===0) { return;}
      var info = [];
      info.push(data.RESULTS[0].name);
      info.push(data.RESULTS[0].lat);
      info.push(data.RESULTS[0].lon);
      info.push(data.RESULTS[0].tzs);
      var searchName = info[0];
      var searchLat = info[1];
      var searchLng = info[2];
      timeZone = info[3];
      console.log(timeZone);
      var weatherApiUrl = "https://api.forecast.io/forecast/97fd0a30e71fbb3ff0b386111be0560c/" + searchLat + "," + searchLng + "?units=" + locationUnit + "&exclude=minutely" + "&callback=?";
      return $.getJSON(weatherApiUrl).then(function(data) {
        console.log(data);
        successCityWeather(data);
        $("#search").val("");
        document.getElementById("search").placeholder = searchName;
      });
    });
  
}

function getCurrentLocationWeather(lat, lng) {
  var weatherApiUrl = "https://api.forecast.io/forecast/97fd0a30e71fbb3ff0b386111be0560c/" + lat + "," + lng + "?units=auto" + "&exclude=minutely" + "&callback=?";
  $.getJSON(weatherApiUrl, successCityWeather);

}
//function to set up weather info of selection on website
function successCityWeather(data) {
  var unixTime = data.currently.time;
  var windSpeed = data.currently.windSpeed;
  var tempData = data.currently.temperature;
  var units = data.flags.units;
  var UTCOffset = data.offset;
  locationUnit = units;
  var description = data.currently.summary;
  var weatherIcon = data.currently.icon;
  changeVideo(weatherIcon);
  convertTemp(units, tempData, "temp");
  convertWind(units, windSpeed);
  convertTime(units, unixTime, UTCOffset, "date");
  $("#description").html("<img id = firstImg src ='images/" + weatherIcon + ".png' alt = 'weatherIcon'>");
  $("#weatherTitle").html(description);
  convertHourly(units, data);
  convertWeekly(units, data);
  //changes active class for temperature on upper left corner
  if (units === "us") {
    $("#fButton").addClass("tempActive");
    $("#cButton").removeClass("tempActive");
  } else {
    $("#cButton").addClass("tempActive");
    $("#fButton").removeClass("tempActive");
  }
}
//finds current location's city and country based off of latlng from browser's geolocation 
function convertLatLng(lat, lng) {
  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({
    "location": latlng
  }, function(results, status) {
    //if geocoder works
    if (status == google.maps.GeocoderStatus.OK) {
      //if there are results
      if (results[1]) {
        //find city, state, and country name
        for (var i = 0; i < results[0].address_components.length; i++) {
          for (var j = 0; j < results[0].address_components[i].types.length; j++) {
            if (results[0].address_components[i].types[j] == "locality") {
              var city = results[0].address_components[i].long_name;
              break;
            }

            if (results[0].address_components[i].types[j] == "administrative_area_level_1") {
              var state = results[0].address_components[i].long_name;
            }
            if (results[0].address_components[i].types[j] == "country") {
              var countryLong = results[0].address_components[i].long_name;
              break;
            }
          }
        }
        //if country is detected to be US, set the format on search placeholder to be city, state. If it is any other country, set the format on search placeholder to be city, country.
        if (countryLong === "United States") {
          document.getElementById("search").placeholder = city + ", " + state;
        } else {
          document.getElementById("search").placeholder = city + ", " + countryLong;
        }
        getCurrentLocationWeather(lat, lng);

      } else {
        alert("No results found for your location");
      }
    } else {
      alert("Geocoder failed because of: " + status);
    }
  });
}
//autocomplete function in the search box
$(function() {
  var noResults = "No Results";
  var cities = [];
  monkeyPatchAutocomplete();
  $("#search").autocomplete({
    source: function(request, response) {
      var autocompleteURL = "http://autocomplete.wunderground.com/aq?query=" + request.term + "&cb=?"
      $.getJSON(
        autocompleteURL,
        function(data) {
          cities = [];
          for (var i = 0; i < data["RESULTS"].length; i++) {
            if (data.RESULTS[i].type === "city") {
              cities.push(data["RESULTS"][i]["name"]);
            }
          }
          if (cities.length === 0 || request.term.length < 3) {
            cities = [noResults];
            $("#search").autocomplete("option", "autoFocus", false);

          } else {
            $("#search").autocomplete("option", "autoFocus", true);
          }
          response(cities);
        }
      );
    },
    minLength: 1,
    //if result is "No results", do not allow to be selectable
    select: function(event, ui) {
      if ($(ui.item).val() === "No Results") {
        event.preventDefault();
      }

    },
    //if resul is "No results", do not allow to focus on dropdownmenu
    focus: function(event, ui) {
      if ($(ui.item).val() === "No Results") {
        event.preventDefault();
        //return false;
      }
    }
  });
});

function monkeyPatchAutocomplete() {
  // don't really need this, but in case I did, I could store it and chain
  var oldFn = $.ui.autocomplete.prototype._renderItem;

  $.ui.autocomplete.prototype._renderItem = function(ul, item) {
    var re = new RegExp(this.term, "i");
    var t = item.label.replace(re, "<span style='font-weight:bold;color:Black;'>" +
      "$&" +
      "</span>");
    return $("<li></li>")
      .data("item.autocomplete", item)
      .append("<a>" + t + "</a>")
      .appendTo(ul);
  };
}
//convert temperature into F/C based off of measurement units of current location
function convertTemp(units, tempData, divName, tempData2) {
  if (typeof(tempData) === "string") {
    $("#" + divName).html(tempData);
    return;
  }
  var temperatureF = Math.round(tempData) + "°F";
  var temperatureC = Math.round(tempData) + "°C";
  var temperature2F = Math.round(tempData2) + "°F";
  var temperature2C = Math.round(tempData2) + "°C";
  if (units === "us") {
    $("#" + divName).html(temperatureF);
  } else {
    $("#" + divName).html(temperatureC);
  }
  if (typeof(tempData2) !== "undefined") {
    if (units === "us") {
      $("#" + divName).html("<b>" + temperatureF.slice(0, -1) + "</b>/ " + temperature2F);
    } else {
      $("#" + divName).html("<b>" + temperatureC.slice(0, -1) + "</b>/ " + temperature2C);
    }
  }
}
//convert wind speed in units based off of measurement units 
function convertWind(units, windSpeed) {
  var windSpeedMiles = Math.round(windSpeed) + " mph ";
  var windSpeedKm = Math.round(windSpeed * 3.6) + " kmph";
  if (units == "us") {
    $("#wind").html(windSpeedMiles);
  } else {
    $("#wind").html(windSpeedKm);
  }
}
//convert time into 24 hour clock / 12 hour clock based off of f/c toggle
function convertTime(units, unixTime, UTCOffset, divName) {
  //if unixTime is "sunrise/sunset" then list sunrise/sunset instead in the hourly forecase
  if (typeof(unixTime) === "string") {
    $("#" + divName).html(unixTime);
    return;
  }
  var date = new Date(unixTime * 1000);
  var hours = date.getUTCHours() + UTCOffset;
  var minutes = 0;
  //if hour +offset is not a whole number but instead with 30/45 minutes
  if (hours % 1 !== 0) {
    minutes += (hours % 1) * 60;
    hours -= (hours % 1);
  }
  var currentTimeZone = date.toTimeString();
  minutes += date.getUTCMinutes();

  // if minutes go above 60, set minutes to the remainder and add one hour
  if (minutes >= 60) {
    minutes = minutes % 60;
    hours += 1;
  }
  //adds "0" to the front of minutes
  var tempMinutes = "0" + minutes;
  minutes = tempMinutes;
  //calculates hour and AM//PM
  var hourFormat = "";
  if (hours < 0) {
    hours += 24;
  }
  if (units === "us" && hours === 0) {
    hours += 12;
    hourFormat = "am"
  } else if (units === "us" && hours > 0 && hours < 12) {
    hourFormat = "am";
  } else if (units === "us" && hours === 12) {
    hourFormat = "pm";
  } else if (units === "us" && hours > 12 && hours < 24) {
    hours -= 12;
    hourFormat = "pm";
  } else if (units === "us" && hours === 24) {
    hours -= 12;
    hourFormat = "am";
  } else if (units === "us" && hours > 24) {
    hours -= 24;
    hourFormat = "am";
  } else if (units !== "us" && hours > 24) {
    hours -= 24;
  } else if (units !== "us" && hours === 24) {
    hours -= 24;
  }

  minutes = minutes.toString();
  //if there is no timeZone that means location was not searched via autocomplete, so it was located via geolocation (current location)
  if (timeZone === "") {
    timeZone = currentTimeZone.substr(-4, 3);
  }
  //sometimes it can't detect timezone, so "local time" sounds better than "undefined"
  if (typeof timeZone === 'undefined') {
    timeZone = "local time";
  };

  //if this function was called with parameters "date" for the first page
  if (divName === "date") {
    if(hourFormat!=="")var formattedTime = "As of " + hours + ":" + minutes.substr(-2) + " " + hourFormat + " " + timeZone;
    else var formattedTime = "As of " + hours + ":" + minutes.substr(-2) +" " + timeZone;

  } //if hourly div, minutes = 0 and F is selected, add a PM or AM
  else if (units === "us" && (minutes === "0" || minutes === "00")) {
    var formattedTime = hours + hourFormat.toUpperCase();
  } //if hourly div, minutes = 0 and C is selected, add :00
  else if (units !== "us" && (minutes === "0" || minutes === "00")) {
    var formattedTime = hours + ":00";
  }
  //if hourly divs & is a sunrise or sunset
  else {
    var formattedTime = hours + ":" + minutes.substr(-2) + hourFormat.toUpperCase();
  }
  $("#" + divName).html(formattedTime);
}

function convertHourly(units, data) {
  var list = [];
  for (var i = 0; i < 24; i++) {
    list[i] = {
      "time": data.hourly.data[i].time,
      "weatherIcon": data.hourly.data[i].icon,
      "temperature": data.hourly.data[i].temperature
    };
  }
  list[0] = {
    "time": data.currently.time,
    "weatherIcon": data.currently.icon,
    "temperature": data.currently.temperature
  };
  if (data.currently.time <= data.daily.data[0].sunriseTime) {
    list[24] = {
      "time": data.daily.data[0].sunriseTime,
      "weatherIcon": "sunrise-icon",
      "temperature": "Sunrise"
    };
  } else {
    list[24] = {
      "time": data.daily.data[1].sunriseTime,
      "weatherIcon": "sunrise-icon",
      "temperature": "Sunrise"
    };
  }
  if (data.currently.time <= data.daily.data[0].sunsetTime) {
    list[25] = {
      "time": data.daily.data[0].sunsetTime,
      "weatherIcon": "sunset-icon",
      "temperature": "Sunset"
    };
  } else {
    list[25] = {
      "time": data.daily.data[1].sunsetTime,
      "weatherIcon": "sunset-icon",
      "temperature": "Sunset"
    };
  }
  //sorts the list[x] from earliest time to latest time
  list.sort(function(a, b) {
    if (a.time > b.time) {
      return 1;
    }
    if (a.time < b.time) {
      return -1;
    }
    return 0;
  });
  //renames the first item in list[x] to be "Now"
  list[0].time = "Now";

  for (var x = 0; x < list.length; x++) {
    var hourDivName = "hourTime" + x;
    var tempDivName = "hourTemp" + x;
    var hourIconDiv = "hourIcon" + x;
    var hourRainPercent = "hourRainPercent" + x;
    var rainPercent = (Math.round((data.hourly.data[x].precipProbability) * 10) * 10);

    if (list[x].weatherIcon === "rain") {
      if (rainPercent === 0) {
        $("#" + hourRainPercent).html("5%");
      } else {
        $("#" + hourRainPercent).html(rainPercent + "%");
      }
    } else {
      $("#" + hourRainPercent).html(" ");
    }

    var imageURL = "<img src = 'images/" + list[x].weatherIcon + ".png' alt = 'weatherIcon' height ='50' width = '50'>";
    convertTime(units, list[x].time, data.offset, hourDivName);
    convertTemp(units, list[x].temperature, tempDivName);
    $("#" + hourIconDiv).html(imageURL);
  }
}

function convertDayOfWeek(unixTime, UTCOffset, divName) {
  var date = new Date((unixTime + (UTCOffset * 3600)) * 1000);
  var weekday = date.getUTCDay();
  switch (weekday) {
    case 0:
      weekday = "Sunday";
      break;
    case 1:
      weekday = "Monday";
      break;
    case 2:
      weekday = "Tuesday";
      break;
    case 3:
      weekday = "Wednesday";
      break;
    case 4:
      weekday = "Thursday";
      break;
    case 5:
      weekday = "Friday";
      break;
    case 6:
      weekday = "Saturday";
      break;
    default:
      weekday = "Error";
  }
  $("#" + divName).html(weekday);
}

function convertWeekly(units, data) {
  var list = [];
  for (var i = 0; i < 8; i++) {
    list[i] = {
      "time": data.daily.data[i].time,
      "weatherIcon": data.daily.data[i].icon,
      "temperatureMin": data.daily.data[i].temperatureMin,
      "temperatureMax": data.daily.data[i].temperatureMax
    };
  }
  for (var x = 0; x < list.length; x++) {
    var dayOfWeek = "day" + x;
    var tempDivName = "weeklyTemp" + x;
    var weatherIconURL = "<img class = 'weeklyIconImg' src = 'images/" + list[x].weatherIcon + ".png' alt = 'weathericon' height= '80' width = '80'>";
    convertDayOfWeek(list[x].time, data.offset, dayOfWeek);
    convertTemp(units, list[x].temperatureMax, tempDivName, list[x].temperatureMin);
    $("#weeklyIcon" + x).html(weatherIconURL)
  }
}
//change video background based off of weather icon
function changeVideo(icon) {
  var player = $("#bgVideo");
  $("#bgVideo").attr("poster", "videos/" + icon + ".jpg");
  $("#bgVideo").attr("background", "url('videos/" + icon + ".jpg') no-repeat;");
  $("#mp4").attr("src", "videos/" + icon + ".mp4");
  //$("#webm").attr("src", "/videos/" + icon + ".webm");
  player.load();
}

//button on footer scrolls to top of page
$("#scrollUp").on("click", function() {
  $("html, body").animate({
    scrollTop: 0
  }, "fast")
});

//smooth scroll animation when clicking on nav bar
$(".smoothScrollUp").on("click", function(e) {
  e.preventDefault();
  $("html, body").animate({
    scrollTop: $(this.hash).offset().top
  }, "slow", function() {});
  //fixes glitch where active class is not removed after clicked then scrolled away (because of focus)
  $(this).blur();
});

// listen for scroll
$(window).scroll(function() {
  var scroll = $(window).scrollTop();
  // apply css classes based on the situation
  if (scroll > 575) {
    $("#nav").addClass("navbar-fixed-top");
    $("#nav").addClass("navbar-default");
    $(".navbar").removeClass("nav1");
  } else {
    $("#nav").removeClass("navbar-default");
    $("#nav").removeClass("navbar-fixed-top");
    $(".navbar").addClass("nav1");

  }
});

$("#fButton").on("click", function(e) {
  e.preventDefault();
  if (locationUnit !== "us") {
    locationUnit = "us";
    var placeholder = document.getElementById("search").placeholder;
    $("#search").val(placeholder);
    searchCityInfo();
  }
})

$("#cButton").on("click", function(e) {
  e.preventDefault();
  if (locationUnit === "us") {
    locationUnit = "si";
    var placeholder = document.getElementById("search").placeholder;
    $("#search").val(placeholder);
    searchCityInfo();
  }
})
