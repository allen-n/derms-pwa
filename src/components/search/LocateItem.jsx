import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { withFirebase } from '../../firebase/withFirebase'
import LeafMap from '../map/LeafMap'
import { Container, Row, Media } from 'react-bootstrap'
import { Button } from '../button/Button'
import { Marker } from 'react-leaflet'
import ReportListModal from './ReportListModal'
import ExifOrientationImg from 'react-exif-orientation-img'
import * as allItems from '../../firebase/items.json'
import '../utils/MapComponents.css'



const LocateItem = props => {
    const [userLocation, setUserLocation] = useState(null)
    const [loadedReports, setLoadedReports] = useState([])
    const [reportIdMap, setReportIdMap] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [modalItems, setModalItems] = useState([])
    const [resetZoom, setResetZoom] = useState(false)

    const maxZoom = 18
    const [mapZoom, setMapZoom] = useState(maxZoom)
    const [searchItemName, setSearchItemName] = useState('')

    const history = useHistory();

    const { firestore, searchData, reportCollection } = props.firebase

    const routeClick = () => {
        history.push("/report-type");
    }

    const queryRadius = 15; // in km, TODO: Make this modifiable dynamically
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

    useEffect(() => {
        if (searchData.categoryId) {
            const itemName = allItems[searchData.categoryId].items[searchData.itemId].name
            setSearchItemName(itemName)
        }
    }, [searchData])

    const returnZoom = (zoom) => {
        setMapZoom(zoom)
    }

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
            </Marker>)
        }));
    }

    const onClusterClick = (cluster) => {
        if (mapZoom >= maxZoom) { // Prevent this behavior unless they're already zoomed all the way in
            const reportsToSort = []
            cluster.layer.getAllChildMarkers().map((child) => {
                const id = child.options.id
                const report = loadedReports[reportIdMap[id]]
                reportsToSort.push(report)
            });

            // Sorts in place, new to old. There is also a .nanoseconds prop, ignore for now, seconds is enough
            reportsToSort.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
            setModalItems(reportsToSort.map(reportToMedia))
            handleModalOpen()
        }
    }

    const reportToMedia = (report) => {
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(report.timestamp.seconds);
        const storeName = report.locName

        // TODO: Fix orientation problem on images: https://github.com/rricard/react-exif-orientation-img
        // ExifOrientationImg work bc exif data isn't being uploaded, need to fix that
        const img = report.imgurl ?
            <ExifOrientationImg // Need to set image size or they blow up the display
                width={64}
                height={"auto"}
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
                            Address: {report.locAddress} <br />
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
        const coords = report.coordinates
        const lat = String(coords.latitude)
        const long = String(coords.longitude)
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


    const zoomOut = () => {
        setResetZoom(!resetZoom)
    }

    const goHome = () => {
        history.push("/map-home")
    }

    return (
        <Container fluid>
            <Row>
                <p className="item-tooltip">{searchItemName}</p>
                <LeafMap
                    returnLocation={returnLocation}
                    delta={.5}
                    limit={3}
                    enableGeoCode={false}
                    enableRevGeoCode={false}
                    clusterMarkerRender={renderMarkers}
                    onClusterClick={onClusterClick}
                    displayCenterMarker={false}
                    resetZoom={resetZoom}
                    maxZoom={maxZoom}
                    returnZoom={returnZoom}
                >
                </LeafMap>
                <ReportListModal show={showModal} items={modalItems} handleClose={handleModalClose} />
            </Row>
            {/* Workaround, this must complement the leaf map's height in LeafMap.css */}
            <Row style={{ height: "10vh" }}>
                <Button buttonStyle="btn-secondary__active" buttonSize="btn-fit-half" onClick={zoomOut}>See All Results </Button>
                <Button buttonStyle="btn-secondary__active" buttonSize="btn-fit-half" onClick={goHome}>Return Home</Button>
            </Row>
        </Container >
    );

}

export default withFirebase(LocateItem);