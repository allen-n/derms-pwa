import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { Button } from './button/Button';
import { Checkbox } from './checkbox/Checkbox';
// import { Button } from 'react-bootstrap'
import { withFirebase } from '../firebase/withFirebase';


/**
 * The landing page for the app
 * @param {*} props
 */
const Start = (props) => {

    const { auth } = props.firebase
    const [currentUser, setCurrentUser] = useState(null)
    const history = useHistory();

    const handleReportClick = (event) => {
        history.push("/locate");
    }

    const handleSearchClick = (event) => {
        history.push("/search-item-type")
    }

    const handleLogin = () => {
        history.push("/login");
    }

    const renderUserEmail = () => {
        if (currentUser != null && currentUser.email != '') {
            return (
                <p>{currentUser.email} is signed in.</p>
            );
        }
        return (
            <div>
                <p style={{color: "red"}}>You must sign in to use the app.</p>
                <p >(It's easy we promise)</p>
            </div>);

    }

    const renderLoginButtonText = () => {
        if (currentUser != null && currentUser.email != '') {
            return (
                <div>Sign Out</div>
            );
        }
        return (
            <div>Sign In</div>
        );

    }

    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in.
            if (currentUser == null) {
                // Can only check when sign-in is rendered
                setCurrentUser(user)
            }
        } else {
            if (currentUser != null) {
                setCurrentUser(null)
            }
        }
    });

    return (
        <div>
            <h2>The neighborhood watch for supplies in your area.</h2>
            <p>Crowdsourcing real-time updates from local shoppers.</p>
            {renderUserEmail()}
            <Button buttonStyle="btn-primary__active" buttonSize="btn-medium" onClick={handleReportClick}>Report found Supplies</Button>
            <Button buttonStyle="btn-secondary__active" buttonSize="btn-medium" onClick={handleSearchClick}>Search for Supplies</Button>
            <Button buttonStyle="btn-general__inactive" buttonSize="btn-medium" onClick={handleLogin}>{renderLoginButtonText()}</Button>
            <Checkbox>I have Read and understood <a href="#">the Privacy Policy.</a></Checkbox>
            <Checkbox>I agree to the <a href="#">Terms and Conditions.</a></Checkbox>
        </div>
    );
}

export default withFirebase(Start);