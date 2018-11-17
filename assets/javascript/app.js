var app = {
  searchMovieDB: function (searchText, isTV) {
    var key = '8db22003a978a1dbb48400e1d0ef0fa7';
    var queryURL = 'https://api.themoviedb.org/3/search/';
    var type = 'movie';
    var additionalParams = '&include_adult=false&language=en-US&page=1';
    var results = [];

    if (isTV === true){
      type = 'tv';
      // additionalParams = '';
    } 
    $.ajax({
      url: queryURL + type + '?api_key=' + key + '&query=' + searchText + additionalParams,
      method: 'GET'
    }).done(function (response) {
      // console.log(response);
      app.drawBoxes(response);
    });
  },

  drawBoxes: function (response) {
    console.log(response.results);
    // console.log('drawBoxes');
    for (i = 0; i < response.results.length; i++) {
      var box = $('<div>');
      box.addClass('thumbNail');
      box.append('<img src="http://image.tmdb.org/t/p/w185//' + response.results[i].poster_path + '">')
      .append('<p>' + response.results[i].title + '</p>')
      .append('<p>' + response.results[i].release_date + '</p>')
      $("#results").append(box);
      console.log('loop')

    }
    console.log('end');
  },

  searchUtelly: function (searchText) {
    
    // var value = $("#searchText").val();
    // console.log(value);

    // var searchedText = value.replace(/\s/g, "+");
    
    var searchedText = searchText.replace(/\s/g, "+");


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
          // app.searchResults(newJson);
      }
    });
  },

  searchResults: function(json) {
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
}

$(document).ready(function () {
  console.log('init');
  $("#submitBtn").click(function(e) {
      e.preventDefault();
      app.searchMovieDB($("#searchText").val());
    });
  });