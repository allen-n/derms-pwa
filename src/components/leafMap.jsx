import React, { useState, useEffect } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { mapBoxConfig } from '../firebase/config'
import { withFirebase } from '../firebase/withFirebase'
import LocateControl from './LocateControl'
import './leafMap.css'

const leafMap = props => {
    const [latLng, setLatLng] = useState({ lat: 34.05, lng: -118.24 })
    const [zoom, setZoom] = useState(15)
    // NOTE: OSM Map Style Options:: https://leaflet-extras.github.io/leaflet-providers/preview/

    const centerMap = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log(position.coords)
                var latit = position.coords.latitude;
                var longit = position.coords.longitude;
                setLatLng({ lat: latit, lng: longit });
                setZoom(15);
            })
        } else {
            console.log("ERROR: Location not enabled")
        }
    }


    return (
        <Map center={latLng} zoom={zoom} whenReady={centerMap}>
            {/* <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
            /> */}
            {/* Mapbox option */}
            <TileLayer
                url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
                tileSize="256"
                maxZoom="18"
                // zoomOffset="-1"
                id='mapbox/streets-v11'
                accessToken={mapBoxConfig.apiKey}
            />


            <Marker position={latLng}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            <LocateControl />
        </Map>
    );
}

export default withFirebase(leafMap)

