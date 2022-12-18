import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Posts from "./pages/Posts";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/posts/:postid" element={<Posts />} />
            </Routes>
        </Router>
    );
}
