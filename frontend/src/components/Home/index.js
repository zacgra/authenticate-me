import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navigation } from "../Navigation";
import pirateTreasure from "./pirate-treasure.gif";

import "./Home.css";

export default function Home() {
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionUser === null) return navigate("/login");
  });

  return (
    <div id="home-page">
      <Navigation />
      <div id="treasure">
        <h1>Super Secret Contents</h1>
        <img src={pirateTreasure} width="200" height="200" />
      </div>
    </div>
  );
}
