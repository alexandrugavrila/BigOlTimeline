Instructions
	To add data, everything is done in BigOlTimeline_Data.xlsx.
	1. Add blocks to ChartBodyData sheet
	2. Refresh power centers power query
	3. New powers will show up in PowerCenters sheet with blank center regions and iterations
	4. Copy the new power lines into the PowerCenter reference
	5. Enter the center region and iteration (if the center region is not in the table yet, 
	   pick a temporary one and put it in the table at the bottom of this readme)
	6. Refresh PowerCenters power query

	If there was a new region, add it to the region list in WriteSVG.py, and add it to the viewbox switches in BOTHeaderScripts.js

Documentation
	Currently entries with None for power are removed from the entries, this is done in 
	createChartBodyDicts(), but the code still supports having the None entries drawn, just remove 
	the if statement.

	style_dict for createSVG functions:
		{
			'fill:rgb': ,
			'stroke': ,
			'stroke_width': ,
		}

	tooltipmap aspect ration: 2395.275/1772.186
	                          width:height = 1.35:1

Naming Conventions
	User-defined functions: camelcase lower
	Python variables: underscores
	Javascript variables: lowercase
	CSS names: lowercase


Thing to dynamically change
	Border outline for blocks
		In blankBOT, timelineBody powerborder filter
	Dilation for mouse hover
		In blankBOT, timelineBody powerhover filter
	Border thickness on Dilation
		In blankBOT, timelineBody powerhover filter: difference between first two dilations
	Thickness of gridlines
		In blankBOT, chartbody SVG style: .yearline
	Font size of year labels needs to be changed in python if changed in CSS

Thoughts
	Hover outline is still weird. Maybe possible to generate it using offset instead of 
	dilation and erode, but blocks that are thinner than half of the offset would end up 
	with blank spots. Its fine for now

	I need to find a way to get the svg style sheet dynamically, instead of just
	getting the second sheet in the css sheetlist. But its not super pressing as I
	don't intend to add any style sheets right now. (this is done in BodyScript.js in
	the variable declaraions)

Temp power centers:
	Power		 		Temp center 				Ideal center
	Mongols		 		European Steppe				?
	Achaemenid Persia	Eastern Mediterranean		Iran
	Byzantine Empire	Eastern Mediterranean		Constantinople
	Ottoman Empire		Eastern Mediterranean		Constantinople