import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { withFirebase } from '../../firebase/withFirebase'
import LeafMap from '../map/LeafMap'
import { Container, Row, Button } from 'react-bootstrap'

const LocationSelect = props => {
    // State Vars
    const [userLocation, setUserLocation] = useState(null)

    // db variables
    const { firestore, reportData, userData } = props.firebase

    // Routing functions
    const history = useHistory();

    const routeClick = () => {
        history.push("/report-type");
    }

    // Make sure user data up to now is collected, if not route back
    useEffect(() => {
        if (userData == null) {
            // alert("You must be logged in to make reports.")
            history.push('/')
        }
    }, [])

    // onClick / callbacks
    const returnLocation = (loc) => {
        const newAddr = {
            latLng: new firestore.GeoPoint(loc.latLng.lat, loc.latLng.lng),
            name: loc.name
        }
        reportData.coordinates = newAddr.latLng;
        reportData.locName = newAddr.name;
        setUserLocation(loc);
    }
    const handleClick = () => {
        routeClick()
    }

    return (
        <Container fluid>
            <Row>
                <LeafMap
                    returnLocation={returnLocation}
                    // ref={mapRef}
                    delta={.5}
                    limit={3}
                    enableGeoCode={false}
                    enableRevGeoCode={true} />
            </Row>
            <Row>
                <Button onClick={handleClick}>Confirm Location</Button>
            </Row>

        </Container >
    );

}

export default withFirebase(LocationSelect);