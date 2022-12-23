import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import Button from "../components/Button";
import "../styles/Home.css";
import { getPosts } from "../helpers/helper";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [skip, setSkip] = useState(0);

	const navigate = useNavigate()

    useEffect(() => {
        if (!document.cookie.includes("check=1")) {
            navigate("/auth");
            return;
        }
        getPosts(null, skip).then((posts) => {
            setSkip(skip + posts.length);
            setPosts(posts);
        });
    }, []);

    const seemoreButtonClickHandler = async (e) => {
        const newPosts = await getPosts(null, skip);
        if (newPosts.length === 0) {
            alert("No new posts");
            return;
        }
        setSkip(skip + newPosts.length);
        setPosts(posts.concat(newPosts));
    };

    return (
        <main className="home">
            <article>
                {posts &&
                    sessionStorage.getItem("user") &&
                    posts.map((post, index) => {
                        return (
                            <Post
                                liked={post.likes.includes(
                                    JSON.parse(sessionStorage.getItem("user"))
                                        ._id
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
            </article>
        </main>
    );
}
