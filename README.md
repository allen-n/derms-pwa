# derms
## Digital Emergency Retail Management System
### Crowd sourcing data on essential goods & services 

*Note*: This is a re-creation of the [derms](https://github.com/allen-n/derms) repo, but using react to manage creating a single page PWA, the piecemeal way it was being done in the original derms repo was not working.

## What's the Point?
Driven by the COVID-19 epidemic, and the inability of many to get the supplies they desperately needed (often due to incorrect or out of date information on the availability of necessities), the DERMS project was born. 

DERMS is simple: crowdsource data on the availability of necessities near you, to reduce unnecessary travel, human to human interaction (in the case of COVID-19), and economic and emotional burden on folks who really just need a roll of toilet paper and don't want to drive to 7 different stores and still not find any.

## Design
Current design ideation can be viewed in an Adobe XD mockup [here](https://xd.adobe.com/view/42bdfd07-4ca1-4ebe-4f06-51c13a64ef12-348c/).

## Getting up and running (dev)

### Software Requirements
* NodeJS + npm installation
* Basic familiarity with your command line
* Set up your repo dependencies (firebase, etc.) according to the steps in Ovie's excellent guide [here](https://blog.logrocket.com/creating-a-lists-pwa-with-react-and-firebase/)
* Last, but not least, you'll need a config file, called config.js, that sits at ```derms-pwa/src/firebase/config.js```. The contents f the file should look like this:

```
export const firebaseConfig = {
    apiKey: # Fill in from firebase console
    authDomain: # Fill in from firebase console
    databaseURL: # Fill in from firebase console
    projectId: # Fill in from firebase console
    storageBucket: # Fill in from firebase console
    messagingSenderId: # Fill in from firebase console
    appId: # Fill in from firebase console
    measurementId: # Fill in from firebase console
}

export const mapBoxConfig = {
    apiKey: # Fill in from mapbox console
    username: # Fill in from mapbox console
}
```
* Firebase info is at the [Firebase Console](https://console.firebase.google.com/) under ```project overview > settings (gear icon) > general > Firebase SDK snippet```
* Mapbox info is at [Mapbox](https://account.mapbox.com/) under ```account > Access Tokens (on the main account page) ```

### Running
```
cd derms-pwa
npm install # run the very first time after you clone to install dependencies
npm start # run app locally
npm run deploy # deploy app to firebase host
```

### APIs being used
* [Firebase](https://firebase.google.com/docs/web/setup) for storage
* Various [Google Maps Javascript APIs](https://developers.google.com/maps/documentation/javascript/tutorial) 
* Relevant docs which informed creating the map are [here](https://developers.google.com/maps/documentation/javascript/firebase#creating-a-basic-map)
* 
* *More information TBD*

### TODOs:
* Complete "Report Item" Flow (See XD mock)
* Complete "Find Item" Flow (See XD mock)
* Create landing and login functionality

## Authors

* [Allen Nikka](https://github.com/allen-n)
* [Jordan Sturner](https://www.behance.net/jordansturner)

## Ackowledgements
* [Ovie Okeh](https://blog.logrocket.com/creating-a-lists-pwa-with-react-and-firebase/) - Great tutorial that got me going on the project.
* [kirupa](https://www.kirupa.com/react/creating_single_page_app_react_using_react_router.htm) - Tutorial on how to make a SPA using react router.
* [Meggin](https://github.com/Meggin) - For providing the [hello-world-pwa](https://github.com/Meggin/hello-world-pwa/commits?author=Meggin) which provided the original background to build this project as a progressive web app deployed with firebase.