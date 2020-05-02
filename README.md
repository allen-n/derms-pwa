# derms
## Digital Emergency Retail Management System
### Crowd sourcing data on essential goods & services 

## What's the Point?
Driven by the COVID-19 epidemic, and the inability of many to get the supplies they desperately needed (often due to incorrect or out of date information on the availability of necessities), the DERMS project was born. 

DERMS is simple: crowdsource data on the availability of necessities near you, to reduce unnecessary travel, human to human interaction (in the case of COVID-19), and economic and emotional burden on folks who really just need a roll of toilet paper and don't want to drive to 7 different stores and still not find any.

## Design
Current design ideation can be viewed in an Adobe XD mockup [here](https://xd.adobe.com/view/42bdfd07-4ca1-4ebe-4f06-51c13a64ef12-348c/).

## Getting up and running (dev)

### Software Requirements
* NodeJS + npm installation
* Basic familiarity with your command line
* Set up your repo dependencies (firebase, etc.) according to the steps in Ovie's excellent guide [here](https://blog.logrocket.com/creating-a-lists-pwa-with-react-and-firebase/). From the guide:
  * If you have experience with Firebase, go ahead and create a new project, create a web app, and provision a Firestore database for it. Otherwise, [create a Firebase account](https://console.firebase.google.com/), log in to your console, and follow the steps in this video below to get set up. 
  * [![Firebase Setup Video](https://img.youtube.com/vi/z4ag_b9tP8k/0.jpg)](https://youtu.be/z4ag_b9tP8k)
  * In the derms-pwa directory, run ```firebase login``` and sign in to your Firebase account. Now complete the following steps:
    1. Run ```firebase init```
    2. Using your spacebar, select both ```Firestore``` and ```Hosting``` and hit enter
    3. Select ```Use an existing project``` and hit enter
    4. Choose the newly created project from the list and hit enter
    5. Keep hitting enter until you get the question ```Configure as a single-page app (rewrite all urls to /index.html)?```. Type ```y``` and hit enter
    6. Some files will be automatically generated or modified for you. Undo the changes to ```firebase.json``` and ```package.json``` by going into those files respectively and pressing ```ctrl-z``` or using the git command (we want the version of these files that came from this repo): 
   ```
   cd derms-pwa
   git checkout -- package.json firebase.json
   ```

* ~~The only additional piece not in Ovie's guide is cloud functions, which can be added to the project by following the documentation google provides [here](https://firebase.google.com/docs/functions/get-started). Updated functions can be deployed using the command ```firebase deploy --only functions```.~~
  * _Note: Cloud functions currently aren't used, so you can skip this step. They may at some point in the future make their way back into the project_
* Last, but not least, you'll need a config file, called config.js, that sits at ```derms-pwa/src/firebase/config.js```. The contents of the file should look like this:

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

### Documentation on APIs, Libraries, & Frameworks being used (and learned on the fly)
* [Firebase](https://firebase.google.com/docs/web/setup), Backend storage, hosting, and auth services
* [React](https://reactjs.org/docs/getting-started.html), Front End Framework
* [Open-Street-Map](https://www.openstreetmap.org/), Map raster tiles
* [Mapbox](https://docs.mapbox.com/api/search/#geocoding), Map geocoding APIs
* [React-Leaflet](https://react-leaflet.js.org/) Map View for rendering open street maps or mapbox raster tiles in react.
* [React-Leaflet-Markercluster](https://github.com/YUzhva/react-leaflet-markercluster#readme), Marker clustering library for leaflet map
* [React-Boostrap](https://react-bootstrap.github.io/getting-started/introduction), Pre-made components and grid organization for UI
* [Geofirestore](https://github.com/geofirestore/geofirestore-js), Wrapper for Firebase's firestore database to allow searching based on geography (i.e. geohashing)
* [React-Exif-Orientation-Img](https://github.com/rricard/react-exif-orientation-img), Help maintain proper image orientation from user uploaded images using exif data
* [UUID](https://github.com/uuidjs/uuid#readme), Generate unique GUIDs for user uploaded data
* [React-Router-Dom](https://github.com/ReactTraining/react-router#readme), SPA routing library for react


## Authors

* [Allen](https://github.com/allen-n) - Frontend & Backend, lots of coding and deciding how to make things work
* [Jordan](https://www.behance.net/jordansturner) - Design & Ideation, lots of deciding how to make things look and feel 
* [Bruno](https://github.com/Brun012) - Frontend, lots of translating design & UX vision into functional code

## Ackowledgements
* [Ovie Okeh](https://blog.logrocket.com/creating-a-lists-pwa-with-react-and-firebase/) - Great tutorial that got me going on the project.
* [kirupa](https://www.kirupa.com/react/creating_single_page_app_react_using_react_router.htm) - Tutorial on how to make a SPA using react router.

