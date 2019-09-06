// This controls the mouseover events for the power groups. It Dilates every entry 
// for that power and puts an outline around contiguous blocks.
// It also controls the tooltip popup to display information about each block

var bodysvg = document.getElementById('bodysvg')
var bodytooltip = document.getElementById('bodytooltip');
var bodytooltiprects = bodytooltip.getElementsByTagName('rect');
var bodytooltippower = document.getElementById('bodytooltippower');
var bodytooltipregion = document.getElementById('bodytooltipregion');
var bodytooltipyears = document.getElementById('bodytooltipyears');

var powergroups = document.getElementsByClassName('powergroup')
for (var i = 0; i < powergroups.length; i++) {
    powergroups[i].addEventListener('mouseover', powerMouseOverEffects);
    powergroups[i].addEventListener('mouseout', powerMouseOutEffects);
}

function powerMouseOverEffects() {
    this.parentElement.appendChild(this);		// Bring the group to the front
    this.classList.add('powergrouphover');		// Add the dilate image filter

    var powergrouprects = this.getElementsByTagName('rect');                                // Get a list of every rectangle in the group
    for (var i = 0; i < powergrouprects.length; i++) {                                      // Add the mouse move and mouse out event listeners to every rectangle
        powergrouprects[i].addEventListener('mousemove', powerRectMouseMoveEffects);
        powergrouprects[i].addEventListener('mouseout', powerRectMouseOutEffects);
    }
}

function powerMouseOutEffects() {
    this.classList.remove('powergrouphover');	// Remove the dilate image filter
    
    var powergrouprects = this.getElementsByTagName('rect');                                // Get a list of every rectangle in the group
    for (var i = 0; i < powergrouprects.length; i++) {                                      // Remove the mouse move and mouse out event listeners from every rectangle
        powergrouprects[i].removeEventListener('mousemove', powerRectMouseMoveEffects);
        powergrouprects[i].removeEventListener('mouseout', powerRectMouseOutEffects);
    }
}

function powerRectMouseMoveEffects(evt) {
    bodytooltip.setAttributeNS(null, 'visibility', 'visible');          // Make the tooltip visible
    bodytooltip.parentElement.appendChild(bodytooltip);
    var selectedrect = evt.target;                                      // Capture the rect we're hovering

    var tooltiptransforms = bodytooltip.transform.baseVal;              // Get all of the transforms on the tooltip element
    if (tooltiptransforms.length === 0 || tooltiptransforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {         // If the first transform isn't a translate add one
        var translate = bodysvg.createSVGTransform();                                                                               // Create empty SVG transform
        translate.setTranslate(0, 0);                                                                                               // Make it transform by 0
        bodytooltip.transform.baseVal.insertItemBefore(translate, 0)                                                                // Add the translate to the transform list
    }

    tooltiptransform = tooltiptransforms.getItem(0);                      // Get the first element on the tooltip transform list, which we know to be a translate
    var coord = getMousePositionBody(evt);                                // Get the mouse position of the mousemove event
    tooltiptransform.setTranslate(coord.x + 10, coord.y + 40);            // Change the position of the tooltip to 10 pixels left and 40 pixels down from the pointer

    bodytooltippower.textContent = this.parentElement.getAttributeNS(null, 'data-power-name');   // Change first line of tooltip text to be the full power name
    bodytooltipregion.textContent = this.getAttributeNS(null, 'data-region');      // Change the second line of tooltip text to be the region
    var startyear = this.getAttributeNS(null, 'data-start-year');                  // Get the start year
    var endyear = this.getAttributeNS(null, 'data-end-year');                      // Get the end year
    console.log(startyear, endyear)
    bodytooltipyears.textContent = startyear + " to " + endyear;                   // Change the third line of tooltip text to be the year range
    var longesttext = Math.max(bodytooltippower.getComputedTextLength(),           // Get the length of the longest of the three lines of text
                               bodytooltipregion.getComputedTextLength(), 
                               bodytooltipyears.getComputedTextLength());
    for (var i = 0; i < bodytooltiprects.length; i++) {                            // Change the width of the tooltip to be 8 more than the longest text length
        bodytooltiprects[i].setAttributeNS(null, 'width', longesttext + 8)
    }
}

function powerRectMouseOutEffects() {
    bodytooltip.setAttributeNS(null, 'visibility', 'hidden');           // Make the tooltip invisible
}


// Helper Functions

// Return the X and Y of the mouse in the current viewbox
function getMousePositionBody(evt) {
    var CTM = body=bodysvg.getScreenCTM();
    return{
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
    };
}