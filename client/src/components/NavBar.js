import React, { useContext, useState } from "react";
import "./NavBar.scss";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [icon, setIcon] = useState("search");

  const handleChange = (event) => {
    authCtx.setSearchTerm(event.target.value);
    if (event.target.value.trim().length > 0) setIcon("close");
    else setIcon("search");
  };

  const clearHandler = () => {
    authCtx.setSearchTerm("");
    setIcon("search");
  };

  const logoutHandler = () => {
    authCtx.logout();
    navigate("/");
  };

  return (
    <React.Fragment>
      <nav>
        <h2>MyPasswords</h2>
        <div className="NavBox">
          <div className="Email">{authCtx.userEmail}</div>
          <button onClick={logoutHandler}>Logout</button>
        </div>
      </nav>
      <hr />
      <div className="SerchContainer">
        <input
          className="Search"
          type="text"
          placeholder="Search"
          value={authCtx.searchTerm}
          onChange={handleChange}
        />
        <span className="material-symbols-outlined" onClick={clearHandler}>
          {icon}
        </span>
      </div>
    </React.Fragment>
  );
};

export default NavBar;
