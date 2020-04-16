
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from 'react-router-dom';
import { Form } from "react-bootstrap";
import { Button } from '../button/Button';
import { withFirebase } from '../../firebase/withFirebase'
import Geocoder from "leaflet-control-geocoder"
import { mapBoxConfig } from '../../firebase/config'
import ReactDOM from 'react-dom'

/**
 * Creates the location input dropdown form
 * Expects locations in array as prop, with the for [{name: "str"}, ..., {name:"Not Listed"}]
 * Last element should have a name string corresponding to a not-found entry
 */
const DropdownLocation = props => {
    // const locations = props.locations != null ? JSON.parse(JSON.stringify(props.locations)) : [] // deep copy

    if (props.returnLocation == null) {
        console.error("Location callback must be defined!")
    }
    // locations.push({ name: notFoundStr })

    const [selectedLoc, setSelectedLoc] = useState(null)

    const locSelectRef = useRef(null)


    const handleClick = (e) => {
        const val = ReactDOM.findDOMNode(locSelectRef.current).value
        const loc = JSON.parse(val)
        setSelectedLoc(loc)
    }

    useEffect(() => {
        ReactDOM.findDOMNode(locSelectRef.current).selectedIndex = -1
    }, [])

    useEffect(() => {
        if (props.locations.length) {
            setSelectedLoc(props.locations[0])
        }


    }, [props.locations])

    useEffect(() => {
        if (selectedLoc != null) {
            if (selectedLoc.name != props.notFoundStr) { props.returnLocation(selectedLoc) }
            else { props.returnLocation(null) }
        }

    }, [selectedLoc])


    if (props.locations != null) {
        return (<>
            <Form.Group controlId="storeName">
                <Form.Label>What store are you in? (Required)</Form.Label>
                <Form.Control required ref={locSelectRef} as="select" onChange={handleClick}>
                    {props.locations.map(location => {
                        const name = location.name.split(",")
                        const val = JSON.stringify(location)
                        return (<option key={name} value={val}>{name[0]}</option>);
                    })}
                </Form.Control>
            </Form.Group>
        </>);
    }
    return null

}


const ConfirmStore = props => {
    // db vars
    const {
        reportData,
        userData,
        storage,
        reportCollection,
        usersCollection,
        firestore } = props.firebase

    // Options for mapbox geocoding queries
    const mapBoxOptions = {
        geocodingQueryParams: {
        },
        reverseQueryParams: {
            // Note: Following params can be modified if we don't like reverse geocoding results
            types: "poi",
            reverseMode: "score",
            limit: 4
        }
    }
    const addrOptions = {
        geocodingQueryParams: {
        },
        reverseQueryParams: {
            types: "address",
            reverseMode: "distance",
            limit: 1
        }
    }

    const [addrCoder, setAddrCoder] = useState(new Geocoder.Mapbox(mapBoxConfig.apiKey, addrOptions)) // address Geocoder
    const [geocoder, setGeoCoder] = useState(new Geocoder.Mapbox(mapBoxConfig.apiKey, mapBoxOptions)) // Geocoder
    const [possibleLocs, setPossibleLocs] = useState([])
    const [selectedLoc, setSelectedLoc] = useState(null)
    const [addrStr, setAddrStr] = useState('')
    const storeNotFoundRef = useRef(null)

    const history = useHistory();

    // Make sure report data up to now is collected, if not route back
    useEffect(() => {
        if (typeof reportData.coordinates === 'undefined') {
            history.push('/map-home')
        }

        reverseGeoCode()
    }, [])

    // Reverse Geocode result listing
    const notFoundStr = "Not Listed"
    const returnLocation = (location) => {
        setSelectedLoc(location)
    }

    // Reverse geocoding, dup from LeafMap
    const reverseGeoCode = () => {
        geocoder.reverse(reportData.coordinates, reportData.locZoom, results => {
            results.push({ name: notFoundStr })
            setPossibleLocs(results)
        })
        addrCoder.reverse(reportData.coordinates, reportData.locZoom, results => {
            if (results.length > 0) {
                setAddrStr(results[0].name)
            }
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        // Split the name and address of the place (if given)
        const name = selectedLoc == null ? storeNotFoundRef.current.value : selectedLoc.name
        const nameArr = name.split(",")
        reportData.locName = nameArr[0]
        reportData.locAddress = selectedLoc == null ? addrStr : nameArr.slice(1, -1).join(",")
        reportData.user = userData.uid

        // If the place has a geo point, use that
        reportData.coordinates = selectedLoc == null ? reportData.coordinates : selectedLoc.center
        reportData.coordinates = new firestore.GeoPoint(reportData.coordinates.lat, reportData.coordinates.lng)
        history.push("/report-type")
    }

    const renderStoreInput = () => {
        if (selectedLoc == null) {
            return (<Form.Group controlId="storeNameNotFound">
                <Form.Label>Not listed? Let us know</Form.Label>
                <Form.Control ref={storeNotFoundRef} required placeholder="Store name" />
            </Form.Group>);
        }
        return null
    }

    const handleCancel = () => {
        history.push("/map-home")
    }

    return (
        <div>
            < Form onSubmit={handleSubmit}>
                <DropdownLocation
                    returnLocation={returnLocation}
                    locations={possibleLocs}
                    notFoundStr={notFoundStr}>
                </DropdownLocation>
                {renderStoreInput()}

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form >
            <Button buttonStyle="btn-secondary__active" buttonSize="btn-medium" onClick={handleCancel}>Cancel</Button>
        </div>);
}

export default withFirebase(ConfirmStore);