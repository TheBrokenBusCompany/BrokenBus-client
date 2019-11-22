# BrokenBus-client
Client for the BrokenBus application

## BrokenBus-server
TODO: In proccess of separating both projects

## Deploy locally

```
$ # Install python dependencies
$ pip install -r requirements.txt
$ # Configure Flask entrypoint
$ export FLASK_APP=client.py
$ # In windows
C: set FLASK_APP=client.py
$ # Run flask dev server
$ flask run
$ # Run flask dev server available outside of localhost
$ flask run --host 0.0.0.0
```

## Dependecies used

### Python

* flask: Web framework [Quickstart documentation](https://flask.palletsprojects.com/en/1.1.x/quickstart/)
* requests: To send HTTP requests to retrieve API results [Documentation](https://2.python-requests.org/en/master/)

### Javascript

* leafletjs: Open source library for interactive mobile friendly maps. [Documentation](https://leafletjs.com/reference-1.6.0.html)
* Google OAuth 2.0: Google sign-in integration. It's client ID must be set up in the [secrets.json](secrets.json) file. [Documentation](https://developers.google.com/identity/sign-in/web/sign-in)
* Fontawesome: Open source icon set [Documentation](https://fontawesome.com/how-to-use/on-the-web/referencing-icons/basic-use)

### External data sources

* Dark Sky API: Weather forecasting API with free tier. It's apikey must be set up in the [secrets.json](secrets.json) file. [Documentation](https://darksky.net/dev/docs)