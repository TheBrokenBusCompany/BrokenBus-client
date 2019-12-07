from flask import Flask, render_template
import utils.darksky as darksky
import json
import os

app = Flask(__name__)

@app.route('/')
def main():
    '''
    Adds forecast data and renders the main page
    '''
    tempMax, tempMin, summary, icon = darksky.todayForecast(darksky.malaga_lat, darksky.malaga_lon)
    temps = str(tempMax) + '~' + str(tempMin)
    icon = darksky.iconMapping[icon]

    clientId = ''
    if 'oauthClientId' in os.environ:
        clientId = os.environ['oauthClientId']
    else:
        with open ('secrets.json') as file:
            data = json.load(file)
            clientId = data['oauthClientId']

    return render_template('index.html', oauthClientId=clientId,
        temperature=temps, summary=summary, weatherIcon=icon)