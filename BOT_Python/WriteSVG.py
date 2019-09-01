import pandas as pd
import pprint as pp


# Prints entire data frame then resets parameters
def printFullDf(df):
    pd.set_option('display.max_rows', len(df))
    pd.set_option('display.max_columns', len(df.columns))
    print(df)
    pd.reset_option('display.max_rows')
    pd.reset_option('display.max_columns')


# If the text is longer than max, cut 2 characters off and add '...'
def truncateText(text, max_chars):
    if len(text) > max_chars:  # If the power is more then 12 characters cut it to 10 and add '...'
        new_text = text[0:(max_chars - 2)] + '...'
    else:
        new_text = text
    return new_text


# Reads a file from a path into a list of lines
def readFile(path):
    with open(path) as in_file:
        lines = in_file.readlines()
    return lines


# Writes a list of lines to a path
def writeFile(path, lines):
    with open(path, 'w+') as out_file:
        out_file.writelines(lines)


# A bank of all the regions matched to what column represents it on the table
# no default, throws error if it is called with something that isn't an entry
def regionSwitch(region):
    return {
        'Ireland': 1,
        'Scotland': 2,
        'Britain': 3,
        'Skandinavia': 4,
        'European Steppe': 5,
        'Poland': 6,
        'Dacia': 7,
        'Germany': 8,
        'France': 9,
        'Spain': 10,
        'Italian Peninsula': 11,
        'North Africa': 12,
        'Greece': 13,
        'Thrace': 14
    }[region]


# A bank of all the powers in the chart matched to its color in RGB format
# no default, throws error if it is called with something that isn't an entry
def powerColorSwitchRGB(power):
    return {
        'None': '(255,255,255)',
        'England': '(209,16,36)',
        'United Kingdom': '(208,20,44)',
        'Ireland': '(22,155,98)',
        'Scotland': '(0,122,192)',
        'Rome': '(192,0,0)',
        'Denmark': '(169,208,142)',
        'Sweden': '(0,106,166)',
        'Kievan Rus': '(232,3,106)',
        'Mongols': '(145,114,186)',
        'Golden Horde': '(249,2,3)',
        'Russia': '(191,143,0)',
        'Poland': '(153,51,0)',
        'Poland-Lithuania': '(200,67,0)',
        'Avars': '(133,255,185)',
        'Bulgaria': '(0,151,110)',
        'Ottoman Empire': '(226,10,23)',
        'Romania': '(253,209,22)',
        'German Franks': '(201,201,201)',
        'Holy Roman Empire': '(123,123,123)',
        'Germany': '(82,82,82)',
        'Franks': '(92,156,214)',
        'France': '(0,36,150)',
        'Visigoths': '(198,89,17)',
        'Spain': '(254,196,0)',
        'Ostragoths': '(242,160,104)',
        'Byzantine Empire': '(112,48,160)',
        'Italy': '(0,147,69)',
        'Carthage': '(116,175,215)',
        'Numidia': '(137,43,42)',
        'Macedonia': '(0,255,255)',
        'Greece': '(6,99,169)',
        'Achaemenid Persia': '(255,0,0)'
    }[power]


# Find where the indicated title is, return what its indentation is and what line it's at
def addIndent(html_lines, group_id, svg_list):
    # Find where the indicated title is and get its indentation level in spaces or tabs
    index = 0
    chart_index = 0
    indent_unit = ''
    indent = ''
    for line in html_lines:
        if '<g id="' + group_id + '">' in line:       # If we hit the chart header
            chart_index = index + 1                                 # Save the index that the chart starts
            indent_chars = (len(line) - len(line.lstrip()))         # Number of characters in indent
            if line[0] == ' ':
                indent_level = int(indent_chars / 4) + 4
                indent_unit = '    '
                indent = indent_unit * indent_level
            if line[0] == '\t':
                indent_level = indent_chars + 1
                indent_unit = '\t'
                indent = indent_unit * indent_level
        index += 1

    # Add the proper indentation to the beginning of each line
    new_svg_list = []
    for svg in svg_list:
        if svg[0:3] == '<g ':  # If the tag opens a group, add an indent level
            new_svg = indent + svg + '\n'
            indent += indent_unit
        elif svg[0:3] == '</g':
            indent = indent.replace(indent_unit, '', 1)
            new_svg = indent + svg + '\n'
        else:
            new_svg = indent + svg + '\n'
        new_svg_list.append(new_svg)

    return new_svg_list, chart_index


