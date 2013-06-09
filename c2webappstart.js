function updateCanvasSize()
{
	var w = jQuery(window).width();
	var h = jQuery(window).height();
	cr_sizeCanvas(w, h);
};

var resizeIntervalId = -1;

jQuery(window).resize(function() {
	if (window.c2resizestretchmode === 1)
	{
		window.c2resizestretchmode = 2;		// put back when breaking back out of fullscreen
		var canvas = document.getElementById("c2canvas");
		window.c2oldcanvaswidth = canvas.width;
		window.c2oldcanvasheight = canvas.height;
		window.c2eventtime = Date.now();
		updateCanvasSize();
		
		// Mac OS X has a "pretty" animation while it expands out in to fullscreen.
		// This seems to not get the right window size right away. So resize 4 times/sec
		// for the next 1.5 sec to wait for the animation to finish then get the right size.
		resizeIntervalId = setInterval(updateCanvasSize, 250);
		setTimeout(function () {
			clearInterval(resizeIntervalId);
			resizeIntervalId = -1;
		}, 1600);
	}
	else if (window.c2resizestretchmode === 2)
	{
		// Prevent re-firing size events during the initial fullscreen opening from
		// messing this up. Wait for the 2 sec timeout.
		if (resizeIntervalId === -1)
		{
			window.c2resizestretchmode = 0;
			cr_sizeCanvas(window.c2oldcanvaswidth, window.c2oldcanvasheight);
		}
	}
});

// Start the Construct 2 project running on window load.
jQuery(document).ready(function ()
{
	// Create new runtime using the c2canvas
	cr_createRuntime("c2canvas");
});

// Pause and resume on page becoming visible/invisible
function onVisibilityChanged() {
	if (document.hidden || document.mozHidden || document.webkitHidden || document.msHidden)
		cr_setSuspended(true);
	else
		cr_setSuspended(false);
};

document.addEventListener("visibilitychange", onVisibilityChanged, false);
document.addEventListener("mozvisibilitychange", onVisibilityChanged, false);
document.addEventListener("webkitvisibilitychange", onVisibilityChanged, false);
document.addEventListener("msvisibilitychange", onVisibilityChanged, false);