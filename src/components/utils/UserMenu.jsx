import React, { useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group';
import { withFirebase } from '../../firebase/withFirebase';
import { useHistory } from 'react-router-dom';
import { Button } from '../button/Button';
import './UserMenu.css'

// Docs here: https://reactcommunity.org/react-transition-group/transition

const UserMenu = ({ in: inProp,
    out: outProp,
    onEnter: enter,
    onExit: exit,
    firebase: firebase }) => {

    const { userData, auth } = firebase
    const history = useHistory();
    const [userName, setUserName] = useState("Loading")
    const timeoutVal = 500; // Must match UsermMenu.css

    const handleSignout = (event) => {
        if (auth.currentUser) {
            auth.signOut();
            history.push("/");
        }
    }

    useEffect(() => {
        if (userData != null)
            setUserName(userData.name)
    }, [userData])

    return (
        <CSSTransition
            classNames="slide"
            in={inProp}
            timeout={timeoutVal}
            unmountOnExit
            onEnter={null || enter} // enter callback
            onExited={null || exit} // exit callback
        >
            <div className="menu-style">
                <h4>Hi {userName}</h4>
                <p>What would you like to do?</p>
                <table>
                    <tbody>
                        <tr><td>Your History</td></tr>
                        <tr><td>Edit Profile</td></tr>
                        <tr><td>Rewards</td></tr>
                        <tr><td>Help</td></tr>
                        <tr><td>Forums</td></tr>
                        <tr><td>Settings</td></tr>
                        <tr><td>Our Story</td></tr>
                    </tbody>
                </table>

                <Button buttonStyle="btn-primary__active" buttonSize="btn-medium-responsive" onClick={
                    () => { alert("Appreciate the thought! This isn't working yet :(.") }}>Donate</Button>
                <Button buttonStyle="btn-secondary__active" buttonSize="btn-medium-responsive" onClick={handleSignout}>Log Out</Button>
            </div>
        </CSSTransition >
    );
}

export default withFirebase(UserMenu)