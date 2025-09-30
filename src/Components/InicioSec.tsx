import React, { useState } from "react";
import UsuarioLogo from "../assets/usario";
import ContraLogo from "../assets/contraseña";
import OjoLogo from "../assets/ojo";
import OjoCerradoLogo from "../assets/ojoCerrado";
import InputText from "./InputText";

const InicioSec: React.FC = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrar, setMostrar] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 flex flex-col items-center">
        <div className="mb-6">
          <UsuarioLogo width={80} height={80} fill="#000" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <InputText
            placeholder="Usuario"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            icon={<UsuarioLogo width={24} height={24} fill="#6C2EFF" />}
          />
          <InputText
            type={mostrar ? "text" : "password"}
            placeholder="Contraseña"
            value={contrasena}
            onChange={e => setContrasena(e.target.value)}
            icon={<ContraLogo width={24} height={24} fill="#6C2EFF" />}
          >
            <button
              type="button"
              onClick={() => setMostrar(!mostrar)}
              className="ml-2"
              tabIndex={-1}
            >
              {mostrar ? (
                <OjoLogo width={24} height={24} fill="#6C2EFF" />
              ) : (
                <OjoCerradoLogo width={24} height={24} fill="#6C2EFF" />
              )}
            </button>
          </InputText>
        </div>
        <button className="bg-indigo-600 text-white w-full py-2 rounded mt-6 hover:bg-indigo-700">
          Iniciar sesión
        </button>
      </div>
    </div>
  );
};

export default InicioSec;