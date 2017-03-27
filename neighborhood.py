from flask import Flask, render_template, request
import httplib2
import urllib
import urllib2
import requests
import json
import re

app = Flask(__name__)

    
@app.route('/')
@app.route('/yelpReviews', methods=['GET', 'POST'])
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

    # Return business data for yelp fusion requests
    businesses = {}
    if request.method == 'POST':

        place_data = json.loads(request.data)
        
        # business search request
        url = 'https://api.yelp.com/v3/businesses/search'
        params = {
                'term': place_data['placeName'],
                'latitude': place_data['coords']['lat'],
                'longitude': place_data['coords']['lng'],
                'limit': 20
                }
        headers = {'Authorization': 'bearer %s' % access_token}

        r = requests.get(url, params=params, headers=headers)
        business_data = json.loads(r.content)

        count = 1
        reg_ex = None
        search_terms = None
        match = None


        yelp_data = {}
        for b in business_data['businesses']:
            
            if len(place_data['placeName']) <= len(b['name']):
                reg_ex = re.compile(r"\b%s\b" % place_data['placeName'], re.I)
                search_terms = b['name']
            else:
                reg_ex = re.compile(r"\b%s\b" % b['name'], re.I)
                search_terms = place_data['placeName']

            if reg_ex.search(search_terms):
                match = True
                yelp_data = {
                    'id': b['id'],
                    'url': b['url'],
                    'photo': b['image_url']
                    }
                break
            count+=1
            
        if match:
            r_url = "https://api.yelp.com/v3/businesses/%s/reviews" % yelp_data['id']
            review_request = requests.get(r_url, headers=headers)
            review_data = json.loads(review_request.content)
            yelp_data['reviews'] = review_data
            yelp_json = json.dumps(yelp_data, default=lambda o: o.__dict__)
 
        else:
            yelp_json = None
            
        return yelp_json
            
    elif request.method == 'GET':
        return render_template('index.html', DATA=data)
    

if __name__ == '__main__':
    app.debug = True
    app.secret_key = "super_secret_key"
    app.run(host='0.0.0.0', port=5000)
