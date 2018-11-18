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

var queryURL = 'https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC';

var app = {
  
  searchMovieDB: function (searchText, isTV) {
    var key = '8db22003a978a1dbb48400e1d0ef0fa7';
    var queryURL = 'https://api.themoviedb.org/3/search/';
    var type = 'movie';
    var additionalParams = '&include_adult=false&language=en-US&page=1';
    
    if (isTV === true){
      type = 'tv'
      // additionalParams = '';
    }
    
    $.ajax({
      url: queryURL + type + '?api_key=' + key + '&query=' + searchText + additionalParams,
      method: 'GET'
    }).done(function (response) {
      console.log(response);
    });
  },
}

$(document).ready(function () {
  console.log('init');
  console.log(database);
  });