import pandas as pd
import svgelements


def printFullDf(df):
    """ Prints entire data frame then resets parameters """

    pd.set_option('display.max_rows', len(df))
    pd.set_option('display.max_columns', len(df.columns))
    print(df)
    pd.reset_option('display.max_rows')
    pd.reset_option('display.max_columns')


def truncateText(text, max_chars):
    """ If the text is longer than max, cut 2 characters off and add '...' """
    if len(text) > max_chars:  # If the power is more then 12 characters cut it to 10 and add '...'
        new_text = text[0:(max_chars - 2)] + '...'
    else:
        new_text = text
    return new_text


def makeYearBC(year_str):
    """ Turns a date from integer format to BC AD format """

    if int(year_str) < 0: return year_str[1:] + 'BC'       # If the year is negative cut off the negative and put BC at thend
    elif year_str == '2019': return 'Present'              # If the year is 2019 return Present
    else: return year_str                                  # If the year is positive and not 2019


def readFile(path):
    """ Reads a file from a path into a list of lines """

    with open(path, 'r') as in_file:
        lines = in_file.readlines()
    return lines


def writeFile(path, lines):
    """ Writes a list of lines to a path """

    with open(path, 'w+') as out_file:
        out_file.writelines(lines)


def regionSwitch(region):
    """ A bank of all the regions matched to what column represents it on the table
        no default, throws error if it is called with something that isn't an entry """

    return {
        'Ireland': 1,
        'Scotland': 2,
        'Britannia': 3,
        'Skandinavia': 4,
        'Baltics': 5,
        'European Steppe': 6,
        'Poland': 7,
        'Dacia': 8,
        'Germania': 9,
        'Gallia': 10,
        'Hispania': 11,
        'Italia': 12,
        'North Africa': 13,
        'Adriatic Coast': 14,
        'Eastern Mediterranean': 15
    }[region]


def inverseRegionSwitch(xlevel):
    """ A bank of every chart column mapped to what region is represented there """

    return {
        1: 'Ireland',
        2: 'Scotland',
        3: 'Britannia',
        4: 'Skandinavia',
        5: 'Baltics',
        6: 'European Steppe',
        7: 'Poland',
        8: 'Dacia',
        9: 'Germania',
        10: 'Gallia',
        11: 'Hispania',
        12: 'Italia',
        13: 'North Africa',
        14: 'Adriatic Coast',
        15: 'Eastern Mediterranean'
    }[xlevel]


def powerColorSwitchRGB(power):
    """ A bank of all the powers in the chart matched to its color in RGB format
         no default, throws error if it is called with something that isn't an entry """

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
        'Achaemenid Persia': '(255,0,0)',
        'Austria-Hungary': '(0, 88, 1)',
        'East Francia': '(255, 203, 29)',
        'Hungary': '(215, 29, 50)',
        'Yugoslavia': '(1, 56, 157)',
        'Austria': '(240, 65, 97)',
        'Khazars': '(93, 188, 210)',
        'Knights of the Sword': '(213, 42, 29)',
        'Teutonic Knights': '(255, 200, 3)',
        'Lithuania': '(33, 124, 89)',
    }[power]


def addIndent(html_lines, group_id, svg_list):
    """ Find where the indicated title is, indent all lines to that level, plus indent all internal groups """

    index = 0
    chart_index = 0
    indent_unit = ''
    indent = ''
    for line in html_lines:
        if '<g id="' + group_id in line:       # If we hit the chart header
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

    new_html_lines = html_lines
    new_html_lines[chart_index:chart_index] = new_svg_list  # Insert the new svg lines into the html lines list
    return new_html_lines


def createChartBodyDicts(df):
    """ Turns data frame into a list of dictionaries """

    df_dict = []
    for i in range(len(df)):
        if df['Power'][i] != 'None':
            df_dict.append(
                dict(Region=df['Region'][i], Start=df['Start Year'][i], End=df['End Year'][i], Power=df['Power'][i]))
    return df_dict


