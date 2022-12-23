import React, { useEffect, useState } from "react";
import "../styles/Search.css";
import Button from "../components/Button";
import { fetchOptions, responseValidator } from "../helpers/helper";
import { useNavigate } from "react-router-dom";

export default function Search() {
    let { url } = process.env.SERVER_URL;
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (!document.cookie.includes("check=1")) {
            navigate("/auth");
            return;
        }
    }, []);

    const searchButtonClickHandler = async () => {
        if (searchInput === "") {
            alert("You must fill the search bar");
            return;
        }
        const response = await fetch(
            `${url}/users/search?search=${searchInput}`,
            {
                ...fetchOptions,
                method: "GET",
            }
        );
        if (responseValidator(response) !== true) {
            return;
        }
        const data = await response.json();
        setUsers(data.users);
    };

    return (
        <main className="search">
            <section className="form">
                <input
                    type="text"
                    placeholder="Usernmame"
                    autoComplete="off"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <Button text="Search" clickHandler={searchButtonClickHandler} />
            </section>
            <article className="result">
                {users.length !== 0 ? (
                    users.map((user, index) => {
                        return (
                            <div
                                className="user"
                                key={index}
                                onClick={(e) => {
                                    user._id ===
                                    JSON.parse(sessionStorage.getItem("user"))
                                        ._id
                                        ? navigate("/profile")
                                        : navigate(`/users/${user._id}`);
                                }}
                            >
                                <img
                                    src={user.profilePic}
                                    alt="User profile picture"
                                    referrerPolicy="no-referrer"
                                />
                                <span>{user.username}</span>
                            </div>
                        );
                    })
                ) : (
                    <h1>There are no users</h1>
                )}
            </article>
        </main>
    );
}
