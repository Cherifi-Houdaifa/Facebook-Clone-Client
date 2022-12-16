import React from "react";
import "../styles/Auth.css";

export default function Auth () {
	return <main className="auth">
		<article className="text">
			<div>
				<h1>Facebook</h1>
				<p className="subname"><span className="blue">Clone</span></p>
				<p className="subtext">Connect with every <span className="blue">fucking</span> person</p>
			</div>
		</article>
		<article className="form">
			<div>
				<input type="text" placeholder="Username" autoComplete="off" />
				<input type="text" placeholder="Password" autoComplete="off" />
				<input type="button" value="Sign in" />
				<input type="button" value="Sign up" />
				<input type="button" value="Sign in with google" />
			</div>
		</article>
	</main>;
}