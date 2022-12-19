import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";
import profilePic from "../assets/profilePic.jpg";
import bell from "../assets/bell.svg";
import addPersonBlue from "../assets/add-person-blue.svg";
import decline from "../assets/decline.svg";
import close from "../assets/close.svg";
import Button from "./Button";

export default function NavBar() {
    const bellPopup = useRef();
    const profilePopup = useRef();
	const createPostDialog = useRef();
	const NavBar = useRef()
	useEffect(() => {
		if (location.pathname === "/auth") {
			NavBar.current.style.display = "none";
		} else {
			NavBar.current.style.display = "flex";
		}
	}, []);
    return (
        <nav ref={NavBar}>
            <ul>
                <Link to="/">Home</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/search">Seacrh</Link>
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
                        profilePopup.current.classList.toggle("show-flex");
                    }}
                />
            </div>
            <div className="bell-popup" ref={bellPopup}>
                <h2>Friend Requests</h2>
                <div className="request">
                    <img
                        src={profilePic}
                        alt="Friend request's profile photo"
                    />
                    <span>Default User</span>
                    <div>
                        <img src={addPersonBlue} alt="Accept friend photo" />
                    </div>
                    <div>
                        <img src={decline} alt="Decline friend photo" />
                    </div>
                </div>
            </div>
            <div className="profile-popup" ref={profilePopup}>
                <span onClick={(e) => createPostDialog.current.toggleAttribute("open")}>Create Post</span>
                <span>Logout</span>
            </div>
			<dialog ref={createPostDialog}>
				<div>
					<textarea cols="30" rows="10" placeholder="Post text"></textarea>
					<label>
						<input type="file" />
						Upload Image
					</label>
					<Button text="Create Post" />
				</div>
				<img src={close} alt="Close Button" onClick={(e) => createPostDialog.current.toggleAttribute("open")}/>
			</dialog>
        </nav>
    );
}
