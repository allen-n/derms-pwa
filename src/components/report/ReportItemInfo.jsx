import React, { useEffect, useRef, useState } from "react";
import { useHistory } from 'react-router-dom';
import { Form, Button, ButtonGroup, ProgressBar } from "react-bootstrap";
import { withFirebase } from '../../firebase/withFirebase'
import { v4 as uuidv4 } from 'uuid';
import ExifOrientationImg from 'react-exif-orientation-img'


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
    const [imageAsURL, setImageAsURL] = useState('')

    const [stockLevel, setStockLevel] = useState(-1)
    const [uploadProg, setUploadProg] = useState(-1)
    const [submitDisabled, setSubmitDisabled] = useState(true)
    const [fileUploadText, setFileUploadText] = useState("Take Photo")

    const aisleRef = useRef(null)
    const history = useHistory();

    // Make sure report data up to now is collected, if not route back
    useEffect(() => {
        if (typeof reportData.coordinates === 'undefined') {
            history.push('/map-home')
        }
        if (reportData.itemId == null) {
            history.push('/report-type')
        }
    }, [])

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
        setFileUploadText("Image Attached!")
        setImageAsURL(window.URL.createObjectURL(image))
        setImageAsFile(image)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (imageAsFile === '') {
            // If no image, proceed with data upload to db
            console.warn(`Couldn't upload your image, it was a ${typeof (imageAsFile)}!`)
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

    const renderImage = () => {

        if (imageAsURL != '') {
            return (<ExifOrientationImg // Need to set image size or they blow up the display
                width={"auto"}
                height={128}
                // className="mr-3"
                src={imageAsURL}
                alt="No Image Provided"
            />);
        }
        return null

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
            <p>Stock Level (Required)</p>
            <ButtonGroup className="mr-2" aria-label="First group" toggle="true">
                <Button onClick={handleStockLevel} value={3} variant="success">Just Restocked</Button>
                <Button onClick={handleStockLevel} value={2} variant="secondary">Normal</Button>
                <Button onClick={handleStockLevel} value={1} variant="warning">Running Low</Button>
                <Button onClick={handleStockLevel} value={0} variant="danger">Empty</Button>
            </ButtonGroup>


            < Form onSubmit={handleSubmit}>
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
                            {fileUploadText}
                        </label>
                    </div>
                    {renderImage()}
                </Form.Group>
                <Button variant="primary" type="submit" disabled={submitDisabled}>
                    Submit
                </Button>
            </Form >
            {renderUploadProg()}
        </div>);
}

export default withFirebase(ReportItemInfo);