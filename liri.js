require("dotenv").config();

const axios = require("axios");
const Spotify = require("node-spotify-api");
const moment = require("moment");
const keys = require("./keys.js");
const fs = require("fs");
const spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var arg = process.argv.slice(3).join(" ");

switch (command) {
	case "concert-this":
		concertSearch(arg);
		break;
	case "spotify-this-song":
		spotifySearch(arg);
		break;
	case "movie-this":
		movieSearch(arg)
		break;
	case "do-what-it-says":
		fs.readFile("random.txt", "utf8", function(error, data) {
			if (error) {
				throw error;
			}
			dataArr = data.split(',')
			if (dataArr[0] == 'spotify-this-song') {
				spotifySearch(dataArr[1]);
			}
		});
}

function concertSearch(arg) {
	if (arg) {
		axios
			.get(
				"https://rest.bandsintown.com/artists/" +
					arg +
					"/events?app_id=codingbootcamp"
			)
			.then(function(response) {
				var concertData = [
					"Venue Name: " + response.data[0].venue.name,
					"Venue Location: " +
						response.data[0].venue.city +
						", " +
						response.data[0].venue.region +
						", " +
						response.data[0].venue.country,
					"Date: " + moment(response.data[0].datetime).format("MM/DD/YYYY"),
				].join("\n\n");
				console.log(concertData);
				addToLog(concertData)
			});
	} else {
		console.log("Please enter an artist");
	}
}

function spotifySearch(arg) {
	if (arg) {
		spotify.search({ type: "track", query: arg }, function(err, data) {
			if (err) {
				return console.log("Error occurred: " + err);
			}
			var spotifyData = [
				"Artists: " + data.tracks.items[0].artists[0].name,
				"Song's name: " + data.tracks.items[0].name,
				"Preview link: " + data.tracks.items[0].preview_url,
				"Album: " + data.tracks.items[0].album.name,
			].join("\n\n");
			console.log(spotifyData);
			addToLog(spotifyData)
		});
	} else {
		spotify.search({ type: "track", query: "Welcome Fort Minor" }, function(
			error,
			data
		) {
			if (error) throw error
			var spotifyData = [
				"Artists: " + data.tracks.items[0].artists[0].name,
				"Song's name: " + data.tracks.items[0].name,
				"Preview link: " + data.tracks.items[0].preview_url,
				"Album: " + data.tracks.items[0].album.name,
			].join("\n\n");
			console.log(spotifyData);
			addToLog(spotifyData)
		});
	}
}

function movieSearch(arg) {
	var URL = "http://www.omdbapi.com/?apikey=trilogy&t=" + arg;
	if (arg) {
		axios
			.get(URL)
			.then(function(response) {
				var movieData = [
					"Movie Title: " + response.data.Title,
					"Year: " + response.data.Year,
					"IMDB Rating: " + response.data.Ratings[0].Value,
					"Rotten Tomatoes Rating: " + response.data.Ratings[1].Value,
					"Country: " + response.data.Country,
					"Language: " + response.data.Language,
					"Plot: " + response.data.Plot,
					"Actors: " + response.data.Actors,
				].join("\n\n");
				console.log(movieData);
				addToLog(movieData)
			})
			.catch(function(error) {
				if (error) throw error;
			});
	} else {
		axios
			.get("http://www.omdbapi.com/?apikey=trilogy&t=Mr.+Nobody")
			.then(function(response) {
				var movieData = [
					"Movie Title: " + response.data.Title,
					"Year: " + response.data.Year,
					"IMDB Rating: " + response.data.Ratings[0].Value,
					"Rotten Tomatoes Rating: " + response.data.Ratings[1].Value,
					"Country: " + response.data.Country,
					"Language: " + response.data.Language,
					"Plot: " + response.data.Plot,
					"Actors: " + response.data.Actors,
				].join("\n\n");
				console.log(movieData);
				addToLog(movieData)
			})
			.catch(function(error) {
				if (error) throw error;
			});
	}
}

function addToLog(data) {
	var divider =
		"\n------------------------------------------------------------\n\n";

	fs.appendFile("log.txt", data + divider, function(error) {
		if (error) throw error;
	});
}