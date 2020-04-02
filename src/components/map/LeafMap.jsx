import React, { useState, useRef } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { mapBoxConfig } from '../../firebase/config'
import LocateControl from './LocateControl'
import GeoCode from './GeoCode'
import Geocoder from "leaflet-control-geocoder"
import './LeafMap.css'
import MarkerClusterGroup from 'react-leaflet-markercluster';


const TextDiv = ({ name }) => {
    return (<h6>Location: {name}</h6>);
}

/**
 * Wrapper component for react-leaflet package that allows rendering of a map
 * @param {*} props 
 * * delta: .default 5,
 * * limit: default 3,
 * * enableMapBoxTiles: default false, if true, mapbox will be tile render source, else open street maps
 * * enableGeoCode: default false,
 * * enableRevGeoCode: default true, Turn off if too many API requests
 * * returnLocation: default null, callback function to return address to parent component
 * * clusterMarkerRender: default null, callback to render markers from parent component with clustering
 * * markerRender: default null, callback to render markers from parent component without clustering
 * * onClusterClick: default null, callback function when cluster is clicked
 * * onMarkerClick: default null, callback function when marker is clicked
 * * displayCenterMarker: default true display center marker on map
 */
const LeafMap = props => {
    // State Vars
    const latLng = { lat: 34.05, lng: -118.24 } // Initial map lat and lng
    const [zoom, setZoom] = useState(15) // map zoom level
    const [centerPos, setCenterPos] = useState({ lat: 34.05, lng: -118.24 }) // Center position, update to update middle marker
    const [address, setAddress] = useState({ name: "Loading..." }) // Address result from geocoding
    const [geocoder, setGeoCoder] = useState(new Geocoder.Mapbox(mapBoxConfig.apiKey, mapBoxOptions)) // Geocoder

    const locateZoom = 17;
    const locateOptions = { initialZoomLevel: locateZoom, enableHighAccuracy: true }

    // Refs to map object and to the map center marker
    const mapContainer = useRef(null)
    const centerMarker = useRef(null)

    // Options for mapbox geocoding queries
    const mapBoxOptions = {
        geocodingQueryParams: {
        },
        reverseQueryParams: {
            // Note: Following params can be modified if we don't like reverse geocoding results
            // reverseMode: "score",
            // limit: 2,
            // tpes: "address, poi"
        }
    }

    // Map movement handlers
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

    // Map and map marker render functions
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

    const centerMarkerRender = () => {
        if (props.displayCenterMarker) {
            return (
                <Marker position={centerPos} ref={centerMarker}>
                    <Popup>
                        We think you're here.
                    </Popup>
                </Marker>
            );
        }
        return null
    }

    const renderTileLayer = () => {
        if (props.enableMapBoxTiles) {
            return (
                <TileLayer
                    url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                    attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
                    tileSize="256"
                    maxZoom="18"
                    id='mapbox/streets-v11'
                    accessToken={mapBoxConfig.apiKey}
                />
            );
        }
        // NOTE: OSM Map Style Options:: https://leaflet-extras.github.io/leaflet-providers/preview/
        return (
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />);

    }

    return (
        <div>
            {renderRevGeoCode()}
            <Map ref={mapContainer} center={latLng} zoom={zoom} onmove={handleMove} onmoveend={handleMoveEnd}>
                {renderTileLayer()}
                {centerMarkerRender()}
                <MarkerClusterGroup
                    onclusterclick={props.onClusterClick}
                    spiderfyOnMaxZoom={false} // prevent spiderify of a cluster when we're zoomed in
                >
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
    enableMapBoxTiles: false,
    enableRevGeoCode: true,
    returnLocation: null,
    clusterMarkerRender: null,
    markerRender: null,
    onClusterClick: null,
    onMarkerClick: null,
    displayCenterMarker: true
}

export default LeafMap
