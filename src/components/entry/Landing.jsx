import React from "react";
import { Button } from '../button/Button';
import { useHistory } from 'react-router-dom';
import { withFirebase } from '../../firebase/withFirebase';

const Landing = props => {
    
    // Check if user is signed in, if so go to main screen
    const { auth } = props.firebase
    
    const history = useHistory();
    const handleLogin = () => {
        history.push("/login")
    }

    const handleSignup = () => {
        history.push("/signup")
    }

    return (
        <div>
            <h2>The neighborhood watch for supplies in your area.</h2>
            <p>Crowdsourcing real-time updates from local shoppers.</p>

            <Button buttonStyle="btn-primary__active" buttonSize="btn-medium" onClick={handleLogin}>Log In</Button>
            <Button buttonStyle="btn-secondary__active" buttonSize="btn-medium" onClick={handleSignup}>Sign Up</Button>
        </div>
    );
}

export default withFirebase(Landing);