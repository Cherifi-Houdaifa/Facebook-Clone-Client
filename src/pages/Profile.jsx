import React, { useRef } from "react";
import "../styles/Profile.css";
import Post from "../components/Post";
import Button from "../components/Button";
import profilePic from "../assets/profilePic.jpg";
import removePerson from "../assets/remove-person.svg";
import edit from "../assets/edit.svg";
import close from "../assets/close.svg";

export default function Profile() {
    const hoverPopup = useRef();
    const updateProfileDialog = useRef();
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
                        onClick={(e) =>
                            updateProfileDialog.current.toggleAttribute("open")
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
                    <Post text="hello world" />
                    <Post text="hello world" />
                </div>
                <div>
                    <Button text="See more" />
                </div>
            </article>
            <dialog ref={updateProfileDialog}>
                <div>
                    <h2>Update Profile</h2>
                    <input
                        type="text"
                        placeholder="New username"
                        autoComplete="off"
                    />
                    <input
                        type="text"
                        placeholder="Profile photo url"
                        autoComplete="off"
                    />
                    <Button text="Update profile" />
                </div>
                <img
                    src={close}
                    alt="Close Button"
                    onClick={(e) =>
                        updateProfileDialog.current.toggleAttribute("open")
                    }
                />
            </dialog>
        </main>
    );
}
