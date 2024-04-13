import React from "react";
import { Link } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import "./navbar.css";
import logo from "./images/logo.png";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img src={logo} alt="Your Brand Logo" className="navbar-logo" />{" "}
          {/* Use className for styling */}
        </Link>
      </div>
      <ul className="nav-menu">
        <li className="nav-item">
          <Link to="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/login">Login/Registration</Link>
        </li>
        {/* New Timetable Link */}
        <li className="nav-item">
          <Link to="/timetable">Create Timetable</Link>
        </li>
        <li className="nav-item">
          <Link to="/schedulegenerator">ScheduleGenerator</Link>
        </li>
        <li className="nav-item">
          <Link to="/backtracking">backtracking</Link>
        </li>
      </ul>
      {/* Dark Mode Toggle */}
      <DarkModeToggle />
      {}
      {/* <div className="navbar-toggler">
        <span></span> {/* For toggle icon, you can use an icon library or create a custom one */}
      {/* </div> */}
    </nav>
  );
}

export default Navbar;
