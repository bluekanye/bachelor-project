import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import Navbar from "./Navbar";
import Home from "./Home";
// import { Login } from "./Login";
// import { Register } from "./Register";
import Timetable from "./Timetable";
import ScheduleGenerator  from "./ScheduleGenerator";
import Backtrack from "./backtracking";
import "./App.css";




function App() {
  return (
    <ThemeProvider>
      {" "}
      {}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> */}
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/schedulegenerator" element={<ScheduleGenerator />} />
          <Route path="/backtracking" element={<Backtrack />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
