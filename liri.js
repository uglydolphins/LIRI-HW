// DEPENDENCIES
// =====================================

// Read and set environment variables
require("dotenv").config();

// Import the API keys
var keys = require("./keys");

// Import the node-spotify-api NPM package.
var Spotify = require("node-spotify-api");

// Import the axios npm package.
var axios = require("axios");

// Import the moment npm package.
var moment = require("moment");

// Import the FS package for read/write.
var fs = require("fs");

// Initialize the spotify API client using our client id and secret
var spotify = new Spotify(keys.spotify);

// Functions

// Band in town
var getMyBands = function(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(
        function(response) {
            var jsonData = response.data;

            if (!jsonData.length) {
                console.log("No results found for " + artist);
                return;
            }
            console.log("Upcoming concerts for " + artist + ":");

            for (var i = 0; i < jsonData.length; i++) {
                var show = jsonData[i];
    
                console.log(
                    show.venue.city +
                    "," +
                    (show.venue.region || show.venue.country) +
                    " at " +
                    show.venue.name +
                    " " +
                    moment(show.datetime).format("MM/DD/YYYY")
                )
            }
        }


    )
}

// Spotify
var getArtistNames = function(artist) {
    return artist.name;
  };

var getMeSpotify = function(songName) {
    if (songName === undefined) {
        songName = "The Sign";
    }

    spotify.search(
        {
            type:"track",
            query: songName
        },
        function(err, data) {
            if(err) {
                console.log("Error occured: " + err);
                return;
            }

            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log(i);
                console.log("artists: " + songs[i].artists.map(getArtistNames));
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("*******************");
            }
        }
    )
};


// Movie search
var getMeMovie = function(movieName) {
    if (movieName === undefined) {
        movieName = "Mr Nobdy";
    }

    var urlHit = 
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

    axios.get(urlHit).then(
        function(response) {
            var jsonData = response.data;

            console.log("title: " + jsonData.Title);
            console.log("year: " + jsonData.Year);
            console.log("rated:" + jsonData.Rated);
            console.log("IMDB rating: " + jsonData.imdbRating);
            console.log("country: " + jsonData.Country);
            console.log("language: " + jsonData.Language);
            console.log("plot: " + jsonData.Plot);
            console.log("actors: " + jsonData.Actors);
            console.log("rotting tomatoes rating: " + jsonData.Ratings[1].Value);
        }
    )

}

// function for detrmining which function to run based on txt file
var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);

        var dataArr = data.split(",");

        if (dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            pick(dataArr[0]);
        }
    })
}

// switch function to determine which command is ran
var pick = function(caseData, functionData) {
    switch(caseData) {
        case "concert-search":
            getMyBands(functionData);
            break;
        case "spotify-search":
            getMeSpotify(functionData);
            break;
        case "movie-search":
            getMeMovie(functionData);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("LIRI doesnt know that")
    }
}

// funtion which takes in command line arguments and excutes correct function accordingly
var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
}

runThis(process.argv[2], process.argv.slice(3).join(" "));