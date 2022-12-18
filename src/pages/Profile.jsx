import React, { useRef } from "react";
import "../styles/Profile.css";
import NavBar from "../components/NavBar";
import Post from "../components/Post";
import Button from "../components/Button";
import profilePic from "../assets/profilePic.jpg";
import removePerson from "../assets/remove-person.svg";
import edit from "../assets/edit.svg";

export default function Profile() {
    const hoverPopup = useRef();
    return (
        <main className="profile">
            <NavBar />
            <article className="profile-data">
                <div className="data">
                    <img
                        src={profilePic}
                        alt="User profile photo"
                        onMouseEnter={(e) =>
                            hoverPopup.current.classList.toggle("show-flex")
                        }
                        onMouseLeave={(e) =>
                            hoverPopup.current.classList.toggle("show-flex")
                        }
                    />
                    <span>Default User</span>
                    <div className="hover-popup" ref={hoverPopup}>
                        <img src={edit} alt="Edit button" />
                    </div>
                </div>
                <div className="friends">
                    <h2>Friends</h2>
                    <div className="friend">
                        <img src={profilePic} alt="Friend profile photo" />
                        <span>Default User</span>
                        <div>
                            <img
                                src={removePerson}
                                alt="Remove friend button"
                            />
                        </div>
                    </div>
                </div>
            </article>
			<article className="posts">
				<h2>Posts</h2>
				<div>
					<Post text="hello world"/>
					<Post text="hello world"/>
					<Button text="See more"/>
				</div>
			</article>
        </main>
    );
}
