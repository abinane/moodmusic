$('#playlist-button').on('click', function() {
	$('#playlist').toggleClass('hidden')
	$('#home-page').toggleClass('hidden')

})
$('.back-button').on('click', function() {
	$('#playlist').toggleClass('hidden')
	$('#home-page').toggleClass('hidden')

})
$('#menu-button').on('click', function() {
	$('#menu').toggleClass('hidden')
})

$('.home-button').on('click', function() {
	$('#home-page').removeClass('hidden')
	$('#playlist').addClass('hidden')
})