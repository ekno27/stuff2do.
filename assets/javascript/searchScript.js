$(document).ready(function() {
    //once button is submitted, artist variable will be created and 
    var queryURL; 
    var selectedLocation; 

    //will display the venues that the artist will play on the search page 
    function venueSelect(artist){
        var venues = [];
        
    }

   $("#submit").on("click", function(){
        //var declaration 
        var artist = $("#search-term-id").val().trim();
        console.log(artist);
        //will display 
        venueSelect(artist);
   });
    
    }); //end of app.js
    