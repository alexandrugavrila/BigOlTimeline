// This controls the mouseover tooltip events for the region headers. It will pop up
// a tooltip that shows the map of what the region looks like

var headersvg = document.getElementById('headersvg');
var headerbar = document.getElementById('headerbar');
var headertooltip = document.getElementById('headertooltip');
var headertooltiptext = document.getElementById('headertooltiptext');
var headertooltipmap = document.getElementById('headertooltipmap');             // Get the group container for the map
var headertooltipmapsvg = document.getElementById('headertooltipmapsvg');       // Get the actual map svg
var headers = document.getElementsByClassName('regionbox');

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

for (var i = 0; i < headers.length; i++) {
    headers[i].addEventListener('mousemove', showHeaderTooltip);
    headers[i].addEventListener('mouseout', hideHeaderTooltip);
}
controlsbutton.addEventListener('mouseover', controlsButtonMouseOver);
controlsbutton.addEventListener('mouseout', controlsButtonMouseOut);
controlsbutton.addEventListener('mousedown', controlsButtonMouseDown);
controlsbutton.addEventListener('mouseup', controlsButtonMouseUp);

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
    headertooltipmapsvg.setAttributeNS(null, 'viewBox', getMapViewBox(tarborder));                               // Set the viewbox to what is specified in getviewbox per region
}

function hideHeaderTooltip() {
    headertooltip.setAttributeNS(null, 'visibility', 'hidden');
    headertooltipmap.setAttributeNS(null, 'visibility', 'hidden');
    hideBorders();
}

function controlsButtonMouseOver() {
    controlsbuttonbox.classList.remove('buttonbox');
    controlsbuttonbox.classList.add('buttonboxhover');
}

function controlsButtonMouseOut() {
    controlsbuttonbox.classList.remove('buttonboxhover');
    controlsbuttonbox.classList.add('buttonbox');
}

function controlsButtonMouseDown() {
    controlsbuttonbox.classList.remove('buttonboxhover');
    controlsbuttonbox.classList.add('buttonboxclick');
}

function controlsButtonMouseUp() {
    controlsbuttonbox.classList.remove('buttonboxclick');
    controlsbuttonbox.classList.add('buttonboxhover');

    adjustControlsAnimations();     // Adjust the controls animation so it goes to where the popup is
    addAnimationEndListeners(controlsanimations, controlsAnimationEnd);     // Add listeners for the end of the animations
    if(controlsanimations[0].getAttributeNS(null, 'data-direction') == 'forward') {     // If the animation is going to run forward
        makeVisible(controlsanimationrect);                                             // Make the animation rectangle invisible
        executeAnimations(controlsanimations);                                          // Run the controls button animations
    } 
    else {                                              // If the controls popup is visible
        makeInvisible(controlspopup);                       // Hide the popup before the animation starts
        makeVisible(controlsanimationrect);                 // Make the animation rectangle visible
        executeAnimationsBackwards(controlsanimations);     // Run the controlsbutton animations in reverse
        
    }
    counterScale(controlspopup, headerbar);     // Counter the scale transform on the popup so its always the same size
}

function controlsAnimationEnd(evt) {
    if(evt.target.classList.contains('finalanimation')) {   // If this is the last animation
        if(evt.target.getAttributeNS(null, 'data-direction') == 'forward') {    // If the animation ran forward
            makeVisible(controlspopup);                                             // Make the popup visible
            makeInvisible(controlsanimationrect);                                   // Make the animation rectangle invisible
            setAnimationDirectionFlag(controlsanimations, 'backward');              // Change all of the direction flags on the controls animations to backward
        }
        else {
            setAnimationDirectionFlag(controlsanimations, 'forward');               // Change all of the direction flags on the controls animations to forward
        }
    }
    evt.target.removeEventListener('endEvent', controlsAnimationEnd);

}


// General Helper Functions

// Toggles an object from visible to hidden or vice versa
function toggleVisibility(object) {
    if(object.getAttributeNS(null, 'visibility') == 'visible') {    // If the object is visible
        makeInvisible(object);                                          // Make it invisible
    }
    else {                                                          // If the object is invisible
        makeVisible(object);                                            // Make it visible
    }
}

// Make an object visible
function makeVisible(object) {
    object.setAttributeNS(null, 'visibility', 'visible');   // Make the object visible
}

// Make an object invisible
function makeInvisible(object) {
    object.setAttributeNS(null, 'visibility', 'hidden');    // Make the object invisible
}

// Executes animations
function executeAnimations(animations) {
    if (animations.length) {    // If it is a list of animations
        for (var i = 0; i < animations.length; i++) {    // For all of the animations
            animations[i].beginElement();    // Execute the animation
        }
    }
    else {      // If it is a single animation
        animations.beginElement();   // Execute the animation
    }
}

