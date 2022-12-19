import React, { useRef } from "react";
import "../styles/Profile.css";
import Post from "../components/Post";
import Button from "../components/Button";
import profilePic from "../assets/profilePic.jpg";
import addPerson from "../assets/add-person.svg";

export default function Users() {
    const hoverPopup = useRef();
    return (
        <main className="profile">
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
                        <img src={addPerson} alt="Edit button" />
                    </div>
                </div>
                <div className="friends">
                    <h2>Friends</h2>
                    <div className="friend">
                        <img src={profilePic} alt="Friend profile photo" />
                        <span>Default User</span>
                    </div>
                </div>
            </article>
            <article className="posts">
                <h2>Posts</h2>
                <div>
                    <Post text="hello world" />
                    <Post text="hello world" />
                </div>
                <div>
                    <Button text="See more" />
                </div>
            </article>
        </main>
    );
}
