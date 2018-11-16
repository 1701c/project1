
$(document).ready(function() {

    $("#searchEnter").click(function(e) {
      e.preventDefault();
      var value = $("#searchText").val();
      console.log(value);
  
      var searchedText = value.replace(/\s/g, "+");
  
      var utellyurl= "https://utelly-tv-shows-and-movies-availability-v1.p.mashape.com/lookup?country=us&term=" + searchedText;
      
      $.ajax({
        url : utellyurl,
        headers : {
          "X-Mashape-Key": "KPBprgn6TVmshqAVU5TA1nFdq6xUp1fEvamjsnwBYoPqRIaL3Q",
          "Accept": "application/json"
        },
        dataType : "json",
        success : function(newJson) {
          console.log(newJson);
            searchResults(newJson);
        }
      });
  
      function searchResults(json) {
  
        var results = "";
  
        console.log(results);
  
        //Loop through search results  
        for (var j=0; j < json.results[i].locations.length; j++) {
            console.log(json.results[i].locations[j].url);
            var location_url = json.results[i].locations[j].url;
            results += '<a href="' + location_url + '">';
            results += '<img src="' + json.results[i].locations[j].icon + '" />';
            results += '</a>';
            }  
        }
    });
  });