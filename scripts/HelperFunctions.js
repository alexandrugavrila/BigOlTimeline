/* TRANSFORM FUNCTIONS */

// Translate the object by x and y
function translateSVGObject(object, x, y) {
    formatTransforms(object);
    var transforms = object.transform.baseVal;      // Get all of the transforms on the object
    var translate = transforms.getItem(0);          // Get the first element on the transform list, which we know to be a translate
    
    var currx = translate.matrix.e;
    var curry = translate.matrix.f;
    translate.setTranslate(currx + x, curry + y);             // Change the position of object to the pointer
}

// Set the translate transform of the object to x and y
function setTranslateSVGObject(object, x, y) {
    formatTransforms(object);
    var transforms = object.transform.baseVal;      // Get all of the transforms on the object
    var translate = transforms.getItem(0);          // Get the first element on the transform list, which we know to be a translate

    translate.setTranslate(x, y);             // Change the position of object to the pointer
}

// Set the scale transform of an object to x and y
function setScaleSVGObject(object, x, y) {
    formatTransforms(object);
    var transforms = object.transform.baseVal;      // Get all of the transforms on the object
    var scale = transforms.getItem(1);              // Get the second element on the transform list, which we know to be a scale

    scale.setScale(x, y);             // Set the scale transform to x and y
}

// Zoom an object by the zoomfactor centered on x,y
function zoomSVGObjectOnLocation(object, zoomfactor, x, y) {
    formatTransforms(object);
    var transforms = object.transform.baseVal;      // Get all of the transforms on the object
    var translate = transforms.getItem(0);
    var scale = transforms.getItem(1);

    // Multiply all transforms by the zoom factor, then correct the translate for the mouse position
    var newtranslatex = (translate.matrix.e * zoomfactor) + ((1 - zoomfactor) * x);
    var newtranslatey = (translate.matrix.f * zoomfactor) + ((1 - zoomfactor) * y);
    var newscalex = scale.matrix.a * zoomfactor;
    var newscaley = scale.matrix.d * zoomfactor;
    translate.setTranslate(newtranslatex, newtranslatey);
    scale.setScale(newscalex, newscaley);
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


/* PARAMETER TOGGLES */

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


/* ANIMATION FUNCTIONS */

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


/* BOT FUNCTIONS */

// Return the x and y of the mouse in the body viewbox
function getMousePositionBody(evt) {
    var CTM = body=bodysvg.getScreenCTM();
    return{
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
    };
}

// Return the x and y of the mouse in the header viewbox
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