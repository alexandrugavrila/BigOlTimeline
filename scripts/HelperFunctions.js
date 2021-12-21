/* TRANSFORM FUNCTIONS */


function translateSVGObject(object, x, y) {
    // Translate the object by x and y
    
    var transforms = object.transform.baseVal;      // Get all of the transforms on the object
    var translate = transforms.getItem(0);          // Get the first element on the transform list, which we know to be a translate
    
    var currx = translate.matrix.e;
    var curry = translate.matrix.f;
    translate.setTranslate(currx + x, curry + y);             // Change the position of object to the pointer
}


function setTranslateSVGObject(object, x, y) {
    // Set the translate transform of the object to x and y
    if(object.length){
        for(var i = 0; i < object.length; i++) {
            object[i].transform.baseVal.getItem(0).setTranslate(x, y);
        }
    }
    else {
        object.transform.baseVal.getItem(0).setTranslate(x, y);             // Change the position of object to the pointer
    }
}


function setScaleSVGObject(object, x, y) {
    // Set the scale transform of an object to x and y

    if(object.length) {
        for(var i = 0; i < object.length; i++) {
            object[i].transform.baseVal.getItem(1).setScale(x, y);
        }
    }
    else {
        object.transform.baseVal.getItem(1).setScale(x, y);             // Set the scale transform to x and y
    }
}


function zoomSVGObjectOnLocation(object, zoomfactorx, zoomfactory, x, y) {
    // Zoom an object by the zoomfactor centered on x,y

    var transforms = object.transform.baseVal;      // Get all of the transforms on the object
    var translate = transforms.getItem(0);
    var scale = transforms.getItem(1);

    // Multiply all transforms by the zoom factor, then correct the translate for the mouse position
    var newtranslatex = (translate.matrix.e * zoomfactorx) + ((1 - zoomfactorx) * x);
    var newtranslatey = (translate.matrix.f * zoomfactory) + ((1 - zoomfactory) * y);
    var newscalex = scale.matrix.a * zoomfactorx;
    var newscaley = scale.matrix.d * zoomfactory;
    translate.setTranslate(newtranslatex, newtranslatey);
    scale.setScale(newscalex, newscaley);
}


function formatTransforms(object) {
    // Add a blank translate and/or a blank scale to the object if either doesn't exist

    var transforms = object.transform.baseVal;      // Get all of the transforms on the object
    svg = getParentSVG(object);

    if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {   // If the first transform isn't a translate add one
        var translate = svg.createSVGTransform();                                                           // Create empty SVG transform
        translate.setTranslate(0, 0);                                                                           // Make it transform by 0
        object.transform.baseVal.insertItemBefore(translate, 0);                                                 // Put the translate at the beginning of the transform list
    }
    if (transforms.length === 1 || transforms.getItem(1).type !== SVGTransform.SVG_TRANSFORM_SCALE) {
        var scale = svg.createSVGTransform();
        scale.setScale(1, 1);
        object.transform.baseVal.insertItemBefore(scale, 1);
    }
}


/* PARAMETER TOGGLES */


function toggleVisibility(object) {
    // Toggles an object from visible to hidden or vice versa

    if(object.getAttributeNS(null, 'visibility') == 'visible') {    // If the object is visible
        makeInvisible(object);                                          // Make it invisible
    }
    else {                                                          // If the object is invisible
        makeVisible(object);                                            // Make it visible
    }
}


function makeVisible(object) {
    // Make an object or array of objects visible

    if(object.length){  // If it is an array
        for(var i = 0; i < object.length; i++) {    // For every object in the array
            object[i].setAttributeNS(null, 'visibility', 'visible');   // Make the object visible
        }
    }
    else {
        object.setAttributeNS(null, 'visibility', 'visible');   // Make the object visible
    }
}


function makeInvisible(object) {
    // Make an object pr array of objects invisible

    if(object.length){  // If it is an array
        for(var i = 0; i < object.length; i++) {    // For every object in the array
            object[i].setAttributeNS(null, 'visibility', 'hidden');    // Make the object invisible
        }
    }
    else {
        object.setAttributeNS(null, 'visibility', 'hidden');   // Make the object visible
    }
}


