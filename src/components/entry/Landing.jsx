import React from "react";
import { Button } from '../button/Button';
import { useHistory } from 'react-router-dom';
import { withFirebase } from '../../firebase/withFirebase';

const Landing = props => {
    
    // Check if user is signed in, if so go to main screen
    const { auth } = props.firebase
    
    const history = useHistory();

    auth.onAuthStateChanged((user) => {
        if (user) {
          // User is signed in.
          history.push("/map-home")
        } 
      });
    
    const handleLogin = () => {
        history.push("/login");
    }

    const handleSignup = () => {
        history.push("/signup");
    }

    return (
        <div>
            <img src={require('../../../public/imgs/Lighthouse_Landing_Page-2@3x.png')} class="header-img"/>
            <h2>The neighborhood watch for your necessities.</h2>
            <h3>Crowdsourcing real-time updates from local shoppers.</h3>
            <Button buttonStyle="btn-primary__active" buttonSize="btn-medium" onClick={handleLogin}>Sign in</Button>
            <Button buttonStyle="btn-secondary__active" buttonSize="btn-medium" onClick={handleSignup}>Sign up</Button>
        </div>
    );
}

export default withFirebase(Landing);