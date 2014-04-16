var moodTags = []; 
var songs = [];

function switchScreens() {
	$('#home-page').toggleClass('hidden')
	$('#playlist').toggleClass('hidden')
	$('#menu').addClass('hidden')
	
}

function toggleMenu() {
	$('#menu').toggleClass('hidden')
}

function goHome () {
	$('#home-page').removeClass('hidden')
	$('#playlist').addClass('hidden')
}

$('.back-button, #playlist-button')
	.on('click', switchScreens);

$('.menu-button').on('click', toggleMenu);

$('.home-button').on('click', goHome);

var splitTags = function(moodObject) {
	var moods 
	if (moodObject !== null) {
		moods = moodObject.split (',')
	}
	else {
		moods = ['untagged']
	}

	return moods
}

var formatTag = function(moodTag) {
	return moodTag.trim().toLowerCase()
} 

var sliderOptions = {
	horizontal: 1,
	itemNav: 'forceCentered',
	scrollBy: 1,
	activateMiddle: 1,
	touchDragging: 1,
	mouseDragging: 1,
	activateOn: 'click',
	smart: true,
	speed: 50
};

var callbackMap = {
	active: function(eventName, itemIndex) {
		console.log(moodTags[itemIndex]);
	}

}

var sliderElementOne = $('.slider-container').first()
var sliderElementTwo = $('.slider-container').last()
var sliderOne = new Sly( sliderElementOne, sliderOptions, callbackMap );
var sliderTwo = new Sly( sliderElementTwo, sliderOptions, callbackMap );


function play() {
	var moodOne = moodTags[sliderOne.rel.activeItem];
	var moodTwo = moodTags[sliderTwo.rel.activeItem];
	var matchingSongToTag = function(song) {
		var hasMoodOne =  _.contains(song.tags, moodOne);
		var hasMoodTwo = _.contains(song.tags, moodTwo);
		return hasMoodOne && hasMoodTwo;
	};

	var matchingSongs = _.filter(songs, matchingSongToTag)
	console.log(matchingSongs)
	var songListItems = _.map(matchingSongs, renderSong) 
	songListItems = songListItems.join(' ');
	$('#playlist ul') .html(songListItems)
	switchScreens ()

}

var renderSong = function (song) {
	return "<li>" + song.Artist + " - " + song.Song + "</li>" 
}

$('#play-button').on('click', play)

var addSong = function(song){
	var tags = song['Mood Tag'];
	// console.log(tags)
	tags = splitTags(tags);
	// console.log(tags)
	tags = _.map (tags, formatTag);
	// console.log(tags, '\n')
	song.tags = tags;
	songs.push(song);
}


var initialize = function() {
	songData.each(addSong)
	// console.log(songs)
   	moodTags = _.chain(songs)
   		.pluck('tags')
		.flatten()
		.unique ()
		.without('')
		.value();
	$('.slider-container').each(function( i, el ) {
		var $el = $( el );
		$el.find('ul')
			.html('<li>'+moodTags.join('</li> <li>')+'</li>');
	})
	sliderOne.init()
	sliderTwo.init()
  }



var songData = new Miso.Dataset({
  key : "0Auivztrde1nqdGY2SGU3NGNRbTRLYXk5cG0yTEg0SGc",
  worksheet : "1",
  importer : Miso.Dataset.Importers.GoogleSpreadsheet,
  parser : Miso.Dataset.Parsers.GoogleSpreadsheet
});
songData.fetch({
  success : initialize,
  error : function() {
    // your error callback here!
  }
});






