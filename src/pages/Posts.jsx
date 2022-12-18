import React from "react";
import "../styles/Posts.css";
import NavBar from "../components/NavBar";
import Post from "../components/Post";
import Button from "../components/Button";
import profilePic from "../assets/profilePic.jpg";

export default function Posts() {
    return (
        <main className="posts">
            <NavBar />
            <article className="post">
                <div className="user">
                    <img src={profilePic} alt="User profile picture" />
                    <span>Default User</span>
                </div>
                <Post
                    text="Hello world my name is james mclaren"
                    image={profilePic}
                    nolink={true}
                />
            </article>
            <article className="comments">
                <div className="create-comment">
                    <input type="text" placeholder="Text" autoComplete="off" />
					<Button text="Comment"/>
                </div>
				<h2>Comments</h2>
				<section>
					<div className="comment light-comment">
						<img src={profilePic} alt="user temporary profile picture" />
						<p>Hello world and thanks very much</p>
					</div>
					<div className="comment dark-comment">
						<img src={profilePic} alt="user temporary profile picture" />
						<p>Hello world and thanks very much</p>
					</div>
					<div className="comment light-comment">
						<img src={profilePic} alt="user temporary profile picture" />
						<p>Hello world and thanks very much</p>
					</div>
				</section>
            </article>
        </main>
    );
}
