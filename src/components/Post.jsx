import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Post.css";
import like from "../assets/like.svg";
import likeFilled from "../assets/like-filled.svg";

export default function Post({ text, image, liked, id }) {
    const navigate = useNavigate();
    return (
        <section className="post">
            <p onClick={(e) => navigate(`/posts/${id}`)}>{text}</p>
            {image ? (
                <div className="image">
                    <img src={image} alt="Post image" />
                </div>
            ) : null}
            <div className="like-box">
                <img src={liked ? likeFilled : like} alt="Like button" />
            </div>
        </section>
    );
}
