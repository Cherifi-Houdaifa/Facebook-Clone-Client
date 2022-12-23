import React, { useEffect, useRef, useState } from "react";
import "../styles/Profile.css";
import Post from "../components/Post";
import Button from "../components/Button";
import removePerson from "../assets/remove-person.svg";
import edit from "../assets/edit.svg";
import close from "../assets/close.svg";
import {
    fetchOptions,
    getCurrentUser,
    getPosts,
    isValidUrl,
    responseValidator,
} from "../helpers/helper";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const hoverPopup = useRef();
    const updateProfileDialog = useRef();

    const [user, setUser] = useState();
    const [posts, setPosts] = useState([]);
    const [skip, setSkip] = useState(0);

    const [upadateUsernameInput, setUpadateUsernameInput] = useState("");
    const [upadateProfilePicInput, setUpadateProfilePicInput] = useState("");

    useEffect(() => {
        if (!document.cookie.includes("check=1")) {
            navigate("/auth");
            return;
        }
        const sessionUser = sessionStorage.getItem("user");
        if (sessionUser) {
            setUser(JSON.parse(sessionUser));
        } else {
            getCurrentUser().then((user) => {
                setUser(user);
                sessionStorage.setItem("user", JSON.stringify(user));
            });
        }
        getPosts(JSON.parse(sessionStorage.getItem("user"))._id, skip).then(
            (posts) => {
                setSkip(skip + posts.length);
                setPosts(posts);
            }
        );
    }, []);

    const seemoreButtonClickHandler = async (e) => {
        const newPosts = await getPosts(
            JSON.parse(sessionStorage.getItem("user"))._id,
            skip
        );
        if (newPosts.length === 0) {
            alert("No new posts from this user");
            return;
        }
        setSkip(skip + newPosts.length);
        setPosts(posts.concat(newPosts));
    };

    const updateProfileButtonClickHandler = async (e) => {
        const { url } = process.env.SERVER_URL;

        if (upadateProfilePicInput && !isValidUrl(upadateProfilePicInput)) {
            alert("Invalid url for profile picture");
            return;
        }
        const response = await fetch(`${url}/users/`, {
            ...fetchOptions,
            method: "PUT",
            body: JSON.stringify({
                username:
                    upadateUsernameInput === ""
                        ? undefined
                        : upadateUsernameInput,
                profilePic:
                    upadateProfilePicInput === ""
                        ? undefined
                        : upadateProfilePicInput,
            }),
        });
        const data = await response.json();
        if (response.status === 401) {
            logout();
            sessionStorage.clear();
            location.pathname = "/auth";
            return;
        }
        if (response.status === 400) {
            alert(data.errors[0].msg);
            return;
        }
        alert(data.message);

        setUpadateUsernameInput("");
        setUpadateProfilePicInput("");

        updateProfileDialog.current.toggleAttribute("open");
        sessionStorage.clear();
        const user = await getCurrentUser();
        setUser(user);
        sessionStorage.setItem("user", JSON.stringify(user));
    };

    const removeFriendButtonClickHandler = async (friendid) => {
        const { url } = process.env.SERVER_URL;
        const response = await fetch(
            `${url}/users/friends/remove?friendid=${friendid}`,
            {
                ...fetchOptions,
                method: "DELETE",
            }
        );
        if (!responseValidator(response)) {
            return;
        }
        const data = await response.json();
        alert(data.message);
        sessionStorage.clear();
        const user = await getCurrentUser();
        setUser(user);
        sessionStorage.setItem("user", JSON.stringify(user));
    };

    return (
        <main className="profile">
            <article className="profile-data">
                <div className="data">
                    <img
                        src={user && user.profilePic}
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
                        referrerPolicy="no-referrer"
                    />
                    <span>{user && user.username}</span>
                    <div className="hover-popup" ref={hoverPopup}>
                        <img src={edit} alt="Edit button" />
                    </div>
                </div>
                <div className="friends">
                    <h2>Friends</h2>
                    {user && user.friends.length !== 0 ? (
                        user.friends.map(({ friend }, index) => {
                            return (
                                <Friend
                                    friend={friend}
                                    removeFriendButtonClickHandler={
                                        removeFriendButtonClickHandler
                                    }
                                    key={index}
                                />
                            );
                        })
                    ) : (
                        <h2 style={{ fontSize: "1.4rem", marginTop: "40px" }}>
                            No friends
                        </h2>
                    )}
                </div>
            </article>
            <article className="posts">
                <h2>Posts</h2>
                <div>
                    {posts &&
                        sessionStorage.getItem("user") &&
                        posts.map((post, index) => {
                            return (
                                <Post
                                    liked={post.likes.includes(
                                        JSON.parse(
                                            sessionStorage.getItem("user")
                                        )._id
                                    )}
                                    text={post.text}
                                    image={
                                        post.img
                                            ? `data:${post.imgMime};base64,${post.img}`
                                            : null
                                    }
                                    likes={post.likes.length}
                                    id={post._id}
                                    key={index}
                                />
                            );
                        })}
                </div>
                <div>
                    <Button
                        text="See more"
                        clickHandler={seemoreButtonClickHandler}
                    />
                </div>
            </article>
            <dialog ref={updateProfileDialog}>
                <div>
                    <h2>Update Profile</h2>
                    <input
                        type="text"
                        placeholder="New username(optimal)"
                        autoComplete="off"
                        value={upadateUsernameInput}
                        onChange={(e) =>
                            setUpadateUsernameInput(e.target.value)
                        }
                    />
                    <input
                        type="text"
                        placeholder="Profile photo url(optimal)"
                        autoComplete="off"
                        value={upadateProfilePicInput}
                        onChange={(e) =>
                            setUpadateProfilePicInput(e.target.value)
                        }
                    />
                    <Button
                        text="Update profile"
                        clickHandler={updateProfileButtonClickHandler}
                    />
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

function Friend({ friend, removeFriendButtonClickHandler }) {
    const navigate = useNavigate();
    return (
        <div className="friend">
            <img
                src={friend.profilePic}
                alt="Friend profile photo"
                referrerPolicy="no-referrer"
                onClick={(e) => navigate(`/users/${friend._id}`)}
            />
            <span>{friend.username}</span>
            <div onClick={(e) => removeFriendButtonClickHandler(friend._id)}>
                <img src={removePerson} alt="Remove friend button" />
            </div>
        </div>
    );
}
