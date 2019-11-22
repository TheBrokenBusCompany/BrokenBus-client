from flask import Flask, render_template
import utils.darksky as darksky
import json

app = Flask(__name__)

@app.route('/')
def main():
    '''
    Adds forecast data and renders the main page
    '''
    tempMax, tempMin, summary, icon = darksky.todayForecast(darksky.malaga_lat, darksky.malaga_lon)
    temps = str(tempMax) + '~' + str(tempMin)
    icon = darksky.iconMapping[icon]

    with open ('secrets.json') as file:
        data = json.load(file)
        clientId = data['oauthClientId']

    return render_template('index.html', oauthClientId=clientId,
        temperature=temps, summary=summary, weatherIcon=icon)

@app.route('/imgurTest')
def imgurTest():
   '''
   Test for the imgur API integration
   '''
   return render_template('imgurTest.html')