var movieTitleRelease = [];
var movieDbArray = [];

var app = {
        searchMovieDB: function (searchText, isTV) {
            var key = '8db22003a978a1dbb48400e1d0ef0fa7';
            var queryURL = 'https://api.themoviedb.org/3/search/';
            var type = 'movie';
            var additionalParams = '&include_adult=false&language=en-US&page=1';

            if (isTV === true) {
                type = 'tv';
                // additionalParams = '';
            }
            $.ajax({
                url: queryURL + type + '?api_key=' + key + '&query=' + searchText + additionalParams,
                method: 'GET'
            }).then(function (response) {
            
                var movieResults = response.results;
                console.log(movieResults);

                for (i = 0; i < response.results.length; i++) {

                    var movieList = response.results[i].original_title;
                    var movieReleaseDate = response.results[i].release_date;

                    
                    console.log(movieList);
                    console.log(movieReleaseDate);
                    app.drawBoxes(response);
                }
            });
        },


        drawBoxes: function (response) {
          movieDbArray = response.results;
            for (i = 0; i < response.results.length; i++) {
                var box = $('<div>');
                box.addClass('thumbNail')
                    .attr('dataIndex', i)
                    .append('<img src="http://image.tmdb.org/t/p/w185//' + response.results[i].poster_path + '">')
                    .append('<p>' + response.results[i].original_title + '</p>')
                    .append('<p>' + response.results[i].release_date + '</p>');

                $("#results").append(box);
            }
        },

        movieSummary: function (i) {
          $('#results').empty()

          .append('<img src="http://image.tmdb.org/t/p/w185//' + movieDbArray[i].poster_path + '">');
          var list = $('<ul>');
          list.append('<li>' + movieDbArray[i].original_title + '</li>')
          .append('<li>' + movieDbArray[i].overview + '</li>')
          .append('<li>' + movieDbArray[i].popularity + '</li>')
          .append('<li>' + movieDbArray[i].release_date + '</li>')
          .append('<li>' + movieDbArray[i].vote_average + '</li>')
          .append('<li>' + movieDbArray[i].vote_count + '</li>')

          $('#results').append(list);
          movieTitleRelease.push(movieDbArray[i].original_title);
          movieTitleRelease.push(movieDbArray[i].release_date);

          $.each(list, function(utellySearch){


          app.searchUtelly(utellySearch);
          });
          
        },

        


        searchUtelly: function (i) {

                var uMovie = movieDbArray[i].original_title.replace(/\s/g, "+");
                var utellyurl = "https://utelly-tv-shows-and-movies-availability-v1.p.mashape.com/lookup?country=us&term=" + uMovie;
                console.log(uMovie);

                $.ajax({
                        url: utellyurl,
                        method: "GET",
                        dataType: "json",
                        headers: {
                            "X-Mashape-Key": "ETvaxKZbFhmshL3jAAZP4Ylhx0iYp1v9LNHjsnY3CSBvSlVwgt"
                        }
                    }).then(function(response) {
                      
                            var result = response.results;

                            
                            
                            
                            console.log(result);


                            $.each(result, function(index) {

        

                                for (var j=0; j < movieTitleRelease.length ; j++) {
                                  
                                  // console.log("moviename" + result[index].name);
                              
                                   if (movieTitleRelease[j].toLowerCase() === result[index].name.toLowerCase()){

                                    var title = result[index].name;
                                    console.log(title);
                                     var topicImage = result[index].picture;
                                    console.log(topicImage);
                                    var streaming = result[index].locations;
                                     var releaseYear = movieTitleRelease[j+1];
                                     console.log(releaseYear);
                                   }
                                  };

                                  $.each(streaming, function (index) {
                                    var streamingText = $("<p>").text("Streaming Platform:");
                                    $('#results').append(streamingText);

                                    var icon = $("<img>");
                                    icon.attr("id", "icons");
                                    icon.attr("src", streaming[index].icon ," ");
                                    $('#results').append(icon);

                                    streamingUrl= $("<a>");
                                    streamingUrl.attr("href", streaming[index].url, " ");
                                    $(icon).wrap(streamingUrl);
                                    
                                    
                                    
                                  

                                    
                                    
                                });
                            });
                          });
                        }
                      }

                      $(document).ready(function () {
                        console.log('init');
                        $("#submitBtn").click(function(e) {
                            e.preventDefault();
                            app.searchMovieDB($("#searchText").val());
                          });
                        });
                      
                        $(document).on('click', '.thumbNail', function () {
                          console.log('click');
                          app.movieSummary($(this).attr('dataIndex'))
                          // app.searchUtelly($(this).attr('mName'),$(this).attr('mYame'));
                        });