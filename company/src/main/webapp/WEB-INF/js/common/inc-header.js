
function fullScreenStatus() {
  return document.fullscreen ||
   document.mozFullScreen ||
   document.webkitIsFullScreen ||
   document.msFullscreenElement;
 }

function changescreen()
{
	 if (fullScreenStatus()){
		 exitfullscreen();
	 }
	 else {
		 enterfullscreen();
	 }
}


function enterfullscreen()
{
	var docElm = document.documentElement;
	 
	//W3C 	 
	if (docElm.requestFullscreen) { 	 
	   docElm.requestFullscreen(); 	 
	}	 
	//FireFox 	 
	else if (docElm.mozRequestFullScreen) { 	 
	   docElm.mozRequestFullScreen(); 	 
	}	 
	//Chrome 
	else if (docElm.webkitRequestFullScreen) { 	 
	   docElm.webkitRequestFullScreen(); 	 
	}	 
	//IE11	 
	else if (docElm.msRequestFullscreen) {	 
		docElm.msRequestFullscreen();	 
	}
	
};


function exitfullscreen()
{
	if (document.exitFullscreen) {
	     document.exitFullscreen();
	}
	 else if (document.msExitFullscreen) {
	     document.msExitFullscreen();
	 }
	 else if (document.mozCancelFullScreen) {
	     document.mozCancelFullScreen();
	 }
	 else if (document.webkitCancelFullScreen) {
	     document.webkitCancelFullScreen();
	 }
	
};


var fullscreenState = document.getElementById("fullscreen-state");
if (fullscreenState) {
	 document.addEventListener("fullscreenchange", function () {
	  fullscreenState.innerHTML = (document.fullscreenElement)? "" : "not ";
	 }, false);
	
	 document.addEventListener("msfullscreenchange", function () {
	  fullscreenState.innerHTML = (document.msFullscreenElement)? "" : "not ";
	 }, false);
	
	 document.addEventListener("mozfullscreenchange", function () {
	  fullscreenState.innerHTML = (document.mozFullScreen)? "" : "not ";
	 }, false);
	
	 document.addEventListener("webkitfullscreenchange", function () {
	  fullscreenState.innerHTML = (document.webkitIsFullScreen)? "" : "not ";
	 }, false);
}