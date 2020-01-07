/* VARIABLE DECLARATIONS */

// Structural elements
var bodysvg = document.getElementById('bodysvg');
var chartbody = document.getElementById('chartbody');
var timelinebody = document.getElementById('timelinebody');
// Style elements
var svgStyleSheet = document.styleSheets[1];
var pyearlabelstyle, syearlabelstyle = getYearLabelStyles();
// Power group hover tooltip elements
var powergroups = document.getElementsByClassName('powergroup');
var powertooltip = document.getElementById('powertooltip');
var powertooltiprects = powertooltip.getElementsByTagName('rect');
var powertooltippower = document.getElementById('powertooltippower');
var powertooltipregion = document.getElementById('powertooltipregion');
var powertooltipyears = document.getElementById('powertooltipyears');
// Year elements
var yeartooltip = document.getElementById('yeartooltip');
var yeartooltiprect = yeartooltip.getElementsByTagName('rect')[0];
var yeartooltipyear = document.getElementById('yeartooltipyear');
var yearlabels = document.getElementById('timelineyearlabels');
var pyearlines = document.getElementById('pyearlines');
var pyearlabels = document.getElementById('pyearlabels');
var secondaryyearlines = document.getElementById('syearlines');
var secondaryyearlabels = document.getElementById('syearlabels');
// Selection elements
var bodyselectrectgroup = document.getElementById('bodyselectionrect');    // The group that contains the selection rectangle
var bodyselectrect = bodyselectrectgroup.getElementsByTagName('rect')[0];       // The rectangle element inside of the selection group
// Controls elements
var controlspopup = document.getElementById('controlspopup');


// Global variables
var chartbottom = -1000
var charttop = 2019
var chartwidth = 1500
var barwidth = 100
var zoomfactor = 0.075;                 // The amount the zoomSVGObject function zooms in or out by
var bodyclick = { x: 0, y: 0 };         // Saves the location of a click on the body svg
var pyearlabeldefaultfontsize = parseFloat(pyearlabelstyle.style.fontSize.match(/\d+(?:\.\d+)?/g), 10); // Pull the number out of the font-size parameter of the primary year label style
var syearlabeldefaultfontsize = parseFloat(syearlabelstyle.style.fontSize.match(/\d+(?:\.\d+)?/g), 10); // Pull the number out of the font-size parameter of the secondary year label style
var focusgroup = null;  // The current focus
var focusanimations = [];   // A list of animations that need to be run backwards to undo the current focus
var focusinvis = [];    // A list of elements made invisible by the current focus group
var focusdisplay = [];  // A list of elements that are not displayed because of the current focus group

/* SCRIPT */

for(var i = 0; i < powergroups.length; i++) {
    powergroups[i].addEventListener('mouseover', powerMouseOverEffects);
    powergroups[i].addEventListener('mouseout', powerMouseOutEffects);
    powergroups[i].addEventListener('dblclick', powerDblclick);
}
bodysvg.addEventListener('mousedown', chartBodyMouseDown);
bodysvg.addEventListener('wheel', chartBodyMouseWheel);
bodysvg.addEventListener('mouseenter', chartBodyMouseEnter);
bodysvg.addEventListener('mousemove', chartBodyMouseMove);
bodysvg.addEventListener('mouseout', chartBodyMouseOut);

initializeChart();