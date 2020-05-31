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
    confirmCallback: confirm
    // firebase: firebase 
}) => {

    // const { userData, auth } = firebase
    // const history = useHistory();
    const timeoutVal = 500; // Must match ConfirmLocationSlider.css

    const handleCancel = (event) => {
        cancel()
    }

    const handleConfirm = (event) => {
        confirm();
    }

    const renderSetPin = () => {
        return (
            <>
                <h2>Set your search area</h2>
                <p>Move the map to set search area</p>

                <Button buttonStyle="btn-primary__active" buttonSize="btn-medium" onClick={handleConfirm}>Confirm</Button>
                <Button buttonStyle="btn-secondary__active" buttonSize="btn-medium" onClick={handleCancel}>Cancel</Button>
            </>
        );
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
                {renderSetPin()}
            </div>
        </CSSTransition >
    );
}

export default withFirebase(ConfirmLocationSlider)