def createCenterRegionsDicts(df):
    """ Turns the data frame into a dictionary of dictionaries with pattern {Power: {Center: 'center region'
                                                                                     Iteration: 'iteration'}} """
    df_dict = {}
    for i in range(len(df)):
        df_dict[str(df['Power'][i])] = {'Center': df['CenterRegion'][i],
                                        'Iteration': df['Iteration'][i]}

    return df_dict


def createChartBodySvgList(body_df_dict, centers_df_dict, params):
    """ Turns the list of dictionaries into a list of SVG rectangle element tags """

    body_svg_list = []
    last_power = ''
    last_region = ''            # Track region changes in case the name of a power needs to be put in something other than the first iteration
    iteration = 1               # Track what iteration of a powers control we're on in the current region, reset to 1 when the region changes
    for dp in body_df_dict:
        # Set parameters of current box
        curr_power = dp['Power']
        curr_region = dp['Region']
        class_list = ['powerrect']
        x = regionSwitch(dp['Region']) * params['bar_width']
        y = (dp['Start'] + params['bottom_date'] * params['year_height'])
        bar_height = (dp['End'] - dp['Start']) * params['year_height']
        rx, ry = None, None
        if params['body_rx']: rx = params['body_rx']
        if params['body_ry']: ry = params['body_ry']
        box_data_dict = {'data-start-year': makeYearBC(str(dp['Start'])),
                         'data-end-year': makeYearBC(str(dp['End'])),
                         'data-region': curr_region,
                         'data-is-center': 'false'}
        style_dict = {'fill:rgb': powerColorSwitchRGB(curr_power)}

        group_data_dict = {'data-power-name': curr_power}

        # If we are in the same power block, and in the same region, add 1 to iteration.
        if curr_power == last_power and curr_region == last_region:
            iteration += 1
        else:
            iteration = 1

        # Check if we are in a new power group, if we are add group tags
        if curr_power != last_power:
            power_group_str = str(dp['Power']).lower().replace(" ", "") + 'group'
            if last_power == '':                                                                         # If its the first region just add the opening group tag
                svg_tag = svgelements.OpenGroup(power_group_str, ['powergroup'], 'visible', group_data_dict, None, None, None, None).createTag()
            elif curr_power == 'None':                                                                   # If the region is None add a closing group tag and then the opening group tag without the filter
                body_svg_list.append('</g>')
                svg_tag = svgelements.OpenGroup(power_group_str, None, 'visible', group_data_dict, None, None, None, None).createTag()
            else:                                                                                        # If it's not the first region or none add the region title, the closing group tag, then the opening group tag
                body_svg_list.append('</g>')                                                                # Add the closing group tag
                svg_tag = svgelements.OpenGroup(power_group_str, ['powergroup'], 'visible', group_data_dict, None, None, None, None).createTag()       # Add the next opening group tag
            body_svg_list.append(svg_tag)

        # If the current block is the center block, and it is the correct iteration, create the power title text tag and the box with the data-is-center set to true
        group_name = curr_power + curr_region   # Name the group the power concatenated with that region
        if iteration > 1:
            if centers_df_dict[dp['Power']]['Center'] == curr_region and iteration == centers_df_dict[dp['Power']]['Iteration']:  # If this box is correct iteration and region to be the center
                box_data_dict['data-is-center'] = 'true'    # Set the dict to show this is the center
                body_svg_list.insert(len(body_svg_list) - 2, svgelements.Rect(None, class_list, None, box_data_dict, style_dict,
                                                                              x, y, params['bar_width'], bar_height, rx, ry).createTag())
                box_data_dict['data-is-center'] = 'false'   # Reset the dict
            else:
                body_svg_list.insert(len(body_svg_list) - 2, svgelements.Rect(None, class_list, None, box_data_dict, style_dict,
                                                                              x, y, params['bar_width'], bar_height, rx, ry).createTag())
            continue
        body_svg_list.append(svgelements.OpenGroup(group_name, None, None, None, None, None, ['translate(0 0)'], None).createTag())     # Add an opening group tag
        if centers_df_dict[dp['Power']]['Center'] == curr_region and iteration == centers_df_dict[dp['Power']]['Iteration']:    # If this box is correct iteration and region to be the center

            box_data_dict['data-is-center'] = 'true'    # Set the dict to show this is the center
            body_svg_list.append(svgelements.Rect(None, class_list, None, box_data_dict, style_dict,
                                                  x, y, params['bar_width'], bar_height, rx, ry).createTag())
            box_data_dict['data-is-center'] = 'false'   # Reset the dict

            title_x = int(x + (params['bar_width'] / 2))
            title_y = int(y + (params['header_length'] / 2))
            if bar_height > (2 * params['body_font_size']):         # If the bar is big enough to display the text
                body_svg_list.append(svgelements.Text(None, ['powertitle'], None, None, None,
                                                      title_x, title_y, 'middle', 'middle', truncateText(curr_power, 11)).createTag())  # Create the text tag and put it in the group that is added after all of the rectangles
            else:
                body_svg_list.append(svgelements.Text(None, ['powertitle'], 'hidden', None, None,
                                                      title_x, title_y, 'middle', 'middle', truncateText(curr_power, 11)).createTag())  # Create the text tag and put it in the group that is added after all of the rectangles
        else:   # If it is not the center, create a normal box
            if curr_power == 'None':
                body_svg_list.append(svgelements.Rect(None, class_list, None, box_data_dict, style_dict,
                                                      x, y, params['bar_width'], bar_height, rx, ry).createTag())
            else:
                body_svg_list.append(svgelements.Rect(None, class_list, None, box_data_dict, style_dict,
                                                      x, y, params['bar_width'], bar_height, rx, ry).createTag())
        body_svg_list.append(svgelements.Animate(None, ['powerfocusanimationtranslate'], None, None, None,
                                                 'transform', 'XML', 'translate', '0 0', '0 0', '0.75s', 'indefinite', 'forward', 'none').createTag())
        body_svg_list.append(svgelements.Animate(None, ['powerfocusanimationopacity'], None, None, None,
                                                 'opacity', 'XML', 'translate', '1', '0', '0.75s', 'indefinite', 'forward', 'none').createTag())
        body_svg_list.append('</g>')

        last_power = curr_power
        last_region = curr_region

    body_svg_list.append('</g>')  # Close the final group
    return body_svg_list


