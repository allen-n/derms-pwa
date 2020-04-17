import React, { useEffect, useState } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { CSSTransition } from 'react-transition-group';
import './TransitionShell.css'


const PageShell = Page => props => {
    const [isLoaded, setIsLoaded] = useState(false)
    useEffect(() => {
        setIsLoaded(true);
    }, [])

    return (
        <CSSTransition
            classNames="fade"
            in={isLoaded}
            timeout={1000}
            // onEnter={() => console.log("Entered")} // enter callback
            // onExited={() => console.log("Exited")} // exit callback
        >
            <Page {...props} />
        </CSSTransition>);
};
export default PageShell;