function makeVisibleIfInvisible(object) {
    // If the object is invisible, make it visible
    
    if(object.getAttributeNS(null, 'visibility') == 'hidden') {
        object.setAttributeNS(null, 'visibility', 'visible');
    }
}


function makeInvisibileIfVisible(object) {
    // If an object is visible, make it invisible

    if(object.getAttributeNS(null, 'visibility') == 'visible') {
        object.setAttributeNS(null, 'hidden');
    }
}


function displayInline(object) {
    // Set an object or array of objects to be displayed

    if(object.length){  // If it is an array
        for(var i = 0; i < object.length; i++) {    // For every object in the array
            object[i].setAttributeNS(null, 'display', 'inline');    // Set the display to inline
        }
    }
    else {
        object.setAttributeNS(null, 'display', 'inline');   // Set the display to inline
    }
}


function displayNone(object) {
    // Set an object or array of objects to not be displayed
    console.log("clicked");
    if(object.length){  // If it is an array
        for(var i = 0; i < object.length; i++) {    // For every object in the array
            object[i].setAttributeNS(null, 'display', 'none');    // Set the display to none
        }
    }
    else {
        object.setAttributeNS(null, 'display', 'none');   // Set the display to none
    }
}


function setFillFreeze(object) {
    // Set an animation or array of animations to freeze on end

    if(object.length){  // If it is an array
        for(var i = 0; i < object.length; i++) {    // For every object in the array
            object[i].setAttributeNS(null, 'fill', 'freeze');    // Set the fill to freeze
        }
    }
    else {
        object.setAttributeNS(null, 'fill', 'freeze');   // Set the fill to freeze
    }
}

function setFillNone(object) {
    // Set an animation or array of animations to reveryt on end

    if(object.length){  // If it is an array
        for(var i = 0; i < object.length; i++) {    // For every object in the array
            object[i].setAttributeNS(null, 'fill', 'none');    // Set the fill to none
        }
    }
    else {
        object.setAttributeNS(null, 'fill', 'none');   // Set the fill to none
    }
}


/* ANIMATION FUNCTIONS */


function executeAnimations(animations) {
    // Executes animations

    if (animations.length) {    // If it is a list of animations
        for (var i = 0; i < animations.length; i++) {    // For all of the animations
            animations[i].beginElement();    // Execute the animation
        }
    }
    else {      // If it is a single animation
        animations.beginElement();   // Execute the animation
    }
}


function executeAnimationsBackwards(animations) {
    // Execute animations in reverse and reset parameters

    if (animations.length) {    // If it is a list of animations
        for (animation of animations) {   // For all of the animations
            reverseAnimation(animation);                                // Reverse it
            animation.addEventListener('endEvent', reverseAnimation) ;  // Add an event at the end to switch it back
            animation.beginElement();                                   // Execute the animation
        }
    }
    else {      // If it is a single animation
        reverseAnimation(animation);                                // Reverse it
        animations.addEventListener('endEvent', reverseAnimation);  // Add an event at the end to switch it back
        animations.beginElement();                                  // Execute the animation
    }
}


