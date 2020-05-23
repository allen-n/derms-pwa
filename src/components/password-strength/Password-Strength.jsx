import React from 'react';
import "./password-strength.css";

const STYLES = [
    "passwordStrength__empty",
    "passwordStrength__veryStrong",
    "passwordStrength__strong",
    "passwordStrength__medium",
    "passwordStrength__weak"
]

export const PasswordStrength = ({ 
    children,
    passwordStrengthStyle
}) => {
    

    const checkPasswordStrengthStyle = STYLES.includes(passwordStrengthStyle) ? passwordStrengthStyle : STYLES[0];

    return (
        <div>
            <div className = {`passwordStrength-bar`}>
                <div className = {`passwordStrength ${passwordStrengthStyle}`}></div>
                <div className = {`passwordStrength ${passwordStrengthStyle}`}></div>
                <div className = {`passwordStrength ${passwordStrengthStyle}`}></div>
                <div className = {`passwordStrength ${passwordStrengthStyle}`}></div>
            </div>
            {/* <p>{children}</p> */}
            {children}
        </div>
    )
}