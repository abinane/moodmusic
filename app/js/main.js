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

var MoodSlider = function(sliderelement) {
	this.el = sliderelement;
	this.init();
};

MoodSlider.prototype.init = function() {
	var callbackMap = {};
	callbackMap.active = function(eventName, itemIndex) {
		this.el.trigger('activate', {
			index: itemIndex,
			mood: this.shuffledMoods[itemIndex]
		});
	}.bind(this);
	this.sly = new Sly(this.el, sliderOptions, callbackMap);
};

MoodSlider.prototype.update = function(mood) {
	this.el.find('li').each(function(index, el) {
		var $el = $(el);
		var active = validMoods(mood, $el.text());
		if ( active ) {
			$el.removeClass('inactive');
		} else {
			$el.addClass('inactive');
		}
	});
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

MoodSlider.prototype.getActiveMood = function() {
	return this.shuffledMoods[ this.sly.rel.activeItem ];
};

var validMoods = function(mood1, mood2) {
	var matchingSongs = _.filter(songs, function(song) { 
		var hasMoodOne = _.contains(song.tags, mood1);
		var hasMoodTwo = _.contains(song.tags, mood2);

		return hasMoodOne && hasMoodTwo;
	});

	return matchingSongs.length > 0;
}

function switchScreens(page) {
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
	var moodOne = sliderOne.getActiveMood();
	var moodTwo = sliderTwo.getActiveMood();

	var matchingSongToTag = function(song) {
		var hasMoodOne =  _.contains(song.tags, moodOne);
		var hasMoodTwo = _.contains(song.tags, moodTwo);
		return hasMoodOne && hasMoodTwo;
	};

	var matchingSongs = _.filter(songs, matchingSongToTag)
	matchingSongs = _.shuffle(matchingSongs)
	matchingSongs = _.first(matchingSongs, 10)

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
}

$('#play-button').on('click', play)

var addSong = function(song){
	var tags = song['Mood Tag'];

	tags = splitTags(tags);

	tags = _.map (tags, formatTag);

	song.tags = tags;
	songs.push(song);
}

var initialize = function() {
	songData.each(addSong)

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
	sliderOne.el.on('activate', function( evt, data ) {
  		sliderTwo.update(data.mood)
  	});

  	sliderTwo.el.on('activate', function( evt, data ) {
  		sliderOne.update(data.mood);
	});
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






