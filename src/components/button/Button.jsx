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
    "btn-medium-responsive",
    "btn-small",
    "btn-fit-half", // fit half the parent component (width)
    "btn-menu",
    "btn-donations",
    "btn-row" // 50% width side by side
]

export const Button = ({ 
    children, 
    type, 
    onClick, 
    buttonStyle, 
    buttonSize,
    disabled
}) => {
    

    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[1];

    const checkButtonStyleActive = disabled ? STYLES[2] : checkButtonStyle; // Disabled the disabled button

    return (
        <button className = {`btn ${checkButtonStyleActive} ${checkButtonSize}`}
                onClick={onClick} type={type} disabled={disabled}>
            {children}
        </button>
    )
}