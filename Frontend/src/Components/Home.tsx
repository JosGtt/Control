import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { empleadoService, type Empleado } from "../services/api";
import LupaLogo from "../assets/lupay";
import FiltroLogo from "../assets/filtro";

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar empleados al inicializar el componente
  useEffect(() => {
    loadEmpleados();
  }, []);

  const loadEmpleados = async () => {
    try {
      setIsLoading(true);
      const data = await empleadoService.getAll();
      setEmpleados(data);
      setError("");
    } catch (err) {
      setError("Error al cargar los empleados");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      loadEmpleados();
      return;
    }

    try {
      setIsLoading(true);
      const data = await empleadoService.search(searchTerm);
      setEmpleados(data);
      setError("");
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Control de Personal</h1>
            <p className="text-gray-600">
              Bienvenido, {user?.empleado?.nombre} {user?.empleado?.apellido} ({user?.rol})
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Barra de búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              <LupaLogo width={16} height={16} fill="white" />
              Buscar
            </button>
            <button
              type="button"
              onClick={loadEmpleados}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <FiltroLogo width={16} height={16} fill="white" />
              Todos
            </button>
          </form>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Lista de empleados */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Empleados ({empleados.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">Cargando empleados...</div>
            </div>
          ) : empleados.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">No se encontraron empleados</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empleado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Área
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Ingreso
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {empleados.map((empleado) => (
                    <tr key={empleado.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {empleado.nombre} {empleado.apellido}
                        </div>
                        <div className="text-sm text-gray-500">
                          {empleado.nacionalidad}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {empleado.ci}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {empleado.area.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {empleado.cargo.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          empleado.estado === 'activo' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {empleado.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(empleado.fecha_entrada).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;