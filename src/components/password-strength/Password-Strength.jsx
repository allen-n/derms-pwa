import React from 'react';

const STYLES = [
    "password-strength__empty",
    "password-strength__veryStrong",
    "password-strength__strong",
    "password-strength__medium",
    "password-strength__weak"
]

export const Button = ({ 
    children, 
    type, 
    onClick, 
    passwordStrengthStyle,
    disabled
}) => {
    

    const passwordStrengthStyle = STYLES.includes(passwordStrengthStyle) ? passwordStrengthStyle : STYLES[0];

    return (
        <span>
            <div className = {`password-strength ${passwordStrengthStyle}`}></div>
            {children}
        </span>
        
    )
}