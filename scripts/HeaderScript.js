/* VARIABLE DECLARATIONS */
var headersvg = document.getElementById('headersvg');
var headerbar = document.getElementById('headerbar');
var headertooltip = document.getElementById('headertooltip');
var headertooltiptext = document.getElementById('headertooltiptext');
var headertooltipmap = document.getElementById('headertooltipmap');             // Get the group container for the map
var headertooltipmapsvg = document.getElementById('headertooltipmapsvg');       // Get the actual map svg
var headers = document.getElementsByClassName('regionbox');

var controlsbutton = document.getElementById('controlsbutton');
var controlsbuttonbox = document.getElementById('controlsbuttonbox');
var controlsbuttontext = document.getElementById('controlsbuttontext');
var controlspopupbox = document.getElementById('controlspopupbox');
var controlsanimationgroup = document.getElementById('controlsanimationgroup');
var controlsanimations = document.getElementsByClassName('controlsanimation');
var controlsanimationx = document.getElementById('controlsanimationx');
var controlsanimationy = document.getElementById('controlsanimationy');
var controlsanimationheight = document.getElementById('controlsanimationheight');
var controlsanimationwidth = document.getElementById('controlsanimationwidth');
var controlsanimationrect = document.getElementById('controlsanimationrect');


/* SCRIPT */
for (var i = 0; i < headers.length; i++) {
    headers[i].addEventListener('mousemove', showHeaderTooltip);
    headers[i].addEventListener('mouseout', hideHeaderTooltip);
}
controlsbutton.addEventListener('mouseover', controlsButtonMouseOver);
controlsbutton.addEventListener('mouseout', controlsButtonMouseOut);
controlsbutton.addEventListener('mousedown', controlsButtonMouseDown);
controlsbutton.addEventListener('mouseup', controlsButtonMouseUp);
