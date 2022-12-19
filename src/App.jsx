import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Posts from "./pages/Posts";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Users from "./pages/Users";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/posts/:postid" element={<Posts />} />
                <Route path="/search" element={<Search />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/users/:userid" element={<Users />} />
            </Routes>
        </Router>
    );
}
