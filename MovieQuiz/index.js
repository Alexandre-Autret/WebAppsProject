const pkey = "e6c11c9cb36789ec5ba3044578589795";
var movieId = 0;
var director = "";
var actors = [];
var firstFetch = true;
var all_mIds = [];
var all_aIds = [];
const main = document.getElementById("main");
var depth = 1;
fetch_movie(firstFetch);
var dirId = 0;
var actIds = [];
var person = 0;
var currentMovie = "";

async function fetch_director(id){
	let dir = "None";
	let query = "https://api.themoviedb.org/3/movie/" + id + "/credits?api_key=" + pkey;
	let response = await fetch(query);
	if (response.status != 404){
		let staff = await response.json();
		var i;
		for (i = 0; i < staff.crew.length; i++){
			if (JSON.stringify(staff.crew[i].job).replace(/\"/g, "") == "Director"){
				dirId = JSON.stringify(staff.crew[i].id).replace(/\"/g, "");
				return JSON.stringify(staff.crew[i].name).replace(/\"/g, "").toLowerCase();
			}
		}
	}
	return dir;
}

async function fetch_actors(id){
	acts = [];
	actIds = [];
	let query = "https://api.themoviedb.org/3/movie/" + id + "/credits?api_key=" + pkey;
	let response = await fetch(query);
	if (response.status != 404){
		let staff = await response.json();
		var i;
		for (i = 0; i < staff.cast.length; i++){
			actIds.push(JSON.stringify(staff.cast[i].id).replace(/\"/g, ""));
			acts.push(JSON.stringify(staff.cast[i].name).replace(/\"/g, "").toLowerCase());
		}
	}
	return acts;
}

function clear_divs(){
	document.getElementById("main").innerHTML = "";
}

async function fetch_movie(firstLoad){
	if (firstLoad){
		movieId = 744;
		firstFetch = false;
	} else {
		movieId = Math.floor(Math.random() * 100000);
	}
	console.log(movieId);
	d1 = document.createElement("div");
	d1.setAttribute("id", "info"+String(depth));
	main.appendChild(d1);
	d2 = document.createElement("div");
	d2.setAttribute("id", "inputDiv"+String(depth));
	main.appendChild(d2);
	d3 = document.createElement("input");
	d3.setAttribute("id", "inputBar"+String(depth));
	d3.type = "text";
	d3.placeholder = "Guess the director or an actor";
	d3.setAttribute("onchange", "on_answer()");
	d2.appendChild(d3);
	let query = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + pkey;
	let response = await fetch(query);
	if (response.status != 404){
		let movie = await response.json();
		if (JSON.stringify(movie.adult) == "false") {
			let title = JSON.stringify(movie.title).replace(/\"/g, "");
			let release = JSON.stringify(movie.release_date).replace(/\"/g, "");
			let poster = "https://www.themoviedb.org/t/p/w600_and_h900_bestv2" + JSON.stringify(movie.poster_path).replace(/\"/g, "");
			director = await fetch_director(movieId);
			actors = await fetch_actors(movieId);
			currentMovie = title.toLowerCase();
			d1.innerHTML = title + "<br>" + release + "<br><br><img src='" + poster + "' onerror='fetch_movie(firstLoad);'/><br>";
			all_mIds.push(currentMovie);
		} else {
			clear_divs();
			fetch_movie(false);
		}
	} else {
		clear_divs();
		fetch_movie(false);
	}
};

async function fetch_person(personId, isDirector){
	d1 = document.createElement("div");
	d1.setAttribute("id", "info"+String(depth));
	main.appendChild(d1);
	d2 = document.createElement("div");
	d2.setAttribute("id", "inputDiv"+String(depth));
	main.appendChild(d2);
	let query = "https://api.themoviedb.org/3/person/" + personId + "?api_key=" + pkey;
	let response = await fetch(query);
	if (response.status != 404){
		let personInfo = await response.json();
		d3 = document.createElement("input");
		d3.setAttribute("id", "inputBar"+String(depth));
		d3.type = "text";
		if (isDirector) {
			d3.placeholder = "Guess a different movie they directed";
		} else {
			d3.placeholder = "Guess a different movie they acted in";
		}
		d3.setAttribute("onchange", "on_person_answer()");
		d2.appendChild(d3);
		let name = JSON.stringify(personInfo.name).replace(/\"/g, "");
		let photo = "https://www.themoviedb.org/t/p/w600_and_h900_bestv2" + JSON.stringify(personInfo.profile_path).replace(/\"/g, "");
		if (isDirector){
			d1.innerHTML = name + "<br><br><img src='" + photo + "' alt='No photo available'/><br>";
		} else {
			d1.innerHTML = name + "<br><br><img src='" + photo + "' alt='No photo available'/><br>";
		}
	}
}

async function on_answer() {
	d = document.createElement("div");
	d.setAttribute("id", "result"+String(depth));
	d.setAttribute("class", "result");
	main.appendChild(d);
	let query = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + pkey;
	let response = await fetch(query);
	if (response.status != 404){
		let movie = await response.json();
		let guess = document.getElementById("inputBar" + String(depth)).value.toLowerCase();
		if (!all_aIds.includes(guess)){
			if (director == guess){
				person = dirId;
				all_aIds.push(guess);
				console.log(all_aIds);
				d.innerHTML = "<em>Correct!</em>";
				depth++;
				document.getElementById("errorMessage").innerHTML = "";
				fetch_person(person, true);
			} else if (actors.includes(guess)) {
				person = actIds[actors.indexOf(guess)];
				all_aIds.push(guess);
				console.log(all_aIds);
				d.innerHTML = "<em>Correct!</em>";
				document.getElementById("errorMessage").innerHTML = "";
				depth++;
				fetch_person(person, false);
			} else {
				document.getElementById("errorMessage").innerHTML = "Wrong! Let's try a different movie!";
				all_aIds = [];
				all_mIds = [];
				clear_divs();
				depth = 1;
				fetch_movie(firstFetch);
			}
		} else {
			document.getElementById("errorMessage").innerHTML = "You can't pick the same person twice!";
			all_aIds = [];
			all_mIds = [];
			clear_divs();
			depth = 1;
			fetch_movie(firstFetch);
		}
	}
}

async function fetch_particular_movie(id) {
	movieId = id;
	d1 = document.createElement("div");
	d1.setAttribute("id", "info"+String(depth));
	main.appendChild(d1);
	d2 = document.createElement("div");
	d2.setAttribute("id", "inputDiv"+String(depth));
	main.appendChild(d2);
	d3 = document.createElement("input");
	d3.setAttribute("id", "inputBar"+String(depth));
	d3.type = "text";
	d3.placeholder = "Guess the director or an actor";
	d3.setAttribute("onchange", "on_answer()");
	d2.appendChild(d3);
	let query = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + pkey;
	let response = await fetch(query);
	if (response.status != 404){
		let movie = await response.json();
			let title = JSON.stringify(movie.title).replace(/\"/g, "");
			let release = JSON.stringify(movie.release_date).replace(/\"/g, "");
			let poster = "https://www.themoviedb.org/t/p/w600_and_h900_bestv2" + JSON.stringify(movie.poster_path).replace(/\"/g, "");
			director = await fetch_director(movieId);
			actors = await fetch_actors(movieId);
			currentMovie = title.toLowerCase();
			d1.innerHTML = title + "<br>" + release + "<br><br><img src='" + poster + "' alt='No poster found'/><br>";
			all_mIds.push(currentMovie);
	} else {
		fetch_movie(false);
	}
}

async function on_person_answer() {
	d = document.createElement("div");
	d.setAttribute("id", "result"+depth);
	d.setAttribute("class", "result");
	main.appendChild(d);
	let query = "https://api.themoviedb.org/3/person/" + person + "/movie_credits?api_key=" + pkey;
	let response = await fetch(query);
	if (response.status != 404){
		let guess = document.getElementById("inputBar" + depth).value.toLowerCase();
		let movie_creds = await response.json();
		let movies = [];
		let mIds = [];
		var i;
		for (i = 0; i < movie_creds.crew.length; i++){
			if (JSON.stringify(movie_creds.crew[i].original_title).replace(/\"/g, "").toLowerCase() != currentMovie){
				movies.push(JSON.stringify(movie_creds.crew[i].original_title).replace(/\"/g, "").toLowerCase());
				mIds.push(JSON.stringify(movie_creds.crew[i].id).replace(/\"/g, ""));
			}
		}
		console.log(movies);
		if (movies.includes(guess) && !all_mIds.includes(guess)){
			d.innerHTML = "<em>Correct!</em>";
			depth++;
			fetch_particular_movie(mIds[movies.indexOf(guess)]);
		} else if (all_mIds.includes(guess)){
			document.getElementById("errorMessage").innerHTML = "You can't choose the same movie twice!";
			all_aIds = [];
			all_mIds = [];
			clear_divs();
			depth = 1;
			fetch_movie(firstFetch);
		} else {
			document.getElementById("errorMessage").innerHTML = "Wrong! Let's try a different movie!";
			all_aIds = [];
			all_mIds = [];
			clear_divs();
			depth = 1;
			fetch_movie(firstFetch);
		}
	}
}