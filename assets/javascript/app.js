$(document).ready(function() {
console.log("hello");







//submit button functionality
$("#submit").on("click", function(){
if($("#artist-name").val().trim()==="" || $("#venue-name").val().trim()==="" ){
    alert("Please fill all categories!");
}

else{
//var declaration 
artist = $("#artist-name").val().trim();

//will display 
venue = $("#venue-name").val().trim();
console.log("artist: " + artist);
console.log("venue: " + venue);

}

});


}); //end of app.js
