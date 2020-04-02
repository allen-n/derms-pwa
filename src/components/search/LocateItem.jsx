import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { withFirebase } from '../../firebase/withFirebase'
import LeafMap from '../map/LeafMap'
import { Container, Row, Col, Button, Media } from 'react-bootstrap'
import { Marker, Popup } from 'react-leaflet'
import ReportListModal from './ReportListModal'
import ExifOrientationImg from 'react-exif-orientation-img'


const LocateItem = props => {
    const [userLocation, setUserLocation] = useState(null)
    const [loadedReports, setLoadedReports] = useState([])
    const [reportIdMap, setReportIdMap] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [modalItems, setModalItems] = useState([])
    const history = useHistory();

    const { firestore, searchData, reportCollection } = props.firebase

    const routeClick = () => {
        history.push("/report-type");
    }

    const queryRadius = 50; // in km
    const queryLimit = 1000;

    const handleModalOpen = () => {
        setShowModal(true);
    }

    const handleModalClose = () => {
        setShowModal(false);
    }

    // Make sure user data up to now is collected, if not route back
    useEffect(() => {
        if (searchData.itemId == null) {
            history.push('/search-item-type')
        }
    }, [])

    const returnLocation = (loc) => {
        const newAddr = {
            latLng: new firestore.GeoPoint(loc.latLng.lat, loc.latLng.lng),
            name: loc.name
        }
        searchData.latLng = newAddr.latLng;
        searchData.locName = "Search Location Name"; //newAddr.name;
        setUserLocation(loc);
        dbQueryReports(newAddr.latLng);
    }

    const handleClick = () => {
        routeClick()
    }

    const dbQueryReports = (loc) => {
        // Fetch like this, then when user clicks on a place, fetch nearby
        // records. sort them by date client-side, and copy the old ones elsewhere 

        reportCollection
            .near({ center: loc, radius: queryRadius })
            .where("itemId", "==", searchData.itemId)
            .limit(queryLimit).get()
            .then((querySnapshot) => {
                const reports = []
                const idMap = {}
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());
                    var tempDoc = doc.data()
                    tempDoc.id = doc.id
                    reports.push(tempDoc)
                    idMap[doc.id] = reports.length - 1 // Map document ID to array index
                });
                setLoadedReports(reports)
                setReportIdMap(idMap)
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    const renderMarkers = () => {
        if (!loadedReports.length) {
            return null
        }

        return (loadedReports.map(report => {
            // console.log(report)
            return (<Marker
                key={report.id}
                id={report.id}
                position={[report.coordinates.latitude, report.coordinates.longitude]}
                onclick={onMarkerClick}>
                {/* TODO@ALLEN: Intercept this click and pop up the result modal, but only for this one result */}
                {/* Can use onMarkerClick, docs here: https://www.npmjs.com/package/react-leaflet-markercluster */}
                {/* Turn off spiderify here: https://github.com/Leaflet/Leaflet.markercluster#all-options */}

                {/* <Popup> {"POP UP HERE"} </Popup> */}
            </Marker>)
        }));
    }

    const onClusterClick = (cluster) => {
        const reportsToSort = []
        cluster.layer.getAllChildMarkers().map((child) => {
            const id = child.options.id
            const report = loadedReports[reportIdMap[id]]
            reportsToSort.push(report)
            // console.log(JSON.parse(child.options.children[0].props.children[1]))
        });

        // Sorts in place, new to old. There is also a .nanoseconds prop, ignore for now, seconds is enough
        reportsToSort.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
        setModalItems(reportsToSort.map(reportToMedia))
        handleModalOpen()
        // TODO@ALLEN: Create some kind of modal that shows these results - DONE
        // TODO: Set initial zoom on item finding to be high enough to see item clusters! And remove the middle marker!
    }

    const reportToMedia = (report) => {
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(report.timestamp.seconds);
        const storeName = report.store == "" ? "No Name Provided" : report.store

        // TODO: Fix orientation problem on images: https://github.com/rricard/react-exif-orientation-img
        // ExifOrientationImg work bc exif data isn't being uploaded, need to fix that
        const img = report.imgurl ?
            <ExifOrientationImg // Need to set image size or they blow up the display
                width={64}
                height={64}
                className="mr-3"
                src={report.imgurl}
                alt="No Image Provided"
            /> : null

        return ({
            id: report.id,
            name: // This is just so I don't have to change all the other classes that use ItemList
                <Media>
                    {img} {/* Dont load the image if there isn't one */}
                    <Media.Body>
                        <h5>Store: {storeName}, Stock(0-3): {report.stock}</h5>
                        <p>
                            Report Date: {d.toLocaleDateString()} <br />
                                Report Time: {d.toLocaleTimeString()}
                        </p>
                        <Button onClick={() => goToNavigate(report.id)}> Go </Button>
                    </Media.Body>
                </Media>
        });
    }

    const goToNavigate = (id) => {
        const report = loadedReports[reportIdMap[id]]
        console.log(report)
        const coords = report.coordinates
        const lat = String(coords.latitude)
        const long = String(coords.longitude)
        console.log("maps://maps.google.com/maps?daddr=" + lat + "," + long)
        if /* if we're on iOS, open in Apple Maps */
            ((navigator.platform.indexOf("iPhone") != -1) ||
            (navigator.platform.indexOf("iPad") != -1) ||
            (navigator.platform.indexOf("iPod") != -1))
            window.open("maps://maps.google.com/maps?daddr=" + lat + "," + long);
        else /* else use Google */
            window.open("https://maps.google.com/maps?daddr=" + lat + "," + long);
    }

    const onMarkerClick = (marker) => {
        const id = marker.target.options.id
        const report = loadedReports[reportIdMap[id]]
        setModalItems([reportToMedia(report)]) // ItemList expects a list, even if it's length 1
        handleModalOpen()
        // console.log(report)
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
                    enableRevGeoCode={false}
                    clusterMarkerRender={renderMarkers}
                    onClusterClick={onClusterClick}
                    displayCenterMarker={false}
                >
                </LeafMap>
                <ReportListModal show={showModal} items={modalItems} handleClose={handleModalClose} />
            </Row>
            <Row>
                <Button onClick={handleModalOpen}>Confirm Location</Button>
            </Row>
        </Container >
    );


}

export default withFirebase(LocateItem);