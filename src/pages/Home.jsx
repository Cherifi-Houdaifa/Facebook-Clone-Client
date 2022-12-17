import React from "react";
import NavBar from "../components/NavBar";
import Post from "../components/Post";
import Button from "../components/Button";
import "../styles/Home.css";

export default function Home() {
    return (
        <main className="home">
            <NavBar />
            <article>
                <Post
                    liked={false}
                    text="Hello world I am going to solve the world hunger you son of a bitch."
                />
                <Post
                    liked={false}
                    text="Hello world I am going to solve the world hunger you son of a bitch."
                />
                <Button text="See more" />
            </article>
        </main>
    );
}