def insertChartBody(path, html_lines):
    """ Inserts the list of svg elements that makes up the chart body into the current HTML lines list """

    chart_body_df = pd.read_excel(path, sheet_name='ChartBodyData', usecols=range(1, 5))                        # Get the dataframe for the chart body from the excel doc
    center_regions_df = pd.read_excel(path, sheet_name='PowerCenters', usecols=range(1, 4))                     # Get the dataframe for each powers central region from the excel doc

    chart_body_df_dict = createChartBodyDicts(chart_body_df)                                                    # Turn the chart body dataframe into a list of dictionaries
    chart_body_df_dict = sorted(chart_body_df_dict, key=lambda x: x['Power'])                                   # Sorts the list of dicts on power, just to get the powers together
    center_regions_df_dict = createCenterRegionsDicts(center_regions_df)                                        # Turn the center regions dataframe into a list of dictionaries
    chart_body_svg_list = createChartBodySvgList(chart_body_df_dict, center_regions_df_dict, chart_params)      # Turn the list of dictionaries into a list of SVG grouped tags

    # Add the proper indentation to every line and insert it into the html lines
    new_html_lines = addIndent(html_lines, 'timelinebody', chart_body_svg_list)
    return new_html_lines


def insertChartRegions(html_lines, params, regions):
    """ Inserts the x-axis headings for the chart """

    # Create an SVG rect for every region in the chart
    svg_list = []
    for region in regions:
        x = regionSwitch(region) * params['bar_width']
        y = 0
        width, height = params['bar_width'], params['header_length']
        rx, ry = None, None
        if params['header_rx']: rx = params['header_rx']
        if params['header_ry']: ry = params['header_ry']
        box_data_dict = {'data-region-name': str(region)}
        text_data_dict = {'data-xlevel': str(regionSwitch(region) + 1),
                          'data-region-name': str(region)}
        style_dict = None

        svg_list.append(svgelements.OpenGroup(str(region) + 'region', ['regiongroup'], None, None, None,
                                              None, ['translate(0 0)'], 'inline').createTag())  # Add the opening group tag for the power box
        svg_list.append(svgelements.Rect(None, ['regionbox'], None, box_data_dict, style_dict,
                                         x, y, width, height, rx, ry).createTag())  # Add the power tag

        x = x + (params['bar_width'] / 2)  # Center x on middle of box width
        y = int(params['header_length'] / 2)  # Center y on middle of box height
        svg_list.append(svgelements.Text(None, ['regiontext'], None, text_data_dict, None,
                                         x, y, 'middle', 'middle', region).createTag())     # Add the region text
        svg_list.append(svgelements.Line(None, ['regionline'], 'invisible', text_data_dict, None,
                                         x, 0, x, params['header_length']).createTag())     # Add the center line on each box, invisible, so the text has a center anchor to adjust to
        svg_list.append(svgelements.Animate(None, ['regionfocusanimationtranslate'], None, None, None,
                                            'transform', 'XML', 'translate', '0 0', '0 0', '0.75s', 'indefinite', 'forward', 'none').createTag())   # Add the animation for the header groups to move
        svg_list.append(svgelements.Animate(None, ['regionfocusanimationopacity'], None, None, None,
                                            'opacity', 'XML', 'translate', '0 0', '0 0', '0.75s', 'indefinite', 'forward', 'none').createTag())   # Add the animation for the header groups to fade
        svg_list.append('</g>')

    # Add the proper indentation to every line and insert it into the html lines
    new_html_lines = addIndent(html_lines, 'regions', svg_list)
    return new_html_lines


