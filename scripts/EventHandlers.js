/* HEADER EVENTS */


function showHeaderTooltip(evt) {
    headertooltip.setAttributeNS(null, 'visibility', 'visible');          // Make the tooltip visible
    headertooltipmap.setAttributeNS(null, 'visibility', 'visible');       // Make the tooltip map visible
    var selectedregion = evt.target;                               // Capture the region we're hovering

    var tooltiptransforms = headertooltip.transform.baseVal;              // Get all of the transforms on the tooltip element
    var tooltipmaptransforms = headertooltipmap.transform.baseVal;        // Get all of the transforms on the tooltip map element

    tooltiptransform = tooltiptransforms.getItem(0);                      // Get the first element on the tooltip transform list, which we know to be a translate
    tooltipmaptransform = tooltipmaptransforms.getItem(0);                // Get the first element on the tooltipmap transform list, which we know to be a translate
    var coord = getMousePositionSVG(evt, headersvg);                      // Get the mouse position of the mousemove event
    tooltiptransform.setTranslate(coord.x + 25, coord.y + 10);            // Change the position of the tooltip to 25 pixels left and 10 pixels down from the pointer
    tooltipmaptransform.setTranslate(coord.x + 35, coord.y + 40);         // Change the position of the tooltip map to 35 pixels left and 40 pixels down from the pointer

    headertooltiptext.textContent = selectedregion.getAttributeNS(null, 'data-region-name');        // Change tooltip text to be the region
    var tarborder = headertooltiptext.textContent.replace(/ /g,'').toLowerCase().concat('border');    // The id of the target border is going to be the region, lowercase, without spaces, plus 'border'
    document.getElementById(tarborder).setAttributeNS(null, 'visibility', 'visible');           // Set the target border to visible
    headertooltipmapsvg.setAttributeNS(null, 'viewBox', getMapViewBox(tarborder));                               // Set the viewbox to what is specified in getviewbox per region
}


function hideHeaderTooltip() {
    headertooltip.setAttributeNS(null, 'visibility', 'hidden');
    headertooltipmap.setAttributeNS(null, 'visibility', 'hidden');
    hideBorders();
}

// Controls Button

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

    launchControlAnimations();
}

// Controls Minimize Button

function controlsMinimizeButtonMouseOver() {
    controlsminimizebuttonbox.classList.remove('buttonbox');
    controlsminimizebuttonbox.classList.add('buttonboxhover');
}


function controlsMinimizeButtonMouseOut() {
    controlsminimizebuttonbox.classList.remove('buttonboxhover');
    controlsminimizebuttonbox.classList.add('buttonbox');
}


function controlsMinimizeButtonMouseDown() {
    controlsminimizebuttonbox.classList.remove('buttonboxhover');
    controlsminimizebuttonbox.classList.add('buttonboxclick');
}


function controlsMinimizeButtonMouseUp() {
    controlsminimizebuttonbox.classList.remove('buttonboxclick');
    controlsminimizebuttonbox.classList.add('buttonboxhover');

    launchControlAnimations();
}

// Controls Animation

function controlsAnimationEnd(evt) {
    if(evt.target.classList.contains('finalanimation')) {   // If this is the last animation
        if(evt.target.getAttributeNS(null, 'data-direction') == 'forward') {    // If the animation ran forward
            controlspopup.setAttributeNS(null, 'display', 'inline');                // Make the popup visible
            makeInvisible(controlsanimationrect);                                   // Make the animation rectangle invisible
            setAnimationDirectionFlag(controlsanimations, 'backward');              // Change all of the direction flags on the controls animations to backward
        }
        else {
            makeInvisible(controlsanimationrect);
            setAnimationDirectionFlag(controlsanimations, 'forward');               // Change all of the direction flags on the controls animations to forward
        }
    }
    evt.target.removeEventListener('endEvent', controlsAnimationEnd);

}


function controlsCheckBoxMouseOut() {
    if(controlscheckboxrect.classList.contains('checkboxclick')){
        controlsCheckBoxMouseUp();
    }
}


function controlsCheckBoxMouseDown() {
    controlscheckboxrect.classList.remove('checkbox');
    controlscheckboxrect.classList.add('checkboxclick');
}


