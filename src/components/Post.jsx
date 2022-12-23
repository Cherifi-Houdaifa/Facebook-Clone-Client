import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Post.css";
import like from "../assets/like.svg";
import likeFilled from "../assets/like-filled.svg";
import { responseValidator, fetchOptions } from "../helpers/helper";

export default function Post({ text, image, liked, id, nolink, likes }) {
    const likeButton = useRef();
    const navigate = useNavigate();
	const [likeCount, setLikeCount] = useState(likes);

    const likeButtonClickHandler = async () => {
        let { url } = process.env.SERVER_URL;
        const response = await fetch(`${url}/posts/like?postid=${id}`, {
            ...fetchOptions,
            method: "PUT",
        });
        if (responseValidator(response) !== true) {
            return;
        }
        const data = await response.json();
        if (data.message === "You have liked this post") {
			setLikeCount(likeCount + 1);
            likeButton.current.src = likeFilled;
        } else {
			setLikeCount(likeCount - 1);
            likeButton.current.src = like;
        }
    };
    return (
        <section className="post">
            <p onClick={(e) => (nolink ? null : navigate(`/posts/${id}`))}>
                {text}
            </p>
            {image ? (
                <div className="image">
                    <img src={image} alt="Post image" />
                </div>
            ) : null}
            <div className="like-box" onClick={likeButtonClickHandler}>
                <img
                    ref={likeButton}
                    src={liked ? likeFilled : like}
                    alt="Like button"
                />
				<span>{likeCount}</span>
            </div>
        </section>
    );
}