def insertChartYears(html_lines, params, regions):
    """ Inserts the y-axis headings and the year lines across the chart """

    year_level = 0      # Store the current level the lines are being drawn
    vert_line_level = 10    # The x distance of the chartspine from the edge
    chart_height = params['bottom_date'] + params['curr_year']      # The max height of the chart
    new_html_lines = html_lines
    format_svg_list = []    # Holds the SVG tags for the chart framework
    primary_lines_svg_list = []     # Holds the SVG tags for the primary lines
    secondary_lines_svg_list = []   # Holds he SVG tags for the secondary lines
    p_year_labels_svg_list = []   # Holds the SVG tags for the primary year labels
    s_year_labels_svg_list = []   # Holds the SVG tags for the secondary year labels

    # Parameters for the chart spine line
    x1 = vert_line_level
    y1 = year_level
    x2 = vert_line_level
    y2 = chart_height
    line_type = 'chartspine'
    format_svg_list.append(svgelements.Line(None, [line_type], None, None, None, x1, y1, x2, y2).createTag())   # Draw the chart spine

    # Parameters for the primary year label
    p_label_height = 20
    p_label_width = 32

    # Parameters for the secondary year level
    s_label_height = 10
    s_label_width = 25

    # Draw in the year lines
    x2 = (len(regions) + 1) * params['bar_width']  # The second x point is the length of the chart
    while year_level < chart_height:
        y1 = year_level
        y2 = year_level
        if year_level % params['primary_year_spacing'] == 0:    # If the year level is a primary line level
            p_label_x = x1 + 1
            p_label_y = y1 - 5

            primary_lines_svg_list.append(svgelements.Line(None, ['pyearline'], None, None, None,
                                                           x1, y1, x2, y2).createTag())  # Draw a primary year line
            p_year_labels_svg_list.append(svgelements.Rect(None, ['yearlabelbackground'], None, None, None,
                                                           p_label_x, p_label_y, p_label_width, p_label_height, None, None).createTag())
            p_year_labels_svg_list.append(svgelements.Text(None, ['pyearlabel'], None, None, None,
                                                           x1 + 5, y1, 'Left', 'Middle', year_level - params['bottom_date']).createTag())
        else:
            s_label_x = x1 + 1
            s_label_y = y1 - 5

            secondary_lines_svg_list.append(svgelements.Line(None, ['syearline'], None, None, None,
                                                             x1, y1, x2, y2).createTag())  # Draw a secondary year line
            s_year_labels_svg_list.append(svgelements.Rect(None, ['yearlabelbackground'], None, None, None,
                                                           s_label_x, s_label_y, s_label_width, s_label_height, None, None).createTag())
            s_year_labels_svg_list.append(svgelements.Text(None, ['syearlabel'], None, None, None,
                                                           x1 + 3, y1, 'Left', 'Middle', year_level - params['bottom_date']).createTag())
        year_level += params['secondary_year_spacing']

    # Add the proper indentation to every line and insert it into the html lines
    new_html_lines = addIndent(new_html_lines, 'timelineyearlines', format_svg_list)
    new_html_lines = addIndent(new_html_lines, 'pyearlines', primary_lines_svg_list)
    new_html_lines = addIndent(new_html_lines, 'syearlines', secondary_lines_svg_list)
    new_html_lines = addIndent(new_html_lines, 'pyearlabels', p_year_labels_svg_list)
    new_html_lines = addIndent(new_html_lines, 'syearlabels', s_year_labels_svg_list)
    return new_html_lines


