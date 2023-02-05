import React from "react";
import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useSelector } from "react-redux";

import "./Navigation.css";

export function Navigation() {
  const sessionUser = useSelector((state) => state.session.user);
  let dropdownMenu;
  if (sessionUser) {
    dropdownMenu = (
      <div id="nav-menu">
        <ProfileButton user={sessionUser} />
      </div>
    );
  } else {
    dropdownMenu = (
      <div id="nav-menu">
        <ul>
          <li>
            <NavLink to="/login">Log In</NavLink>
          </li>
          <li>
            <NavLink to="/signup">Sign Up</NavLink>
          </li>
        </ul>
      </div>
    );
  }
  return <div>{dropdownMenu}</div>;
}
