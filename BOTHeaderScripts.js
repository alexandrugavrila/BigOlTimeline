// This controls the mouseover tooltip events for the region headers. It will pop up
// a tooltip that shows the map of what the region looks like

var svg = document.getElementById('headersvg')
var tooltip = document.getElementById('headertooltip');
var tooltiptext = document.getElementById('tooltiptext');
var tooltipmap = document.getElementById('tooltipmap');             // Get the group container for the map
var tooltipmapsvg = document.getElementById('tooltipmapsvg');       // Get the actual map svg

var headers = document.getElementsByClassName('regionbox');
for (var i = 0; i < headers.length; i++) {
    headers[i].addEventListener('mousemove', showHeaderTooltip);
    headers[i].addEventListener('mouseout', hideHeaderTooltip);
}

function showHeaderTooltip(evt) {
    tooltip.setAttributeNS(null, 'visibility', 'visible');          // Make the tooltip visible
    tooltipmap.setAttributeNS(null, 'visibility', 'visible');       // Make the tooltip map visible
    var selected_region = evt.target;                               // Capture the region we're hovering

    var tooltiptransforms = tooltip.transform.baseVal;              // Get all of the transforms on the tooltip element
    var tooltipmaptransforms = tooltipmap.transform.baseVal;        // Get all of the transforms on the tooltip map element
    if (tooltiptransforms.length === 0 || tooltiptransforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {         // If the first transform isn't a translate add one
        var translate = svg.createSVGTransform();                                                                                   // Create empty SVG transform
        translate.setTranslate(0, 0);                                                                                               // Make it transform by 0
        tooltip.transform.baseVal.insertItemBefore(translate, 0)                                                                    // Add the translate to the transform list
    }
    if (tooltipmaptransforms.length === 0 || tooltipmaptransforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {   // If the first transform isn't a translate add one
        var translate = svg.createSVGTransform();                                                                                   // Create empty SVG transform
        translate.setTranslate(0, 0);                                                                                               // Make it transform by 0
        tooltipmap.transform.baseVal.insertItemBefore(translate, 0)                                                                 // Add the translate to the transform list
    }

    tooltiptransform = tooltiptransforms.getItem(0);                      // Get the first element on the tooltip transform list, which we know to be a translate
    tooltipmaptransform = tooltipmaptransforms.getItem(0);                // Get the first element on the tooltipmap transform list, which we know to be a translate
    var coord = getMousePosition(evt);                                    // Get the mouse position of the mousemove event
    tooltiptransform.setTranslate(coord.x + 25, coord.y + 10);            // Change the position of the tooltip to 25 pixels left and 10 pixels down from the pointer
    tooltipmaptransform.setTranslate(coord.x + 35, coord.y + 40);         // Change the position of the tooltip map to 35 pixels left and 40 pixels down from the pointer

    tooltiptext.textContent = selected_region.getAttributeNS(null, 'data-tooltip-text');        // Change tooltip text to be the region
    var tarborder = tooltiptext.textContent.replace(/ /g,'').toLowerCase().concat('border');    // The id of the target border is going to be the region, lowercase, without spaces, plus 'border'
    document.getElementById(tarborder).setAttributeNS(null, 'visibility', 'visible');           // Set the target border to visible
    tooltipmapsvg.setAttribute('viewBox', getviewbox(tarborder));                               // Set the viewbox to what is specified in getviewbox per region
}

function hideHeaderTooltip(evt) {
    tooltip.setAttributeNS(null, 'visibility', 'hidden');
    tooltipmap.setAttributeNS(null, 'visibility', 'hidden');
    hideborders();
}

// Helper Functions

// Return the X and Y of the mouse in the current viewbox
function getMousePosition(evt) {
    var CTM = svg.getScreenCTM();
    return{
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
    };
}

// Set the visibility of all borders to hidden
function hideborders() {
    var regionborders = document.getElementsByClassName('regionborder');
    for(var i = 0; i < regionborders.length; i++){
        regionborders[i].setAttributeNS(null, 'visibility', 'hidden');
    }
}

function getviewbox(border){
    var viewboxgroup;

    switch(border) {
        case 'irelandborder': 
            viewboxgroup = 'westerneurope';
            break;
        case 'scotlandborder': 
            viewboxgroup = 'westerneurope';
            break;
        case 'britainborder': 
            viewboxgroup = 'westerneurope';
            break;
    }

    switch(viewboxgroup) {
        case 'westerneurope':
            return '1035 460 270 200'
    }
}