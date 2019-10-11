// This controls mouse events for the chart body. 
// Dilates every entry in a power group on mouseover and puts an outline around contiguous blocks.
// Controls the tooltip popup to display information about each block
// Draws rectangle for selection and adjusts viewbox on mouseup

var bodysvg = document.getElementById('bodysvg');
var chartbody = document.getElementById('chartbody');
var bodytooltip = document.getElementById('bodytooltip');
var bodytooltiprects = bodytooltip.getElementsByTagName('rect');
var bodytooltippower = document.getElementById('bodytooltippower');
var bodytooltipregion = document.getElementById('bodytooltipregion');
var bodytooltipyears = document.getElementById('bodytooltipyears');
var bodyselectrectgroup = document.getElementById('bodyselectionrectangle');    // The group that contains the selection rectangle
var bodyselectrect = bodyselectrectgroup.getElementsByTagName('rect')[0];       // The rectangle element inside of the selection group

var zoomfactor = 0.075;                 // The amount the zoomSVGObject function zooms in or out by
var bodyclick = { x: 0, y: 0 };         // Saves the location of a click on the body svg

var powergroups = document.getElementsByClassName('powergroup');
for (var i = 0; i < powergroups.length; i++) {
    powergroups[i].addEventListener('mouseover', powerMouseOverEffects);
    powergroups[i].addEventListener('mouseout', powerMouseOutEffects);
}
bodysvg.addEventListener('mousedown', chartBodyMouseDown);
bodysvg.addEventListener('wheel', chartBodyMouseWheel);

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
    bodytooltip.parentElement.appendChild(bodytooltip);                 // Bring the tooltip to the front
    var selectedrect = evt.target;                                      // Capture the rect we're hovering

    var coord = getMousePositionBody(evt);                                // Get the mouse position of the mousemove event
    translateSVGObject(bodytooltip, coord.x + 10, coord.y + 40);          // Change the position of the tooltip to 10 pixels left and 40 pixels down from the pointer

    bodytooltippower.textContent = this.parentElement.getAttributeNS(null, 'data-power-name');   // Change first line of tooltip text to be the full power name
    bodytooltipregion.textContent = this.getAttributeNS(null, 'data-region');      // Change the second line of tooltip text to be the region
    var startyear = this.getAttributeNS(null, 'data-start-year');                  // Get the start year
    var endyear = this.getAttributeNS(null, 'data-end-year');                      // Get the end year
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

function chartBodyMouseDown(evt) {
    var coord = getMousePositionBody(evt);       // Get the position of the click event
    bodyclick.x = coord.x;                       // Save the x of the click globally
    bodyclick.y = coord.y;                       // Save the y of the click globally

    if(evt.altKey) {    // If Alt was pressed during the click we are doing a rectangle selection
        translateSVGObject(bodyselectrectgroup, coord.x, coord.y);           // Move the box to the pointer
        bodyselectrect.setAttributeNS(null, 'height', '0');                  // Set the rectangle height to 0
        bodyselectrect.setAttributeNS(null, 'width', '0');                   // Set the rectangle width to 0
        bodyselectrectgroup.setAttributeNS(null, 'visibility', 'visible');   // Make the box visible
        
        bodysvg.addEventListener('mousemove', selectionMouseMove);    // Add the mousemove tracking for selection
        bodysvg.addEventListener('mouseup', selectionMouseUp);        // Add the mouseup listener for selection
    }
    else {      // Add the mousemove tracking, add the same behavior for mouseup and mouseout
        bodysvg.addEventListener('mousemove', chartPanMouseMove);
        bodysvg.addEventListener('mouseup', chartPanMouseUp);
        bodysvg.addEventListener('mouseout', chartPanMouseUp);
    }
    evt.preventDefault();   // To stop from highlighting elements on click and drag
}

function selectionMouseUp() {
    bodyselectrectgroup.setAttributeNS(null, 'visibility', 'hidden');

    bodysvg.removeEventListener('mousemove', selectionMouseMove);       // Remove the mousemove tracking for selection
    bodysvg.removeEventListener('mouseup', selectionMouseUp);           // Remove the mouseup listener for selection
}

function selectionMouseMove(evt) {
    var coord = getMousePositionBody(evt);
    var boxparams = {     // Get the width and height of the box by subtracting the transform values from the current mouse coordinates
        width: coord.x - bodyclick.x,
        height: coord.y - bodyclick.y
    };
    
    if (boxparams.width < 0 && boxparams.height >= 0) {          // If just the width is negative
        translateSVGObject(bodyselectrectgroup, coord.x, bodyclick.y);
        boxparams.width = Math.abs(coord.x - bodyclick.x);
    }
    else if (boxparams.width >= 0 && boxparams.height < 0) {     // If just the height is negative
        translateSVGObject(bodyselectrectgroup, bodyclick.x, coord.y);
        boxparams.height = Math.abs(coord.y - bodyclick.y);
    }
    else if (boxparams.width < 0 && boxparams.height < 0) {     // If both are negative
        translateSVGObject(bodyselectrectgroup, coord.x, coord.y);
        boxparams.width = Math.abs(coord.x - bodyclick.x);
        boxparams.height = Math.abs(coord.y - bodyclick.y);
    }

    bodyselectrect.setAttributeNS(null, 'width', boxparams.width);      // Set the selection rectangle width
    bodyselectrect.setAttributeNS(null, 'height', boxparams.height);    // Set the selection rectangle height
    evt.preventDefault();
}

