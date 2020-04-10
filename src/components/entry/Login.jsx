import React, { useState, useRef } from "react";
import { Form } from "react-bootstrap";
import { Button } from '../button/Button';
import { withFirebase } from '../../firebase/withFirebase'
import { useHistory } from 'react-router-dom';
import { Link } from "react-router-dom";

const Login = props => {

    // Named export 'auth' from the prop injected by the withFirebase HOC 
    const { auth, firestore, usersCollection } = props.firebase

    const formEmail = useRef(null);
    const formPassword = useRef(null);
    const [isDisabled, setIsDisabled] = useState(true)

    // Page navigation
    const history = useHistory();
    const goToMap = () => history.push("/map-home");

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
        signInUser(email, pass)
    };

    const updateUserLoginDate = (user) => {
        const uid = user.uid
        usersCollection.doc(uid).update({ lastLogIn: firestore.FieldValue.serverTimestamp() })
            .catch(error => console.error("Error updating last login for user: ", error));
    }

    const signInUser = (email, password) => {
        auth.signInWithEmailAndPassword(email, password)
            .then(function (result) {
                formEmail.current.value = ''
                formPassword.current.value = ''
                updateUserLoginDate(result.user);
                goToMap()
            })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // [START_EXCLUDE]
                if (errorCode === 'auth/wrong-password') {
                    alert('Wrong password.');
                } else {
                    alert("Couldn't sign you in: ", errorMessage);
                }
                console.error(error);
                // [END_EXCLUDE]
            });

    }

    const handleChange = (event) => {
        if (formEmail.current.value != '' &&
            formPassword.current.value != '') {
            setIsDisabled(false)
        } else {
            setIsDisabled(true)
        }
    }



    return (
        <div>
            <Link to="/">Back</Link>
            <h1>Sign in</h1>
            <p>New to the community? <Link to="/signup">Sign up</Link> </p>

            <Form onSubmit={handleSubmit} onChange={handleChange}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Email" ref={formEmail} />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" ref={formPassword} />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isDisabled}>Submit</Button>
            </Form>
        </div>
    );

}

export default withFirebase(Login)

// Useful functions for later in refactor:

// // TODO@ALLEN: allow email verification, password reset, and anonymous/othe sign-ins
//     // SRC: https://github.com/firebase/quickstart-js/blob/473045e4ce77bab2a553545a34a583bf7474373a/auth/email-password.html#L95-L107
//     /**
//      * Sends an email verification to the user.
//      */
//     function sendEmailVerification() {
//         // [START sendemailverification]
//         auth.currentUser.sendEmailVerification().then(function () {
//             // Email Verification sent!
//             // [START_EXCLUDE]
//             alert('Email Verification Sent!');
//             // [END_EXCLUDE]
//         });
//         // [END sendemailverification]
//     }

//     function sendPasswordReset() {
//         var email = document.getElementById('email').value;
//         // [START sendpasswordemail]
//         auth.sendPasswordResetEmail(email).then(function () {
//             // Password Reset Email Sent!
//             // [START_EXCLUDE]
//             alert('Password Reset Email Sent!');
//             // [END_EXCLUDE]
//         }).catch(function (error) {
//             // Handle Errors here.
//             var errorCode = error.code;
//             var errorMessage = error.message;
//             // [START_EXCLUDE]
//             if (errorCode == 'auth/invalid-email') {
//                 alert(errorMessage);
//             } else if (errorCode == 'auth/user-not-found') {
//                 alert(errorMessage);
//             }
//             console.error(error);
//             // [END_EXCLUDE]
//         });
//         // [END sendpasswordemail];
//     }