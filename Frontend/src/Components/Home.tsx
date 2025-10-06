import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { empleadoService, type Empleado } from "../services/api";
import InicioLogo from "../assets/inicio";
import UsuarioLogo from "../assets/usario";
import RegistrosLogo from "../assets/registros";
import CargoLogo from "../assets/cargo";
import HistorialLogo from "../assets/historial";
import CerrarLogo from "../assets/cerrar";
import LupaLogo from "../assets/lupay";
import FiltroLogo from "../assets/filtro";
import AñadirLogo from "../assets/añadir";
import EditarLogo from "../assets/editar";
import RemoverLogo from "../assets/remover";
import OrdenarLogo from "../assets/ordenar";
import GuardarOnLogo from "../assets/guardaron";
import GuardarOffLogo from "../assets/guardaroff";
import DosLineasLogo from "../assets/dosLineas";

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  // Cargar empleados al inicializar el componente (sin mostrar errores)
  useEffect(() => {
    loadEmpleados(false);
  }, []);

  // Cargar datos cuando cambiamos a dashboard para mostrar estadísticas
  useEffect(() => {
    if (activeSection === "dashboard" && empleados.length === 0) {
      loadEmpleados(false);
    }
  }, [activeSection]);

  // Limpiar errores cuando cambiamos de sección
  useEffect(() => {
    if (activeSection !== "empleados") {
      setError("");
    }
  }, [activeSection]);

  const loadEmpleados = async (showErrorOnFail = false) => {
    try {
      setIsLoading(true);
      const data = await empleadoService.getAll();
      setEmpleados(data);
      setError(""); // Limpiar cualquier error previo
    } catch (err) {
      // Solo mostrar error si explícitamente se solicita
      if (showErrorOnFail) {
        setError("Error al cargar los empleados");
      }
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    
    if (!searchTerm.trim()) {
      loadEmpleados(true);
      return;
    }

    try {
      setIsLoading(true);
      const data = await empleadoService.search(searchTerm);
      setEmpleados(data);
      
      // Solo mostrar mensaje si no hay resultados de búsqueda
      if (data.length === 0) {
        setError(`No se encontraron empleados que coincidan con "${searchTerm}"`);
      } else {
        setError("");
      }
    } catch (err) {
      setError("Error al buscar empleados");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  // Menú de navegación lateral
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: InicioLogo },
    { id: "empleados", label: "Empleados", icon: UsuarioLogo },
    { id: "registros", label: "Registros", icon: RegistrosLogo },
    { id: "cargos", label: "Cargos", icon: CargoLogo },
    { id: "historial", label: "Historial", icon: HistorialLogo },
  ];

  // Estadísticas del dashboard
  const stats = [
    {
      title: "Total Empleados",
      value: empleados.length,
      icon: UsuarioLogo,
      color: "bg-blue-600",
    },
    {
      title: "Empleados Activos",
      value: empleados.filter(e => e.estado === 'activo').length,
      icon: GuardarOnLogo,
      color: "bg-green-600",
    },
    {
      title: "Empleados Finalizados",
      value: empleados.filter(e => e.estado === 'finalizado').length,
      icon: GuardarOffLogo,
      color: "bg-red-600",
    },
    {
      title: "Áreas",
      value: new Set(empleados.map(e => e.area.nombre)).size,
      icon: CargoLogo,
      color: "bg-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Menú Lateral Colapsable */}
      <aside className={`${
        isSidebarOpen ? 'w-64' : 'w-16'
      } bg-gray-800 fixed h-full left-0 top-0 shadow-xl transition-all duration-300 ease-in-out z-50`}>
        {/* Logo/Header del menú */}
        <div className="px-4 py-4 border-b border-gray-700">
          <div className={`${isSidebarOpen ? 'flex items-center justify-between' : ''}`}>
            <div className={`${isSidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
              <h2 className="text-xl font-bold text-white">Control</h2>
              <p className="text-gray-400 text-sm">Sistema de Personal</p>
            </div>
            <div className={`${isSidebarOpen ? '' : 'flex justify-center'}`}>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`${isSidebarOpen ? 'p-3' : 'w-full p-3'} rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center ${isSidebarOpen ? '' : 'justify-center'}`}
                aria-label={isSidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <div className="relative w-5 h-5 flex flex-col justify-center items-center">
                    {/* Línea superior */}
                    <div
                      className={`w-5 h-0.5 bg-gray-300 transition-all duration-700 ease-in-out absolute ${
                        isSidebarOpen 
                          ? 'rotate-45' 
                          : 'rotate-0 -translate-y-1'
                      }`}
                    />
                    {/* Línea inferior */}
                    <div
                      className={`w-5 h-0.5 bg-gray-300 transition-all duration-700 ease-in-out absolute ${
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
        <div className="p-4 border-b border-gray-700">
          <div className={`flex items-center ${isSidebarOpen ? 'space-x-3' : 'justify-center'}`}>
            <div className="bg-gray-700 p-2 rounded-full">
              <UsuarioLogo width={20} height={20} fill="#E5E7EB" />
            </div>
            <div className={`${isSidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
              <p className="text-white text-sm font-medium">
                {user?.empleado?.nombre} {user?.empleado?.apellido}
              </p>
              <p className="text-gray-400 text-xs">{user?.rol}</p>
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
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <Icon width={20} height={20} fill="currentColor" />
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
              className={`w-full flex items-center ${isSidebarOpen ? 'space-x-3' : 'justify-center'} p-3 rounded-lg text-red-400 hover:bg-red-600 hover:text-white transition-all duration-200`}
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

      {/* Contenido Principal */}
      <main className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-16'} bg-gray-900 min-h-screen transition-all duration-300 ease-in-out`}>
        {/* Header Superior */}
        <header className="bg-gray-800 shadow-lg px-6 py-5 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {activeSection === "dashboard" && "Dashboard"}
                {activeSection === "empleados" && "Gestión de Empleados"}
                {activeSection === "registros" && "Registros"}
                {activeSection === "cargos" && "Cargos"}
                {activeSection === "historial" && "Historial"}
              </h1>
              <p className="text-gray-400">
                {activeSection === "dashboard" && "Resumen general del sistema"}
                {activeSection === "empleados" && "Administrar empleados del sistema"}
                {activeSection === "registros" && "Historial de registros"}
                {activeSection === "cargos" && "Gestión de cargos y áreas"}
                {activeSection === "historial" && "Historial de actividades"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-gray-400 text-sm">
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

        {/* Contenido según sección activa */}
        <div className="p-6 pt-4">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                          <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                          <Icon width={24} height={24} fill="white" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Acciones rápidas */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Acciones Rápidas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button 
                    onClick={() => setActiveSection("empleados")}
                    className="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <LupaLogo width={24} height={24} fill="#10B981" />
                    <span className="text-white text-sm mt-2">Buscar Empleados</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <AñadirLogo width={24} height={24} fill="#3B82F6" />
                    <span className="text-white text-sm mt-2">Añadir Empleado</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <HistorialLogo width={24} height={24} fill="#F59E0B" />
                    <span className="text-white text-sm mt-2">Ver Historial</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <OrdenarLogo width={24} height={24} fill="#8B5CF6" />
                    <span className="text-white text-sm mt-2">Generar Reporte</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "empleados" && (
            <div className="space-y-6">
              {/* Barra de búsqueda */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <form onSubmit={handleSearch} className="flex gap-4">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LupaLogo width={20} height={20} fill="#6B7280" />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar empleados por nombre, apellido, CI..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <LupaLogo width={16} height={16} fill="white" />
                    Buscar
                  </button>
                  <button
                    type="button"
                    onClick={() => loadEmpleados(true)}
                    className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-500 flex items-center gap-2"
                  >
                    <FiltroLogo width={16} height={16} fill="white" />
                    Todos
                  </button>
                </form>
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Lista de empleados */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">
                    Empleados ({empleados.length})
                  </h2>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                    <AñadirLogo width={16} height={16} fill="white" />
                    Nuevo Empleado
                  </button>
                </div>

                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="text-gray-400">Cargando empleados...</div>
                  </div>
                ) : empleados.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-gray-400">No se encontraron empleados</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Empleado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            CI
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Área
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Cargo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {empleados.map((empleado) => (
                          <tr key={empleado.id} className="hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="bg-gray-600 p-2 rounded-full mr-3">
                                  <UsuarioLogo width={16} height={16} fill="#E5E7EB" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-white">
                                    {empleado.nombre} {empleado.apellido}
                                  </div>
                                  <div className="text-sm text-gray-400">
                                    {empleado.nacionalidad}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {empleado.ci}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {empleado.area.nombre}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {empleado.cargo.nombre}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                empleado.estado === 'activo' 
                                  ? 'bg-green-900 text-green-300' 
                                  : empleado.estado === 'finalizado'
                                  ? 'bg-red-900 text-red-300'
                                  : 'bg-gray-900 text-gray-300'
                              }`}>
                                {empleado.estado}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                                  <EditarLogo width={14} height={14} fill="white" />
                                </button>
                                <button className="bg-red-600 text-white p-2 rounded hover:bg-red-700">
                                  <RemoverLogo width={14} height={14} fill="white" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Otras secciones */}
          {activeSection !== "dashboard" && activeSection !== "empleados" && (
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">
                Sección en Desarrollo
              </h3>
              <p className="text-gray-400">
                Esta sección estará disponible próximamente.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;