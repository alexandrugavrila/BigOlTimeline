Instructions
	To add data, everything is done in BigOlTimeline_Data.xlsx.
	1. Add blocks to ChartBodyData sheet
	2. Refresh power centers power query
	3. New powers will show up in PowerCenters sheet with blank center regions and iterations
	4. Copy the new power lines into the PowerCenter reference
	5. Enter the center region and iteration (if the center region is not in the table yet, 
	   pick a temporary one and put it in the table at the bottom of this readme)
	6. Refresh PowerCenters power query

Documentation
	Currently entries with None for power are removed from the entries, this is done in 
	createChartBodyDicts(), but the code still supports having the None entries drawn, just remove 
	the if statement.

Naming Conventions
	User-defined functions: camelcase lower
	Variables: underscores
	CSS names: lowercase


Thing to dynamically change
	Border outline for blocks
		In blankBOT, timelineBody powerborder filter
	Dilation for mouse hover
		In blankBOT, timelineBody powerhover filter
	Border thickness on Dilation
		In blankBOT, timelineBody powerhover filter difference between first two dilations

Thoughts
	Hover outline is still weird. Maybe possible to generate it using offset instead of 
	dilation and erode, but blocks that are thinner than half of the offset would end up 
	with blank spots. Its fine for now.


Temp power centers:
	Power		 		Temp center 				Ideal center
	Mongols		 		European Steppe				?
	Achaemenid Persia	Thrace						Iran
	Byzantine Empire	Thrace						Constantinople
	Ottoman Empire		Thrace						Constantinople