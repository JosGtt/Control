import React from "react";
import { useAuth } from "../../context/AuthContext";

// Importar iconos
import InicioLogo from "../../assets/inicio";
import UsuarioLogo from "../../assets/usario";
import RegistrosLogo from "../../assets/registros";
import CargoLogo from "../../assets/cargo";
import HistorialLogo from "../../assets/historial";
import CerrarLogo from "../../assets/cerrar";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  activeSection,
  setActiveSection,
}) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  // Menú de navegación lateral
  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: InicioLogo },
    { id: "empleados", label: "Empleados", icon: UsuarioLogo },
    { id: "registros", label: "Registros", icon: RegistrosLogo },
    { id: "cargos", label: "Cargos", icon: CargoLogo },
    { id: "historial", label: "Historial", icon: HistorialLogo },
  ];

  return (
    <>
      {/* Menú Lateral Colapsable */}
      <aside className={`${
        isSidebarOpen ? 'w-64' : 'w-16'
      } bg-white border-r border-gray-200 fixed h-full left-0 top-0 shadow-lg transition-all duration-300 ease-in-out z-50`}>
        
        {/* Logo/Header del menú */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className={`${isSidebarOpen ? 'flex items-center justify-between' : ''}`}>
            <div className={`${isSidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
              <h2 className="text-xl font-bold text-gray-900">Control</h2>
              <p className="text-gray-600 text-sm">Sistema de Personal</p>
            </div>
            <div className={`${isSidebarOpen ? '' : 'flex justify-center'}`}>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`${isSidebarOpen ? 'p-3' : 'w-full p-3'} rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center ${isSidebarOpen ? '' : 'justify-center'}`}
                aria-label={isSidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <div className="relative w-5 h-5 flex flex-col justify-center items-center">
                    {/* Línea superior */}
                    <div
                      className={`w-5 h-0.5 bg-gray-600 transition-all duration-700 ease-in-out absolute ${
                        isSidebarOpen 
                          ? 'rotate-45' 
                          : 'rotate-0 -translate-y-1'
                      }`}
                    />
                    {/* Línea inferior */}
                    <div
                      className={`w-5 h-0.5 bg-gray-600 transition-all duration-700 ease-in-out absolute ${
                        isSidebarOpen 
                          ? '-rotate-45' 
                          : 'rotate-0 translate-y-1'
                      }`}
                    />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Información del usuario */}
        <div className="p-4 border-b border-gray-200">
          <div className={`flex items-center ${isSidebarOpen ? 'space-x-3' : 'justify-center'}`}>
            <div className="bg-gray-200 p-2 rounded-full">
              <UsuarioLogo width={20} height={20} fill="#6B7280" />
            </div>
            <div className={`${isSidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
              <p className="text-gray-900 text-sm font-medium">
                {user?.empleado?.nombre} {user?.empleado?.apellido}
              </p>
              <p className="text-gray-500 text-xs">{user?.rol}</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center ${isSidebarOpen ? 'space-x-3' : 'justify-center'} p-3 rounded-lg mb-2 transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <Icon width={20} height={20} fill={activeSection === item.id ? "#059669" : "currentColor"} />
                  </div>
                  <span className={`text-sm font-medium ${isSidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
                    {item.label}
                  </span>
                </button>
                {/* Tooltip para modo colapsado */}
                {!isSidebarOpen && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Botón de cerrar sesión */}
        <div className={`absolute bottom-4 ${isSidebarOpen ? 'left-4 right-4' : 'left-2 right-2'}`}>
          <div className="relative group">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${isSidebarOpen ? 'space-x-3' : 'justify-center'} p-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200`}
              title={!isSidebarOpen ? 'Cerrar Sesión' : undefined}
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <CerrarLogo width={20} height={20} fill="currentColor" />
              </div>
              <span className={`text-sm font-medium ${isSidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
                Cerrar Sesión
              </span>
            </button>
            {/* Tooltip para modo colapsado */}
            {!isSidebarOpen && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Cerrar Sesión
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay para dispositivos móviles */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;