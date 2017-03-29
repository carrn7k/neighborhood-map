# Neighborhood Map -- version 1.0

A single-page app which displays a map of a neighborhood and
information about notable places in that area.

## Running the App--
	
### Dependencies - 
* Vagrant
* VirtualBox
* Python
* Flask
* Knockout JS
* jQuery
* Font-Awesome
* Node
* Gulp

If you don't have have Python on your machine, you'll 
need to install Python and the necessary python libraries.

Download and Install Python: https://www.python.org/downloads/

A virtual machine is needed to run the app locally and integrate 
the Python backend, which is necessary for the Yelp Fusion API. 
If don't wish to use the Yelp API, vagrant, Python and VirtualBox
are not necessary, as the html can simply be opened in a web browser.

## If you wish to us Vagrant, Python and VirtualBox, refer to the instructions below:

If you don't have vagrant and VirtualBox installed on yourmachine,
please install them and set up your virtualmachine using the .vagrant
file in the directory.

For help installing vagrant, visit the following
link: https://www.vagrantup.com/docs/getting-started/project_setup.html

This app is set to run on localhost:5000, if you wish
to change this, please reconfigure the vagrant file to 
include the port you wish to operate from. 

```ruby
  config.vm.network "forwarded_port", guest: 8000, host: 8000
  config.vm.network "forwarded_port", guest: 8080, host: 8080
  config.vm.network "forwarded_port", guest: 5000, host: 5000
```
**If you make changes to the .vagrant file, run *vagrant reload* for changes to take effect**
**You also must reconfigure the portion of application.py file shown below.**

```python
if __name__ == '__main__':
    app.debug = True
    app.secret_key = "super_secret_key"
    app.run(host='0.0.0.0', port=5000)
```
	
After all required software has been installed, open a 
terminal and navigate to the project directory /NeighborhoodMap.
In your terminal, type the following commands:

* vagrant up
* vagrant ssh

You should now be logged into the virtual machince. Navigate
to /vagrant to access the application files and then
type python neighborhood.py to run the app. After typing this 
command, your machine should be hosting the app on localhost:5000
(or whatever port you've set up). Open your favorite browser 
and navigate to your local port to view the app. 

## API's

This app uses Flickr, Yelp and Trip Expert to provide additional
information and media about the places. Flickr requires an API 
secret and key, Trip Expert requires an API key, and Yelp requires
a client id and secret. Please refer to the following links for 
instructions on obtaining the secrets and keys:

* https://www.flickr.com/services/developer/api/
* https://www.tripexpert.com/api
* https://www.yelp.com/developers/documentation/v3/get_started

Once you have obtained the keys and secret, you'll need to update
the main.js file. You can either update the main.js file directly,
or you can create a seperate file to store the key and secret. If
you choose to update the file directly, go to line 293 in main.js and
change the variable tripExpertKey to point to your API key:

```javascript
var tripExpertKey = YOUR_API_KEY
```
Next, go to lines 476 and 477 in the main.js file and update the flickKey
and flickSecret variables:

```javascript
var flickKey = YOUR_API_KEY
var flickSecret = YOUR_SECRET
```
To update the Yelp credentials, open the neighborhood.py file and locate 
the client_id and client_secret variables. 

```python
client_id = YOUR_CLIENT_ID
client_secret = YOUR_CLIENT_SECRET
```

If you choose to create a seperate file, then name it config_settings.js
and add the following variables: 

```javascript
var fKey = YOUR_FLICKR_API_KEY
var fSecret = YOUR_FLICKR_API_SECRET
var tKey = YOUR_TRIPEXPERT_API_KEY
```
Additionally, you can create a seperate file to store your Yelp variables. 
Create a file named yelp_secrets.json--or whatever you wish to call it, and
store the variables in a json object. In the neighborhood.py file, load the 
variables from the file like so:

```python
CLIENT_DATA = json.loads(open('yelp_secrets.json', 'r').read())
client_id = CLIENT_DATA['yelp_data']['client_id']
client_secret = CLIENT_DATA['yelp_data']['client_secret']
```

## Building the App

This application is built using NPM and Gulp. In order to build the app
from the ground up please install Node. For help installing Node and npm
refer to the following link https://docs.npmjs.com/getting-started/installing-node.

After you have node installed, open the Node.js command prompt and navigate 
to your working directory. Once in the directory, follow the instructions at 
this link https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md. 

This app utilizes the following Gulp plugins: 

* gulp-sass
* gulp-autoprefixer
* gulp-concat
* gulp-uglify
* gulp-clean-css

To install them, in your working directory type the following commands:

npm install gulp-sass --save-dev
npm install gulp-autoprefixer --save-dev
npm install gulp-concat --save-dev
npm install gulp-uglify --save-dev
npm install gulp-clean-css --save-dev

For a reference of the gulp functions being used in this app, please refer
to the gulp.js file. Depending on the structure of your directory, you may 
need to reconfigure the folder destinations and sources. Once the Gulp
plugins have been installs, simply type commands in the Node terminal to 
execute them.
 
	