function chartPanMouseUp() {
    bodysvg.removeEventListener('mousemove', chartPanMouseMove);
    bodysvg.removeEventListener('mouseup', chartPanMouseUp);
    bodysvg.removeEventListener('mouseout', chartPanMouseUp);
}

function chartPanMouseMove(evt) {
    var dx = 0;         // X distance the body and header will be translated
    var dy = 0;         // Y distance the body will be translated
    var transforms = chartbody.transform.baseVal;      // Get all of the transforms on the object

    if(transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {   // If there is no transform or the first transform isn't a translate
        translateSVGObject(chartbody, 0, 0);        // Add an empty translate to the body
        translateSVGObject(headerregions, 0, 0);    // Add an empty translate to the header
    }
    else {
        dx = transforms.getItem(0).matrix.e + evt.movementX;        // The distance to translate on the x axis is the current translate summed with the new movement
        dy = transforms.getItem(0).matrix.f + evt.movementY;        // The distance to translate on the y axis is the current translate summed with the new movement
        translateSVGObject(chartbody, dx, dy);                      // Translate the chart body by dk and dy
        translateSVGObject(headerregions, dx, 0);                   // Translate the chart header by dy (headerregions defined in BOTHeaderScripts.js)
    }
}

function chartBodyMouseWheel(evt) {
    var coord = getMousePositionBody(evt);

    if(evt.altKey) {
        if(evt.deltaY > 0) {    // Mouse scroll down
            zoomSVGObjectOnLocation(chartbody, 1 - zoomfactor, coord.x, coord.y);   // Zoom the body out by the zoom factor, centered on the mouse
            zoomSVGObjectOnLocation(headerregions, 1 - zoomfactor, coord.x, 0);     // Zoom the header out by the zoom factor, centered on the mouse x and the top of the header
        }
        else {                  // Mouse scroll up
            zoomSVGObjectOnLocation(chartbody, 1 + zoomfactor, coord.x, coord.y);   // Zoom the body in by the zoom factor, centered on the mouse
            zoomSVGObjectOnLocation(headerregions, 1 + zoomfactor, coord.x, 0);     // Zoom the header in by the zoom factor, centered on the mouse x and the top of the header
        }
        evt.preventDefault();   // Don't scroll the webpage when zooming
    }
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

// Translate the object by X and Y
function translateSVGObject(object, x, y) {
    formatTransforms(object);
    var transforms = object.transform.baseVal;      // Get all of the transforms on the object
    var transform = transforms.getItem(0);          // Get the first element on the transform list, which we know to be a translate
    
    transform.setTranslate(x, y);             // Change the position of object to the pointer
}

// Zoom an object by the zoomfactor centered on x,y
function zoomSVGObjectOnLocation(object, zoomfactor, x, y) {
    formatTransforms(object);
    var transforms = object.transform.baseVal;      // Get all of the transforms on the object
    var translate = transforms.getItem(0);
    var scale = transforms.getItem(1);

    // Multiply all transforms by the zoom factor, then correct the translate for the mouse position
    var newTranslateX = (translate.matrix.e * zoomfactor) + ((1 - zoomfactor) * x);
    var newTranslateY = (translate.matrix.f * zoomfactor) + ((1 - zoomfactor) * y);
    var newScaleX = scale.matrix.a * zoomfactor;
    var newScaleY = scale.matrix.d * zoomfactor;
    translate.setTranslate(newTranslateX, newTranslateY);
    scale.setScale(newScaleX, newScaleY);
}

// Add a blank translate and/or a blank scale to the object if either doesn't exist
function formatTransforms(object) {
    var transforms = object.transform.baseVal;      // Get all of the transforms on the object

    if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {   // If the first transform isn't a translate add one
        var translate = bodysvg.createSVGTransform();                                                           // Create empty SVG transform
        translate.setTranslate(0, 0);                                                                           // Make it transform by 0
        object.transform.baseVal.insertItemBefore(translate, 0);                                                 // Put the translate at the beginning of the transform list
    }
    if (transforms.length === 1 || transforms.getItem(1).type !== SVGTransform.SVG_TRANSFORM_SCALE) {
        var scale = bodysvg.createSVGTransform();
        scale.setScale(1, 1);
        object.transform.baseVal.insertItemBefore(scale, 1);
    }
}