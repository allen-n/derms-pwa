import React from 'react';
import "./arrow.css";

const STYLES = [
    "arrow-active",
    "arrow-inactive"
]

export const Arrow = ({ 
    arrowStyle
}) => {
    

    const checkArrowStyle = STYLES.includes(arrowStyle) ? arrowStyle : STYLES[1];

    return (
        <span className = {`arrow ${checkArrowStyle}`}/>
    )
}