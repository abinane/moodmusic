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
	.on('click', switchScreens) 

$('#menu-button').on('click', toggleMenu)

$('.home-button').on('click', goHome)



