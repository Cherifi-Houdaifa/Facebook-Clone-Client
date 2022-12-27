import React, { useEffect, useState } from "react";
import "../styles/Posts.css";
import Post from "../components/Post";
import Button from "../components/Button";
import profilePic from "../assets/profilePic.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { fetchOptions, getImgMime, logout } from "../helpers/helper";

export default function Posts() {
    const { postid } = useParams();
    const [post, setPost] = useState();

    const navigate = useNavigate();

    const [commentInputText, setCommentInputText] = useState("");

    useEffect(() => {
        const { url } = process.env.SERVER_URL;
        if (!document.cookie.includes("check=1")) {
            navigate("/auth");
            return;
        }
        const getPost = async () => {
            const response = await fetch(`${url}/posts/${postid}/comments`, {
                ...fetchOptions,
                method: "GET",
            });
            const data = await response.json();
            if (response.status === 401) {
                logout().then((value) => {
					sessionStorage.clear();
					navigate("/auth");
				});
                return false;
            }
            if (response.status === 400 || response.status === 500) {
                navigate("/");
                return;
            }
            setPost(data);
        };
        getPost();
    }, []);

    const commentButtonClickHandler = async (e) => {
        const { url } = process.env.SERVER_URL;
        if (commentInputText === "") {
            alert("You must fill the comment input");
            return;
        }
        const response = await fetch(`${url}/posts/${postid}/comments`, {
            ...fetchOptions,
            method: "POST",
            body: JSON.stringify({
                text: commentInputText,
            }),
        });
        const data = await response.json();
        if (response.status === 401) {
            await logout();
            sessionStorage.clear();
            navigate("/auth");
            return false;
        }
        if (response.status === 400 || response.status === 500) {
            navigate("/");
            return;
        }
        let newPost = {...post};
        newPost.comments.push({
            text: commentInputText,
            user: JSON.parse(sessionStorage.getItem("user"))._id,
        });
        setPost(newPost);
		setCommentInputText("");
    };

    return (
        <main className="posts">
            <article className="post">
                <div className="user">
                    <img
                        src={post && post.user.profilePic}
                        alt="User profile picture"
                        referrerPolicy="no-referrer"
                        onClick={(e) => {
                            (post && post.user._id) ===
                            JSON.parse(sessionStorage.getItem("user"))._id
                                ? navigate("/profile")
                                : navigate(`/users/${post.user._id}`);
                        }}
                    />
                    <span>{post && post.user.username}</span>
                </div>
                {post && (
                    <Post
                        liked={
                            sessionStorage.getItem("user") &&
                            post.likes.includes(
                                JSON.parse(sessionStorage.getItem("user"))._id
                            )
                        }
                        text={post.text}
                        image={
                            post.img
                                ? `data:${getImgMime(post.img)};base64,${
                                      post.img
                                  }`
                                : null
                        }
                        likes={post.likes.length}
                        id={post._id}
                        nolink={true}
                    />
                )}
            </article>
            <article className="comments">
                <div className="create-comment">
                    <input
                        type="text"
                        placeholder="Text"
                        autoComplete="off"
                        value={commentInputText}
                        onChange={(e) => setCommentInputText(e.target.value)}
                    />
                    <Button
                        text="Comment"
                        clickHandler={commentButtonClickHandler}
                    />
                </div>
                <h2>Comments</h2>
                <section>
                    {post && post.comments.length !== 0 ? (
                        post.comments.map((comment, index) => {
                            return (
                                <div
                                    className={`comment ${
                                        index % 2 == 0
                                            ? "light-comment"
                                            : "dark-comment"
                                    }`}
									key={index}
                                >
                                    <img
                                        src={profilePic}
                                        alt="user temporary profile picture"
                                        onClick={(e) => {
                                            comment.user ===
                                            JSON.parse(
                                                sessionStorage.getItem("user")
                                            )._id
                                                ? navigate("/profile")
                                                : navigate(
                                                      `/users/${comment.user}`
                                                  );
                                        }}
                                    />
                                    <p>{comment.text}</p>
                                </div>
                            );
                        })
                    ) : (
                        <h1>There are no comments</h1>
                    )}
                </section>
            </article>
        </main>
    );
}
