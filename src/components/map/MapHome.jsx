import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { withFirebase } from '../../firebase/withFirebase'
import LeafMap from '../map/LeafMap'
import { Container, Row } from 'react-bootstrap'
import { Button } from '../button/Button';
import UserMenu from '../utils/UserMenu'
import ConfirmLocationSlider from '../map/ConfirmLocationSlider'
import './MapHome.css'

const MapHome = props => {
    // db variables
    const { userData } = props.firebase

    // Routing functions
    const history = useHistory();

    const handleReportClick = (event) => {
        // history.push("/locate");
        setConfirmPin(true);
        setDisplayCenterMarker(true);
        setMoveMenu(false);
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

    const [moveMenu, setMoveMenu] = useState(false)
    const [confirmPin, setConfirmPin] = useState(false)
    const [displayCenterMarker, setDisplayCenterMarker] = useState(false)

    const moveUserMenu = (e) => {
        setMoveMenu(!moveMenu)
    }

    const cancelConfirmPin = () => {
        setConfirmPin(false);
        setDisplayCenterMarker(false);
    }

    return (
        <Container fluid>
            <Row>
                <LeafMap
                    className="map-container"
                    initZoom={17}
                    delta={.5}
                    limit={4}
                    enableGeoCode={false}
                    enableRevGeoCode={false}
                    displayCenterMarker={displayCenterMarker} />
            </Row>
            <Row>
                <Button buttonSize="btn-row" onClick={handleSearchClick}>Find Supplies</Button>
                <Button buttonSize="btn-row" onClick={handleReportClick}>Report Findings</Button>
            </Row>
            {/* TODO: This button jumps around when the page loads, likely due to CSS issues */}
            <Button buttonSize="btn-menu" onClick={moveUserMenu}>+</Button>
            <UserMenu in={moveMenu} />
            <ConfirmLocationSlider in={confirmPin} cancelCallback={cancelConfirmPin}/>

        </Container >
    );

}

export default withFirebase(MapHome);