// Execute animations in reverse and reset parameters
function executeAnimationsBackwards(animations) {
    if (animations.length) {    // If it is a list of animations
        for (var i = 0; i < animations.length; i++) {   // For all of the animations
            reverseAnimation(animations[i]);                                // Reverse it
            animations[i].addEventListener('endEvent', reverseAnimation) ;  // Add an event at the end to switch it back
            animations[i].beginElement();                                   // Execute the animation
        }
    }
    else {      // If it is a single animation
        reverseAnimation(animation);                                // Reverse it
        animations.addEventListener('endEvent', reverseAnimation);  // Add an event at the end to switch it back
        animations.beginElement();                                  // Execute the animation
    }
}

// Reverse an animation, either an animation being passed or from an event
function reverseAnimation(animation){
    if (event.type == 'endEvent') {    // If triggered at the end of an animation
        var animation = event.target;       // Replace animation with the event 
    }
    var to = animation.getAttributeNS(null, 'to');      // Store the to value
    var from = animation.getAttributeNS(null, 'from');  // Store the from value
    animation.setAttributeNS(null, 'to', from);         // Swap to and from
    animation.setAttributeNS(null, 'from', to);         // Swap from and to
    if (event.type == 'endEvent') {     // If triggered at the end of an animation 
        animation.removeEventListener('endEvent', reverseAnimation);    // Remove the event listener
    }
}

// Add listeners to a set of animations
function addAnimationEndListeners(animations, endfunction) {
    if (animations.length) {    // If it is a list of animations
        for (var i = 0; i < animations.length; i++) {   // For all of the animations
            animations[i].addEventListener('endEvent', endfunction);    // Add the specified function to run at the end of the event
        }
    }
    else {      // If it is a single animation
        animations.addEventListener('endEvent', endfunction);    // Add the specified function to run at the end of the event
    }
}

// Toggle the direction flag on animations that are meant to be run in reverse
function setAnimationDirectionFlag(animations, direction) {
    if (animations.length) {    // If it is a list of animations
        for (var i = 0; i < animations.length; i++) {   // For all of the animations
            animations[i].setAttributeNS(null, 'data-direction', direction);    // Set the direction
        }
    }
    else {      // If it is a single animation
            animations.setAttributeNS(null, 'data-direction', direction);   // Set the direction
    }
}

// Counter a scale transform on an element applied to it by it's parent group
function counterScale(object, parent) {
    formatTransforms(parent);    // Put blank transforms on the header to avoid checking for them

    newa = 1 / parent.transform.baseVal.getItem(1).matrix.a;   // Get the inverse of the x scale
    newd = 1 / parent.transform.baseVal.getItem(1).matrix.d;   // Get the inverse of the y scale
    setScaleSVGObject(object, newa, newd);    // Set the scale to the inverse values

    parente = parent.transform.baseVal.getItem(0).matrix.e;   // Get the inverse of the x transalte
    parentf = parent.transform.baseVal.getItem(0).matrix.f;   // Get the inverse of the y translate
    setTranslateSVGObject(object, -parente * newa, -parentf * newd);  // Adjust the translate for the parent element's new CTM, this essentially just keeps it in place.
}

// Specific Helper Functions

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
function getMapViewBox(border) {
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

// Adjusts the x, y, height, width, to, and from parameters of the animation to work
// with the scale and transform of the popup
function adjustControlsAnimations() {
    formatTransforms(headerbar);        // Put blank transforms on the header to avoid checking for them
    formatTransforms(controlspopup);    // Put blank transforms on the controls popup to avoid checking for them

    var headere = parseInt(headerbar.transform.baseVal.getItem(0).matrix.e, 10);
    var headerf = parseInt(headerbar.transform.baseVal.getItem(0).matrix.f, 10);
    var headera = headerbar.transform.baseVal.getItem(1).matrix.a;
    var headerd = headerbar.transform.baseVal.getItem(1).matrix.d;
    
    var popupx = parseInt(controlspopupbox.getAttributeNS(null, 'x'), 10);
    var popupy = parseInt(controlspopupbox.getAttributeNS(null, 'y'), 10);
    var popupheight = parseInt(controlspopupbox.getAttributeNS(null, 'height'), 10);
    var popupwidth = parseInt(controlspopupbox.getAttributeNS(null, 'width'), 10);
    
    var x = (popupx - headere) * (1 / headera);
    var y = (popupy - headerf) * (1 / headerd)
    var height = popupheight * (1 / headera);
    var width = popupwidth * (1 / headerd);

    controlsanimationx.setAttributeNS(null, 'to', x);
    controlsanimationy.setAttributeNS(null, 'to', y);
    controlsanimationheight.setAttributeNS(null, 'to', height);
    controlsanimationwidth.setAttributeNS(null, 'to', width);
}