import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { withFirebase } from '../firebase/withFirebase'
import LeafMap from './LeafMap'
import { Container, Row, Button } from 'react-bootstrap'
import { Marker, Popup } from 'react-leaflet'

const LocateItem = props => {
    const [userLocation, setUserLocation] = useState(null)
    const [loadedReports, setLoadedReports] = useState([])
    const [reportIdMap, setReportIdMap] = useState({})
    const history = useHistory();

    const { firestore, searchData, reportCollection } = props.firebase

    const routeClick = () => {
        history.push("/report-type");
    }

    const queryRadius = 50; // in km
    const queryLimit = 1000;

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
                <Popup> {"POP UP HERE"} </Popup>
            </Marker>)
        }));
    }

    const onClusterClick = (cluster) => {
        const reportsToSort = []
        cluster.layer.getAllChildMarkers().map((child) => {
            const id = child.options.id
            var report = loadedReports[reportIdMap[id]]
            report.sortIdx = Date(report.timestamp)
            reportsToSort.push(report)
            // console.log(JSON.parse(child.options.children[0].props.children[1]))
        });

        // Sorts in place, new to old. There is also a .nanoseconds prop, ignore for now, seconds is enough
        reportsToSort.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
        // TODO@ALLEN: Create some kind of modal that shows these results
        // TODO: Set initial zoom on item finding to be high enough to see item clusters! And remove the middle marker!
    }

    const onMarkerClick = (marker) => {
        const id = marker.target.options.id
        const report = loadedReports[reportIdMap[id]]
        console.log(report)
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
                    onClusterClick={onClusterClick}>
                </LeafMap>
            </Row>
            <Row>
                {/* <Button onClick={handleClick}>Confirm Location</Button> */}
            </Row>

        </Container >
    );

}

export default withFirebase(LocateItem);