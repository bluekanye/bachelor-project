import React from "react";
import { useTheme } from "./ThemeContext";

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`theme-toggle-container ${
        theme === "dark" ? "dark" : "light"
      }`}
    >
      <input
        type="checkbox"
        id="theme-toggle-checkbox"
        className="theme-toggle-checkbox"
        onChange={toggleTheme}
        checked={theme === "dark"}
      />
      <label
        htmlFor="theme-toggle-checkbox"
        className="theme-toggle-slider"
      ></label>
    </div>
  );
};

export default DarkModeToggle;
