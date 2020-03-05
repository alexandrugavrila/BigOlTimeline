import wx
import config


def launchWindow():
    app = wx.App()
    frame = wx.Frame(None, -1, 'BigOlTimeline Configuration')




    window = wx.Frame(None, id=-1, title="BigOlTimeline Configuration", size=(600, 400))
    panel = wx.Panel(window)
    label = wx.StaticText(panel, label="Current Excel Data", pos=(10, 10))
    window.Show(True)
    app.MainLoop()


if __name__ == "__main__":
    BOT_data_path = r'C:\Users\alexa\Desktop\Personal\BigOlTimeline\data\BigOlTimeline_Data.xlsx'
    base_HTML_path = r'C:\Users\alexa\Desktop\Personal\BigOlTimeline\blankBOT.html'
    tar_HTML_path = r'C:\Users\alexa\Desktop\Personal\BigOlTimeline\index.html'

    chart_body_df = pd.read_excel(BOT_data_path, sheet_name='ChartBodyData', usecols=range(1, 5))    # Get the dataframe for the chart body from the excel doc
    chart_body_dicts = createChartBodyDicts(chart_body_df)
    print(chart_body_dicts)

    launchWindow()