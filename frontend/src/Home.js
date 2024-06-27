import React from "react";
import { Link } from "react-router-dom";
import "./home.css";

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Üdvözöljük az Órarend készítő alkalmazásnál!</h1>
        <p>Könnyedén hozzon létre és kezeljen iskolai órarendeket.</p>
      </header>

      <section className="features-section">
        <h2>Főbb Jellemzők</h2>
        <ul>
          <li>Egyszerű és felhasználóbarát felület</li>
          <li>Testreszabható adatbázis</li>
          
        </ul>
      </section>

      {/* <div className="cta-section">
        <Link to="/login" className="cta-button">
          Kezdjük el
        </Link>
      </div> */}

      

      <footer className="home-footer">
        <p>&copy; 2024 Órarend készítő alkalmazás. Minden jog fenntartva.</p>
        {}
      </footer>
    </div>
  );
}

export default Home;
