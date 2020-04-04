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
        reportData.coordinates = loc.latLng;
        reportData.locZoom = loc.zoom
        reportData.locName = loc.name;
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
                    initZoom={17}
                    delta={.5}
                    limit={4}
                    enableGeoCode={false}
                    enableRevGeoCode={false} />
            </Row>
            <Row>
                <Button onClick={handleClick}>Confirm Location</Button>
            </Row>

        </Container >
    );

}

export default withFirebase(LocationSelect);