if __name__ == "__main__":
    BOT_data_path = r'C:\Users\alexa\Desktop\Personal\BigOlTimeline\data\BigOlTimeline_Data.xlsx'
    base_HTML_path = r'C:\Users\alexa\Desktop\Personal\BigOlTimeline\blankBOT.html'
    tar_HTML_path = r'C:\Users\alexa\Desktop\Personal\BigOlTimeline\index.html'

    chart_params = {
        'bar_width': 100,               # The width of every bar in the chart in pixels
        'year_height': 1,               # How many pixels each year will represent
        'primary_year_spacing': 100,    # The space between the primary year lines
        'secondary_year_spacing': 20,   # The space between the secondary year lines
        'bottom_date': 1000,            # Year BC the chart will start
        'header_length': 30,            # Length of the regions header
        'curr_year': 2019,              # Current year
        'header_font_size': 15,         # Font size of the header labels
        'body_font_size': 15,           # Size of text in the chart body
        'body_rx': None,                # Rounding of chart body corners
        'body_ry': None,                # Rounding of chart body corners
        'header_rx': None,              # Rounding of chart header corners
        'header_ry': None,              # Rounding of chart header corners
    }

    regions_list = ['Ireland', 'Scotland', 'Britannia', 'Skandinavia', 'European Steppe', 'Baltics', 'Poland', 'Dacia', 'Germania',
                    'Gallia', 'Hispania', 'Italia', 'North Africa', 'Adriatic Coast', 'Eastern Mediterranean']

    base_html_lines = readFile(base_HTML_path)                                               # Get the HTML template
    result_html_lines = insertChartBody(BOT_data_path, base_html_lines,)                     # Insert the chart body svg tags to the correct place
    result_html_lines = insertChartRegions(result_html_lines, chart_params, regions_list)    # Insert the chart x-axis header svg tags to the correct place
    result_html_lines = insertChartYears(result_html_lines, chart_params, regions_list)      # Insert the chart y-axis tags and the gridlines
    writeFile(tar_HTML_path, result_html_lines)