# Creates an SVG rectangle tag with the given parameters. If there is no outline, put None for stroke and stroke_width
def createSVGRect(class_str_list, x, y, width, height, rx, ry, data_dict, style_dict):
    rect_tag = '<rect'
    if class_str_list:                      # There are classes to add
        rect_tag += ' class="'                  # Initialize the class tag
        for class_str in class_str_list:        # for every class to add
            rect_tag += class_str + ' '             # Add the class and a space
        rect_tag = rect_tag[:-1] + '"'          # Remove the last space and replace it with a double quote
    rect_tag += ' x="' + str(x) + '"'
    rect_tag += ' y="' + str(y) + '"'
    rect_tag += ' width="' + str(width) + '"'
    rect_tag += ' height="' + str(height) + '"'
    if rx: rect_tag += ' rx="' + str(rx) + '"'
    if ry: rect_tag += ' ry="' + str(ry) + '"'
    if data_dict:
        for data in data_dict:
            rect_tag += ' ' + data + '="' + data_dict[data] + '"'
    if style_dict:
        rect_tag += ' style="'
        for style in style_dict:
            rect_tag += style + style_dict[style] + ';'
        rect_tag += '"'
    rect_tag += ' />'

    return rect_tag


# Creates an SVG line tag with the given parameters
def createSVGLine(class_str_list, x1, y1, x2, y2, data_dict, style_dict):
    line_tag = '<line'
    if class_str_list:                      # There are classes to add
        line_tag += ' class="'                  # Initialize the class tag
        for class_str in class_str_list:        # for every class to add
            line_tag += class_str + ' '             # Add the class and a space
        line_tag = line_tag[:-1] + '"'          # Remove the last space and replace it with a double quote
    line_tag += ' x1="' + str(x1) + '"'
    line_tag += ' y1="' + str(y1) + '"'
    line_tag += ' x2="' + str(x2) + '"'
    line_tag += ' y2="' + str(y2) + '"'
    if data_dict:
        for data in data_dict:
            line_tag += ' ' + data + '="' + data_dict[data] + '"'
    if style_dict:
        line_tag += ' style="'
        for style in style_dict:
            line_tag += style + style_dict[style] + ';'
        line_tag += '"'
    line_tag += ' />'

    return line_tag


# Creates an SVG text tag with the given parameters
def createSVGTextCenter(class_str_list, x, y, text):
    text_tag = '<text'
    if class_str_list:                      # There are classes to add
        text_tag += ' class="'                  # Initialize the class tag
        for class_str in class_str_list:        # for every class to add
            text_tag += class_str + ' '             # Add the class and a space
        text_tag = text_tag[:-1] + '"'          # Remove the last space and replace it with a double quote

    text_tag += ' x="' + str(x) + '"'
    text_tag += ' y="' + str(y) + '"'
    text_tag += ' text-anchor="middle" alignment-baseline="middle">'
    text_tag += text
    text_tag += '</text>'

    return text_tag


# Create an opening group tag with the given parameters
def createSVGOpenGroupTag(id_string, class_string, filter_string):
    g_tag = '<g'
    if id_string: g_tag += ' id="' + id_string + '"'
    if class_string: g_tag += ' class="' + class_string + '"'
    if filter_string: g_tag += ' filter="' + filter_string + '"'
    g_tag += '>'
    return g_tag


# Turns data frame into a list of dictionaries
def createChartBodyDicts(df):
    df_dict = []
    for i in range(len(df)):
        if df['Power'][i] != 'None':
            df_dict.append(
                dict(Region=df['Region'][i], Start=df['Start Year'][i], Finish=df['End Year'][i], Power=df['Power'][i]))
    return df_dict


# Turns the data frame into a dictionary of dictionaries with pattern {Power: {Center: 'center region'
#                                                                              Iteration: 'iteration'}}
def createCenterRegionsDicts(df):
    df_dict = {}
    for i in range(len(df)):
        df_dict[str(df['Power'][i])] = {'Center': df['CenterRegion'][i],
                                        'Iteration': df['Iteration'][i]}

    return df_dict


