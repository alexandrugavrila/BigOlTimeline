/* VARIABLE DECLARATIONS */

// Structural elements
var bodysvg = document.getElementById('bodysvg');
var chartbody = document.getElementById('chartbody');
var timelinebody = document.getElementById('timelinebody');
// Power group hover tooltip elements
var powergroups = document.getElementsByClassName('powergroup');
var bodytooltip = document.getElementById('bodytooltip');
var bodytooltiprects = bodytooltip.getElementsByTagName('rect');
var bodytooltippower = document.getElementById('bodytooltippower');
var bodytooltipregion = document.getElementById('bodytooltipregion');
var bodytooltipyears = document.getElementById('bodytooltipyears');
// Selectrion elements
var bodyselectrectgroup = document.getElementById('bodyselectionrectangle');    // The group that contains the selection rectangle
var bodyselectrect = bodyselectrectgroup.getElementsByTagName('rect')[0];       // The rectangle element inside of the selection group
// Controls elements
var controlspopup = document.getElementById('controlspopup');
// Styles
var primaryyearlines = document.getElementById('primaryyearlines');
var secondaryyearlines = document.getElementById('secondaryyearlines');

// Global variables
var zoomfactor = 0.075;                 // The amount the zoomSVGObject function zooms in or out by
var bodyclick = { x: 0, y: 0 };         // Saves the location of a click on the body svg


/* SCRIPT */
for (var i = 0; i < powergroups.length; i++) {
    powergroups[i].addEventListener('mouseover', powerMouseOverEffects);
    powergroups[i].addEventListener('mouseout', powerMouseOutEffects);
}
bodysvg.addEventListener('mousedown', chartBodyMouseDown);
bodysvg.addEventListener('wheel', chartBodyMouseWheel);

