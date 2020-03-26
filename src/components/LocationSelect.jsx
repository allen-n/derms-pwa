import React, { useState, useRef } from 'react'
import { useHistory } from 'react-router-dom';
import { withFirebase } from '../firebase/withFirebase'
import LeafMap from './LeafMap'
import { Container, Row, Button, Text } from 'react-bootstrap'

const LocationSelect = props => {
    const [userLocation, setUserLocation] = useState(null)
    const history = useHistory();

    const { firestore, dbData } = props.firebase

    const routeClick = () => {
        history.push("/report");
    }

    const returnLocation = (loc) => {
        const newAddr = {
            latLng: new firestore.GeoPoint(loc.latLng.lat, loc.latLng.lng),
            name:loc.name
        }
        dbData.location = newAddr;
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