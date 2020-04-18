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
    const { userData, reportData, searchData } = props.firebase

    // Routing functions
    const history = useHistory();

    const handleReportClick = (event) => {
        setUserFlow('report')
        setConfirmPin(true);
        setDisplayCenterMarker(true);
        setMoveMenu(false);
    }

    const handleSearchClick = (event) => {
        setUserFlow('search')
        setConfirmPin(true);
        setDisplayCenterMarker(true);
        setMoveMenu(false);
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
    const [userFlow, setUserFlow] = useState('') // either 'report' or 'search'
    const [userLocation, setUserLocation] = useState(null)

    const moveUserMenu = (e) => {
        setMoveMenu(!moveMenu)
    }

    const cancelConfirmPin = () => {
        setConfirmPin(false);
        setDisplayCenterMarker(false);
    }

    const returnLocation = (loc) => {
        setUserLocation(loc);
    }

    const confirmLoc = () => {
        switch (userFlow) {
            case 'report':
                reportData.coordinates = userLocation.latLng;
                reportData.locZoom = userLocation.zoom
                reportData.locName = userLocation.name;
                history.push("/confirm-store")
                break;
            case 'search':
                searchData.coordinates = userLocation.latLng;
                searchData.locZoom = userLocation.zoom
                searchData.locName = userLocation.name;
                history.push("/search-item-type")
                break;
            default:
                console.error("Tried to confirm user location, but search flow wasn't set, was: ", userFlow)
        }


    }

    return (
        <Container fluid className="fill-height">
            <Row>
                <LeafMap
                    className="map-container"
                    returnLocation={returnLocation}
                    initZoom={17}
                    delta={.5}
                    limit={4}
                    enableGeoCode={false}
                    enableRevGeoCode={false}
                    displayCenterMarker={displayCenterMarker} />
            </Row>
            {/* Workaround, this must complement the leaf map's height in LeafMap.css */}
            <Row style={{ height: "10vh" }}>
                <Button buttonSize="btn-fit-half" onClick={handleSearchClick}>Find Supplies</Button>
                <Button buttonSize="btn-fit-half" onClick={handleReportClick}>Report Findings</Button>
            </Row>
            {/* TODO: This button jumps around when the page loads, likely due to CSS issues */}
            <Button buttonSize="btn-menu" onClick={moveUserMenu}>+</Button>
            <UserMenu in={moveMenu} />
            <ConfirmLocationSlider in={confirmPin} cancelCallback={cancelConfirmPin} confirmCallback={confirmLoc} />

        </Container >
    );

}

export default withFirebase(MapHome);