import React from "react";
import "./checkbox.css";

export const Checkbox = ({ 
    children,
    name,
    type,
    checked,
    onChange
}) => {

    return (
        <label className={`checkboxLabel`}>
            <input
                name={`${name}`}
                type={`checkbox`}
                checked={checked}
                onChange={onChange}/>
            <span className = {`checkbox`}></span>
            {children}
        </label>
    )
}