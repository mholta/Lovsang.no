 var spotifyID = ""
  var spotifyTarget = document.getElementById("spotify-embed-target")
  var spotifyLoaded = false

function lazySpotify() {
	if (! spotifyLoaded && isInViewport(spotifyTarget)) {
  	spotifyTarget.innerHTML = '<iframe src="https://open.spotify.com/embed/track/' + spotifyID + '" width="100%" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
		spotifyLoaded = true
    window.removeEventListener('scroll', lazySpotify, false)
    window.removeEventListener('resize', lazySpotify, false)
  }
}

function isInViewport(elem) {
  var bounding = elem.getBoundingClientRect();
  return (
      bounding.top >= -100 &&
      bounding.left >= 0 &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}



function initLazy() {
  lazySpotify()
  window.addEventListener('scroll', lazySpotify, false)
  window.addEventListener('resize', lazySpotify, false)
}
