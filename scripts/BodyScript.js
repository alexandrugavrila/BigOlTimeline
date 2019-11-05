/* VARIABLE DECLARATIONS */

// Structural elements
var bodysvg = document.getElementById('bodysvg');
var chartbody = document.getElementById('chartbody');
var timelinebody = document.getElementById('timelinebody');
// Power group hover tooltip elements
var powergroups = document.getElementsByClassName('powergroup');
var powertooltip = document.getElementById('powertooltip');
var powertooltiprects = powertooltip.getElementsByTagName('rect');
var powertooltippower = document.getElementById('powertooltippower');
var powertooltipregion = document.getElementById('powertooltipregion');
var powertooltipyears = document.getElementById('powertooltipyears');
// Year tooltip elements
var yeartooltip = document.getElementById('yeartooltip');
var yeartooltiprect = yeartooltip.getElementsByTagName('rect')[0];
var yeartooltipyear = document.getElementById('yeartooltipyear');
// Selection elements
var bodyselectrectgroup = document.getElementById('bodyselectionrect');    // The group that contains the selection rectangle
var bodyselectrect = bodyselectrectgroup.getElementsByTagName('rect')[0];       // The rectangle element inside of the selection group
// Controls elements
var controlspopup = document.getElementById('controlspopup');
// Styles
var primaryyearlines = document.getElementById('primaryyearlines');
var secondaryyearlines = document.getElementById('secondaryyearlines');

// Global variables
var chartbottom = 1000
var zoomfactor = 0.075;                 // The amount the zoomSVGObject function zooms in or out by
var bodyclick = { x: 0, y: 0 };         // Saves the location of a click on the body svg


/* SCRIPT */
formatTransforms(chartbody);
for (var i = 0; i < powergroups.length; i++) {
    powergroups[i].addEventListener('mouseover', powerMouseOverEffects);
    powergroups[i].addEventListener('mouseout', powerMouseOutEffects);
}
bodysvg.addEventListener('mousedown', chartBodyMouseDown);
bodysvg.addEventListener('wheel', chartBodyMouseWheel);
bodysvg.addEventListener('mouseenter', chartBodyMouseEnter);
bodysvg.addEventListener('mousemove', chartBodyMouseMove);
bodysvg.addEventListener('mouseout', chartBodyMouseOut);