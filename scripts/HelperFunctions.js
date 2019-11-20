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
    
    var transforms = object.transform.baseVal;      // Get all of the transforms on the object
    var translate = transforms.getItem(0);          // Get the first element on the transform list, which we know to be a translate

    translate.setTranslate(x, y);             // Change the position of object to the pointer
}


function setScaleSVGObject(object, x, y) {
    // Set the scale transform of an object to x and y

    var transforms = object.transform.baseVal;      // Get all of the transforms on the object
    var scale = transforms.getItem(1);              // Get the second element on the transform list, which we know to be a scale

    scale.setScale(x, y);             // Set the scale transform to x and y
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
    // Make an object visible

    object.setAttributeNS(null, 'visibility', 'visible');   // Make the object visible
}


function makeInvisible(object) {
    // Make an object invisible

    object.setAttributeNS(null, 'visibility', 'hidden');    // Make the object invisible
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
    // Counter a scale transform on an element applied to it by it's parent group

    formatTransforms(parent);    // Put blank transforms on the header to avoid checking for them

    newa = 1 / parent.transform.baseVal.getItem(1).matrix.a;   // Get the inverse of the x scale
    newd = 1 / parent.transform.baseVal.getItem(1).matrix.d;   // Get the inverse of the y scale
    setScaleSVGObject(object, newa, newd);    // Set the scale to the inverse values
}


function counterTranslate(object, parent) {
    newa = 1 / parent.transform.baseVal.getItem(1).matrix.a;   // Get the inverse of the x scale
    newd = 1 / parent.transform.baseVal.getItem(1).matrix.d;   // Get the inverse of the y scale
    parente = parent.transform.baseVal.getItem(0).matrix.e;   // Get the inverse of the x transalte
    parentf = parent.transform.baseVal.getItem(0).matrix.f;   // Get the inverse of the y translate
    
    setTranslateSVGObject(object, -parente * newa, -parentf * newd);  // Adjust the translate for the parent element's new CTM, this essentially just keeps it in place.
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


/* BOT FUNCTIONS */

function getMousePositionBody(evt) {
    // Return the x and y of the mouse in the body viewbox

    var CTM = bodysvg.getScreenCTM();
    return{
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
    };
}


function getMousePositionHeader(evt) {
    // Return the x and y of the mouse in the header viewbox

    var CTM = headersvg.getScreenCTM();
    return{
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
    };
}


function formatBodyTransforms() {
    // Format the transforms on all of the objects in the body that will be transformed

    objects = [chartbody, powertooltip, yeartooltip, controlspopup, 
               bodyselectionrect, yearlabels]

    for(var i = 0; i < objects.length; i++) {
        formatTransforms(objects[i]);
    }
}


function formatHeaderTransforms() {
    // Format the transforms on all of the objects in the header that will be transformed
    objects = [headerbar, headertooltip, controlspopup, headertexts, headertextsgroup, controlsbutton];
    
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


function hideBorders() {
    // Set the visibility of all borders on the headertooltip map to hidden

    var regionborders = document.getElementsByClassName('regionborder');
    for(var i = 0; i < regionborders.length; i++){
        regionborders[i].setAttributeNS(null, 'visibility', 'hidden');
    }
}


function getMapViewBox(border) {
    // A series of switches to put the border in a group and set the group to a viewbox

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


function adjustRegionTextTranslates(oldxscale, newxscale) {
    // Adjust the region texts, and the controls button text to be in the center of their boxes

    var centerdifference = (regionboxwidth * newxscale) - (regionboxwidth * oldxscale);     // Find the diference in the center of the boxes caused by the new scale

    // For every header text, move it to the new center of the box
    for(var i = 0; i < headertexts.length; i++) {
        xlevel = parseInt(headertexts[i].getAttributeNS(null, 'data-xlevel'), 10);  // The boxes place on the bar left to right
        translate = centerdifference * (xlevel + 0.5)
        translateSVGObject(headertexts[i], translate, 0);
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
    makeVisibleIfInvisible(headertextsgroup);
}


function resetRegionTextXs() {
    // Reset the x level of each box to its starting value

    // For every header text, set its x value to its original
    for(var i = 0; i < headertexts.length; i++) {
        setTranslateSVGObject(headertexts[i], 0, 0);
    }
}