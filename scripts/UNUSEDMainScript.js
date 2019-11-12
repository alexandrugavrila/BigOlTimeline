/* VARIABLE DECLARATIONS */

// Structural elements
var bodysvg = document.getElementById('bodysvg');
var headersvg = document.getElementById('headersvg');
var chartbody = document.getElementById('chartbody');
var timelinebody = document.getElementById('timelinebody');
var headerbar = document.getElementById('headerbar');
var headers = document.getElementsByClassName('regionbox');
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
var primaryyearlines = document.getElementById('pyearlines');
var primaryyearlabels = document.getElementById('pyearlabels');
var secondaryyearlines = document.getElementById('syearlines');
var secondaryyearlabels = document.getElementById('syearlabels');
// Selection elements
var bodyselectrectgroup = document.getElementById('bodyselectionrect');    // The group that contains the selection rectangle
var bodyselectrect = bodyselectrectgroup.getElementsByTagName('rect')[0];       // The rectangle element inside of the selection group
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


// Global variables
var chartbottom = -1000
var charttop = 2019
var chartwidth = 1500
var zoomfactor = 0.075;                 // The amount the zoomSVGObject function zooms in or out by
var bodyclick = { x: 0, y: 0 };         // Saves the location of a click on the body svg

