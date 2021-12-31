function tutorialCheck(){
    // Check if this is a first site visit, if it is ask if they want to launch the tutorial

    tutoriallaunchmodal.style.display = "inline";
}


function tutorialLaunchModalClose() {
    // Close the tutorial lauch modal

    tutoriallaunchmodal.style.display = "none";
}


function launchTutorial(){
    // Runs the tutorial
    
    tutoriallaunchmodal.style.display = "none"; // Hide the tutorial launch modal
    pointereventblock.style.display = "block";  // Block pointer events on the website below the tutorial
    
    //Start chart header tutorial
    tutorialchartheader.style.display = "block";
}