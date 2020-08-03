import React from 'react';
import "./stock-level-radio.css";
import * as stockLevel from '../../firebase/stock.json'

const STYLES = [
    "btn-stock-level__inactive",
    "btn-stock-level__restock",
    "btn-stock-level__normal",
    "btn-stock-level__warning",
    "btn-stock-level__empty",
]

const SIZES = [
    "btn-stock-level__medium",
    "btn-stock-level__small"
]

export const StockLevelRadio = ({  
    buttonStyle, 
    buttonSize,
    onClick
}) => {

    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];
    const stockToNum = stockLevel.stockToNum
    const numToStock = stockLevel.numToStock

    return (
        <>
            <label className={`btn-stock-level-label`}>
                <input type={`radio`} id={`restock`} name={`stocklevel`} value={stockToNum["Just Restocked"]} onClick={onClick}/>
                <div className={`btn-stock-level btn-stock-level__restock ${checkButtonSize}`}>Just Restocked</div>
            </label>
            <label className={`btn-stock-level-label`}>
                <input type={`radio`} id={`normal`} name={`stocklevel`} value={stockToNum["Plenty"]} onClick={onClick}/>
                <div className={`btn-stock-level btn-stock-level__normal ${checkButtonSize}`}>Plenty</div>
            </label>
            <label className={`btn-stock-level-label`}>
                <input type={`radio`} id={`low`} name={`stocklevel`} value={stockToNum["Running Low"]} onClick={onClick}/>
                <div className={`btn-stock-level btn-stock-level__warning ${checkButtonSize}`}>Running Low</div>
            </label>
            <label className={`btn-stock-level-label`}>
                <input type={`radio`} id={`empty`} name={`stocklevel`} value={stockToNum["Empty"]} onClick={onClick}/>
                <div className={`btn-stock-level btn-stock-level__empty ${checkButtonSize}`}>Empty</div>
            </label>
        </>
    )
}