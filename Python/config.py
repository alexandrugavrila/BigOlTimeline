""" This script launches the configurationi application for the timeline """

import wx
import wx.svg as svg
import wx.grid as grid
import pandas as pd
import helperfunctions as hf

file_paths = {  # The dictionary of all the relevant file paths, imported by any other scripts if needed
    'BOT_data': r'D:\Personal\Projects\BigOlTimeline\Code\BigOlTimeline\data\BigOlTimeline_Data.xlsx',  # The path for the excel sheet
    'base_HTML': r'D:\Personal\Projects\BigOlTimeline\Code\BigOlTimeline\blankBOT.html',  # The path for the html framework file
    'final_HTML': r'D:\Personal\Projects\BigOlTimeline\Code\BigOlTimeline\index.html',  # The path for the filled out html
    'map_preview': r'D:\Personal\Projects\BigOlTimeline\Code\BigOlTimeline\img\map_preview.svg',  # The path for the map preview svg
    'chart_preview': r'D:\Personal\Projects\BigOlTimeline\Code\BigOlTimeline\img\chart_preview.svg'  # The path for the chart preview svg
}

chart_params = {
    'bar_width': 100,  # The width of every bar in the chart in pixels
    'year_height': 1,  # How many pixels each year will represent
    'primary_year_spacing': 100,  # The space between the primary year lines
    'secondary_year_spacing': 20,  # The space between the secondary year lines
    'bottom_date': 1000,  # Year BC the chart will start
    'header_length': 30,  # Length of the regions header
    'curr_year': 2019,  # Current year
    'header_font_size': 15,  # Font size of the header labels
    'body_font_size': 15,  # Size of text in the chart body
    'body_rx': None,  # Rounding of chart body corners
    'body_ry': None,  # Rounding of chart body corners
    'header_rx': None,  # Rounding of chart header corners
    'header_ry': None,  # Rounding of chart header corners
}


class ConfigApp(wx.App):
    """ The configuration application """

    def __init__(self):
        super().__init__()
        self.frame = ConfigFrame(parent=None, title="Big Ol' Timeline Configuration")
        self.frame.Show()


class ConfigFrame(wx.Frame):
    """ The frame for the configuration application """

    def __init__(self, parent, title):
        super().__init__(parent, title=title, size=(1600, 800))
        self.configpanel = ConfigPanel(self)


class ConfigPanel(wx.Panel):
    """ The top level Panel containing the other panels """
    def __init__(self, parent):
        super().__init__(parent)

        # Create a horizontal sizer and add the three main panels
        sizer = wx.BoxSizer(wx.HORIZONTAL)
        sizer.Add(DataPanel(self), 1, wx.EXPAND)
        sizer.Add(ControlsPanel(self), 1, wx.EXPAND)
        sizer.Add(PreviewPanel(self), 1, wx.EXPAND)
        self.SetSizer(sizer)


class DataPanel(wx.Panel):
    """ The panel displaying the table """
    def __init__(self, parent):
        super().__init__(parent)

        bot_data_grid = PowerDataSpreadsheet(self)  # Create a new instance of the configuration grid

        sizer = wx.BoxSizer(wx.VERTICAL)
        sizer.Add(bot_data_grid, 1, wx.EXPAND)
        self.SetSizer(sizer)


class ControlsPanel(wx.Panel):
    """ The panel containing the controls """

    def __init__(self, parent):
        super().__init__(parent)

        v_sizer = wx.BoxSizer(wx.VERTICAL)  # The vertical sizer to stack the labels on top of the boxes
        h1_sizer = wx.BoxSizer(wx.HORIZONTAL)  # The horizontal sizer to place the labels
        h2_sizer = wx.BoxSizer(wx.HORIZONTAL)  # The horizontal sizer to place the text inputs
        h3_sizer = wx.BoxSizer(wx.HORIZONTAL)  # The horizontal sizer to place the buttons

        # Add the text input box labels to the top row
        h1_sizer.Add(wx.StaticText(self, -1, label="Region"), wx.EXPAND)
        h1_sizer.Add(wx.StaticText(self, -1, label="Power"), wx.EXPAND)
        h1_sizer.Add(wx.StaticText(self, -1, label="Start Year"), wx.EXPAND)
        h1_sizer.Add(wx.StaticText(self, -1, label="End Year"), wx.EXPAND)

        # Add four text input boxes to the second row
        h2_sizer.Add(wx.TextCtrl(self, -1))
        h2_sizer.Add(wx.TextCtrl(self, -1))
        h2_sizer.Add(wx.TextCtrl(self, -1))
        h2_sizer.Add(wx.TextCtrl(self, -1))

        # Add all of the horizontal sizers to the vertical sizer
        v_sizer.Add(h1_sizer)
        v_sizer.Add(h2_sizer)
        v_sizer.Add(h3_sizer)

        self.SetSizer(v_sizer)  # Add the sizer to the panel


