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

var databaseRef = firebase.database().ref('appdata');
var movieTitleRelease = [];
var movieDbArray = [];
var dataIndex = 0;

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

                movieTitleRelease.push(movieList);
                movieTitleRelease.push(movieReleaseDate);
                console.log(movieList);
                console.log(movieReleaseDate);
                app.drawBoxes(response);
            }
        });
    },

    drawBoxes: function (response) {
        movieDbArray = response.results;
        $('#results').empty()
        for (i = 0; i < response.results.length; i++) {
            var card = $('<div class="thumbNail card">')
            var poster = $('<div class="card-image">')
            var content = $('<div class="card-content">')
            poster.append('<img src="http://image.tmdb.org/t/p/w185//' + response.results[i].poster_path + '">')
                .addClass('posterImg')
            content.append('<p>' + response.results[i].original_title + ' (' + response.results[i].release_date.substring(0, 4) + ')</p>');
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
            .append(movieDbArray[i].original_title + ' (' + movieDbArray[i].release_date.substring(0, 4) + ')');
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
    },

    // adds user to database by uid for tracking/storing 
    addUserToDatabase: function (user) {
        console.log(user.uid);

        var userInfo = {}
        userInfo.email = user.email;
        userInfo.displayName = user.displayName;
        userInfo.uid = user.uid;
        userInfo.favorites = {};
        databaseRef.child(user.uid).push(userInfo);
        app.currentUser = userInfo;
    },

    // updates favorites
    updateFavorites: function (received) {
        var data = received.val();
        console.log(data);
        for (key in data) {
            var arr = data[key];
            console.log(arr);
            if (arr.iud == app.currentUser.uid) {
                app.favorites = arr.favorites;
            }
        }
    },

    // pushes the movie info JSON to an array "favorites" attached to uid
    addToWatchList: function (i) {
        // console.log(movieDbArray[i].id);
        // databaseRef.child(app.currentUser).child('favorites').push(movieDbArray[i]);
    },
    // current user has uid for storing user specific lists of favorites
    currentUser: {},

    favorites: [],

    // Draw favorites
    drawFavorites: function (array) {
        $('#results').empty()
        for (i = 0; i < array.length; i++) {
            var card = $('<div class="thumbNail card">')
            var poster = $('<div class="card-image">')
            var content = $('<div class="card-content">')
            poster.append('<img src="http://image.tmdb.org/t/p/w185//' + response.results[i].poster_path + '">')
                .addClass('posterImg')
            content.append('<p>' + response.results[i].original_title + ' (' + response.results[i].release_date.substring(0, 4) + ')</p>');
            card.attr('dataIndex', i)
                .append(poster)
                .append(content)
            $("#results").append(card);
        }
    },

    userIsNew: function (uid) {
        for (key in databaseRef) {
            if (key == uid) {
                console.log(key);
                return false;
            }
        }
        return true;
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
        dataIndex = $(this).attr('dataIndex')
        app.movieSummary(dataIndex)
    });
    $(document).on('click', '.modalClose', function () {
        console.log('click');
        $('.modal').attr('class', 'modal')
    });
    $(document).on('click', '.addToWatchList', function () {
        console.log('click');
        app.addToWatchList(dataIndex);
    })
    $(document).on('click', '#watchListBtn', function () {
        app.favorites = databaseRef.child(app.currentUser.uid).favorites;
        app.drawFavorites(app.favorites);
    });

    databaseRef.on("value", app.updateFavorites);
});


// This needs to be scoped globally for reasons that are above my paygrade
function login() {
    function newLoginHappened(user) {
        // User is signed in
        if (user) {
            // Check for new User
            if (app.userIsNew(user.uid)) {
                app.addUserToDatabase(user);
            } else {
                app.currentUser = user.uid;
            }
            //databaseRef('users').child(user);
        } else {
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithRedirect(provider);
        }
    }
    firebase.auth().onAuthStateChanged(newLoginHappened);
}

// This may or may not be necessary. It would probably be a better UI if the
// user wasn't prompted to login until they actually wanted to save favorites
// but for now this is what has it working
window.onload = login;