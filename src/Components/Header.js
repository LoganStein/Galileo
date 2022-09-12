import React from "react";
import Small_Search from "./Small_Search";
import "../CSS/Header.css";
import { Link } from "react-router-dom";

function Header(props) {
  return (
    <div>
      <div className="header-container">
        <Link to="/">
          <h1>Stellar Value Viewer</h1>
        </Link>
        <Link to="/About">
          <h3>About</h3>
        </Link>
        <div>
          <Small_Search setAddress={props.setAddress} />
        </div>
      </div>
    </div>
  );
}

export default Header;
