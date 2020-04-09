import React from "react";
import "./toggle.css";

export const Toggle = ({
    name,
    type,
    checked,
    onChange
}) => {

    return (
        <label className={`switch`}>
            <input
                name={`${name}`}
                type={`checkbox`}
                checked={checked}
                onChange={onChange}/>
            <span className = {`slider`}></span>
        </label>
    )
}