function reverseAnimation(animation){
    // Reverse an animation, either an animation being passed or from an event

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


function addAnimationEndListeners(animations, endfunction) {
    // Add listeners to a set of animations
    
    if (animations.length) {    // If it is a list of animations
        for (var i = 0; i < animations.length; i++) {   // For all of the animations
            animations[i].addEventListener('endEvent', endfunction);    // Add the specified function to run at the end of the event
        }
    }
    else {      // If it is a single animation
        animations.addEventListener('endEvent', endfunction);    // Add the specified function to run at the end of the event
    }
}


function setAnimationDirectionFlag(animations, direction) {
    // Toggle the direction flag on animations that are meant to be run in reverse

    if (animations.length) {    // If it is a list of animations
        for (var i = 0; i < animations.length; i++) {   // For all of the animations
            animations[i].setAttributeNS(null, 'data-direction', direction);    // Set the direction
        }
    }
    else {      // If it is a single animation
            animations.setAttributeNS(null, 'data-direction', direction);   // Set the direction
    }
}


function counterScale(object, parent) {
    // Counter a scale transform on an element or array of elements applied to it by it's parent group

    formatTransforms(parent);    // Put blank transforms on the parent to avoid checking for them

    newa = 1 / parent.transform.baseVal.getItem(1).matrix.a;   // Get the inverse of the x scale
    newd = 1 / parent.transform.baseVal.getItem(1).matrix.d;   // Get the inverse of the y scale

    if(object.length) {
        for(var i = 0; i < object.length; i++) {
            setScaleSVGObject(object[i], newa, newd);    // Set the scale to the inverse values
        }
    }
    else {
        setScaleSVGObject(object, newa, newd);    // Set the scale to the inverse values

    }
}


function counterTranslate(object, parent) {
    newa = 1 / parent.transform.baseVal.getItem(1).matrix.a;   // Get the inverse of the x scale
    newd = 1 / parent.transform.baseVal.getItem(1).matrix.d;   // Get the inverse of the y scale
    parente = parent.transform.baseVal.getItem(0).matrix.e;   // Get the inverse of the x transalte
    parentf = parent.transform.baseVal.getItem(0).matrix.f;   // Get the inverse of the y translate
    
    if(object.length) {
        for(var i = 0; i < object.length; i++) {
            setTranslateSVGObject(object[i], -parente * newa, -parentf * newd);  // Adjust the translate for the parent element's new CTM, this essentially just keeps it in place.
        }
    }
    else {
        setTranslateSVGObject(object, -parente * newa, -parentf * newd);  // Adjust the translate for the parent element's new CTM, this essentially just keeps it in place.
    }
}

/* GENERAL HELPER FUNCTIONS */


function isVisible(object) {
    // Get the visibility status of the element, return true or false

    vis = object.getAttributeNS(null, 'visibility');
    if(vis == 'visible') {
        return true;
    }
    else if(vis == 'hidden') {
        return false;
    }
}


function getParentSVG(object) {
    // Get the svg that the element is part of

    var parent = object.parentElement;
    var parenttype = parent.tagName.toLowerCase();

    while(parenttype != 'svg') {
        parent = parent.parentElement;
        parenttype = parent.tagName.toLowerCase();
    } 
    
    return document.getElementById(parent.getAttributeNS(null, 'id'));
}


function simulateEvent(element, eventName) {
    // Simulate an HTML or mouse event on the element. Takes element and eventName as an argument,
    // and has an optional third argument that is a dictionary of options. Options in that dictionary
    // overwrite defaultOptionsn using extendDict

    var defaultOptions = {
        bubbles: true,
        cancelable: true,
        button: 0,
        pointerX: 0,
        pointerY: 0,
        clientX: 0,
        clientY: 0,
        deltaX: 0,
        deltaY: 0,
        deltaZ: 0,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
    }

    var eventMatchers = {
        'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
        'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/,
        'WheelEvents': /^(?:wheel)$/
    }

    var options = extend(defaultOptions, arguments[2] || {});
    var event, eventType = null;

    // Make sure only a valid event is triggered by checking against the list in eventMatchers. If nothing matches throw a syntax error
    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }
    if (!eventType)
        throw new SyntaxError('Only HTMLEvents, MouseEvents, and WheelEvents interfaces are supported');

    // Create the new event
    if (eventType == 'HTMLEvents') {  // If it's an HTMLEvent initialize with bubbles and canccelable property
        event = new Event(eventName, options);
    }
    else if(eventType == 'MouseEvents') {   // If it's a mouse event initialize with all of the mouse properties
        event = new MouseEvent(eventName, options);
    }
    else if(eventType == 'WheelEvents') {   // If it's a wheel event initialize with all of the wheel properties
        event = new WheelEvent(eventName, options);
    }

    element.dispatchEvent(event);   // Execute Event
}


function extend(destination, source) {
    // Replace dictionary values in the destination with the defined values in the source
    
    for (var key in source)
        if(destination[key] != undefined)
            destination[key] = source[key];
    return destination;
}


function getOffset(element) {
    // Get the absolute screen position of an element

    var bound = element.getBoundingClientRect()
    scrollLeft = window.pageXOffset
    scrollTop = window.pageYOffset
    return{ top: bound.top + scrollTop, left: bound.left + scrollLeft }
}