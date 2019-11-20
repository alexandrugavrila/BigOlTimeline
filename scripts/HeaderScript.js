/* VARIABLE DECLARATIONS */

var headersvg = document.getElementById('headersvg');

// Header Elements
var headerbar = document.getElementById('headerbar');
var headerboxes = document.getElementsByClassName('regionbox');
var headertexts = document.getElementsByClassName('regiontext');
var headerboxesgroup = document.getElementById('regionboxes');
var headertextsgroup = document.getElementById('regiontexts');

// Header tooltip elements
var headertooltip = document.getElementById('headertooltip');
var headertooltiptext = document.getElementById('headertooltiptext');
var headertooltipmap = document.getElementById('headertooltipmap');             // Get the group container for the map
var headertooltipmapsvg = document.getElementById('headertooltipmapsvg');       // Get the actual map svg

// Controls elements
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
var controlspopup = document.getElementById('controlspopup');


// Global Variables
var regionboxwidth = headerboxes[0].getAttributeNS(null, 'width');

/* SCRIPT */

formatHeaderTransforms();   // Add blank transforms to all of the elements that may need transforming
adjustRegionTexts();    // Truncate all of the region header texts properly

for (var i = 0; i < headerboxes.length; i++) {
    headerboxes[i].addEventListener('mousemove', showHeaderTooltip);
    headerboxes[i].addEventListener('mouseout', hideHeaderTooltip);
}
controlsbutton.addEventListener('mouseover', controlsButtonMouseOver);
controlsbutton.addEventListener('mouseout', controlsButtonMouseOut);
controlsbutton.addEventListener('mousedown', controlsButtonMouseDown);
controlsbutton.addEventListener('mouseup', controlsButtonMouseUp);
