from lxml.html import parse
from urllib.request import urlopen
import json

parsed = parse(urlopen('https://en.wikipedia.org/wiki/List_of_national_parks_of_Canada'))
doc = parsed.getroot()
res = {}
tables = doc.findall('.//table')
content = tables[1].text_content()
trs = tables[1].findall('.//tr')[1::]

for tr in trs:
    content = tr.text_content()
    th = tr.findall('.//th')
    if len(th) != 0:
        title = th[0].find(".//a").text_content().replace(u'\n', u'')
        res[title] = {}
        tds = tr.findall('.//td')
        src = tds[0].find('.//img').attrib.get('src') if tds[0].find('.//img') is not None else ''
        src = src[2:src.find('.jpg')+4].replace('/thumb', '/')
        res[title]['photo'] = src
        res[title]['location'] = tds[1].find('.//a').text_content()
        res[title]['year'] = tds[2].text_content().replace(u'\n', u'')
        area = tds[3].text_content().replace(u'\xa0', u'')
        res[title]['area'] = area[:area.find('km2')] + 'km2'
        res[title]['natural_region'] = tds[4].text_content().replace(u'\n', u'')
        res[title]['description'] = tds[5].text_content().replace(u'\n', u'')
    else:
        tds = tr.findall('.//td')
        title = tds[0].find(".//a").text_content().replace(u'\n', u'')
        res[title] = {}
        src = tds[1].find('.//img').attrib.get('src') if tds[1].find('.//img') is not None else ''
        src = src[2:src.find('.jpg')+4].replace('/thumb', '/')
        res[title]['photo'] = src
        res[title]['location'] = tds[2].find('.//a').text_content()
        res[title]['year'] = tds[3].text_content().replace(u'\n', u'')
        area = tds[4].text_content().replace(u'\xa0', u'')
        res[title]['area'] = area[:area.find('km2')] + 'km2'
        res[title]['natural_region'] = tds[5].text_content().replace(u'\n', u'')
        res[title]['description'] = tds[6].text_content().replace(u'\n', u'')

with open("record.json", "w") as f:
    json.dump(res, f)
    print("json initialized.")

