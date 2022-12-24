import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    logout,
    fetchOptions,
    getCurrentUser,
    responseValidator,
} from "../helpers/helper";
import "../styles/NavBar.css";
import bell from "../assets/bell.svg";
import addPersonBlue from "../assets/add-person-blue.svg";
import decline from "../assets/decline.svg";
import close from "../assets/close.svg";
import Button from "./Button";

export default function NavBar() {
    const bellPopup = useRef();
    const profilePopup = useRef();
    const createPostDialog = useRef();
    const NavBar = useRef();

    const navigate = useNavigate();
    let location = useLocation();

    const [user, setUser] = useState({});
	
    const [createPostTextInput, setCreatePostTextInput] = useState("");
    const createPostFileInput = useRef();

    useEffect(() => {
        if (location.pathname === "/auth") {
            NavBar.current.style.display = "none";
            return;
        } else {
            NavBar.current.style.display = "flex";
        }
        if (!document.cookie.includes("check=1")) {
            navigate("/auth");
            return;
        }
        const sessionUser = sessionStorage.getItem("user");
        if (sessionUser) {
            setUser(JSON.parse(sessionUser));
            return;
        }

        getCurrentUser().then((user) => {
            setUser(user);
            sessionStorage.setItem("user", JSON.stringify(user));
        });
    }, [location]);

    const logoutButtonClickHandler = async (e) => {
        await logout();
        sessionStorage.clear();
        navigate("/auth");
    };

    const createPostButtonClickHandler = async (e) => {
        const { url } = process.env.SERVER_URL;
        const file = createPostFileInput.current.files[0];
        console.log(createPostTextInput);
        console.log(file);
        if (createPostTextInput === "") {
            alert("You must fill the text input");
            return;
        }
        if (createPostTextInput.length > 200) {
            alert("maximum text length is 200");
            return;
        }
        if (!["image/png", "image/jpeg", "image/gif"].includes(file.type)) {
            alert("Allowed file extensions are: png, jpeg, gif");
            return;
        }
        if (file.size > 1024 * 1024 * 2) {
            alert("File too big");
            return;
        }
        const formData = new FormData();
        formData.append("text", createPostTextInput);
        formData.append("image", createPostFileInput.current.files[0]);
        const response = await fetch(`${url}/posts/`, {
            mode: "cors",
            credentials: "include",
            method: "POST",
            body: formData,
        });
        if (!responseValidator(response)) {
            return;
        }
        const data = await response.json();
        createPostDialog.current.toggleAttribute("open");
        alert(data.message);

		sessionStorage.clear();
        const user = await getCurrentUser();
        setUser(user);
        sessionStorage.setItem("user", JSON.stringify(user));
    };

	const acceptFriendButtonClickHandler = async (friendid) => {
        const { url } = process.env.SERVER_URL;
        const response = await fetch(
            `${url}/users/friends/accept?friendid=${friendid}`,
            {
                ...fetchOptions,
                method: "POST",
            }
        );
        if (responseValidator(response) !== true) {
            return;
        }
        const data = await response.json();
        alert(data.message);

        sessionStorage.clear();
        const user = await getCurrentUser();
        setUser(user);
        sessionStorage.setItem("user", JSON.stringify(user));
    };
    const declineFriendButtonClickHandler = async (friendid) => {
        const { url } = process.env.SERVER_URL;
        const response = await fetch(
            `${url}/users/friends/decline?friendid=${friendid}`,
            {
                ...fetchOptions,
                method: "POST",
            }
        );
        if (responseValidator(response) !== true) {
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
                    src={user && user.profilePic}
                    alt="profile picture"
                    onClick={(e) => {
                        profilePopup.current.classList.toggle("show-flex");
                    }}
                    referrerPolicy="no-referrer"
                />
            </div>
            <div className="bell-popup" ref={bellPopup}>
                <h2>Friend Requests</h2>
                {JSON.stringify(user) !== JSON.stringify({}) ? (
                    user.requests.length === 0 ? (
                        <h2>There are no friend requests</h2>
                    ) : (
                        user.requests.map((friend, index) => {
                            return (
                                <FriendRequest
                                    username={friend.user.username}
                                    profilePic={friend.user.profilePic}
                                    id={friend.user._id}
                                    key={index}
									acceptButtonHandler={acceptFriendButtonClickHandler}
									declineButtonHandler={declineFriendButtonClickHandler}
                                />
                            );
                        })
                    )
                ) : null}
            </div>
            <div className="profile-popup" ref={profilePopup}>
                <span
                    onClick={(e) =>
                        createPostDialog.current.toggleAttribute("open")
                    }
                >
                    Create Post
                </span>
                <span onClick={logoutButtonClickHandler}>Logout</span>
            </div>
            <dialog ref={createPostDialog}>
                <div>
                    <textarea
                        cols="30"
                        rows="10"
                        maxLength="200"
                        placeholder="Post text"
                        value={createPostTextInput}
                        onChange={(e) => setCreatePostTextInput(e.target.value)}
                    ></textarea>
                    <label>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/gif"
                            ref={createPostFileInput}
                        />
                        Upload Image
                    </label>
                    <Button
                        text="Create Post"
                        clickHandler={createPostButtonClickHandler}
                    />
                </div>
                <img
                    src={close}
                    alt="Close Button"
                    onClick={(e) =>
                        createPostDialog.current.toggleAttribute("open")
                    }
                />
            </dialog>
        </nav>
    );
}

function FriendRequest({ username, profilePic, id, declineButtonHandler, acceptButtonHandler }) {
    const navigate = useNavigate();
    let { url } = process.env.SERVER_URL;

    return (
        <div className="request">
            <img
                src={profilePic}
                alt="Friend request's profile photo"
                referrerPolicy="no-referrer"
            />
            <span onClick={(e) => navigate("/users/" + id)}>{username}</span>
            <div onClick={(e) => acceptButtonHandler(id)}>
                <img src={addPersonBlue} alt="Accept friend photo" />
            </div>
            <div onClick={(e) => declineButtonHandler(id)}>
                <img src={decline} alt="Decline friend photo" />
            </div>
        </div>
    );
}
