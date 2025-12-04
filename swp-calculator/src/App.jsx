// src/App.jsx
import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import SwpCalculator from "./pages/SwpCalculator";
import SipCalculator from "./pages/SipCalculator";
import "./styles.css"

export default function App() {
  const [route, setRoute] = React.useState("home");

  return (
    <div style={{ maxWidth: 980, margin: "28px auto", fontFamily: "Inter, Arial" }}>
      <Header route={route} setRoute={setRoute} />

      <main style={{ marginTop: 20 }}>
        {route === "home" && <Home onNavigate={setRoute} />}
        {route === "swp" && <SwpCalculator />}
        {route === "sip" && <SipCalculator />}
      </main>
    </div>
  );
}
