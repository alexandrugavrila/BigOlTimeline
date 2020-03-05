""" General helper functions for use in other python scripts """


import pandas as pd


def print_full_df(df):
    """ Prints entire data frame then resets parameters """

    pd.set_option('display.max_rows', len(df))
    pd.set_option('display.max_columns', len(df.columns))
    print(df)
    pd.reset_option('display.max_rows')
    pd.reset_option('display.max_columns')


def truncate_text(text, max_chars):
    """ If the text is longer than max, cut 2 characters off and add '...' """

    if len(text) > max_chars:  # If the power is more then 12 characters cut it to 10 and add '...'
        new_text = text[0:(max_chars - 2)] + '...'
    else:
        new_text = text
    return new_text


def make_year_bc(year_str):
    """ Turns a date from integer format to BC AD format """

    if int(year_str) < 0:
        return year_str[1:] + 'BC'  # If the year is negative cut off the negative and put BC at thend
    elif year_str == '2019':
        return 'Present'  # If the year is 2019 return Present
    else:
        return year_str  # If the year is positive and not 2019


def read_file(path):
    """ Reads a file from a path into a list of lines """

    with open(path, 'r') as in_file:
        lines = in_file.readlines()
    return lines


def write_file(path, lines):
    """ Writes a list of lines to a path """

    with open(path, 'w+') as out_file:
        out_file.writelines(lines)
