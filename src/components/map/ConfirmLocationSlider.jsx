import React, { useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group';
import { withFirebase } from '../../firebase/withFirebase';
import { useHistory } from 'react-router-dom';
import { Button } from '../button/Button';
import './ConfirmLocationSlider.css'

// Docs here: https://reactcommunity.org/react-transition-group/transition

const ConfirmLocationSlider = ({ in: inProp,
    out: outProp,
    onEnter: enter,
    onExit: exit,
    cancelCallback: cancel,
    firebase: firebase }) => {

    const { userData, auth } = firebase
    const history = useHistory();
    const timeoutVal = 500; // Must match ConfirmLocationSlider.css

    const handleCancel = (event) => {
        console.log("cancel Clicked")
        cancel()
    }

    return (
        <CSSTransition
            classNames="location-slide"
            in={inProp}
            timeout={timeoutVal}
            unmountOnExit
            onEnter={null || enter} // enter callback
            onExited={null || exit} // exit callback
        >
            <div className="location-slide-style">
                <h4>Set your search area</h4>
                <p>Move the map to set search area</p>

                <Button buttonStyle="btn-primary__active" buttonSize="btn-medium" onClick={
                    () => { alert("Appreciate the thought! This isn't working yet :(.") }}>Confirm</Button>
                <Button buttonStyle="btn-secondary__active" buttonSize="btn-medium" onClick={handleCancel}>Cancel</Button>
            </div>
        </CSSTransition >
    );
}

export default withFirebase(ConfirmLocationSlider)