/* VARIABLE DECLARATIONS */

var headersvg = document.getElementById('headersvg');

// Header Elements
var headerbar = document.getElementById('headerbar');
var headerregions = document.getElementsByClassName('regiongroup')
var headerboxes = document.getElementsByClassName('regionbox');
var headertexts = document.getElementsByClassName('regiontext');
var headerboxesgroup = document.getElementById('regionboxes');
var headercenterlines = document.getElementsByClassName('regionline');

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
var controlscheckbox = document.getElementById('controlscheckbox');
var controlscheckboxrect = document.getElementById('controlscheckboxrect');
var controlscheckmark = document.getElementById('controlscheckmark');
var controlscheckboxtext = document.getElementById('controlscheckboxtext');


// Global Variables
var regionboxwidth = headerboxes[0].getAttributeNS(null, 'width');
var oldcenter = getOffset(headercenterlines[0]).left

/* SCRIPT */

for (var i = 0; i < headerboxes.length; i++) {
    headerboxes[i].addEventListener('mousemove', showHeaderTooltip);
    headerboxes[i].addEventListener('mouseout', hideHeaderTooltip);
}
controlsbutton.addEventListener('mouseover', controlsButtonMouseOver);
controlsbutton.addEventListener('mouseout', controlsButtonMouseOut);
controlsbutton.addEventListener('mousedown', controlsButtonMouseDown);
controlsbutton.addEventListener('mouseup', controlsButtonMouseUp);
controlsminimizebutton.addEventListener('mouseover', controlsMinimizeButtonMouseOver);
controlsminimizebutton.addEventListener('mouseout', controlsMinimizeButtonMouseOut);
controlsminimizebutton.addEventListener('mousedown', controlsMinimizeButtonMouseDown);
controlsminimizebutton.addEventListener('mouseup', controlsMinimizeButtonMouseUp);
controlscheckbox.addEventListener('mouseout', controlsCheckBoxMouseOut);
controlscheckbox.addEventListener('mousedown', controlsCheckBoxMouseDown);
controlscheckbox.addEventListener('mouseup', controlsCheckBoxMouseUp);