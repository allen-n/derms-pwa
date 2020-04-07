import React, { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { withFirebase } from '../../firebase/withFirebase'
import { useHistory } from 'react-router-dom';

const Signup = props => {

    // Named export 'auth' from the prop injected by the withFirebase HOC 
    const { auth, firestore, usersCollection, authToUser } = props.firebase

    const formEmail = useRef(null);
    const formPassword = useRef(null);
    const newUser = useRef(null);
    const [currentUser, setCurrentUser] = useState('')

    // Page navigation
    const history = useHistory();
    const goHome = (event) => {
        history.push("/");
    }


    const handleSubmit = (event) => {
        event.preventDefault()
        var email = formEmail.current.value
        var pass = formPassword.current.value
        var isNewUser = newUser.current.checked
        if (isNewUser) {
            registerUser(email, pass)
        } else {
            signInUser(email, pass)
        }
        formEmail.current.value = ''
        formPassword.current.value = ''
    };

    const registerUser = (email, password) => {
        auth.createUserWithEmailAndPassword(email, password)
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // [START_EXCLUDE]
                if (errorCode == 'auth/weak-password') {
                    alert('The password is too weak.');
                }
                if (errorCode == 'auth/internal-error') {
                    alert(`Your browser is blocking the Google login API we use. 
                It's kosher, we promise. But to log in you'll have to turn that blocker off 🙏.`);
                }
                else {
                    alert(errorMessage);
                }
                console.log(error);
                // [END_EXCLUDE]
            });
    }

    const storeNewUser = (user) => {
        var newUser = authToUser(user)
        newUser.dateCreated = firestore.FieldValue.serverTimestamp();
        newUser.lastLogIn = firestore.FieldValue.serverTimestamp();
        newUser.status = 0
        newUser.reportQuality = 0
        newUser.referralSignUps = 0
        newUser.isBusiness = false
        newUser.reports = []

        usersCollection.doc(newUser.uid).set(newUser)
            .then(docRef => {
                // NOTE: Can't get docref ID because we specified a doc
                // console.log("Document written with ID: ", docRef.id, ", userID: ", newUser.uid);
            })
            .catch(error => console.error("Error adding new user: ", error))
    }

     return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUserFirstLastName">
                <Form.Label> Name</Form.Label>
                <Form.Control type="text" id="firstName" placeholder="First Name" />
                <Form.Control type="text" id="lastName" placeholder="Last Name" />
                <Form.Text className="text-muted">
                    We'll never share your last name with anyone else.
                    </Form.Text>

            </Form.Group>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" id="formEmail" ref={formEmail} />
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" id="formPassword" ref={formPassword} />
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check to create an account" ref={newUser} defaultChecked={false} />
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
        </Form>
    );

}

export default withFirebase(Signup)