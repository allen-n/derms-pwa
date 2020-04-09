import React, { useEffect, useRef, useState } from "react";
import { useHistory } from 'react-router-dom';
import { Form, Button, ButtonGroup, ProgressBar } from "react-bootstrap";
import { withFirebase } from '../../firebase/withFirebase'
import { v4 as uuidv4 } from 'uuid';
import Geocoder from "leaflet-control-geocoder"
import { mapBoxConfig } from '../../firebase/config'
import ReactDOM from 'react-dom'


/**
 * Creates the location input dropdown form
 * Expects locations in array as prop, with the for [{name: "str"}, ..., {name:"Not Listed"}]
 * Last element should have a name string corresponding to a not-found entry
 */
const DropdownLocation = props => {
    // const locations = props.locations != null ? JSON.parse(JSON.stringify(props.locations)) : [] // deep copy

    if (props.returnLocation == null) {
        console.error("Location callback must be defined!")
    }
    // locations.push({ name: notFoundStr })

    const [selectedLoc, setSelectedLoc] = useState(null)

    const locSelectRef = useRef(null)


    const handleClick = (e) => {
        const val = ReactDOM.findDOMNode(locSelectRef.current).value
        const loc = JSON.parse(val)
        setSelectedLoc(loc)
    }

    useEffect(() => {
        ReactDOM.findDOMNode(locSelectRef.current).selectedIndex = -1
    }, [])

    useEffect(() => {
        if (props.locations.length) {
            setSelectedLoc(props.locations[0])
        }


    }, [props.locations])

    useEffect(() => {
        if (selectedLoc != null) {
            if (selectedLoc.name != props.notFoundStr) { props.returnLocation(selectedLoc) }
            else { props.returnLocation(null) }
        }

    }, [selectedLoc])


    if (props.locations != null) {
        return (<>
            <Form.Group controlId="storeName">
                <Form.Label>What store are you in? (Required)</Form.Label>
                <Form.Control required ref={locSelectRef} as="select" onChange={handleClick}>
                    {props.locations.map(location => {
                        const name = location.name.split(",")
                        const val = JSON.stringify(location)
                        return (<option key={name} value={val}>{name[0]}</option>);
                    })}
                </Form.Control>
            </Form.Group>
        </>);
    }
    return null

}

