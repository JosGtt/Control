import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InicioSec from "./Components/InicioSec";
// Puedes agregar más componentes aquí, por ejemplo:
// import Dashboard from "./Components/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioSec />} />
        {/* Ejemplo para otra página:
        <Route path="/dashboard" element={<Dashboard />} />
        */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;