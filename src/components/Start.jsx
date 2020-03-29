import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap'
import { withFirebase } from '../firebase/withFirebase'



const Start = (props) => {

    const { auth } = props.firebase
    const [currentUser, setCurrentUser] = useState('')
    const history = useHistory();

    const handleReportClick = (event) => {
        history.push("/login");
    }

    const handleSearchClick = (event) => {
        history.push("/search-item-type")
    }

    const handleLogin = () => {
        history.push("/login");
    }

    const renderUserEmail = () => {
        return (
            <p>{currentUser.email} is signed in.</p>
        );
    }

    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in.
            if (currentUser == '') {
                // Can only check when sign-in is rendered
                setCurrentUser(user)
            }
        } else {
            if (currentUser != '') {
                setCurrentUser('')
            }
        }
    });

    return (
        <div>
            <h2>The neighborhood watch for supplies in your area.</h2>
            <p>Crowdsourcing real-time updates from local shoppers.</p>
            {renderUserEmail()}
            <Button onClick={handleReportClick}>Report found Supplies</Button>
            <Button onClick={handleSearchClick}>Search for Supplies</Button>
            <Button variant="secondary" onClick={handleLogin}>Log in or Out</Button>
        </div>
    );
}

export default withFirebase(Start);