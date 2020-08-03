import React from 'react';
import "./map-tag.css";

export const MapTag = ({ 
    children,
    onClick
}) => {

    return (
        <div className = {`mapTag`} onClick={onClick} >
            {children} <span className = {`closeX`}></span>
        </div>
    )
}