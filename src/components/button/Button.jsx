import React from 'react';
import "./button.css";

const STYLES = [
    "btn-primary__active",
    "btn-secondary__active",
    "btn-general__inactive"
]

const SIZES = [
    "btn-large",
    "btn-medium",
    "btn-small"
]

export const Button = ({ 
    children, 
    type, 
    onClick, 
    buttonStyle, 
    buttonSize
}) => {

    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[1];

    return (
        <button className = {`btn ${checkButtonStyle} ${checkButtonSize}`}
                onClick={onClick} type={type}>
            {children}
        </button>
    )
}