import React from "react";
import { User } from "../requests/user-requests";
import { NavLink } from "react-router-dom";
import "../styles/nav-bar-styles.css";

type NavBarProps = {
  user: User;
  onUserLogout: () => void;
};

export function NavBar({ user, onUserLogout }: NavBarProps){
    return (
        <div className="navBarContainer">
            <div className="profileInfo">
                {user.profile_pic && (
                <img src={user.profile_pic} alt="Profile pic" className="profilePic" />
                )}
                <span>{user.username}</span>
            </div>
            <div>
                <NavLink to="/" end className="navItem">Home</NavLink>
                <button onClick={onUserLogout}>Logout</button>
            </div>
        </div>
    );
};
