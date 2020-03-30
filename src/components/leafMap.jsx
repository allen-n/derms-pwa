import React, { useState, useRef } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { mapBoxConfig } from '../firebase/config'
import LocateControl from './LocateControl'
import GeoCode from './GeoCode'
import Geocoder from "leaflet-control-geocoder"
import './LeafMap.css'
import MarkerClusterGroup from 'react-leaflet-markercluster';


const TextDiv = ({ name }) => {
    return (<h6>Location: {name}</h6>);
}

const LeafMap = props => {
    const latLng = { lat: 34.05, lng: -118.24 } // Initial map lat and lng
    const [zoom, setZoom] = useState(15) // map zoom level
    const [centerPos, setCenterPos] = useState({ lat: 34.05, lng: -118.24 }) // Center position, update to update middle marker
    const [address, setAddress] = useState({ name: "Loading..." })

    const locateZoom = 17;
    const locateOptions = { initialZoomLevel: locateZoom, enableHighAccuracy: true }

    const mapContainer = useRef(null)
    const centerMarker = useRef(null)

    const mapBoxOptions = {
        geocodingQueryParams: {
        },
        reverseQueryParams: {
            // TODO: Play with params if we don't like reverse geocoding results
            // reverseMode: "score",
            // limit: 2,
            // tpes: "address, poi"
        }
    }

    const [geocoder, setGeoCoder] = useState(new Geocoder.Mapbox(mapBoxConfig.apiKey, mapBoxOptions))

    // NOTE: OSM Map Style Options:: https://leaflet-extras.github.io/leaflet-providers/preview/

    const handleMove = event => {
        var newCenter = event.target.getCenter()
        setCenterPos(newCenter)
    }

    const handleMoveEnd = event => {
        var newCenter = event.target.getCenter()
        setCenterPos(newCenter)
        if (props.enableRevGeoCode) {
            reverseGeoCode();
        } else {
            if (props.returnLocation != null) {
                props.returnLocation({
                    latLng: newCenter,
                    name: "Geocoding Off"
                })
            }
        }

    }

    const renderGeoCode = () => {
        if (props.enableGeoCode) {
            return (<GeoCode searchLoc={centerPos} delta={props.delta} limit={props.limit} />);
        }
        return null
    }

    const renderRevGeoCode = () => {
        if (props.enableRevGeoCode) {
            return (<TextDiv name={address.name}> </TextDiv>);
        }
        return null
    }

    const reverseGeoCode = () => {
        geocoder.reverse(centerPos, zoom, results => {
            var r = results[0];
            setAddress(r)
            if (props.returnLocation != null) {
                const newAddr = {
                    latLng: centerPos,
                    name: r.name
                }
                props.returnLocation(newAddr)
            }
        })
    }

    const clusterMarkerRender = () => {
        if (props.clusterMarkerRender != null) {
            return props.clusterMarkerRender()
        }
        return null
    }

    return (
        <div>
            {renderRevGeoCode()}
            <Map ref={mapContainer} center={latLng} zoom={zoom} onmove={handleMove} onmoveend={handleMoveEnd}>
                {/* OpenStreetMaps Option */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Mapbox option */}
                {/* <TileLayer
                url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
                tileSize="256"
                maxZoom="18"
                id='mapbox/streets-v11'
                accessToken={mapBoxConfig.apiKey}
            /> */}


                <Marker position={centerPos} ref={centerMarker}>
                    <Popup>
                        We think you're here.
                    </Popup>
                </Marker>
                <MarkerClusterGroup
                    onclusterclick={props.onClusterClick}>
                    {clusterMarkerRender()}
                </MarkerClusterGroup>

                <LocateControl options={locateOptions} startDirectly={true} />
                {renderGeoCode()}
            </Map>

        </div>
    );
}

LeafMap.defaultProps = {
    delta: .5,
    limit: 3,
    enableGeoCode: false,
    enableRevGeoCode: true, // Turn off if too many API requests
    returnLocation: null, // callback function to return address to parent component
    clusterMarkerRender: null, // callback to render markers from parent component with clustering
    markerRender: null, // callback to render markers from parent component without clustering
    onClusterClick: null, // callback function when cluster is clicked
    onMarkerClick: null // callback function when marker is clicked
}

export default LeafMap

