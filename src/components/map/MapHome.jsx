import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { withFirebase } from '../../firebase/withFirebase'
import LeafMap from '../map/LeafMap'
import { Container, Row } from 'react-bootstrap'
import { Button } from '../button/Button';

const MapHome = props => {
    // db variables
    const { userData } = props.firebase

    // Routing functions
    const history = useHistory();

    const handleReportClick = (event) => {
        history.push("/locate");
    }

    const handleSearchClick = (event) => {
        history.push("/search-item-type")
    }


    // Make sure user data up to now is collected, if not route back
    useEffect(() => {
        if (userData == null) {
            // alert("You must be logged in to make reports.")
            history.push('/')
        }
    }, [])

    return (
        <Container fluid>
            <Row>
                <LeafMap
                    initZoom={17}
                    delta={.5}
                    limit={4}
                    enableGeoCode={false}
                    enableRevGeoCode={false} />
            </Row>
            <Row>
                <Button buttonSize="btn-row" onClick={handleSearchClick}>Find Supplies</Button>
                <Button buttonSize="btn-row" onClick={handleReportClick}>Report Findings</Button>
            </Row>

        </Container >
    );

}

export default withFirebase(MapHome);