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
var uSearch = [];
var movieDbArray = [];
var dataIndex = 0;
var movieDbKey = '8db22003a978a1dbb48400e1d0ef0fa7';

var app = {
    trendingMovieDB: function () {
        $.ajax({
            url: 'https://api.themoviedb.org/3/trending/all/day?api_key=' + movieDbKey,
            method: 'GET'
        }).then(function (response) {
            movieDbArray = response.results;
    
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
        } else {
            isTV = false;
        }
        $.ajax({
            url: queryURL + type + '?api_key=' + movieDbKey + '&query=' + searchText + additionalParams,
            method: 'GET'
        }).then(function (response) {
            movieDbArray = response.results;
            
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

    drawBoxes: function () {
        $('#results').empty()
        for (i = 0; i < movieDbArray.length; i++) {
            var card = $('<div class="thumbNail card">')
            var poster = $('<div class="card-image">')
            var content = $('<div class="card-content">')
            poster.append('<img src="http://image.tmdb.org/t/p/w185//' + movieDbArray[i].poster_path + '">')
                .addClass('posterImg')

            if (movieDbArray[i].hasOwnProperty('original_name')) {
                content.append('<p>' + movieDbArray[i].original_name)
            } else {
                content.append('<p>' + movieDbArray[i].original_title)
            }
            card.attr('dataIndex', i)
                .append(poster)
                .append(content)
            $("#results").append(card);
        }
    },

    movieSummary: function (i) {

        $('.modal').addClass('is-active')
        $('.modal-card-title').empty()

        if (movieDbArray[i].hasOwnProperty('original_name')) {
            $('.modal-card-title').append(movieDbArray[i].original_name)
        } else {
            $('.modal-card-title').append(movieDbArray[i].original_title)
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
        uSearch.push($('.modal-card-title').text());
        app.searchUtelly(i);
    },

    searchUtelly: function () {

        var uMovie = uSearch;
        uSearch.length =1;
        var utellyurl = "https://utelly-tv-shows-and-movies-availability-v1.p.mashape.com/lookup?country=us&term=" + uMovie;
        

        $.ajax({
                url: utellyurl,
                method: "GET",
                dataType: "json",
                headers: {
                    "X-Mashape-Key": "ETvaxKZbFhmshL3jAAZP4Ylhx0iYp1v9LNHjsnY3CSBvSlVwgt"
                }
            }).then(function(response) {
              
                    var result = response.results;

                $.each(result, function(index) {
                        
                    if (uSearch == result[index].name){
                            var streaming = result[index].locations;
                        }
                          
                $.each(streaming, function (index) {

                    var streamingText = $("<p>").text("Streaming Platform:");
                        $('#modalResults').append(streamingText);

                    var icon = $("<img>");
                        icon.attr("id", "icons");
                        icon.attr("src", streaming[index].icon ," ");
                        $('#modalResults').append(icon);

                        streamingUrl= $("<a>");
                        streamingUrl.attr("href", streaming[index].url, " ");
                        $(icon).wrap(streamingUrl);
                });
            });
        });
    },

    // adds user to database by uid for tracking/storing 
    addUserToDatabase: function (user) {
        
        if (this.userIsNew) {
            var userInfo = {}
            userInfo.email = user.email;
            userInfo.displayName = user.displayName;
            userInfo.uid = user.uid;
            userInfo.favorites = {};
            databaseRef.child(user.uid).push(userInfo);
        }
        app.currentUser = user.uid;
    },

    // updates favorites
    updateFavorites: function (received) {
        var data = received.val();
        
        for (key in data) {
            var arr = data[key];
            
            if (key == app.currentUser) {
                
                app.favorites = arr.favorites;
            }
        }
    },

    // pushes the movie info JSON to an array "favorites" attached to uid
    addToWatchList: function (i) {
        
        if (app.currentUser == "") {
            login();
        } else {
            
            databaseRef.child(app.currentUser).child('favorites').push(movieDbArray[i]);
        }
    },
    // current user has uid for storing user specific lists of favorites
    currentUser: "",

    favorites: [],

    // Draw favorites
    drawFavorites: function (array) {
       movieDbArray = Object.values(app.favorites)
       this.drawBoxes();
    },

    userIsNew: function (uid) {
        
        if (databaseRef.hasOwnProperty(uid)){
            return false;
        }
        return true;
    }
}

$(document).ready(function () {
    
    $("#submitBtn").click(function (e) {
        e.preventDefault();
        app.searchMovieDB($("#searchText").val());
    });

    $(document).on('click', '.thumbNail', function () {
        uSearch = [];
        dataIndex = $(this).attr('dataIndex')
        app.movieSummary(dataIndex)
    });

    $(document).on('click', '.modalClose', function () {
        $('.modal').attr('class', 'modal')
    });

    $(document).on('click', '.addToWatchList', function () {
       app.addToWatchList(dataIndex);
    });

    $(document).on('click', '#watchListBtn', function () {
        app.drawFavorites(app.favorites);
    });

    $(document).on('click', '#trendingBtn', function () {
       app.trendingMovieDB();
    });

    databaseRef.on("value", app.updateFavorites);
});


// This needs to be scoped globally
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
            // If no signed in user authenticate
        } else {
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithRedirect(provider);
        }
    }
    firebase.auth().onAuthStateChanged(newLoginHappened);
}


window.onload = login;