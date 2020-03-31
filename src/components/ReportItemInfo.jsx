import React, { useEffect, useRef, useState } from "react";
import { useHistory } from 'react-router-dom';
import { Form, Button, ButtonGroup, ProgressBar } from "react-bootstrap";
import { withFirebase } from '../firebase/withFirebase'
import { v4 as uuidv4 } from 'uuid';



const ReportItemInfo = props => {
    const {
        reportData,
        userData,
        storage,
        reportCollection,
        usersCollection,
        firestore } = props.firebase

    // Image upload handling
    // src: https://dev.to/tallangroberg/how-to-do-image-upload-with-firebase-in-react-cpj
    const allInputs = { imgUrl: '' }
    const [imageAsFile, setImageAsFile] = useState('')
    const [stockLevel, setStockLevel] = useState(-1)
    const [uploadProg, setUploadProg] = useState(-1)
    const [submitDisabled, setSubmitDisabled] = useState(true)

    const aisleRef = useRef(null)
    const storeRef = useRef(null)
    const history = useHistory();

    // Make sure report data up to now is collected, if not route back
    useEffect(() => {
        if (reportData.coordinates == null) {
            history.push('/locate')
        }
        if (reportData.itemId == null) {
            history.push('/report-type')
        }
    }, [])

    const handleStockLevel = (event) => {
        setStockLevel(event.target.value)
        setSubmitDisabled(false)
    }

    const handleImageAsFile = (e) => {
        const image = e.target.files[0]
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
        reportData.store = storeRef.current.value
        reportData.user = userData.uid

        alert('Submission complete, nice work!')
        history.push("/"); // Go home

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

    return (
        <div>
            <ButtonGroup className="mr-2" aria-label="First group" toggle="true">
                <Button onClick={handleStockLevel} value={3} variant="success">Just Restocked</Button>
                <Button onClick={handleStockLevel} value={2} variant="secondary">Normal</Button>
                <Button onClick={handleStockLevel} value={1} variant="warning">Running Low</Button>
                <Button onClick={handleStockLevel} value={0} variant="danger">Empty</Button>
            </ButtonGroup>


            < Form onSubmit={handleSubmit}>
                <Form.Group controlId="storeName">
                    <Form.Label>What store are you in? (Leave blank if correct)</Form.Label>
                    <Form.Control ref={storeRef} placeholder="" /> {/* TODO: Add Store name guess as placeholder param */}
                </Form.Group>
                <Form.Group controlId="aisleNum">
                    <Form.Label>What aisle(s) (Optional)</Form.Label>
                    <Form.Control ref={aisleRef} placeholder="Aisle 1" />
                </Form.Group>

                <Form.Group controlId="itemImgGrp">
                    <Form.Label> Take a photo of what you see! (optional) </Form.Label>
                    <Form.Control
                        name="itemImg"
                        type="file"
                        accept="image/*;capture=camera"
                        multiple
                        onChange={handleImageAsFile} />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={submitDisabled}>
                    Submit
                </Button>
            </Form >
            {renderUploadProg()}
        </div>);
}

export default withFirebase(ReportItemInfo);