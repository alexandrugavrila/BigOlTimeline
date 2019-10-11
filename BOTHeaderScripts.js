// This controls the mouseover tooltip events for the region headers. It will pop up
// a tooltip that shows the map of what the region looks like

var headersvg = document.getElementById('headersvg');
var headerregions = document.getElementById('timelineregions');
var headertooltip = document.getElementById('headertooltip');
var headertooltiptext = document.getElementById('headertooltiptext');
var headertooltipmap = document.getElementById('headertooltipmap');             // Get the group container for the map
var headertooltipmapsvg = document.getElementById('headertooltipmapsvg');       // Get the actual map svg

var headers = document.getElementsByClassName('regionbox');
for (var i = 0; i < headers.length; i++) {
    headers[i].addEventListener('mousemove', showHeaderTooltip);
    headers[i].addEventListener('mouseout', hideHeaderTooltip);
    headers[i].addEventListener('mousedown', mouseClick);
}


function showHeaderTooltip(evt) {
    headertooltip.setAttributeNS(null, 'visibility', 'visible');          // Make the tooltip visible
    headertooltipmap.setAttributeNS(null, 'visibility', 'visible');       // Make the tooltip map visible
    var selectedregion = evt.target;                               // Capture the region we're hovering

    var tooltiptransforms = headertooltip.transform.baseVal;              // Get all of the transforms on the tooltip element
    var tooltipmaptransforms = headertooltipmap.transform.baseVal;        // Get all of the transforms on the tooltip map element
    if (tooltiptransforms.length === 0 || tooltiptransforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {         // If the first transform isn't a translate add one
        var translate = headersvg.createSVGTransform();                                                                                   // Create empty SVG transform
        translate.setTranslate(0, 0);                                                                                               // Make it transform by 0
        headertooltip.transform.baseVal.insertItemBefore(translate, 0)                                                                    // Add the translate to the transform list
    }
    if (tooltipmaptransforms.length === 0 || tooltipmaptransforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {   // If the first transform isn't a translate add one
        var translate = headersvg.createSVGTransform();                                                                                   // Create empty SVG transform
        translate.setTranslate(0, 0);                                                                                               // Make it transform by 0
        headertooltipmap.transform.baseVal.insertItemBefore(translate, 0)                                                                 // Add the translate to the transform list
    }

    tooltiptransform = tooltiptransforms.getItem(0);                      // Get the first element on the tooltip transform list, which we know to be a translate
    tooltipmaptransform = tooltipmaptransforms.getItem(0);                // Get the first element on the tooltipmap transform list, which we know to be a translate
    var coord = getMousePositionHeader(evt);                              // Get the mouse position of the mousemove event
    tooltiptransform.setTranslate(coord.x + 25, coord.y + 10);            // Change the position of the tooltip to 25 pixels left and 10 pixels down from the pointer
    tooltipmaptransform.setTranslate(coord.x + 35, coord.y + 40);         // Change the position of the tooltip map to 35 pixels left and 40 pixels down from the pointer

    headertooltiptext.textContent = selectedregion.getAttributeNS(null, 'data-tooltip-text');        // Change tooltip text to be the region
    var tarborder = headertooltiptext.textContent.replace(/ /g,'').toLowerCase().concat('border');    // The id of the target border is going to be the region, lowercase, without spaces, plus 'border'
    document.getElementById(tarborder).setAttributeNS(null, 'visibility', 'visible');           // Set the target border to visible
    headertooltipmapsvg.setAttribute('viewBox', getViewBox(tarborder));                               // Set the viewbox to what is specified in getviewbox per region
}

function hideHeaderTooltip(evt) {
    headertooltip.setAttributeNS(null, 'visibility', 'hidden');
    headertooltipmap.setAttributeNS(null, 'visibility', 'hidden');
    hideBorders();
}

function mouseClick(evt) {
    var coord = getMousePositionHeader(evt);
    console.log(coord.x, coord.y);
}

// Helper Functions

// Return the X and Y of the mouse in the current viewbox
function getMousePositionHeader(evt) {
    var CTM = headersvg.getScreenCTM();
    return{
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
    };
}

// Set the visibility of all borders to hidden
function hideBorders() {
    var regionborders = document.getElementsByClassName('regionborder');
    for(var i = 0; i < regionborders.length; i++){
        regionborders[i].setAttributeNS(null, 'visibility', 'hidden');
    }
}

// A series of switches to put the border in a group and set the group to a viewbox
function getViewBox(border){
    var viewboxgroup;

    switch(border) {
        case 'irelandborder': 
            viewboxgroup = 'westerneurope';
            break;
        case 'scotlandborder': 
            viewboxgroup = 'westerneurope';
            break;
        case 'britanniaborder': 
            viewboxgroup = 'westerneurope';
            break;
        case 'skandinaviaborder':
            viewboxgroup = 'northerneurope';
            break;
        case 'galliaborder':
            viewboxgroup = 'westerneurope';
            break;
        case 'hispaniaborder':
            viewboxgroup = 'westerneurope';
            break;
        case 'italiaborder':
            viewboxgroup = 'westerneurope';
            break;
    }

    switch(viewboxgroup) {
        case 'westerneurope':
            return '1035 460 270 200';
        case 'northerneurope':
            return '1100 330 405 300';       
    }
}