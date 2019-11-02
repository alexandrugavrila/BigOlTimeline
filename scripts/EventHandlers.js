/* HEADER EVENTS */

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

/* BODY EVENTS */

function powerMouseOverEffects() {
    this.parentElement.appendChild(this);		// Bring the group to the front
    this.classList.add('powergrouphover');		// Add the dilate image filter

    var powergrouprects = this.getElementsByTagName('rect');    // Get a list of every rectangle in the group
    for (var i = 0; i < powergrouprects.length; i++) {      // Add the mouse move and mouse out event listeners to every rectangle
        powergrouprects[i].addEventListener('mousemove', powerRectMouseMoveEffects);
        powergrouprects[i].addEventListener('mouseout', powerRectMouseOutEffects);
    }

    var powertitle = this.getElementsByClassName('powertitle')[0];
    powertitle.classList.remove('powertitle');
    powertitle.classList.add('selectedtitle');
    timelinebody.appendChild(powertitle);
}

function powerMouseOutEffects() {
    this.classList.remove('powergrouphover');	// Remove the dilate image filter
    
    var powergrouprects = this.getElementsByTagName('rect');                                // Get a list of every rectangle in the group
    for (var i = 0; i < powergrouprects.length; i++) {                                      // Remove the mouse move and mouse out event listeners from every rectangle
        powergrouprects[i].removeEventListener('mousemove', powerRectMouseMoveEffects);
        powergrouprects[i].removeEventListener('mouseout', powerRectMouseOutEffects);
    }

    var powertitle = timelinebody.getElementsByClassName('selectedtitle')[0];
    this.appendChild(powertitle);
    powertitle.classList.remove('selectedtitle');
    powertitle.classList.add('powertitle');
}

function powerRectMouseMoveEffects(evt) {
    bodytooltip.setAttributeNS(null, 'visibility', 'visible');          // Make the tooltip visible
    bodytooltip.parentElement.appendChild(bodytooltip);                 // Bring the tooltip to the front
    var selectedrect = evt.target;                                      // Capture the rect we're hovering

    var coord = getMousePositionBody(evt);                              // Get the mouse position of the mousemove event
    setTranslateSVGObject(bodytooltip, coord.x + 15, coord.y + 15);     // Change the position of the tooltip to 10 pixels left and 40 pixels down from the pointer

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
        setTranslateSVGObject(bodyselectrectgroup, coord.x, bodyclick.y);
        boxparams.width = Math.abs(coord.x - bodyclick.x);
    }
    else if (boxparams.width >= 0 && boxparams.height < 0) {     // If just the height is negative
        setTranslateSVGObject(bodyselectrectgroup, bodyclick.x, coord.y);
        boxparams.height = Math.abs(coord.y - bodyclick.y);
    }
    else if (boxparams.width < 0 && boxparams.height < 0) {     // If both are negative
        setTranslateSVGObject(bodyselectrectgroup, coord.x, coord.y);
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
    translateSVGObject(chartbody, evt.movementX, evt.movementY);       // Translate the chart body by dk and dy
    translateSVGObject(headerbar, evt.movementX, 0);               // Translate the chart header by dy (headerregions defined in BOTHeaderScripts.js)
    counterScale(controlspopup, headerbar);     // Keeps the controls dialogue box centered if panning while it's open
}

function chartBodyMouseWheel(evt) {
    var coord = getMousePositionBody(evt);

    if(evt.altKey) {
        if(evt.deltaY > 0) {    // Mouse scroll down
            zoomSVGObjectOnLocation(chartbody, 1 - zoomfactor, coord.x, coord.y);   // Zoom the body out by the zoom factor, centered on the mouse
            zoomSVGObjectOnLocation(headerbar, 1 - zoomfactor, coord.x, 30);    // Zoom the header out by the zoom factor, centered on the mouse x and the top of the header
            counterScale(controlspopup, headerbar);     // Scale the controls dialogue box, in case it's visible
        }
        else {                  // Mouse scroll up
            zoomSVGObjectOnLocation(chartbody, 1 + zoomfactor, coord.x, coord.y);   // Zoom the body in by the zoom factor, centered on the mouse
            zoomSVGObjectOnLocation(headerbar, 1 + zoomfactor, coord.x, 30);     // Zoom the header in by the zoom factor, centered on the mouse x and the top of the header
            counterScale(controlspopup, headerbar);     // Scale the controls dialogue box, in case it's visible (This is done in both branches, that is necessary because on this one it has to be done before the final translate)
            setTranslateSVGObject(headerbar, headerbar.transform.baseVal.getItem(0).matrix.e, 0);   // Set the header to the top of the webpage so the zoom doesnt cut part of it
        }
        
        

        var currX = headerbar.transform.baseVal.getItem(0).matrix.e;    // The current x transform of the header regions
        var currScaleY = headerbar.transform.baseVal.getItem(1).matrix.d;   // The current y scale transform of the header regions
        var headerHeight = parseFloat(headerbar.getElementsByTagName('rect')[0].getAttribute('height'));    // The height of the header regions
        if(currScaleY >= 1) {   // If the header is bigger than default
            setTranslateSVGObject(headerbar, currX, 0);   // Set the header to the top of the webpage so the zoom doesnt cut part of it
        }
        else {  // If the header is smaller than the default
            setTranslateSVGObject(headerbar, currX, headerHeight - (headerHeight * currScaleY));   // Set the header down by how much it has shrunk so there is no white space between it and the graph
        }
        evt.preventDefault();   // Don't scroll the webpage when zooming
    }
}

