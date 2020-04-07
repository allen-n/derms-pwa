import React from 'react';
import "./stock-level-label.css";

const STYLES = [
    "stock-level-label__inactive",
    "stock-level-label__restock",
    "stock-level-label__normal",
    "stock-level-label__warning",
    "stock-level-label__empty",
]

const SIZES = [
    "stock-level-label__medium",
    "stock-level-label__small"
]

export const StockLevelLabel = ({ 
    children, 
    type, 
    onClick, 
    labelStyle, 
    labelSize
}) => {

    const checkLabelStyle = STYLES.includes(labelStyle) ? labelStyle : STYLES[0];
    const checkLabelSize = SIZES.includes(labelSize) ? labelSize : SIZES[0];

    return (
        <button className = {`stock-level-label ${checkLabelStyle} ${checkLabelSize}`}
                onClick={onClick} type={type}>
            {children}
        </button>
    )
}