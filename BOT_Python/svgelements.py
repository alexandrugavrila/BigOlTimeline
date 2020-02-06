
class Base:
    def __init__(self, id_str, class_list, visibility, data_dict, style_dict):
        self.id_str = id_str
        self.class_list = class_list
        self.visibility = visibility
        self.data_dict = data_dict
        self.style_dict = style_dict


class Rect(Base):
    def __init__(self, id_str, class_list, visibility, data_dict, style_dict, x, y, width, height, rx, ry):
        super().__init__(id_str, class_list, visibility, data_dict, style_dict)
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.rx = rx
        self.ry = ry

    def createTag(self):
        """ Creates an SVG rectangle tag """

        rect_tag = '<rect'
        if self.id_str: rect_tag += ' id="' + self.id_str + '"'
        if self.class_list:  # There are classes to add
            rect_tag += ' class="'  # Initialize the class tag
            for class_str in self.class_list:  # for every class to add
                rect_tag += class_str + ' '  # Add the class and a space
            rect_tag = rect_tag[:-1] + '"'  # Remove the last space and replace it with a double quote
        rect_tag += ' x="' + str(self.x) + '"'
        rect_tag += ' y="' + str(self.y) + '"'
        rect_tag += ' width="' + str(self.width) + '"'
        rect_tag += ' height="' + str(self.height) + '"'
        if self.rx: rect_tag += ' rx="' + str(self.rx) + '"'
        if self.ry: rect_tag += ' ry="' + str(self.ry) + '"'
        if self.data_dict:
            for data in self.data_dict:
                rect_tag += ' ' + data + '="' + self.data_dict[data] + '"'
        if self.style_dict:
            rect_tag += ' style="'
            for style in self.style_dict:
                rect_tag += style + self.style_dict[style] + ';'
            rect_tag += '"'
        rect_tag += ' />'

        return rect_tag


class Line(Base):
    def __init__(self, id_str, class_list, visibility, data_dict, style_dict, x1, y1, x2, y2):
        super().__init__(id_str, class_list, visibility, data_dict, style_dict)
        self.x1 = x1
        self.y1 = y1
        self.x2 = x2
        self.y2 = y2

    def createTag(self):
        """ Creates an SVG line tag """

        line_tag = '<line'
        if self.id_str: line_tag += ' id="' + self.id_str + '"'
        if self.class_list:  # There are classes to add
            line_tag += ' class="'  # Initialize the class tag
            for class_str in self.class_list:  # for every class to add
                line_tag += class_str + ' '  # Add the class and a space
            line_tag = line_tag[:-1] + '"'  # Remove the last space and replace it with a double quote
        line_tag += ' x1="' + str(self.x1) + '"'
        line_tag += ' y1="' + str(self.y1) + '"'
        line_tag += ' x2="' + str(self.x2) + '"'
        line_tag += ' y2="' + str(self.y2) + '"'
        if self.data_dict:
            for data in self.data_dict:
                line_tag += ' ' + data + '="' + self.data_dict[data] + '"'
        if self.style_dict:
            line_tag += ' style="'
            for style in self.style_dict:
                line_tag += style + self.style_dict[style] + ';'
            line_tag += '"'
        line_tag += ' />'

        return line_tag


class Text(Base):
    def __init__(self, id_str, class_list, visibility, data_dict, style_dict, x, y, anchor, alignment, content):
        super().__init__(id_str, class_list, visibility, data_dict, style_dict)
        self.x = x
        self.y = y
        self.anchor = anchor
        self.alignment = alignment
        self.content = content

    def createTag(self):
        """ Creates an SVG text tag """

        text_tag = '<text'
        if self.id_str: text_tag += ' id="' + self.id_str + '"'
        if self.class_list:  # There are classes to add
            text_tag += ' class="'  # Initialize the class tag
            for class_str in self.class_list:  # for every class to add
                text_tag += class_str + ' '  # Add the class and a space
            text_tag = text_tag[:-1] + '"'  # Remove the last space and replace it with a double quote

        if self.visibility:
            text_tag += ' visibility="' + self.visibility + '"'
        text_tag += ' x="' + str(self.x) + '"'
        text_tag += ' y="' + str(self.y) + '"'
        text_tag += ' text-anchor="' + str(self.anchor) + '"'
        text_tag += ' alignment-baseline="' + str(self.alignment) + '"'
        if self.data_dict:
            for data in self.data_dict:
                text_tag += ' ' + data + '="' + self.data_dict[data] + '"'
        if self.style_dict:
            text_tag += ' style="'
            for style in self.style_dict:
                text_tag += style + self.style_dict[style] + ';'
            text_tag += '"'
        text_tag += '>'
        text_tag += str(self.content)
        text_tag += '</text>'

        return text_tag