# Turns the list of dictionaries into a list of SVG rectangle element tags
def createChartBodySvgList(body_df_dict, centers_df_dict, params):
    body_svg_list = []
    text_svg_list = []
    last_power = ''
    last_region = ''  # Track region changes in case the name of a power needs to be put in something other than the first iteration
    iteration = 1  # Track what iteration of a powers control we're on in the current region, reset to 1 when the region changes
    for dp in body_df_dict:
        # Set parameters of current box
        curr_power = dp['Power']
        curr_region = dp['Region']
        x = regionSwitch(dp['Region']) * params['bar_width']
        y = (dp['Start'] + params['bottom_date'] * params['year_height'])
        bar_height = (dp['Finish'] - dp['Start']) * params['year_height']
        rx, ry = None, None
        if params['body_rx']: rx = params['body_rx']
        if params['body_ry']: ry = params['body_ry']
        data_dict = None
        style_dict = {'fill:rgb': powerColorSwitchRGB(curr_power)}

        # If we are in the same power block, and in the same region, add 1 to iteration.
        if curr_power == last_power and curr_region == last_region:
            iteration += 1
        else:
            iteration = 1

        # Check if we are in a new power group, if we are add group tags
        if curr_power != last_power:
            power_group_str = str(dp['Power']).lower().replace(" ", "") + 'group'
            class_str = 'powergroup'
            if last_power == '':                                                    # If its the first region just add the opening group tag
                svg_tag = createSVGOpenGroupTag(power_group_str, class_str, None)
            elif curr_power == 'None':                                              # If the region is None add a closing group tag and then the opening group tag without the filter
                body_svg_list.append('</g>')
                svg_tag = createSVGOpenGroupTag(power_group_str, None, None)
            else:                                                                   # If it's not the first region or none add the region title, the closing group tag, then the opening group tag
                for tag in text_svg_list:                                               # Add the chart body titles to the group
                    body_svg_list.append(tag)
                text_svg_list = []                                                      # Rest the list of text for the next power group
                body_svg_list.append('</g>')                                            # Add the closing group tag
                svg_tag = createSVGOpenGroupTag(power_group_str, class_str, None)       # Add the next opening group tag
            body_svg_list.append(svg_tag)

        if curr_power == 'None':
            svg_tag = createSVGRect(None, x, y, params['bar_width'], bar_height, rx, ry, data_dict, style_dict)
        else:
            svg_tag = createSVGRect(None, x, y, params['bar_width'], bar_height, rx, ry, data_dict, style_dict)
        body_svg_list.append(svg_tag)

        # If the current block is the center block, and it is the correct iteration, create the power title text tag
        if centers_df_dict[dp['Power']]['Center'] == curr_region and iteration == centers_df_dict[dp['Power']]['Iteration']:
            if bar_height > (2 * params['body_font_size']):         # If the bar is big enough to display the text
                title_x = int(x + (params['bar_width'] / 2))
                title_y = int(y + (params['header_length'] / 2))
                text_svg_list.append(createSVGTextCenter(['powertitle'], title_x, title_y, truncateText(curr_power, 11)))

        last_power = curr_power
        last_region = curr_region

    for tag in text_svg_list:  # Add the last entries to the list
        body_svg_list.append(tag)
    body_svg_list.append('</g>')  # Close the final group
    return body_svg_list


# Inserts the list of svg elements that makes up the chart body into the current HTML lines list
def insertChartBody(path, html_lines):
    chart_body_df = pd.read_excel(path, sheet_name='ChartBodyData', usecols=range(1, 5))                        # Get the dataframe for the chart body from the excel doc
    center_regions_df = pd.read_excel(path, sheet_name='PowerCenters', usecols=range(1, 4))                     # Get the dataframe for each powers central region from the excel doc

    chart_body_df_dict = createChartBodyDicts(chart_body_df)                                                    # Turn the chart body dataframe into a list of dictionaries
    chart_body_df_dict = sorted(chart_body_df_dict, key=lambda x: x['Power'])                                   # Sorts the list of dicts on power, just to get the powers together
    center_regions_df_dict = createCenterRegionsDicts(center_regions_df)                                        # Turn the center regions dataframe into a list of dictionaries
    chart_body_svg_list = createChartBodySvgList(chart_body_df_dict, center_regions_df_dict, chart_params)      # Turn the list of dictionaries into a list of SVG grouped tags

    # Add the proper indentation to every line and insert it into the html lines
    indent_svg_list, chart_index = addIndent(html_lines, 'timelinebody', chart_body_svg_list)
    new_html_lines = html_lines
    new_html_lines[chart_index:chart_index] = indent_svg_list                                                   # Insert the new svg lines into the html lines list
    return new_html_lines


