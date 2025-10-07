import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioLogo from "../assets/usario";
import ContraLogo from "../assets/contraseña";
import OjoLogo from "../assets/ojo";
import OjoCerradoLogo from "../assets/ojoCerrado";
import InputText from "./InputText";
import { useAuth } from "../context/AuthContext";

const InicioSec: React.FC = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario.trim() || !contrasena.trim()) {
      setError("Por favor ingresa usuario y contraseña");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const success = await login(usuario, contrasena);
      if (success) {
        navigate("/home");
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-emerald-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 flex flex-col items-center">
        <div className="mb-6">
          <UsuarioLogo width={80} height={80} fill="#059669" />
        </div>
        
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full flex flex-col gap-2">
            <InputText
              placeholder="Usuario"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              icon={<UsuarioLogo width={24} height={24} fill="#059669" />}
            />
            <InputText
              type={mostrar ? "text" : "password"}
              placeholder="Contraseña"
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
              icon={<ContraLogo width={24} height={24} fill="#059669" />}
            >
              <button
                type="button"
                onClick={() => setMostrar(!mostrar)}
                className="ml-2"
                tabIndex={-1}
              >
                {mostrar ? (
                  <OjoLogo width={24} height={24} fill="#059669" />
                ) : (
                  <OjoCerradoLogo width={24} height={24} fill="#059669" />
                )}
              </button>
            </InputText>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-emerald-600 text-white w-full py-2 rounded mt-6 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InicioSec;