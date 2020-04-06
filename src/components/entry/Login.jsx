import React, { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { withFirebase } from '../../firebase/withFirebase'
import { useHistory } from 'react-router-dom';

const Login = props => {

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

    const updateUserLoginDate = (user) => {
        const uid = user.uid
        usersCollection.doc(uid).update({ lastLogIn: firestore.FieldValue.serverTimestamp() })
            .catch(error => console.error("Error updating last login for user: ", error));
    }

    const signInUser = (email, password) => {
        auth.signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.error(error);
            // [END_EXCLUDE]
        });

    }

    const signOutUser = () => {
        if (auth.currentUser) {
            auth.signOut();
            // [END signout]
        }
    }


    // TODO@ALLEN: allow email verification, password reset, and anonymous/othe sign-ins
    // SRC: https://github.com/firebase/quickstart-js/blob/473045e4ce77bab2a553545a34a583bf7474373a/auth/email-password.html#L95-L107
    /**
     * Sends an email verification to the user.
     */
    function sendEmailVerification() {
        // [START sendemailverification]
        auth.currentUser.sendEmailVerification().then(function () {
            // Email Verification sent!
            // [START_EXCLUDE]
            alert('Email Verification Sent!');
            // [END_EXCLUDE]
        });
        // [END sendemailverification]
    }

    function sendPasswordReset() {
        var email = document.getElementById('email').value;
        // [START sendpasswordemail]
        auth.sendPasswordResetEmail(email).then(function () {
            // Password Reset Email Sent!
            // [START_EXCLUDE]
            alert('Password Reset Email Sent!');
            // [END_EXCLUDE]
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode == 'auth/invalid-email') {
                alert(errorMessage);
            } else if (errorCode == 'auth/user-not-found') {
                alert(errorMessage);
            }
            console.error(error);
            // [END_EXCLUDE]
        });
        // [END sendpasswordemail];
    }

    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in.
            if (currentUser == '') {
                // Can only check when sign-in is rendered
                if (newUser.current && newUser.current.checked) {
                    storeNewUser(user);
                } else {
                    updateUserLoginDate(user);
                }
                setCurrentUser(user)
            }
        } else {
            if (currentUser != '') {
                setCurrentUser('')
            }
        }
    });

    const renderSignInForm = () => {
        if (currentUser == '') {
            return (
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" ref={formEmail} />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                    </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" ref={formPassword} />
                    </Form.Group>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check to create an account" ref={newUser} defaultChecked={false} />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
            );
        }
        return (
            <Form>
                <h5>{currentUser.email} is signed in.</h5>
                <Button variant="secondary" onClick={signOutUser}>Sign Out</Button>
                <Button onClick={goHome}>Go Back</Button>
            </Form>

        );
    }

    return (
        renderSignInForm()
    );

}

export default withFirebase(Login)