function controlsCheckBoxMouseUp() {
    controlscheckboxrect.classList.remove('checkboxclick');
    controlscheckboxrect.classList.add('checkbox');
    toggleVisibility(controlscheckmark);
    if(controlscheckmark.getAttributeNS(null, 'visibility') == 'visible') {
        document.cookie = "showcontrols=false; Secure; SameSite=Strict";
    }
    else {
        document.cookie = "showcontrols=true; Secure; SameSite=Strict";
    }
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
    this.parentElement.appendChild(powertitle);
    makeVisible(yeartooltip);  // Set the year tooltip to visible, as hovering over the box counts as a mouseout
}


function powerRectMouseMoveEffects(evt) {
    powertooltip.setAttributeNS(null, 'visibility', 'visible');          // Make the tooltip visible
    powertooltip.parentElement.appendChild(powertooltip);                // Bring the tooltip to the front

    var coord = getMousePositionSVG(evt, bodysvg);                               // Get the mouse position of the mousemove event
    setTranslateSVGObject(powertooltip, coord.x + 15, coord.y + 15);     // Change the position of the tooltip to 10 pixels left and 40 pixels down from the pointer

    powertooltippower.textContent = this.parentElement.getAttributeNS(null, 'data-power-name');   // Change first line of tooltip text to be the full power name
    powertooltipregion.textContent = this.getAttributeNS(null, 'data-region');      // Change the second line of tooltip text to be the region
    var startyear = this.getAttributeNS(null, 'data-start-year');                   // Get the start year
    var endyear = this.getAttributeNS(null, 'data-end-year');                       // Get the end year
    powertooltipyears.textContent = startyear + " to " + endyear;                   // Change the third line of tooltip text to be the year range
    var longesttext = Math.max(powertooltippower.getComputedTextLength(),           // Get the length of the longest of the three lines of text
                               powertooltipregion.getComputedTextLength(), 
                               powertooltipyears.getComputedTextLength());
    for (var i = 0; i < powertooltiprects.length; i++) {                            // Change the width of the tooltip to be 8 more than the longest text length
        powertooltiprects[i].setAttributeNS(null, 'width', longesttext + 8)
    }
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


function powerRectMouseOutEffects() {
    powertooltip.setAttributeNS(null, 'visibility', 'hidden');           // Make the tooltip invisible
}


function powerDblclick(evt) {
    // When a power box is double clicked, make all other powers invisible and bring all of the rectangles 
    // for that group together with an animation in the group. Do the same thing with the header bar. All
    // columns that contain an entry for that power should be brought together, all others made invisible.
    // If a group is already focused in, do all these things in reverse.

    if(focusgroup == null) {    // If there was no currently focused group
        var currgroup = this.getAttributeNS(null, 'id');  // The name of the selected group
        focusgroup = currgroup;
        var currregions = []    // The list of regions that have the current power
        var rects = this.getElementsByTagName('rect')   // The rectangle elements of the power group
        for(var i = 0; i < powergroups.length; i++) {   // Set all other powers to invisible
            if(powergroups[i].getAttributeNS(null, 'id') != currgroup){     // If the group is not the focus group
                makeInvisible(powergroups[i])   // Set the group to invisible
                focusinvis.push(powergroups[i]) // Add the group to the invisible items list
            }
        }

        var centerpower
        // Get the center group for the power, and build a list of all the regions the power inhabits
        for(var i = 0; i < rects.length; i++) { 
            currregions.push(document.getElementById(rects[i].getAttributeNS(null, 'data-region') + 'region'))  // Add the region of the box to the current regions list
            if(rects[i].getAttributeNS(null, 'data-is-center') == 'true'){  // If this is the center block
                centerpower = rects[i]  // Assign it to centerpower
            }
        }
        var centerX = parseInt(centerpower.getAttributeNS(null, 'x'))   // Get the x value of the center region
        for(region of headerregions) {  // For all of the regions in the headerbar
            if(!currregions.includes(region)){   // If the region is not in the current region list
                region.setAttributeNS(null, 'display', 'none'); // Set the group to not be displayed
                focusdisplay.push(region);  // Add the group to the not displayed items list
            }
        }

        // Create a list for the powers on each side of the center
        var leftfrompower = []
        var rightfrompower = []
        var leftfromregion = []
        var rightfromregion = []

        for(var i = 0; i < rects.length; i++) { 
            var rectX = parseInt(rects[i].getAttributeNS(null, 'x'))
            if(rectX == centerX) {  // If the current box is the center ignore it
                continue;
            } else if(rectX < centerX) {     // If the current box is left of the center
                leftfrompower.push(rects[i])    // Put the rectangle at the end of the left from list
                leftfromregion.push(document.getElementById(rects[i].getAttributeNS(null, 'data-region') + 'region'))    // Put the region at the end of the left from list
            } else if (rectX > centerX) {    // If the current box is right of the center
                rightfrompower.push(rects[i])   // Put the rectangle at the end of the right from list
                rightfromregion.push(document.getElementById(rects[i].getAttributeNS(null, 'data-region') + 'region'))    // Put the region at the end of the right from list
            }
        }

        // Generate the coordinates for the most compact grouping
        var leftto = []
        var rightto = []
        for(var i = 0; i < leftfrompower.length; i++) {
            leftto.unshift(centerX - (barwidth * (i + 1)))
        }
        for(var i = 0; i < rightfrompower.length; i++) {
            rightto.push(centerX + (barwidth * (i + 1)))
        }

        var to = leftto.concat(rightto)     // Put the left and right to lists together
        var frompowers = leftfrompower.concat(rightfrompower)   // Put the left and right from power lists together
        var fromregions = leftfromregion.concat(rightfromregion)  // Put the left and right from region lists together
        
        // Adjust the animations
        for(var i = 0; i < frompowers.length; i++) {
            if(frompowers[i].getAttributeNS(null, 'x') != to[i]) {  // If the from and to x values are not the same
                distance = to[i] - frompowers[i].getAttributeNS(null, 'x');  // The distance to move is the destination - the current x
                
                poweranimation = frompowers[i].parentElement.getElementsByClassName('powerfocusanimation')[0];    // Get the power animation from the group
                regionanimation = fromregions[i].getElementsByClassName('regionfocusanimation')[0];  // Get the region animation from the group
                poweranimation.setAttributeNS(null, 'to', distance.toString() + ' 0');   // Set the to attribute of the power animation to the distance
                regionanimation.setAttributeNS(null, 'to', distance.toString() + ' 0');  // Set the to attribute of the region animation to the distance
                poweranimation.setAttributeNS(null, 'fill', 'freeze');      // Set the fill property of the power animation to freeze on a forward animation
                regionanimation.setAttributeNS(null, 'fill', 'freeze');     // Set the fill property of the region animation to freeze on a forward animation
                focusanimations.push(poweranimation, regionanimation);
            }
            if(focusanimations.length) {
                executeAnimations(focusanimations);
            }
        }
    } else {    // If there was a currently focused group
        focusgroup = null;  // Set the focus group to nothing
        if(focusanimations.length) {   // If there were animations launched
            for(animation of focusanimations) { // For all of the animations that launched to focus
                animation.setAttributeNS(null, 'fill', 'none'); // Set their fill property to none because they are running in reverse. Otherwise when an unrelated animation triggers they will revert the freeze of the forward animation
            }

            addAnimationEndListeners(focusanimations[0], focusAnimationEnd);     // Add an end listener to a focusanimation so we don't sent things to visible till it ends
            executeAnimationsBackwards(focusanimations);  // Run the animation backwards
        } else {  // If there were no unconnected boxes
            for(el of focusinvis) { // Make all of the invisible elements visible
                makeVisible(el);
            }
            for(el of focusdisplay) {   // Display all of the nondisplayed elements
                el.setAttributeNS(null, 'display', 'inline');
            }
            
            focusanimations = [];   // Empty the focus animation list
            focusinvis = [];    // Empty the invisible elements list
            focusdisplay = [];  // Empty the nondisplayed elements list
        }
    }
}


function focusAnimationEnd(evt) {
    for(el of focusinvis) { // Make all of the invisible elements visible
        makeVisible(el)
    }
    for(el of focusdisplay) {   // Display all of the nondisplayed elements
        el.setAttributeNS(null, 'display', 'inline')
    }
    focusgroup = null;  // Set the focus group to nothing
    focusanimations = [];   // Empty the focus animation list
    focusinvis = [];    // Empty the invisible elements list
    focusdisplay = [];  // Empty the nondisplayed elements list
    evt.target.removeEventListener('endEvent', focusAnimationEnd);  // Remove the end event
}

// Chart Body Events

function chartBodyMouseDown(evt) {
    var coord = getMousePositionSVG(evt, bodysvg);       // Get the position of the click event
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


function chartBodyMouseEnter() {
    yeartooltip.setAttributeNS(null, 'visibility', 'visible');
}


function chartBodyMouseMove(evt) {
    var coord = getMousePositionSVG(evt, bodysvg);  // Get the mouse position in the SVG
    var pt1 = bodysvg.createSVGPoint();     // Create an empty point
    pt1.x = coord.x;                        // Set the point x to the mouse x
    pt1.y = coord.y;                        // Set the point y to the mouse y
    matrix = chartbody.getCTM().inverse();  // Get the inverse transform matrix on the chart body
    var pt2 = pt1.matrixTransform(matrix);  // Apply it to the mouse position point
    year = pt2.y + chartbottom;             // Subtract the bottom year, that is our year

    // If the mouse is out of the transformed chart bounds, make the year tooltip invisible
    if(pt2.x < 0 || pt2.x > chartwidth || pt2.y + chartbottom < chartbottom || pt2.y + chartbottom > charttop){
        if(isVisible(yeartooltip)){ makeInvisible(yeartooltip); }   // If its visibile make it invisible
    } 
    else {    // If the mouse is inside the transformed chart bounds, make the year tooltip visible
        if(!isVisible(yeartooltip)){ makeVisible(yeartooltip); }    // If its invisible make it visible
    }

    yeartooltipyear.textContent = parseInt(year, 10);   // Set the year tooltip text to the calculated year
    textlength = yeartooltipyear.getComputedTextLength();   // Find the length of the text
    setTranslateSVGObject(yeartooltip, coord.x - textlength - 15, coord.y + 15);    // Move the top right corner of the tooltip to 15 left and 15 down of the cursor
    yeartooltip.getElementsByTagName('rect')[0].setAttributeNS(null, 'width', textlength + 8);   // Set the tooltip to be the length of the text plus a bit
}


function chartBodyMouseOut() {
    yeartooltip.setAttributeNS(null, 'visibility', 'hidden');
}


function chartBodyMouseWheel(evt) {

    var coord = getMousePositionSVG(evt, bodysvg);
    oldcenter = getOffset(headercenterlines[0]).left

    if(evt.altKey) {
        var oldxscale = parseFloat(chartbody.transform.baseVal.getItem(1).matrix.a, 10);
        
        // Mouse scroll down, zoom out
        if(evt.deltaY > 0) {
            zoomSVGObjectOnLocation(chartbody, 1 - zoomfactor, 1 - zoomfactor, coord.x, coord.y);   // Zoom the body out by the zoom factor, centered on the mouse
            zoomSVGObjectOnLocation(headerbar, 1 - zoomfactor, 1 - zoomfactor, coord.x, 30);    // Zoom the header out by the zoom factor, centered on the mouse x and the top of the header
            var newxscale = parseFloat(chartbody.transform.baseVal.getItem(1).matrix.a, 10);   // Have to get these here so its after any adustment            


            // If the zoom factor is greater than 1 keep the ysale at 1 and move region texts to compensate for the header length shrinkage
            if(newxscale > 1) {
                setScaleSVGObject(headerbar, newxscale, 1);     // Make sure the header bar is not changing in the y direction on zoom
                counterScale(headertexts, headerbar);      // Counter the xscale on the texts so they dont stretch
                counterScale(controlsbutton, headerbar);      // Counter the xscale on the texts so they dont stretch
                adjustRegionTextTranslates();   // Adjust the X translates of the region texts to the new box centers
                adjustRegionTexts();    // Change how much of the region is truncated based off of the new length of the boxes
            }
            
            // If we are passing zooming out past 1 set everything back to one just to equalize small errors
            if(oldxscale > 1 && newxscale < 1) {
                setScaleSVGObject(chartbody, 1, 1);
                setScaleSVGObject(headerbar, 1, 1);
                setScaleSVGObject(headertexts, 1, 1);
                resetRegionTextXs();
            }

            // If the zoom factor is less than 1.5, hide the secondary year lines
            if(newxscale < 1.5) {
                makeInvisible(secondaryyearlines);
                makeInvisible(secondaryyearlabels);
            }
        }
        // Mouse scroll up, zoom in
        else {
            zoomSVGObjectOnLocation(chartbody, 1 + zoomfactor, 1 + zoomfactor, coord.x, coord.y);   // Zoom the body in by the zoom factor, centered on the mouse
            zoomSVGObjectOnLocation(headerbar, 1 + zoomfactor, 1 + zoomfactor, coord.x, 30);     // Zoom the header in by the zoom factor, centered on the mouse x and the top of the header
            var newxscale = parseFloat(chartbody.transform.baseVal.getItem(1).matrix.a, 10);   // Have to get these here so its after any adustment

            // If the zoom factor is greater than 1 keep the yscale at 1 and move the region texts to compensate for header length expansion
            if(newxscale > 1) {
                setScaleSVGObject(headerbar, newxscale, 1);     // Make sure the header bar is not changing in the y direction on zoom
                counterScale(headertexts, headerbar);      // Counter the xscale on the texts so they dont stretch
                counterScale(controlsbutton, headerbar);      // Counter the xscale on the control button so it doesn't stretch
                adjustRegionTextTranslates();   // Adjust the X translates of the region texts to the new box centers
                adjustRegionTexts();    // Change how much of the region is truncated based off of the new length of the boxes
            }

            // If we are passing zooming in past 1 set everything back to one just to equalize small errors
            if(oldxscale < 1 && newxscale > 1) {
                setScaleSVGObject(chartbody, 1, 1);
                setScaleSVGObject(headerbar, 1, 1);
                setScaleSVGObject(headertexts, 1, 1);
                resetRegionTextXs();
            }

            // If the zoom factor is greater than 1.5, show the secondary year lines
            if(newxscale > 1.5) {
                makeVisible(secondaryyearlines);
                makeVisible(secondaryyearlabels);
            }       
        }
        counterScale(controlspopup, headerbar);     // Scale the controls dialogue box, in case it's visible
        counterTranslate(controlspopup, headerbar); // Translate the controls dialogue box, in case it's visible
        adjustYearLabelFont();     // Counter the scaling of the year labels by adjusting their font
        adjustYearLabelTranslates();    // Put the year labels where they need to be after a zoom
        setYearLabelWidths();   // Adjust the year labels width to match the new length of the text

        evt.preventDefault();   // Don't scroll the webpage when zooming
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
}

// Selection Box Events

function selectionMouseUp() {
    bodyselectrectgroup.setAttributeNS(null, 'visibility', 'hidden');

    bodysvg.removeEventListener('mousemove', selectionMouseMove);       // Remove the mousemove tracking for selection
    bodysvg.removeEventListener('mouseup', selectionMouseUp);           // Remove the mouseup listener for selection
}


function selectionMouseMove(evt) {
    var coord = getMousePositionSVG(evt, bodysvg);
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


// Chart Pan Events

function chartPanMouseUp() {
    bodysvg.removeEventListener('mousemove', chartPanMouseMove);
    bodysvg.removeEventListener('mouseup', chartPanMouseUp);
    bodysvg.removeEventListener('mouseout', chartPanMouseUp);
}


function chartPanMouseMove(evt) {
    translateSVGObject(chartbody, evt.movementX, evt.movementY);    // Translate the chart body by dx and dy
    translateSVGObject(headerbar, evt.movementX, 0);    // Translate the chart header by dy (headerregions defined in BOTHeaderScripts.js)
    counterTranslate(controlspopup, headerbar);     // Keeps the controls dialogue box centered if panning while it's open
    
    adjustYearLabelTranslates();    // Keep the year labels where they need to be after a pan
}



