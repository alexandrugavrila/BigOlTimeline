// This controls the mouseover tooltip events for the region headers. It will pop up
// a tooltip that shows the map of what the region looks like

var svg = document.getElementById('headersvg')
var tooltip = document.getElementById('headertooltip');
var tooltip_text = tooltip.getElementsByTagName('text')[0];
var tooltip_rects = tooltip.getElementsByTagName('rect');
var headers = document.getElementsByClassName('regionbox');

console.log(tooltip.children);

for (var i = 0; i < headers.length; i++) {
    headers[i].addEventListener('mousemove', showHeaderTooltip);
    headers[i].addEventListener('mouseout', hideHeaderTooltip);
}

function showHeaderTooltip(evt) {
    tooltip.setAttributeNS(null, 'visibility', 'visible');          // Make the tooltip visible
    var selected_region = evt.target;                               // Capture the region we're hovering
    var transforms = tooltip.transform.baseVal;                     // Get all of the transforms on the element


    // If the first transform isn't a translate add one
    if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
        var translate = svg.createSVGTransform();                           // Create empty SVG transform
        translate.setTranslate(0, 0);                                       // Make it transform by 0
        tooltip.transform.baseVal.insertItemBefore(translate, 0)            // Add the translate to the transform list
    }

    transform = transforms.getItem(0);                      // Get the first element on the transform list, which we know to be a translate
    var coord = getMousePosition(evt);                      // Get the mouse position of the mousemove event
    transform.setTranslate(coord.x + 15, coord.y + 10);     // Change the position of the tooltip to 15 pixels left and 10 pixels down from the pointer

    tooltip_text.textContent = selected_region.getAttributeNS(null, 'data-tooltip-text');     // Change tooltip text to be the region
    tooltip_length = tooltip_text.getComputedTextLength();                                    // Find length of the tooltip text
    for (var i = 0; i < tooltip_rects.length; i++) {                                          // Change the width of each rectangle in the tooltip to the text length + 8
        tooltip_rects[i].setAttributeNS(null, "width", tooltip_length + 8);
    }
}

function hideHeaderTooltip(evt) {
    tooltip.setAttributeNS(null, 'visibility', 'hidden');
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