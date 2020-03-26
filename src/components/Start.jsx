import React, { Component } from "react";
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap'



const Start = () => {
    const history = useHistory();

    const handleClick = (event) => {
        history.push("/login");
    }
    return (
        <div>
            <h2>The neighborhood watch for supplies in your area.</h2>
            <p>Crowdsourcing real-time updates from local shoppers.</p>
            <Button onClick={handleClick}>Lets Get Started</Button>
        </div>
    );
}

export default Start;