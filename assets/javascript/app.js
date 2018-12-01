// Initialize Firebase
var config = {
    apiKey: "AIzaSyAOPqOfuiDFoo_BVc7nHtcB7x0DbDtIGUc",
    authDomain: "c-group-project-1.firebaseapp.com",
    databaseURL: "https://c-group-project-1.firebaseio.com",
    projectId: "c-group-project-1",
    storageBucket: "",
    messagingSenderId: "479131120752"
};
firebase.initializeApp(config);

var database = firebase.database();

// test code to verify database functionality

database.ref().set({
    LastQuery: "Test",
    User: "Major Tom"
});

var movieTitleRelease = [];
var movieDbArray = [];
var movieDbKey = '8db22003a978a1dbb48400e1d0ef0fa7';

var app = {
    trendingMovieDB: function () {
        $.ajax({
            url: 'https://api.themoviedb.org/3/trending/all/day?api_key='+ movieDbKey,
            method: 'GET'
        }).then(function (response) {
            movieDbArray = response.results;
            console.log(movieDbArray);
            for (i = 0; i < movieDbArray.length; i++) {
                if (movieDbArray[i].hasOwnProperty('original_name')) {
                    movieTitleRelease.push(movieDbArray[i].original_name);
                    movieTitleRelease.push(movieDbArray[i].first_air_date);
                } else {
                    movieTitleRelease.push(movieDbArray[i].original_title);
                    movieTitleRelease.push(movieDbArray[i].release_date);
                }
                app.drawBoxes();
            }
        });
    },

    searchMovieDB: function (searchText) {
        var queryURL = 'https://api.themoviedb.org/3/search/';
        var type = 'movie';
        var additionalParams = '&include_adult=false&language=en-US&page=1';
        if ($('#tv').is(':checked')) {
            type = 'tv';
            isTV = true;
        }
        else {
            isTV = false;
        }
        $.ajax({
            url: queryURL + type + '?api_key=' + movieDbKey + '&query=' + searchText + additionalParams,
            method: 'GET'
        }).then(function (response) {
            movieDbArray = response.results;
            console.log(movieDbArray);
            for (i = 0; i < movieDbArray.length; i++) {
                if (movieDbArray[i].hasOwnProperty('original_name')) {
                    console.log('TV');
                    movieTitleRelease.push(movieDbArray[i].original_name);
                    movieTitleRelease.push(movieDbArray[i].first_air_date);
                } else {
                    console.log('Movie');
                    movieTitleRelease.push(movieDbArray[i].original_title);
                    movieTitleRelease.push(movieDbArray[i].release_date);
                    console.log(movieDbArray[i].original_title);
                    console.log(movieDbArray[i].release_date);
                }
                app.drawBoxes();
            }
        });
    },

    drawBoxes: function () {
        $('#results').empty()
        for (i = 0; i < movieDbArray.length; i++) {
            var card = $('<div class="thumbNail card">')
            var poster = $('<div class="card-image">')
            var content = $('<div class="card-content">')
            poster.append('<img src="http://image.tmdb.org/t/p/w185//' + movieDbArray[i].poster_path + '">')
                .addClass('posterImg')
            if (movieDbArray[i].hasOwnProperty('original_name')) {
                content.append('<p>' + movieDbArray[i].original_name + ' (' + movieDbArray[i].first_air_date.substring(0, 4) + ')</p>')
            } else {
                content.append('<p>' + movieDbArray[i].original_title + ' (' + movieDbArray[i].release_date.substring(0, 4) + ')</p>')
            }
            card.attr('dataIndex', i)
                .append(poster)
                .append(content)
            $("#results").append(card);
        }
    },

    movieSummary: function (i) {
        console.log('modal results');
        $('.modal').addClass('is-active')
        $('.modal-card-title').empty()
        if (movieDbArray[i].hasOwnProperty('original_name')) {
            $('.modal-card-title').append(movieDbArray[i].original_name + ' (' + movieDbArray[i].first_air_date.substring(0, 4) + ')')
        } else {
            $('.modal-card-title').append(movieDbArray[i].original_title + ' (' + movieDbArray[i].release_date.substring(0, 4) + ')')
        }
        $('#modalResults').empty()
            .append('<img src="http://image.tmdb.org/t/p/w185//' + movieDbArray[i].poster_path + '">');
        var list = $('<ul>');
        list.append('<li>Overview: ' + movieDbArray[i].overview + '</li>')
            .append('<li>Popularity: ' + movieDbArray[i].popularity + '</li>')
            .append('<li>Release Date: ' + movieDbArray[i].release_date + '</li>')
            .append('<li>Vote Average: ' + movieDbArray[i].vote_average + '</li>')
            .append('<li>Vote Count: ' + movieDbArray[i].vote_count + '</li>')
        $('#modalResults').append(list)
        app.searchUtelly(i);
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
        }).then(function (response) {

            var result = response.results;


            console.log(result);

            $.each(result, function (index) {


                for (var j = 0; j < movieTitleRelease.length; j++) {

                    // console.log("moviename" + result[index].name);

                    if (movieTitleRelease[j].toLowerCase() === result[index].name.toLowerCase()) {

                        var title = result[index].name;
                        console.log(title);
                        var topicImage = result[index].picture;
                        console.log(topicImage);
                        var streaming = result[index].locations;
                        var releaseYear = movieTitleRelease[j + 1];
                        console.log(releaseYear);
                    }
                };

                $.each(streaming, function (index) {
                    var streamingText = $("<p>").text("Streaming Platform:");
                    $('#results').append(streamingText);

                    var icon = $("<img>");
                    icon.attr("src", streaming[index].icon, " ");
                    $('#results').append(icon);

                    var streamingUrl = $("<p>").text("Watch");
                    streamingUrl.attr("href", streaming[index].url, " ");


                    $('#results').append(streamingUrl);


                });
            });
        });
    }
}

$(document).ready(function () {
    console.log('init');
    $("#submitBtn").click(function (e) {
        e.preventDefault();
        app.searchMovieDB($("#searchText").val());
    });
    $(document).on('click', '.thumbNail', function () {
        console.log('click');
        app.movieSummary($(this).attr('dataIndex'))
        // app.searchUtelly($(this).attr('mName'),$(this).attr('mYame'));
    });
    $(document).on('click', '.modalClose', function () {
        console.log('click');
        $('.modal').attr('class','modal')
    });
    $(document).on('click', '#trendingBtn', function () {
        console.log('click');
        app.trendingMovieDB();
    });
});