const ReportItemInfo = props => {
    // db vars
    const {
        reportData,
        userData,
        storage,
        reportCollection,
        usersCollection,
        firestore } = props.firebase

    // Image upload handling howto: https://dev.to/tallangroberg/how-to-do-image-upload-with-firebase-in-react-cpj

    // State Vars
    const [imageAsFile, setImageAsFile] = useState('')
    const [stockLevel, setStockLevel] = useState(-1)
    const [uploadProg, setUploadProg] = useState(-1)
    const [submitDisabled, setSubmitDisabled] = useState(true)

    // Options for mapbox geocoding queries
    const mapBoxOptions = {
        geocodingQueryParams: {
        },
        reverseQueryParams: {
            // Note: Following params can be modified if we don't like reverse geocoding results
            types: "poi",
            reverseMode: "score",
            limit: 4
        }
    }
    const [geocoder, setGeoCoder] = useState(new Geocoder.Mapbox(mapBoxConfig.apiKey, mapBoxOptions)) // Geocoder
    const [possibleLocs, setPossibleLocs] = useState([])
    const [selectedLoc, setSelectedLoc] = useState(null)

    const aisleRef = useRef(null)
    const storeNotFoundRef = useRef(null)
    const history = useHistory();

    // Make sure report data up to now is collected, if not route back
    useEffect(() => {
        if (typeof reportData.coordinates === 'undefined') {
            history.push('/locate')
        }
        if (reportData.itemId == null) {
            history.push('/report-type')
        }
        reverseGeoCode()
    }, [])

    // Reverse Geocode result listing
    const notFoundStr = "Not Listed"
    const returnLocation = (location) => {
        setSelectedLoc(location)
    }

    // Reverse geocoding, dup from LeafMap
    const reverseGeoCode = () => {
        geocoder.reverse(reportData.coordinates, reportData.locZoom, results => {
            var r = results[0];
            results.push({ name: notFoundStr })
            setPossibleLocs(results)
        })
    }


    // Callback / onclick handlers
    const handleStockLevel = (event) => {
        setStockLevel(event.target.value)
        setSubmitDisabled(false)
    }

    const handleImageAsFile = (e) => {
        const image = e.target.files[0]
        if (image.size > 10485760) {
            alert('Image is too big (max. 10 Mb)');
            return;
        }
        setImageAsFile(image)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (imageAsFile === '') {
            // If no image, proceed with data upload to db
            console.error(`Couldn't upload your image, it was a ${typeof (imageAsFile)}!`)
            return handleDataUpload();
        }

        // Upload files source here: https://firebase.google.com/docs/storage/web/upload-files
        const uploadTask = storage.ref(`/images/${uuidv4() + imageAsFile.name}`).put(imageAsFile)

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            function (snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProg(progress)
                // console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        // console.log('Upload is paused');
                        break;
                    case 'running':
                        // console.log('Upload is running');
                        break;
                }
            }, function (error) {

                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;

                    case 'storage/canceled':
                        // User canceled the upload
                        break;
                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            }, function () {
                // Upload completed successfully, now we can get the download URL
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    // console.log('File available at', downloadURL);
                    setUploadProg(-1)
                    return handleDataUpload(downloadURL);
                });
            });

    }

    const handleDataUpload = (imgUrl) => {
        reportData.timestamp = firestore.FieldValue.serverTimestamp();
        reportData.stock = stockLevel;
        if (imgUrl) {
            reportData.imgurl = imgUrl
        }
        reportData.aisle = aisleRef.current.value
        // Split the name and address of the place (if given)
        const name = selectedLoc == null ? storeNotFoundRef.current.value : selectedLoc.name
        const nameArr = name.split(",")
        reportData.locName = nameArr[0]
        reportData.locAddress = selectedLoc == null ? "N/A" : nameArr.slice(1, -1).join(",")
        reportData.user = userData.uid

        // If the place has a geo point, use that
        reportData.coordinates = selectedLoc == null ? reportData.coordinates : selectedLoc.center
        reportData.coordinates = new firestore.GeoPoint(reportData.coordinates.lat, reportData.coordinates.lng)
        reportData.isOutdated = false; // A cloud function will write this to true after certain amount of time

        history.push("/"); // Go home
        alert('Submission complete, nice work!')
        

        // Do work in the background (on home screen) fore responsiveness
        reportCollection.add(reportData).then(docRef => {
            // console.log("Document written with ID: ", docRef.id);
            updateUserRecordArr(userData.uid, docRef.id)
        })
            .catch(error => console.error("Error adding document: ", error))

    }

    const updateUserRecordArr = (userID, recordID) => {
        usersCollection.doc(userID).update({
            reports: firestore.FieldValue.arrayUnion(recordID)
        }).catch(error => {
            console.error("Error updating user's submitted report array", error)
        });
    }

    const renderUploadProg = () => {
        if (uploadProg >= 0) {
            return (<ProgressBar now={uploadProg} />
            );
        }
        return null
    }



    const renderStoreInput = () => {
        if (selectedLoc == null) {
            return (<Form.Group controlId="storeNameNotFound">
                <Form.Label>Type name below</Form.Label>
                <Form.Control ref={storeNotFoundRef} required placeholder="..." />
            </Form.Group>);
        }
        return null
    }

    return (
        <div>
            <p>Stock Level (Required)</p>
            <ButtonGroup className="mr-2" aria-label="First group" toggle="true">
                <Button onClick={handleStockLevel} value={3} variant="success">Just Restocked</Button>
                <Button onClick={handleStockLevel} value={2} variant="secondary">Normal</Button>
                <Button onClick={handleStockLevel} value={1} variant="warning">Running Low</Button>
                <Button onClick={handleStockLevel} value={0} variant="danger">Empty</Button>
            </ButtonGroup>


            < Form onSubmit={handleSubmit}>
                <DropdownLocation
                    returnLocation={returnLocation}
                    locations={possibleLocs}
                    notFoundStr={notFoundStr}>
                </DropdownLocation>
                {renderStoreInput()}
                <Form.Group controlId="aisleNum">
                    <Form.Label>What aisle(s) (Optional)</Form.Label>
                    <Form.Control ref={aisleRef} placeholder="Aisle 1" />
                </Form.Group>

                <Form.Group controlId="itemImgGrp">
                    <Form.Label> Take a photo of what you see! (optional) </Form.Label>
                    <div className="custom-file">
                        <input
                            type="file"
                            name="itemImg"
                            className="custom-file-input"
                            id="inputGroupFile01"
                            accept="image/*;capture=camera"
                            aria-describedby="inputGroupFileAddon01"
                            onChange={handleImageAsFile}
                        />
                        <label className="custom-file-label" htmlFor="inputGroupFile01">
                            Take Photo
                    </label>
                    </div>
                </Form.Group>
                <Button variant="primary" type="submit" disabled={submitDisabled}>
                    Submit
                </Button>
            </Form >
            {renderUploadProg()}
        </div>);
}

export default withFirebase(ReportItemInfo);