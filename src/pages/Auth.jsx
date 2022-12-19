import React, { useRef } from "react";
import "../styles/Auth.css";
import close from "../assets/close.svg";

export default function Auth() {
    const signUpDialog = useRef();
    return (
        <main className="auth">
            <article className="text">
                <div>
                    <h1>Facebook</h1>
                    <p className="subname">
                        <span className="blue">Clone</span>
                    </p>
                    <p className="subtext">
                        Connect with every <span className="blue">fucking</span>{" "}
                        person
                    </p>
                </div>
            </article>
            <article className="form">
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        autoComplete="off"
                    />
                    <input
                        type="text"
                        placeholder="Password"
                        autoComplete="off"
                    />
                    <input type="button" value="Sign in" />
                    <input
                        type="button"
                        value="Sign up"
                        onClick={(e) => signUpDialog.current.toggleAttribute("open")}
                    />
                    <input type="button" value="Sign in with google" />
                </div>
                <dialog ref={signUpDialog}>
                    <div>
                        <h2>Sign up</h2>
                        <input
                            type="text"
                            placeholder="Username"
                            autoComplete="off"
                        />
                        <input
                            type="text"
                            placeholder="Password"
                            autoComplete="off"
                        />
                        <input
                            type="text"
                            placeholder="Confirm Password"
                            autoComplete="off"
                        />
                        <input type="button" value="Sign up" />
                    </div>
					<img src={close} alt="Close button" onClick={(e) => signUpDialog.current.toggleAttribute("open")} />
                </dialog>
            </article>
        </main>
    );
}
