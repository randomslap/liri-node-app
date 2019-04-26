require("dotenv").config();

var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
	case "concert-this":
		axios
			.get(
				"https://rest.bandsintown.com/artists/" +
					arg +
					"/events?app_id=codingbootcamp"
			)
			.then(function(response) {
				console.log("Venue Name: " + response.data[0].venue.name);
				console.log(
					"Venue Location: " +
						response.data[0].venue.city +
						", " +
						response.data[0].venue.region +
						", " +
						response.data[0].venue.country
				);
				console.log(
					"Date: " + moment(response.data[0].datetime).format("MM/DD/YYYY")
				);
			});
		break;
	case "spotify-this-song" + arg:
		spotify.search({ type: "track", query: arg }, function(error, data) {
			if (error) {
				console.log(error);
			}
			console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name);
			console.log("Song Name: " + data.tracks.items[0].name);
			console.log("Album: " + data.tracks.items[0].album.name);
			console.log("URL: " + data.tracks.items[0].album.external_urls.spotify);
		});
		break;
	case "spotify-this-song":
		spotify.search(
			{ type: "track", query: "The Sign" },
			function(err, data) {
				if (err) {
					return console.log("Error occurred: " + err);
				}
				console.log(data.tracks)
			}
		);
}
