//variable declarations
var venuePin;
var map;
var artist;
var venue;
//default location that will change once venue is established
var latitude = 34.44562;
var longitude = -119.2454;
var venueLocation = {
  lat: latitude,
  lng: longitude
};
var category = "restaurant";
var queryBIT;
$(document).ready(function () {


  //initially hiding results
  $("#results").hide();
  $("#venue-options").hide();
  //initially hiding potentially broken links
  $("#city").hide();
  $("#location-rate").hide();
  $("#page-link").hide();
  $("#map").hide();
  $("#venue-list").hide();
  $("#related").hide();
  $("#venue").hide();
  $("#artist").hide();
  $("#map-buttons").hide();
  $("#current-selection").hide();

  function displayArtistInfo() {
    queryAI = "https://rest.bandsintown.com/artists/" + artist + "?app_id=ekno27"

    $.ajax({
      url: queryAI,
      method: "GET"
    }).then(function (response) {
      artist = response.name
      console.log(response)
    });
  }

  //displays band info on corresponding div
  function displayBandInfo(venue, city) {
    //  console.log(venue);
    $("#artist").text(artist);
    $("#venue").text("Venue: " + venue);
    $("#city").text("City: " + city);
  }
  //functions that get ajax calls 
  // gets BIT data for usage
  function eventOptions(artist) {
    console.log("hello");
    queryBIT = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=ekno27";

    //ajax call for bandsintown API
    $.ajax({
      url: queryBIT,
      method: "GET"
    }).then(function (response) {

      for (var i = 0; i < response.length; i++) {
        var optionDiv = $("<div>");
        $(optionDiv).attr("id", "sub-event");
        $(optionDiv).attr("city", response[i].venue.city);
        $(optionDiv).attr("latitude", response[i].venue.latitude);
        $(optionDiv).attr("longitude", response[i].venue.longitude);
        $(optionDiv).attr("venue", response[i].venue.name);
        optionDiv.addClass("card");
        //making card-title
        var cardTitle = $("<h5>");
        cardTitle.addClass("card-title");
        cardTitle.text(response[i].venue.name);
        var subTitle = $("<h6>");
        subTitle.addClass("card-subtitle mb-2 text-muted");
        subTitle.text(response[i].venue.city + ", " + response[i].venue.region);
        var date = $("<p>");
        date.text("Date: " + response[i].datetime);


        $(optionDiv).append(cardTitle);
        $(optionDiv).append(subTitle);
        $(optionDiv).append(date);
        $("#append-venues").append(optionDiv);

      }

    });
  }


  //pressing the submit button or the enter key to submit data 

  //event listener for enter key
  $(window).keydown(function (event) {
    if (event.keyCode == 13) {

      if (artist = $("#artist-name").val().trim() !== "") {
        event.preventDefault();
        $("#results").hide();
        //show results
        $("#append-venues").empty();
        $("#venue-options").show();

        //var declaration 
        artist = $("#artist-name").val().trim();

        $("#venue-list").show();
        displayArtistInfo()
        eventOptions(artist);
        return false;


        // console.log("artist: " + artist);
        // eventOptions(artist, venue);
      } else {
        alert("Please enter an artist!");
      }
    }
  });
  $("#submit").on("click", function () {
    if ($("#artist-name").val().trim() !== "") {

      event.preventDefault();
      $("#results").hide();
      //show results
      $("#append-venues").empty();

      //var declaration 
      artist = $("#artist-name").val().trim();
      // eventOptions(artist, venue);

      $("#venue-list").show();
      displayArtistInfo()
      eventOptions(artist);
      return false;
    } else {
      alert("Please enter an artist!");

    }

  });

  $("#append-venues").on("click", "#sub-event", function () {
    // console.log(this);
    latitude = parseFloat($(this).attr("latitude"));
    longitude = parseFloat($(this).attr("longitude"));
    var currVenue = $(this).attr("venue");
    // console.log(currVenue + "curr")
    var city = $(this).attr("city");
    venueLocation = {
      lat: latitude,
      lng: longitude
    };
    initMap();
    displayBandInfo(currVenue, city);
    $("#results").show();
    $("#map").show();
    $("#venue-options").hide();
    $("#venue-list").hide();
    $("#related").show();
    $("#navbar").show();
    $("#venue").show();
    $("#artist").show();
    $("#current-selection").show();
    $("#related").show();
    $("#map-buttons").show();
    $("#city").show();
    $("#artist-name").val("");
    $("#artist-name").attr("placeholder","Who are you going to see next?");



  });

  $("#category-buttons").on("click", ".btn", function () {
    category = $(this).attr("id");
    // console.log(category);
    initMap();
  });

}); //end of document.ready

//google functions
function initMap() {
  // console.log(venueLocation);
  //makes map centered at venue
  map = new google.maps.Map(document.getElementById("map"), {
    center: venueLocation,
    zoom: 14
  });
  //selects what kind of service will be given
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: venueLocation,
    radius: 1000,
    type: [category]
  }, callback); //callback will check if the call was successful

  //creating a marker for the venue 
  var marker = new google.maps.Marker({
    position: venueLocation,
    map: map,
    title: venue
  });
}

//displays clicked marker
function displaySelection(markerInfo) {
  // console.log(markerInfo);
  var id = markerInfo.place_id;
  var detail = new google.maps.places.PlacesService(map);
  detail.getDetails({
    placeId: id
  }, function (place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {

      // console.log(place.website);
      //display results in related side
      $("#location-name").text(place.name);
      $("#location-rate").text("Rating: " + place.rating + "/5");
      $(".location-address").text("Address: " + place.formatted_address);
      $("#page-link").text("Website");
      $("#page-link").attr("href", place.website);
    }
  });
}

// displays related results
function displayRelatedResults(markerInfo) {
  $("#related-results").empty();
  var id = markerInfo.place_id; //will be used to retrieve results


  //god please work 
  //used to obtain objects containing local information
  var detail = new google.maps.places.PlacesService(map);
  detail.getDetails({
    placeId: id
  }, function (place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // console.log(place.formatted_address);
      //display results in related side

      var resultDiv = $("<div>");
      $(resultDiv).attr("id", "sub-card");
      resultDiv.addClass("card");
      //making card-title
      var cardTitle = $("<h5>");
      cardTitle.addClass("card-title");
      cardTitle.text(place.name);
      var subTitle = $("<h6>");
      subTitle.addClass("card-subtitle mb-2 text-muted");
      subTitle.text(place.formatted_address);
      $(resultDiv).append(cardTitle);
      $(resultDiv).append(subTitle);
      $("#related-results").append(resultDiv);
      //   console.log(place.name);

    }
  });

}

//retrieves places from api 
function callback(results, status) {


  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < 8; i++) {
      displayRelatedResults(results[i]);
      createMarker(results[i]);

    }
  }
}



//function will create markers
function createMarker(place) {
  var color;
  switch (category) {
    //markers will be of different colors depending on category
    case "restaurant":
      color = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
      break;
    case "bar":
      color = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
      break;
    case "parking":
      color = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
      break;
    case "lodging":
      color = "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";
      break;

  }
  //making markers for each category
  if (place.geometry !== undefined) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: color,
      title: place.name,

    });

    //adds information about the marker clicked onto the pin 
    google.maps.event.addListener(marker, 'click', function () {
      displaySelection(place);
      $("#location-name").text(place.name);
      //shows links that would otherwise be broken
      $("#location-rate").show();
      $("#page-link").show();


      // console.log(place.name);
    });
  } else {
    // console.log("error");
    return;
  }

}