class PreviewPanel(wx.Panel):
    """ The panel containing the sizer for the previews, and the functions they use """

    def __init__(self, parent):
        super().__init__(parent)
        self.scale_factor = None  # Children objects use this variable
        self.chart_img_panel = None  # Initialize chart image panel attribute to None, will be filled in updatePreviews
        self.map_img_panel = None  # Initialize map image panel attribute to None, will be filled in updatePreviews
        self.update_previews()  # Update the svg files with the current data from the html

        sizer = wx.BoxSizer(wx.VERTICAL)  # The vertical sizer to hold the preview panels
        sizer.Add(self.chart_img_panel, -1, wx.EXPAND)  # Add the chart panel to the sizer
        # sizer.Add(self.mapimgpanel, -1, wx.EXPAND)  # Add the map panel to the sizer
        self.SetSizer(sizer)  # Add the sizer to the panel

    def update_previews(self):
        """ Update the previews with the chart and map svg's """

        html_data = hf.read_file(file_paths['final_HTML'])  # Get the html file as a list of lines
        map_svg_lines = self.get_svg(html_data, 'headertooltipmapsvg')  # Pull the svg lines for the map from the full html
        chart_svg_lines = self.get_svg(html_data, 'bodysvg')  # Pull the svg lines from the chart from the full html
        hf.write_file(file_paths['chart_preview'], chart_svg_lines)  # Write the svg lines into the chart preview svg file
        hf.write_file(file_paths['map_preview'], map_svg_lines)  # Write the svg lines into the map preview svg file

        self.chart_img_panel = ChartPreviewPanel(self)  # Set the chart image panel to be a new instance of ChartPreviewPanel
        # self.mapimgpanel = MapPreviewPanel(self)  # Set the map image panel to be a new instance of MapPreviewPanel

    @staticmethod
    def get_svg(data, id_string):
        """ Find the svg specified by the id in the data and return it as a list of html lines """

        start_index = -1  # Initialize the start index to -1 so we can check if its been changed
        end_index = 0
        for idx, line in enumerate(data):
            if id_string in line:
                start_index = idx
            if '</svg>' in line and start_index != -1:   # If we found the start tag
                end_index = idx  # If this is the first end svg tag we've found mark the index and break the loop
                break  # Break the loop so we don't overwrite with a different svg tag

        return data[start_index: end_index]

    def on_paint(self, evt):
        """ Paint the SVG on the preview Panel. This is called by the child classes ChartPreviewPanel and MapPreviewPanel """

        self.Hide()  # Incase this is a resize, hide the old panel
        self.Show()  # Show the panel
        dc = wx.PaintDC(self)  # Create the context
        dc.SetBackground(wx.Brush('white'))  # Set the background of the context

        dc_dim = min(self.Size.width, self.Size.height)  # The dimension of the context
        img_dim = min(self.img.width, self.img.height)  # The dimension of the image
        scale = dc_dim / img_dim  # Divide them to get the scale between the image and the amount of room to display it

        ctx = wx.GraphicsContext.Create(dc)
        self.img.RenderToGC(ctx, scale * self.scale_factor)


class ChartPreviewPanel(PreviewPanel):
    """ The panel that displays the preview of the chart """

    # noinspection PyArgumentList
    def __init__(self, parent):
        super(PreviewPanel, self).__init__(parent)
        self.scale_factor = 0.5
        self.img = svg.SVGimage.CreateFromFile(file_paths['chart_preview'])
        self.Bind(wx.EVT_PAINT, self.on_paint)


class MapPreviewPanel(PreviewPanel):
    """ The panel that displays the preview of the world map """

    # noinspection PyArgumentList
    def __init__(self, parent):
        super(PreviewPanel, self).__init__(parent)
        self.scale_factor = 1
        self.img = svg.SVGimage.CreateFromFile(file_paths['map_preview'])
        self.Bind(wx.EVT_PAINT, self.on_paint)


class PowerDataSpreadsheet(grid.Grid):
    """ The panel containing the input field of the application """

    def __init__(self, parent):
        grid.Grid.__init__(self, parent, -1)     # Call wx.grid.Grid initialization manually

        df = pd.read_excel(file_paths['BOT_data'], sheet_name='ChartBodyData', usecols=range(1, 5))   # Get the dataframe for the chart body from the excel doc
        self.CreateGrid(df.shape[0], df.shape[1])   # Create a grid with the length and width of the dataframe

        # Add the column headers to the grid
        for idx, label in enumerate(df.columns):    # For every column in the data frame
            self.SetColLabelValue(idx, label)   # Set the column header in the grid

        # Populate the grid with the data frame
        for idx1, col in enumerate(df.columns):     # For every column in the data frame
            for idx2, value in enumerate(df[col]):      # For every value in the column
                self.SetCellValue(idx2, idx1, str(value))   # Insert the value into the grid converted to a string


if __name__ == "__main__":
    app = ConfigApp()
    app.MainLoop()
