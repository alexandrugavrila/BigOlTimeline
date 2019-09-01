// This controls the mouseover events for the power groups. It Dilates every entry 
// for that power and puts an outline around contiguous blocks

var powergroups = document.getElementsByClassName('powergroup')
for (var i = 0; i < powergroups.length; i++) {
    powergroups[i].addEventListener('mouseover', powerMouseOverEffects);
    powergroups[i].addEventListener('mouseout', powerMouseOutEffects);
}

function powerMouseOverEffects() {
    this.parentElement.appendChild(this);		// Bring to front
    this.classList.add('powergrouphover');		// Add the dilate image filter
}

function powerMouseOutEffects() {
    this.classList.remove('powergrouphover');	// Remove the dilate image filter
}


