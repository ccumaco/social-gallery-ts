import React from "react";
import "./App.css";
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Home from "./views/Home"; // Asegúrate de importar Home desde el archivo correcto

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Link to="/login">Login</Link>
          <Link to="/register">register</Link>
          <Link to="/">Home</Link>
        </header>

        <Routes>
          <Route path="/login" element={<Login />} />{" "}
          <Route path="/register" element={<Login />} />{" "}
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
