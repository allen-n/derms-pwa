import React, { useState, useRef } from 'react'
import { withFirebase } from '../firebase/withFirebase'
import LeafMap from './LeafMap'
import { Container, Row, Button, Text } from 'react-bootstrap'

const LocationSelect = props => {
    const [userAddress, setUserAddress] = useState(null)
    // const mapRef = useRef(null)

    const returnAddress = (address) => {
        // console.log(address)
        setUserAddress(address);
    }

    const handleClick = () => {
        console.log(userAddress)
    }

    return (
        <Container fluid>
            <Row>
                <LeafMap
                    returnAddress={returnAddress}
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