class OpenGroup(Base):
    def __init__(self, id_str, class_list, visibility, data_dict, style_dict, filter_string, transform_list, display):
        super().__init__(id_str, class_list, visibility, data_dict, style_dict)
        self.filter_string = filter_string
        self.transform_list = transform_list
        self.display = display

    def createTag(self):
        """ Create an opening group tag """

        g_tag = '<g'
        if self.id_str: g_tag += ' id="' + self.id_str + '"'
        if self.class_list:  # There are classes to add
            g_tag += ' class="'  # Initialize the class tag
            for class_str in self.class_list:  # for every class to add
                g_tag += class_str + ' '  # Add the class and a space
            g_tag = g_tag[:-1] + '"'  # Remove the last space and replace it with a double quote
        if self.data_dict:
            for data in self.data_dict:
                g_tag += ' ' + data + '="' + self.data_dict[data] + '"'
        if self.visibility: g_tag += ' visibility="' + self.visibility + '"'
        if self.filter_string: g_tag += ' filter="' + self.filter_string + '"'
        if self.transform_list:
            g_tag += ' transform="'
            for transform in self.transform_list:
                g_tag += transform + ' '  # Add the class and a space
            g_tag = g_tag[:-1] + '"'  # Remove the last space and replace it with a double quote
        if self.display: g_tag += ' display="' + self.display + '"'
        g_tag += '>'

        return g_tag


class Animate(Base):
    def __init__(self, id_str, class_list, visibility, data_dict, style_dict,
                 attribute_name, attribute_type, type_param, from_param, to_param, dur, begin, direction, fill):
        super().__init__(id_str, class_list, visibility, data_dict, style_dict)
        self.attribute_name = attribute_name
        self.attribute_type = attribute_type
        self.type_param = type_param
        self.from_param = from_param
        self.to_param = to_param
        self.dur = dur
        self.begin = begin
        self.direction = direction
        self.fill = fill

    def createTag(self):
        if self.attribute_name == 'transform': anim_tag = '<animateTransform'
        else: anim_tag = '<animate'

        if self.id_str: anim_tag += ' id="' + self.id_str + '"'
        if self.class_list:  # There are classes to add
            anim_tag += ' class="'  # Initialize the class tag
            for class_str in self.class_list:  # for every class to add
                anim_tag += class_str + ' '  # Add the class and a space
            anim_tag = anim_tag[:-1] + '"'  # Remove the last space and replace it with a double quote
        if self.data_dict:
            for data in self.data_dict:
                anim_tag += ' ' + data + '="' + self.data_dict[data] + '"'
        if self.style_dict:
            anim_tag += ' style="'
            for style in self.style_dict:
                anim_tag += style + self.style_dict[style] + ';'
            anim_tag += '"'

        if self.attribute_name: anim_tag += ' attributeName="' + str(self.attribute_name) + '"'
        if self.attribute_type: anim_tag += ' attributeType="' + str(self.attribute_type) + '"'
        if self.type_param: anim_tag += ' type="' + str(self.type_param) + '"'
        if self.from_param: anim_tag += ' from="' + str(self.from_param) + '"'
        if self.to_param: anim_tag += ' to="' + str(self.to_param) + '"'
        if self.dur: anim_tag += ' dur="' + str(self.dur) + '"'
        if self.begin: anim_tag += ' begin="' + str(self.begin) + '"'
        if self.direction: anim_tag += ' data-direction="' + str(self.direction) + '"'
        if self.fill: anim_tag += ' fill="' + str(self.fill) + '"'
        anim_tag += '/>'

        return anim_tag
