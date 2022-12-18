import React from "react";
import "../styles/Search.css";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import profilePic from "../assets/profilePic.jpg";

export default function Search () {
	return <main className="search">
		<NavBar />
		<section className="form">
			<input type="text" placeholder="Usernmame" autoComplete="off" />
			<Button text="Search"/>
		</section>
		<article className="result">
			<div className="user">
				<img src={profilePic} alt="User profile picture" />
				<span>Default User</span>
			</div>
			<div className="user">
				<img src={profilePic} alt="User profile picture" />
				<span>Default User</span>
			</div>
			<div className="user">
				<img src={profilePic} alt="User profile picture" />
				<span>Default User</span>
			</div>
		</article>
	</main>
}