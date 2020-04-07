import React, { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { withFirebase } from '../../firebase/withFirebase'
import { useHistory } from 'react-router-dom';

const Signup = props => {

    // Named export 'auth' from the prop injected by the withFirebase HOC 
    const { auth, firestore, usersCollection, authToUser } = props.firebase

    const formEmail = useRef(null);
    const formPassword = useRef(null);
    const formFName = useRef(null);
    const formLName = useRef(null);
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

        registerUser(email, pass)

    };

    const registerUser = (email, password) => {
        auth.createUserWithEmailAndPassword(email, password)
            .then(function (response) {
                storeNewUser(response.user)
                formEmail.current.value = ''
                formPassword.current.value = ''
                formFName.current.value = ''
                formLName.current.value = ''

            })
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
                    alert("Couldn't create account: ", errorMessage)
                }
                console.error(error);
                // [END_EXCLUDE]
            });
    }

    const storeNewUser = (user) => {
        var newUser = {
            name: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
            emailVerified: user.emailVerified,
            uid: user.uid
        }
        newUser.dateCreated = firestore.FieldValue.serverTimestamp();
        newUser.lastLogIn = firestore.FieldValue.serverTimestamp();
        newUser.status = 0
        newUser.reportQuality = 0
        newUser.referralSignUps = 0
        newUser.isBusiness = false
        newUser.reports = []
        newUser.firstName = formFName.current.value
        newUser.lastName = formLName.current.value


        usersCollection.doc(newUser.uid).set(newUser)
            .catch(error => console.error("Error adding new user: ", error))

        auth.currentUser.updateProfile({
            displayName: newUser.firstName
        }).then(function () {
            // Update successful.
        }, function (error) {
            console.error("Couldn't update auth user name", error)
        });

    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUserFirstLastName">
                <Form.Label> Name</Form.Label>
                <Form.Control type="text" id="firstName" placeholder="First Name" ref={formFName} />
                <Form.Control type="text" id="lastName" placeholder="Last Name" ref={formLName} />
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
            <Button variant="primary" type="submit">Submit</Button>
        </Form>
    );

}

export default withFirebase(Signup)