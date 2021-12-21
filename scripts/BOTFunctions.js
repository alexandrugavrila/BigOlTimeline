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

    makeVisible(bodysvg);
    makeVisible(headersvg);

    tutorialCheck();
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
    focustranslateanimations.length = 0;   // Empty the focus translate animation list
    focusopacityanimations.length = 0;  // Empty the focus opacity animation list
    focusinvis.length = 0;    // Empty the invisible elements list
    focusdisplayregions.length = 0;   // Empty the nondisplayed regions list
    focusdisplayrects.length = 0;     // Empty the nondisplayed rects list
}