import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import Button from "../components/Button";
import "../styles/Home.css";
import { getPosts } from "../helpers/helper";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [skip, setSkip] = useState(0);

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
