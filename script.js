
// Initialize Firebase


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA_ubIvQMN6NzlOB0B2DYFVeVAVZn2KBv0",
    authDomain: "group-project-b3d87.firebaseapp.com",
    databaseURL: "https://group-project-b3d87.firebaseio.com",
    projectId: "group-project-b3d87",
    storageBucket: "group-project-b3d87.appspot.com",
    messagingSenderId: "83091955855"
  };
  firebase.initializeApp(config);
</script>

var database = firebase.database();


//Display Previously Downloaded Songs From Firebase
$(document).ready(function() {

 	database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {

 		$("#histLog").append(
 	    "<tr><td> " + snapshot.val().searchKeyword + 
 	    "</td><td> " + snapshot.val().songTitle +
 	    "</td><td> " + (moment(snapshot.val().dateAdded).format("MM/DD/YY hh:mm A")) +
 	    "</td></tr><br>"
		);
 	});
});


var searchKeyword = "";
var finalKeyword = "";

$("#submitBtn").on("click", function(event) {

	event.preventDefault();

	//Assign input value to variable
	searchKeyword = $("#inputValue").val().trim();
	//Concatenate string in case user adds a band name with space in between
	finalKeyword = searchKeyword.split(" ").join("+");

	//Resets the list of entries every time the the submit button is clicked
	$("#displayArtist").empty();
	$("#videoPlayer").empty();

    // runs the song or artist search option picked
	if ($("#artistOrSong option")[0]['selected'] === true) {

		$("#displayArtist").prepend(searchKeyword.charAt(0).toUpperCase() + searchKeyword.substr(1) +"'s Top 10 Songs");

		//assin API url to variable
		var queryUrl = "http://api.musicgraph.com/api/v2/track/search?api_key=6ec87e6f89ee9f0aee16c1f99c37e328&artist_name=" + finalKeyword + "&limit=10";
		
		$.ajax({
			url: queryUrl,
			method: "GET"
		}).done(function(response) {

			$("#displayTable").empty();

			//Initializing the variables with empty arrays 
			var song = [];
			var tubeId = [];
			var album = [];

			//Pull values from JSON API and add to array
			for (var i = 0; i <= 9; i++) {
				song.push(response.data[i].title);
				tubeId.push(response.data[i].track_youtube_id); 
				album.push(response.data[i].album_title);

				//Display table with values from JSON API
				$("#displayTable").append(
					"<tr><td>" + song[i] +
					"</td><td>" + album[i] +
					"</td><td class='center aligned'>" + "<a href='http://www.youtube.com/watch?v=" + tubeId[i] + "?autoplay=1&showinfo=0&controls=0' frameborder='0' target='_blank' class='js-newWindow' data-popup='toolbar=no,scrollbars=yes,resizable=yes,top=70,left=400,width=440,height=300'><input id='videoId' type='image' src='playbutton.png' width='20%'></a>" +
					"</td><td class='center aligned'>" + "<button id='downloadBtn' value='" + song[i] + "' class='ui blue button' style='background: linear-gradient(#22abe9 5%, #010304 100%)'></button>" +
					"</td></tr>"
				);

				$("#downloadBtn").attr("id", "downloadBtn" + [i]);
				$("#videoId").attr("id", "videoId" + [i]);

				//popup window displaying the video of the song when clicking the play button
				$(document).ready(function(){
	            $('.js-newWindow').click(function () {
	 
	                var $this = $(this);
	 
	                var url = $this.attr("href");
	                var windowName = "popUp";
	                var windowSize = $this.data("popup");
	 
	                window.open(url, windowName, windowSize);
	            	});
	        	});


				//Creates download button for each song entry
				var t = $("<a>");
		    	t.attr("href","javascript:convert2mp3('" + tubeId[i] + "')");
		    	t.css("color", "white");
		    	t.text("Download Song");
		    	$("#downloadBtn" + [i]).html(t);

				//firebase code
				//Initialize song title variable before clicking the download button
				var songTitle = "";

				$("#downloadBtn" + [i]).on("click", function() {
			 		//Assing value from val tag from downloadBtn to a variable and push to firebase
			 		songTitle = $(this).val();

			 		database.ref().push({
						searchKeyword: searchKeyword,
						songTitle: songTitle,
						dateAdded: firebase.database.ServerValue.TIMESTAMP
					});	
				});
			};
		});
	} else {
		//dispays when the song search option is chosen
		$("#displayArtist").prepend("Song Results:");

		//assin API url to variable
		var queryUrl = "http://api.musicgraph.com/api/v2/track/search?api_key=6ec87e6f89ee9f0aee16c1f99c37e328&title=" + finalKeyword + "&limit=5";

		$.ajax({
			url: queryUrl,
			method: "GET"
		}).done(function(response) {

			$("#displayTable").empty();

			//Initializing the variables with empty arrays 
			var song = [];
			var tubeId = [];
			var album = [];

			//Pull values from JSON API and add to array
			for (var y = 0; y <= 4; y++) {
				song.push(response.data[y].title);
				tubeId.push(response.data[y].track_youtube_id); 
				album.push(response.data[y].album_title);

				var searchKeyword = response.data[0].artist_name;

				//Display table with values from JSON API
				$("#displayTable").append(
					"<tr><td>" + song[y] +
					"</td><td>" + album[y] +
					"</td><td class='center aligned'>" + "<a href='http://www.youtube.com/watch?v=" + tubeId[y] + "?autoplay=1&showinfo=0&controls=0' frameborder='0' target='_blank' class='js-newWindow' data-popup='toolbar=no,scrollbars=yes,resizable=yes,top=70,left=400,width=440,height=300'><input id='videoId' type='image' src='playbutton.png' width='20%'></a>" +
					"</td><td class='center aligned'>" + "<button id='downloadBtn' value='" + song[y] + "' class='ui blue button' style='background: linear-gradient(#22abe9 5%, #010304 100%)'></button>" +
					"</td></tr>"
				);

				$("#downloadBtn").attr("id", "downloadBtn" + [y]);
				$("#videoId").attr("id", "videoId" + [y]);

				//popup window displaying the video of the song when clicking the play button
				$(document).ready(function(){
	            $('.js-newWindow').click(function () {
	 
	                var $this = $(this);
	 
	                var url = $this.attr("href");
	                var windowName = "popUp";
	                var windowSize = $this.data("popup");
	 
	                window.open(url, windowName, windowSize);
	            	});
	        	});

				//Creates download button for each song entry
				var u = $("<a>");
		    	u.attr("href","javascript:convert2mp3('" + tubeId[y] + "')");
		    	u.css("color", "white");
		    	u.text("Download Song");
		    	$("#downloadBtn" + [y]).html(u);

				//firebase code
				//Initialize song title variable to use during on click event
				var songTitle = "";

				$("#downloadBtn" + [y]).on("click", function() {
			 		//Assing value from val tag from downloadBtn to a variable and push to firebase
			 		songTitle = $(this).val();

			 		database.ref().push({
						searchKeyword: searchKeyword,
						songTitle: songTitle,
						dateAdded: firebase.database.ServerValue.TIMESTAMP
					});	
				});
			};
		});
	};
});

//displays a list of songs downloaded when giving the time and date of each download 
$("#downloadBtn").on("click", function() {
 	database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {

 		$("#histLog").append(
 	    "<tr><td> " + snapshot.val().searchKeyword + 
 	    "</td><td> " + snapshot.val().songTitle +
 	    "</td><td> " + (moment(snapshot.val().dateAdded).format("MM/DD/YY hh:mm A")) +
 	    "</td></tr><br>"
 		);
 	});
});
