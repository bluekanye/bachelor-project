import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      name,
      email,
      password,
      role,
      ...(role === "teacher" && { subject: "" }),
    };
    console.log("Registration Data:", userData);
  };

  return (
    <div className="auth-form-container">
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label htmlFor="role">Select Role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <label htmlFor="name">Full Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="name"
          placeholder="Full Name"
        />
        <label htmlFor="email">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="youremail@gmail.com"
          id="email"
          name="email"
        />
        {role === "teacher" && (
          <>
            <label htmlFor="subject">Subject</label>
            <input
              value=""
              onChange={(e) => {}}
              id="subject"
              placeholder="Subject Taught"
            />
          </>
        )}
        <label htmlFor="password">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="********"
          id="password"
          name="password"
        />

        <button type="submit">Register</button>
      </form>
      <Link to="/login" className="link-btn">
        Already have an account? Login here.
      </Link>
    </div>
  );
};
