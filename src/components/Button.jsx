import React from "react";
import "../styles/Button.css";

export default function Button({ text, clickHandler }) {
    return (
        <input
            className="secondary-button"
            type="button"
            value={text}
            onClick={clickHandler}
        />
    );
}
