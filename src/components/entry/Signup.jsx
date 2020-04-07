import React, { useState, useRef } from "react";
import { Form } from "react-bootstrap";
import { Button } from '../button/Button';
import { Checkbox } from '../checkbox/Checkbox';
import { withFirebase } from '../../firebase/withFirebase'
import { useHistory } from 'react-router-dom';

const Signup = props => {

    // Named export 'auth' from the prop injected by the withFirebase HOC 
    const { auth, firestore, usersCollection } = props.firebase

    const formEmail = useRef(null);
    const formPassword = useRef(null);
    const formFName = useRef(null);
    const formLName = useRef(null);

    const [isDisabled, setIsDisabled] = useState(true)

    // Page navigation
    const history = useHistory();

    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in.
            history.push("/map-home")
        }
    });

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

    const handleChange = (event) => {
        if (formEmail.current.value != '' &&
            formPassword.current.value != '' &&
            formFName.current.value != '' &&
            formLName.current.value != '') {
            setIsDisabled(false)
        } else {
            setIsDisabled(true)
        }
    }

    return (
        <Form onSubmit={handleSubmit} onChange={handleChange}>
            <Form.Group>
                <Form.Label> Name</Form.Label>
                <Form.Control type="text" id="firstName" placeholder="First Name" ref={formFName} />
                <Form.Control type="text" id="lastName" placeholder="Last Name" ref={formLName} />
                <Form.Text className="text-muted">
                    We'll never share your last name with anyone else.
                    </Form.Text>

            </Form.Group>
            <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" id="formEmail" ref={formEmail} />
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
            </Form.Group>

            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" id="formPassword" ref={formPassword} />
            </Form.Group>
            <Checkbox>I have Read and understood <a href="#">the Privacy Policy.</a></Checkbox>
            <Checkbox>I agree to the <a href="#">Terms and Conditions.</a></Checkbox>
            <Button variant="primary" type="submit" disabled={isDisabled}>Submit</Button>
        </Form>
    );

}

export default withFirebase(Signup)