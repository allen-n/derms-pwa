import React, { useState, useEffect, useRef } from 'react'
import { withFirebase } from '../firebase/withFirebase'
import GoogleMapReact from 'google-map-react';
import { gMapsConfig } from '../firebase/config'
import ConfirmModal from './ConfirmModal'
import { Button } from 'react-bootstrap'

//TODO: Seperate this into different map compoments that
// include Gmap component but for the different user flows

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const Gmap = props => {
    // TODO: Delete state variables if not necessary
    const [center, setCenter] = useState({ lat: 34.05, lng: -118.24 })
    const [zoom, setZoom] = useState(10)
    const [placeInfo, setPlaceInfo] = useState(null)
    /**
     * var place_info = {
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        id: place.place_id,
        phone: place.formatted_phone_number,
        images: place.photos
        };
     */

    // Modal State
    const [confirmModalShow, setConfirmModalShow] = useState(false);
    const [confirmModalProps, setConfirmmodalProps] = useState({
        title: "Is this where you are?",
        body: "No Place",
        confirmtext: "Yes!",
        denytext: "No :(",
    })

    const setMapOptions = () => {
        return {
            disableDoubleClickZoom: true,
            streetViewControl: false,
            mapTypeControl: false,
            streetViewControl: false, // Remove option for satellite view
            zoomControl: false,
            scaleControl: false,
            fullscreenControl: false,
            styles: [{
                featureType: 'poi',
                stylers: [{ visibility: 'on' }]  // Turn *on* points of interest.
            }, {
                featureType: 'transit.station',
                stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
            }]
        }
    }

    const setAndReturnLoc = (map) => {
        var initialLocation = null
        var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        var myLoc = new google.maps.Marker({
            clickable: false,
            position: { lat: -33.890, lng: 151.274 },
            map: map,
            icon: image // TODO@ALLEN: use local file
        });
        navigator.geolocation.getCurrentPosition(function (position) {
            // Center on user's current location if geolocation prompt allowed
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
            map.setZoom(16);
            myLoc.setPosition(initialLocation);
        }, function (positionError) {
            // User denied geolocation prompt - default to Chicago
            map.setCenter(new google.maps.LatLng(39.8097343, -98.5556199));
            map.setZoom(13);
            alert("This app is a lot easier to use if you enable location!")
        });
        return initialLocation
    }

    var ClickEventHandler = function (map, origin) {
        this.origin = origin;
        this.map = map;
        this.placesService = new google.maps.places.PlacesService(map);

        // Listen for clicks on the map.
        map.addListener('click', this.handleClick.bind(this));
    };

    ClickEventHandler.prototype.handleClick = function (event) {
        console.log('You clicked on: ' + event.latLng);
        var map = this.map
        // If the event has a placeId, use it.
        if (event.placeId) {
            console.log('You clicked on place:' + event.placeId);

            // Calling e.stop() on the event prevents the default info window from
            // showing.
            // If you call stop here when there is no placeId you will prevent some
            // other map click event handlers from receiving the event.
            event.stop();
            map.setCenter(event.latLng);
            // this.calculateAndDisplayRoute(event.placeId);
            this.getPlaceInformation(event.placeId);
        }
    };

    ClickEventHandler.prototype.getPlaceInformation = function (placeId) {

        this.placesService.getDetails({ placeId: placeId }, function (place, status) {
            if (status === 'OK') {
                setConfirmmodalProps({
                    title: "Is this where you are?",
                    body: place.name + ", " + place.formatted_address,
                    confirmtext: "Yes!",
                    denytext: "No :(",
                })
                setConfirmModalShow(true);
                setPlaceInfo({
                    name: place.name,
                    address: place.formatted_address,
                    rating: place.rating,
                    id: place.place_id,
                    phone: place.formatted_phone_number,
                    images: place.photos
                });
            }
        });
    };


    // This returns the JSX that is the skeleton of the Gmap 
    return (
        // Important! Always set the container height explicitly

        <div style={{ height: '70vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: gMapsConfig.apiKey,
                    language: 'en',
                    libraries: 'places'
                }}
                defaultCenter={center}
                defaultZoom={zoom}
                options={setMapOptions}
                onGoogleApiLoaded={({ map, maps }) => {
                    // TODO: combine into "onMapLoad()"
                    // pass onMapLoad() as prop from parent component
                    var initLoc = setAndReturnLoc(map, maps)
                    var clickHandler = new ClickEventHandler(map, origin)
                }}
                yesIWantToUseGoogleMapApiInternals={true}
            >
                <AnyReactComponent
                    lat={34.05}
                    lng={-118.24}
                    text="My Marker"
                />
            </GoogleMapReact>
            <ConfirmModal
                show={confirmModalShow}
                onDeny={() => setConfirmModalShow(false)}
                onConfirm={() => {
                    console.log("Conf")
                    setConfirmModalShow(false)
                }}
                props={confirmModalProps}
            />
        </div>
    );
}

// This export injects the firebase prop into the Gmap component
export default withFirebase(Gmap)