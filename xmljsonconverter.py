import pandas as pd
import json


def xmltojson(xmlpath, jsonpath):
    df = pd.DataFrame(pd.read_excel(xmlpath))

    for key in df:
        totalrow = len(df[key])

    jsonoutput = {"Sheet1": {}}

    for i in range(totalrow):
        jsonoutput["Sheet1"][i + 2] = {}

    colnumber = 0

    for key in df:
        colnumber += 1
        for i in range(len(df[key])):
            if not pd.isna(df[key][i]):
                index = i + 2
                jsonoutput["Sheet1"][index][colnumber] = {
                    "text": df[key][i],
                    "font-weight": "",
                    "font-style": "",
                    "text-decoration": "",
                    "text-align": "left",
                    "background-color": "#ffffff",
                    "color": "#000000",
                    "font-family": "arial",
                    "font-size": "16",
                }

    with open(jsonpath, "w", encoding="utf-8") as f:
        json.dump(jsonoutput, f, ensure_ascii=False)