# Inserts the x-axis headings for the chart
def insertChartRegions(html_lines, params, regions):
    # Create an SVG rect for every region in the chart
    svg_list = []
    for region in regions:
        x = regionSwitch(region) * params['bar_width']
        y = 0
        width, height = params['bar_width'], params['header_length']
        rx, ry = None, None
        if params['header_rx']: rx = params['header_rx']
        if params['header_ry']: ry = params['header_ry']
        data_dict = {'data-tooltip-text': str(region)}
        style_dict = {'fill:rgb': '(255,255,255)'}
        box_tag = createSVGRect(['regionbox'], x, y, width, height, rx, ry, data_dict, style_dict)
        svg_list.append(box_tag)

        x = x + (params['bar_width'] / 2)  # Center x on middle of box width
        y = int(params['header_length'] / 2)  # Center y on middle of box height
        name_tag = createSVGTextCenter(['regiontext'], x, y, truncateText(region, 12))
        svg_list.append(name_tag)

    # Add the proper indentation to every line and insert it into the html lines
    indent_svg_list, chart_header_index = addIndent(html_lines, 'timelineregions', svg_list)
    new_html_lines = html_lines
    new_html_lines[chart_header_index:chart_header_index] = indent_svg_list  # Insert the new svg lines into the html lines list

    return new_html_lines


# Inserts the y-axis headings and the year lines across the chart
def insertChartYears(html_lines, params, regions):
    year_level = 0
    vert_line_level = 10
    line_spacing = 100
    chart_height = params['bottom_date'] + params['curr_year']

    x1 = vert_line_level
    y1 = year_level
    x2 = vert_line_level
    y2 = chart_height
    svg_list = [(createSVGLine(['yearline'], x1, y1, x2, y2, None, None))]          # Draw the vertical line
    while year_level < params['bottom_date'] + params['curr_year']:
        x1 = vert_line_level
        y1 = year_level
        x2 = (len(regions) + 1) * params['bar_width']
        y2 = year_level
        svg_list.append(createSVGLine(['yearline'], x1, y1, x2, y2, None, None))
        year_level += line_spacing

    # Add the proper indentation to every line and insert it into the html lines
    indent_svg_list, chart_header_index = addIndent(html_lines, 'timelineyears', svg_list)
    new_html_lines = html_lines
    new_html_lines[chart_header_index:chart_header_index] = indent_svg_list  # Insert the new svg lines into the html lines list
    return new_html_lines


if __name__ == "__main__":
    BOT_data_path = r'C:\Users\alexa\Desktop\Personal\BigOlTimeline\BigOlTimeline_Data.xlsx'
    base_HTML_path = r'C:\Users\alexa\Desktop\Personal\BigOlTimeline\blankBOT.html'
    tar_HTML_path = r'C:\Users\alexa\Desktop\Personal\BigOlTimeline\BOT.html'

    chart_params = {
        'bar_width': 100,           # The width of every bar in the chart in pixels
        'year_height': 1,           # How many pixels each year will represent
        'bottom_date': 4000,        # Year BC the chart will start
        'header_length': 30,        # Length of the regions header
        'curr_year': 2019,          # Current year
        'header_font_size': 15,     # Font size of the header labels
        'body_font_size': 15,       # Size of text in the chart body
        'body_rx': None,               # Rounding of chart body corners
        'body_ry': None,               # Rounding of chart body corners
        'header_rx': None,             # Rounding of chart header corners
        'header_ry': None,             # Rounding of chart header corners
    }

    regions_list = ['Ireland', 'Scotland', 'Britain', 'Skandinavia', 'European Steppe', 'Poland', 'Dacia', 'Germany',
                    'France', 'Spain', 'Italian Peninsula', 'North Africa', 'Greece', 'Thrace']

    base_html_lines = readFile(base_HTML_path)                                               # Get the HTML template
    result_html_lines = insertChartBody(BOT_data_path, base_html_lines,)                     # Insert the chart body svg tags to the correct place
    result_html_lines = insertChartRegions(result_html_lines, chart_params, regions_list)    # Insert the chart x-axis header svg tags to the correct place
    result_html_lines = insertChartYears(result_html_lines, chart_params, regions_list)      # Insert the chart y-axis tags and the gridlines
    writeFile(tar_HTML_path, result_html_lines)