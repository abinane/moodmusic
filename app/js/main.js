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

$('.slider-container').sly(sliderOptions);









// // Trying out sly.js
// $('#mood-slider').sly({
// 	horizontal: 1,
// 	itemNav: 'basic',
// 	smart: 1,
// 	activateOn: 'click',
// 	mouseDragging: 1,
// 	touchDragging: 1,
// 	releaseSwing: 1,
// 	startAt: 3,
// 	// scrollBar: $wrap.find('.scrollbar'),
// 	scrollBy: 1,
// 	// pagesBar: $wrap.find('.pages'),
// 	activatePageOn: 'click',
// 	speed: 300,
// 	elasticBounds: 1,
// 	easing: 'easeOutExpo',
// 	dragHandle: 1,
// 	dynamicHandle: 1,
// 	clickBar: 1,

// 	// Buttons
// 	// forward: $wrap.find('.forward'),
// 	// backward: $wrap.find('.backward'),
// 	// prev: $wrap.find('.prev'),
// 	// next: $wrap.find('.next'),
// 	// prevPage: $wrap.find('.prevPage'),
// 	// nextPage: $wrap.find('.nextPage')
// })

