import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import InicioSec from "./Components/InicioSec";
import Home from "./Components/Home";
import ProtectedRoute from "./Components/ProtectedRoute";

// Componente para redireccionar si ya está autenticado
const LoginRedirect: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  
  return <InicioSec />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginRedirect />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          {/* Redireccionar cualquier ruta no encontrada */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;