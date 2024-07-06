import React from "react";
import { NavLink } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import "./navbar.css";
import logo from "./images/logo.png";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        
          <img src={logo} alt="Your Brand Logo" className="navbar-logo" />
        
      </div>
      <ul className="nav-menu">
        <li className="nav-item">
          <NavLink to="/" className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}>Főoldal</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/timetable" className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}>Adatbázis szerkesztés</NavLink>
        </li>
        {/* <li className="nav-item">
          <NavLink to="/schedulegenerator" className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}>ScheduleGenerator</NavLink>
        </li> */}
        <li className="nav-item">
          <NavLink to="/backtracking" className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}>Backtracking algoritmus</NavLink>
        </li>
        {/* <li className="nav-item">
          <Link to="/login">Login/Registration</Link>
        </li> */}
        {/* New Timetable Link */}
      </ul>
      {/* Dark Mode Toggle */}
      <DarkModeToggle />
      {/* <div className="navbar-toggler">
        <span></span> {/* For toggle icon, you can use an icon library or create a custom one */}
      {/* </div> */}
    </nav>
  );
}

export default Navbar;
