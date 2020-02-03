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

    if(object.length){
        for(var i = 0; i < object.length; i++) {
            object[i].setAttributeNS(null, 'visibility', 'visible');   // Make the object visible
        }
    }
    else {
        object.setAttributeNS(null, 'visibility', 'visible');   // Make the object visible
    }
}


function makeInvisible(object) {
    // Make an object pr array of objects invisible
    if(object.length){
        for(var i = 0; i < object.length; i++) {
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
    if(object.length){
        for(var i = 0; i < object.length; i++) {
            object[i].setAttributeNS(null, 'display', 'inline');    // Make the object invisible
        }
    }
    else {
        object.setAttributeNS(null, 'display', 'inline');   // Make the object visible
    }
}


function displayNone(object) {
    // Set an object or array of objects to not be displayed
    if(object.length){
        for(var i = 0; i < object.length; i++) {
            object[i].setAttributeNS(null, 'display', 'none');    // Make the object invisible
        }
    }
    else {
        object.setAttributeNS(null, 'display', 'none');   // Make the object visible
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


/* BOT FUNCTIONS */

function initializeChart() {
    formatBodyTransforms();   // Add blank transforms to all of the bpdy elements that may need transforming
    formatHeaderTransforms();   // Add blank transforms to all of the header elements that may need transforming
    setYearLabelWidths();   // Set the year label boxes to match the text length
    adjustRegionTexts();    // Truncate all of the region header texts properly, have to do this afterwards or getcomputertextlength doesnt work

    coord = getMousePositionSVG(new WheelEvent('wheel'), bodysvg);  // Get the screen coordinate of the mouse event from where I want it to fire on the svg
    for(var i = 0; i < 10; i ++) {    // Run a mouse scroll out event 15 times to initialize the chart as zoomed out
        simulateEvent(bodysvg, 'wheel', {clientX: -coord.x + 100, clientY: -coord.y, deltaY: 1, altKey: true});
    }
    cookies = document.cookie.split(';')
    for(i in cookies) {
        if(cookies[i].includes('showcontrols')) {
            values=cookies[i].split('=');
            if(values[1] == 'true') {
                controlspopup.setAttributeNS(null, 'display', 'inline');
                setAnimationDirectionFlag(controlsanimations, 'backward');
            }else{
                controlspopup.setAttributeNS(null, 'display', 'none');
                makeVisible(controlscheckmark);
                setAnimationDirectionFlag(controlsanimations, 'forward');
            }
        }
    }

    // Once everything is set up propery display the header and body
    // bodysvg.setAttributeNS(null, 'display', 'inline');
    // headersvg.setAttributeNS(null, 'display', 'inline');


    makeVisible(bodysvg)
    makeVisible(headersvg)
    
}


function getMousePositionSVG(evt, svg) {
    // Return the x and y of the mouse in the body viewbox

    var CTM = svg.getScreenCTM();
    return{
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
    };
}


function formatBodyTransforms() {
    // Format the transforms on all of the objects in the body that will be transformed

    objects = [chartbody, powertooltip, yeartooltip, bodyselectionrect, yearlabels]

    for(var i = 0; i < objects.length; i++) {
        formatTransforms(objects[i]);
    }
}


function formatHeaderTransforms() {
    // Format the transforms on all of the objects in the header that will be transformed
    objects = [headerbar, headertooltip, headertooltipmap, controlspopup, headertexts, controlsbutton];
    
    for(var i = 0; i < objects.length; i++) {
        if(objects[i].length) {
            for(var j = 0; j < objects[i].length; j++) {
                formatTransforms(objects[i][j]);
            }
        }
        else {
            formatTransforms(objects[i]);
        }
    }
}


function setYearLabelWidths() {
    // Make all the year label backgrounds the proper length

    texts = yearlabels.getElementsByTagName('text');    // Get all of the texts in the year labels
    backgrounds = yearlabels.getElementsByTagName('rect');  // Get all of the backgrounds in the year labels

     // Loop over ever item in both lists, they have the same length
    for(var i = 0; i < backgrounds.length; i++) {  
        length = texts[i].getComputedTextLength();  // Find the length of the text

        if(texts[i].classList.contains('pyearlabel')) {     // If its a primary label
            backgrounds[i].setAttributeNS(null, 'width', (length + 8));   // Set the length of the background to the found length plus a bit
        }
        else if(texts[i].classList.contains('syearlabel')) {    // If its a secondary label
            backgrounds[i].setAttributeNS(null, 'width', (length + 4));   // Set the length of the background to the found length plus a bit
        }
    }
}


function launchControlAnimations() {
    adjustControlsAnimations();     // Adjust the controls animation so it goes to where the popup is
    addAnimationEndListeners(controlsanimations, controlsAnimationEnd);     // Add listeners for the end of the animations
    if(controlsanimations[0].getAttributeNS(null, 'data-direction') == 'forward') {     // If the animation is going to run forward
        makeVisible(controlsanimationrect);                                             // Make the animation rectangle invisible
        executeAnimations(controlsanimations);                                          // Run the controls button animations
    } 
    else {                                              // If the controls popup is visible
        controlspopup.setAttributeNS(null, 'display', 'none');  // Hide the popup before the animation starts
        makeVisible(controlsanimationrect);                     // Make the animation rectangle visible
        executeAnimationsBackwards(controlsanimations);         // Run the controlsbutton animations in reverse
    }
    counterScale(controlspopup, headerbar);     // Counter the scale transform on the popup so it's always the same size
    counterTranslate(controlspopup, headerbar); // Counter the translate transform on the popup so it's always in the same place
}


function adjustControlsAnimations() {
    // Adjusts the x, y, height, width, to, and from parameters of the animation to work
    // with the scale and transform of the popup 
    
    formatTransforms(headerbar);        // Put blank transforms on the header to avoid checking for them
    formatTransforms(controlspopup);    // Put blank transforms on the controls popup to avoid checking for them

    var headere = parseInt(headerbar.transform.baseVal.getItem(0).matrix.e, 10);    // The x translate of the headerbar as an int
    var headerf = parseInt(headerbar.transform.baseVal.getItem(0).matrix.f, 10);    // The y translate of the headerbar as an int
    var headera = headerbar.transform.baseVal.getItem(1).matrix.a;  // The x scale of the headerbar
    var headerd = headerbar.transform.baseVal.getItem(1).matrix.d;  // The y scale of the headerbar
    var bodyd = chartbody.transform.baseVal.getItem(1).matrix.d;    // The y scale of the chartbody

    var popupx = parseInt(controlspopupbox.getAttributeNS(null, 'x'), 10);  // The x parameter of the animation as an int
    var popupy = parseInt(controlspopupbox.getAttributeNS(null, 'y'), 10);  // The y parameter of the animation as an int
    var popupheight = parseInt(controlspopupbox.getAttributeNS(null, 'height'), 10);    // The height parameter of the animation as an int
    var popupwidth = parseInt(controlspopupbox.getAttributeNS(null, 'width'), 10);      // The width parameter of the animation as an int
    
    var x = (popupx - headere) * (1 / headera);     // The new x is the old x adjusted for the translate and then the x scale of the header
    var y = (popupy - headerf) * (1 / headerd);     // The new y is the old y adjusted for the translate and then the y scale of the header
    var height = popupheight * (1 / headera);   // The new height is the standard height divided by the x scale of the header
    var width = popupwidth * (1 / bodyd);   // The new width is the standard width divided by the y scale of the chart body, can't use the header y scale because its no longer scaling higher than 1

    controlsanimationx.setAttributeNS(null, 'to', x);   // Set the animation x
    controlsanimationy.setAttributeNS(null, 'to', y);   // Set the animation y
    controlsanimationheight.setAttributeNS(null, 'to', height);     // Set the animation height
    controlsanimationwidth.setAttributeNS(null, 'to', width);   // Set the animation width
}


function adjustYearLabelTranslates() {
    // If the chart is translated in the positive direction, adjust the yearlabel location
    
    xtrans = chartbody.transform.baseVal.getItem(0).matrix.e;
    xscale = chartbody.transform.baseVal.getItem(1).matrix.a;

    if(xtrans < 0) {
        setTranslateSVGObject(yearlabels, -xtrans * (1 / xscale), 0)
    }
    else {
        setTranslateSVGObject(yearlabels, 0, 0);
    }
}


function getYearLabelStyles() {
    for(var i = 0; i < svgStyleSheet.cssRules.length; i++) {
        if(svgStyleSheet.cssRules[i].selectorText == '.pyearlabel') {
            pyearlabelstyle = svgStyleSheet.cssRules[i];
        }
        if(svgStyleSheet.cssRules[i].selectorText == '.syearlabel') {
            syearlabelstyle = svgStyleSheet.cssRules[i];
        }
    }
    return pyearlabelstyle, syearlabelstyle;
}


function adjustYearLabelFont() {
    // Counter the scaling of the year labels by adjusting their font size
    
    yscale = chartbody.transform.baseVal.getItem(1).matrix.d;

    newsizep = pyearlabeldefaultfontsize * (1 / yscale);
    newsizes = syearlabeldefaultfontsize * (1 / yscale);
    pyearlabelstyle.style.fontSize = newsizep.toString() + "px"
    syearlabelstyle.style.fontSize = newsizes.toString() + "px"
}


function adjustRegionTextTranslates() {
    // Adjust the region texts to be in the center of their boxes
    // Uses the current CTM matrix of the texts and the CTM matrix of the center line object to adjust the
    //   translate of the texts, according to the formula
    //   e2 = x(a1-a2) + e1 
    //   where the centerline is subscript 2, and the text is subscript 1
    // This equation was calculated from the CTM matrix equations

    for(var i = 0; i < headertexts.length; i++) {   // For every header text
        xlevel = parseInt(headertexts[i].getAttributeNS(null, 'data-xlevel'), 10);  // The boxes place on the bar left to right
        x = parseInt(headertexts[i].getAttributeNS(null, 'x'))  // The untransformed x level 
        a1 = headercenterlines[i].getCTM().a    // The a value of the centerline CTM
        a2 = headertexts[i].getCTM().a          // The a value of the text CTM
        e1 = headercenterlines[i].getCTM().e    // The e value of the centerline CTM
        
        setTranslateSVGObject(headertexts[i], 0, 0)     // Set the translate to 0 so we can get all the other transforms acting on it
        basee2 = headertexts[i].getCTM().e  // The e of the CTM without the texts own translate
        tare2 = (x * (a1 - a2)) + e1    // The target e of the texts CTM according to the matrix formula
        translate = (tare2 - basee2) / a1   // The translate is the target - the current translates, divided by the scale
        setTranslateSVGObject(headertexts[i], translate, 0);    // Set the translate
    }
}


function adjustRegionTexts() {
    // Adjust how much of the region text is truncated to compensate for the changing
    // region box width

    for(var i = 0; i < headertexts.length; i++) {
        fulltext = headertexts[i].getAttributeNS(null, 'data-region-name');
        boxwidth = regionboxwidth * headerbar.transform.baseVal.getItem(1).matrix.a;
        headertexts[i].textContent = fulltext;
        textlength = headertexts[i].getComputedTextLength();
        
        j = headertexts[i].textContent.length;
        while(headertexts[i].getComputedTextLength() > boxwidth - 5){
            headertexts[i].textContent = fulltext.substring(0,j) + '...';
            j -= 1;
        }
    }
}


function resetRegionTextXs() {
    // Reset the x level of each box to its starting value

    // For every header text, set its x value to its original
    for(var i = 0; i < headertexts.length; i++) {
        setTranslateSVGObject(headertexts[i], 0, 0);
    }
}


function hideBorders() {
    // Set the visibility of all borders on the headertooltip map to hidden

    var regionborders = document.getElementById('borders').getElementsByTagName('path');
    for(var i = 0; i < regionborders.length; i++){
        regionborders[i].setAttributeNS(null, 'visibility', 'hidden');
    }
}


function getMapViewBox(border) {
    // A series of switches to put the border in a group and set the group to a viewbox

    var viewboxgroup;

    switch(border) {
        case 'irelandborder': 
            viewboxgroup = 'Weurope';
            break;
        case 'scotlandborder': 
            viewboxgroup = 'Weurope';
            break;
        case 'britanniaborder': 
            viewboxgroup = 'Weurope';
            break;
        case 'skandinaviaborder':
            viewboxgroup = 'Neurope';
            break;
        case 'balticsborder':
            viewboxgroup = 'Neurope';
            break;
        case 'europeansteppeborder':
            viewboxgroup = 'Eeurope';
            break;
        case 'polandborder':
            viewboxgroup = 'Eeurope';
            break;
        case 'daciaborder':
            viewboxgroup = 'Eeurope';
            break;
        case 'germaniaborder':
            viewboxgroup = 'Weurope';
            break;
        case 'galliaborder':
            viewboxgroup = 'Weurope';
            break;
        case 'hispaniaborder':
            viewboxgroup = 'Weurope';
            break;
        case 'italiaborder':
            viewboxgroup = 'Weurope';
            break;
        case 'northafricaborder':
            viewboxgroup = 'SWeurope';
            break;
        case 'adriaticcoastborder':
            viewboxgroup = 'SEeurope';
            break;
        case 'easternmediterraneanborder':
            viewboxgroup = 'SEeurope';
            break;
    }

    switch(viewboxgroup) {
        case 'Weurope':
            return '1035 460 270 200';
        case 'Neurope':
            return '1100 330 405 300';
        case 'SEeurope':
            return '1200 500 150 150';
        case 'Eeurope':
            return '1170 460 250 200';
        case 'SWeurope':
            return '1045 500 270 200';
    }
}


function resetFocusState() {
    focusgroup = null;  // Set the focus group to nothing
    focustransparencyanimations = [];   // Empty the focus animation list
    focusopacityanimations = []; // Empty the opacity animation list
    focusinvis = [];    // Empty the invisible elements list
    focusdisplay = [];  // Empty the nondisplayed elements list
}