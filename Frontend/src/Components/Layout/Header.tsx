import React from "react";

interface HeaderProps {
  activeSection: string;
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const getSectionTitle = () => {
    switch (activeSection) {
      case "dashboard": return "Dashboard";
      case "empleados": return "Gestión de Empleados";
      case "registros": return "Registros";
      case "cargos": return "Cargos";
      case "historial": return "Historial";
      default: return "Sistema de Control";
    }
  };

  const getSectionDescription = () => {
    switch (activeSection) {
      case "dashboard": return "Resumen general del sistema";
      case "empleados": return "Administrar empleados del sistema";
      case "registros": return "Historial de registros";
      case "cargos": return "Gestión de cargos y áreas";
      case "historial": return "Historial de actividades";
      default: return "Gestión de recursos humanos";
    }
  };

  return (
    <header className="bg-white shadow-sm px-6 py-5 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getSectionTitle()}
          </h1>
          <p className="text-gray-600">
            {getSectionDescription()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-gray-500 text-sm">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;