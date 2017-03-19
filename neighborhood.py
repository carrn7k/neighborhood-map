from flask import Flask, render_template
import httplib2
import requests
import json

import urllib

app = Flask(__name__)

    
@app.route('/')
@app.route('/neighorhood/')
def test():

    # make this secret
    client_id = 'ep5qqPgGIQ_AcshvApcWfA'
    client_secret = 'M5mOMPPmVZVZr1Jda9aQIJuIGzzlcqeVL310nH4KGDWKUmz9OY3HUGOlJZMvHdhi'

    # retrieve access_token
    url = 'https://api.yelp.com/oauth2/token?grant_type=client_credentials&client_id=%s&client_secret=%s' % (
        client_id, client_secret)
    h = httplib2.Http()
    response = h.request(url, "POST")
    data = json.loads(response[1])
    access_token = data['access_token']

##    print('\n')
##    print(response)
##    print('\n')
##
##    # build request url
##    url = 'https://api.yelp.com/v3/businesses/search'
##    
##    data = {'term': 'food',
##            'location': 'Tokyo'}
##    e_data = urllib.urlencode(data)
##    headers = {'Authorization': 'Bearer: %s' % access_token}
##
##    # make request
##    response = requests.request('GET', url, data=data, headers=headers)
####    request = h.request(y_url,
####                    method='GET',
####                    headers={'Authorization': 'Bearer: %s' % access_token},
####                    body=e_params)
##
##    print('\n')
##    print(response.json())
##    print('\n')
##            

    return render_template('index.html', DATA=data)
    

if __name__ == '__main__':
    app.debug = True
    app.secret_key = "super_secret_key"
    app.run(host='0.0.0.0', port=5000)
