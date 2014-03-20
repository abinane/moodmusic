var moodTags = []; 

function switchScreens() {
	$('#home-page').toggleClass('hidden')
	$('#playlist').toggleClass('hidden')
	
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

$('#menu-button').on('click', toggleMenu);

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
	$('#playlist ul')
		.html('You\'ve selected ' + moodOne + ' and ' + moodTwo);
	switchScreens()
} 

$('#play-button').on('click', play)



var songData = new Miso.Dataset({
  key : "0Auivztrde1nqdGY2SGU3NGNRbTRLYXk5cG0yTEg0SGc",
  worksheet : "1",
  importer : Miso.Dataset.Importers.GoogleSpreadsheet,
  parser : Miso.Dataset.Parsers.GoogleSpreadsheet
});
songData.fetch({
  success : function() {
   	moodTags = _.chain( songData.column('Mood Tag').data)
		.map (splitTags)
		.flatten()
		.map (formatTag)
		.unique ()
		.value();
	$('.slider-container').each(function( i, el ) {
		var $el = $( el );
		$el.find('ul')
			.html('<li>'+moodTags.join('</li> <li>')+'</li>');
	})
	sliderOne.init()
	sliderTwo.init()

	// initialize!
  },
  error : function() {
    // your error callback here!
  }
});






