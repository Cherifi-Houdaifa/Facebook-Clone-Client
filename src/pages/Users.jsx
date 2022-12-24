import React, { useEffect, useRef, useState } from "react";
import "../styles/Profile.css";
import Post from "../components/Post";
import Button from "../components/Button";
import addPerson from "../assets/add-person.svg";
import { useNavigate, useParams } from "react-router-dom";
import {
    getCurrentUser,
    getUser,
    getPosts,
    fetchOptions,
    logout,
} from "../helpers/helper";

export default function Users() {
    const hoverPopup = useRef();
    const { userid } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [posts, setPosts] = useState([]);
    const [skip, setSkip] = useState(0);

    useEffect(() => {
        if (!document.cookie.includes("check=1")) {
            navigate("/auth");
            return;
        }
        // if userid is the same as the current logged in user id redirect to profile page
        const sessionUser = sessionStorage.getItem("user");
        if (sessionUser) {
            if (userid === JSON.parse(sessionUser)._id) {
                navigate("/profile");
                return;
            }
        } else {
            getCurrentUser().then((user) => {
                if (userid === user._id) {
                    navigate("/profile");
                    return;
                }
                sessionStorage.setItem("user", JSON.stringify(user));
            });
        }
        // get this user by id
        getUser(userid).then((user) => {
            if (!user) {
                navigate("/");
                return;
            } else {
                setUser(user);
            }
        });
        // get the posts of this user
        getPosts(userid, skip).then((posts) => {
            setSkip(skip + posts.length);
            setPosts(posts);
        });
    }, []);

    // click handler for the see more button
    const seemoreButtonClickHandler = async (e) => {
        const newPosts = await getPosts(
            userid,
            skip
        );
        if (newPosts.length === 0) {
            alert("No new posts from this user");
            return;
        }
        setSkip(skip + newPosts.length);
        setPosts(posts.concat(newPosts));
    };

    // click hanler for the send request button
    const sendRequestButtonClickHandler = async (e) => {
        let { url } = process.env.SERVER_URL;
        const response = await fetch(
            `${url}/users/friends/request?friendid=${userid}`,
            {
                ...fetchOptions,
                method: "POST",
            }
        );
        if (response.status === 401) {
            logout().then((value) => {
                sessionStorage.clear();
                location.pathname = "/auth";
            });
            return;
        }
        const data = await response.json();
        if (response.status === 400) {
            alert(data.message);
            return;
        }
        if (response.status === 500) {
            return;
        }
        alert(data.message);
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
                        referrerPolicy="no-referrer"
                        onClick={sendRequestButtonClickHandler}
                    />
                    <span>{user && user.username}</span>
                    <div className="hover-popup" ref={hoverPopup}>
                        <img src={addPerson} alt="send request button" />
                    </div>
                </div>
                <div className="friends">
                    <h2>Friends</h2>
                    {user && user.friends.length !== 0 ? (
                        user.friends.map(({friend}, index) => {
                            return (
                                <div className="friend" key={index}>
                                    <img
                                        src={friend.profilePic}
                                        alt="Friend profile photo"
                                        referrerPolicy="no-referrer"
                                        onClick={(e) => {
                                            friend._id ===
                                            JSON.parse(
                                                sessionStorage.getItem("user")
                                            )._id
                                                ? navigate("/profile")
                                                : navigate(
                                                      `/users/${friend._id}`
                                                  );
                                        }}
                                    />
                                    <span>{friend.username}</span>
                                </div>
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
                    posts.length !== 0 ? (
                        <>
                            {posts.map((post, index) => {
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
                            <Button
                                text="See more"
                                clickHandler={seemoreButtonClickHandler}
                            />
                        </>
                    ) : (
                        <h1>No posts</h1>
                    )}
                </div>
            </article>
        </main>
    );
}
