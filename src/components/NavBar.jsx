import React, { useRef } from "react";
import "../styles/NavBar.css";
import profilePic from "../assets/profilePic.jpg";
import bell from "../assets/bell.svg";

export default function NavBar() {
    const bellPopup = useRef();
    const profilePopup = useRef();
    return (
        <nav>
            <ul>
                <a href="/">Home</a>
                <a href="#">Profile</a>
                <a href="#">Seacrh</a>
            </ul>
            <div className="profile">
                <img
                    src={bell}
                    alt="bell icon"
                    onClick={(e) => {
                        bellPopup.current.classList.toggle("show-block");
                    }}
                />
                <img
                    src={profilePic}
                    alt="profile picture"
                    onClick={(e) => {
                        profilePopup.current.classList.toggle("show-block");
                    }}
                />
            </div>
            <div className="bell-popup" ref={bellPopup}>
                <h2>Friend Requests</h2>
            </div>
            <div className="profile-popup" ref={profilePopup}></div>
        </nav>
    );
}
