var moodTags = []; 
var songs = [];

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

// $('.slider-container').each(function( i, el ) {
// 		var $el = $( el );
// 		$el.find('ul')
// 			.html('<li>'+moodTags.join('</li> <li>')+'</li>');
// 	})
// 	sliderOne.init()
// 	sliderTwo.init()

var callbackMap = {
	active: function(eventName, itemIndex) {
		console.log(moodTags[itemIndex]);
	}
};

var MoodSlider = function(sliderelement) {
	this.el = sliderelement;
	this.init();
};

MoodSlider.prototype.init = function() {
	this.sly = new Sly(this.el, sliderOptions, callbackMap)
};

MoodSlider.prototype.render = function() {
	this.el.find('ul')
			.html('<li>'+this.shuffledMoods.join('</li> <li>')+'</li>');
	this.sly.init();
};

MoodSlider.prototype.set = function(moods) {
	this.moods = moods;
	this.shuffledMoods = _.shuffle(moods);
	this.render();
};

function switchScreens(page) {
	console.log(page)
	$('.page').addClass("hidden")
	$('#' + page).removeClass('hidden')
	$('#menu').addClass('hidden')
}

function toggleMenu() {
	$('#menu').toggleClass('hidden')
}

$('[data-name]').on('click', function(evt){
	var page = $(this).data('name')
	switchScreens(page)
})

$('.menu-button').on('click', toggleMenu);

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


var sliderOne = new MoodSlider($('.slider-container').first())
var sliderTwo = new MoodSlider($('.slider-container').last())


function play() {
	var moodOne = moodTags[sliderOne.sly.rel.activeItem];
	var moodTwo = moodTags[sliderTwo.sly.rel.activeItem];
	var matchingSongToTag = function(song) {
		var hasMoodOne =  _.contains(song.tags, moodOne);
		var hasMoodTwo = _.contains(song.tags, moodTwo);
		return hasMoodOne && hasMoodTwo;
	};

	var matchingSongs = _.filter(songs, matchingSongToTag)
	matchingSongs = _.shuffle(matchingSongs)
	matchingSongs = _.first(matchingSongs, 10)
	console.log(matchingSongs[0])

	var songListItems = _.map(matchingSongs, renderSong) 
	songListItems = songListItems.join(' ');
	$('#playlist ul') .html(songListItems)
 	
 	if (matchingSongs[0]) {
 		$('.current.song').html(matchingSongs[0].Song)
 		$('.current.artist').html(matchingSongs[0].Artist)
 		$('#playlist-button').removeClass('hidden')
 	}
 	else {
 		$('.current.song').html("No match found")
 		$('.current.artist').html("")
 		$('#playlist-button').addClass('hidden')
 	}
}

var getYoutube = function(song) {
	var link = song.Artist + " " + song.Song
    link = encodeURIComponent(link)
    link = link.replace(/%20/g, '+').replace(/'/g, '%27')
    return "https://www.youtube.com/results?search_query=" + link
}

var renderSong = function (song) {
	return "<li><a href='" + getYoutube(song) + "'> " + song.Artist + " - " + song.Song + "</a> </li>" 
/*
<li>The Ting Tings - That's Not My Name</li>
<a href=" "> </a>
*/
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
		.without('untagged')
		.value()
		.sort();
	

	sliderOne.set(moodTags)
	sliderTwo.set(moodTags)
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






