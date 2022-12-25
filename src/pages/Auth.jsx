import React, { useRef, useState } from "react";
import "../styles/Auth.css";
import close from "../assets/close.svg";
import { useNavigate } from "react-router-dom";
import { fetchOptions, getCurrentUser } from "../helpers/helper";

export default function Auth() {
    const signUpDialog = useRef();
    const [signinUsernameInput, setSigninUsernameInput] = useState("");
    const [signinPasswordInput, setSigninPasswordInput] = useState("");

    const [signupUsernameInput, setSignupUsernameInput] = useState("");
    const [signupPasswordInput, setSignupPasswordInput] = useState("");
    const [signupConfirmPasswordInput, setSignupConfirmPasswordInput] =
        useState("");
    const navigate = useNavigate();

    const signinButtonClickHandler = async () => {
        if (!signinUsernameInput || !signinPasswordInput) {
            return alert("Username and password inputs should not be empty");
        }
        const { url } = process.env.SERVER_URL;
        const response = await fetch(url + "/auth/local", {
            ...fetchOptions,
            method: "POST",
            body: JSON.stringify({
                username: signinUsernameInput,
                password: signinPasswordInput,
            }),
        });

        if (response.status === 401) {
            return alert("Invalid username or password");
        }
		const data = await response.json();
		alert(data.message);
		sessionStorage.clear();
		getCurrentUser().then((user) => {
			sessionStorage.setItem("user", JSON.stringify(user));
		});
		navigate("/");
    };

    const signupButtonClickHandler = async (e) => {
        if (
            !signupUsernameInput ||
            !signupPasswordInput ||
            !signupConfirmPasswordInput
        ) {
            return alert("All of the three fields must be filled");
        }
        if (signupPasswordInput.length < 8) {
            return alert("Password must be atleast 8 charachters");
        }
        if (signupPasswordInput !== signupConfirmPasswordInput) {
            return alert("Password and the confirmed one must be the same");
        }
        const { url } = process.env.SERVER_URL;
        const response = await fetch(url + "/auth/local/signup", {
            ...fetchOptions,
            method: "POST",
            body: JSON.stringify({
                username: signupUsernameInput,
                password: signupPasswordInput,
                "confirm-password": signupConfirmPasswordInput,
            }),
        });
        const data = await response.json();
        if (response.status === 400) {
            return alert(data.errors[0].msg);
        }
        signUpDialog.current.toggleAttribute("open");
        alert("You have successfully signed up");
    };

    const googleSigninButtonClickHandler = (e) => {
        const { url } = process.env.SERVER_URL;
        const popup = window.open(url + "/auth/google", "_blank", "popup=1");
        const popupCheck = setInterval(() => {
            if (popup.closed) {
                if (document.cookie.includes("check=1")) {
                    // the user is logged in successfly
                    clearInterval(popupCheck);
                    sessionStorage.clear();
                    getCurrentUser().then((user) => {
                        sessionStorage.setItem("user", JSON.stringify(user));
                    });
                    navigate("/");
                }
            }
        }, 1000);
    };

    return (
        <main className="auth">
            <article className="text">
                <div>
                    <h1>Facebook</h1>
                    <p className="subname">
                        <span className="blue">Clone</span>
                    </p>
                    <p className="subtext">
                        Connect with every
                        <span className="blue"> fucking </span>
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
                        value={signinUsernameInput}
                        onChange={(e) => setSigninUsernameInput(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Password"
                        autoComplete="off"
                        value={signinPasswordInput}
                        onChange={(e) => setSigninPasswordInput(e.target.value)}
                    />
                    <input
                        type="button"
                        value="Sign in"
                        onClick={signinButtonClickHandler}
                    />
                    <input
                        type="button"
                        value="Sign up"
                        onClick={(e) =>
                            signUpDialog.current.toggleAttribute("open")
                        }
                    />
                    <input
                        type="button"
                        value="Sign in with google"
                        onClick={googleSigninButtonClickHandler}
                    />
                </div>
                <dialog ref={signUpDialog}>
                    <div>
                        <h2>Sign up</h2>
                        <input
                            type="text"
                            placeholder="Username"
                            autoComplete="off"
                            value={signupUsernameInput}
                            onChange={(e) =>
                                setSignupUsernameInput(e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="Password"
                            autoComplete="off"
                            value={signupPasswordInput}
                            onChange={(e) =>
                                setSignupPasswordInput(e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="Confirm Password"
                            autoComplete="off"
                            value={signupConfirmPasswordInput}
                            onChange={(e) =>
                                setSignupConfirmPasswordInput(e.target.value)
                            }
                        />
                        <input
                            type="button"
                            value="Sign up"
                            onClick={signupButtonClickHandler}
                        />
                    </div>
                    <img
                        src={close}
                        alt="Close button"
                        onClick={(e) =>
                            signUpDialog.current.toggleAttribute("open")
                        }
                    />
                </dialog>
            </article>
        </main>
    );
}
