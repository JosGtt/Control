import { useState, useEffect } from "react";
import { empleadoService, type Empleado } from "../services/api";

// Importar componentes
import Sidebar from "./Layout/Sidebar";
import Header from "./Layout/Header";
import Dashboard from "./Dashboard/Dashboard";
import EmpleadosSection from "./Empleados/EmpleadosSection";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Función para obtener datos de empleados
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

  // Función para manejar búsqueda
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      loadEmpleados(true);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const results = await empleadoService.search(searchTerm);
      setEmpleados(results);
    } catch (err) {
      setError("Error al buscar empleados");
      console.error("Error en búsqueda:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect para cargar datos iniciales
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content Area */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300 ease-in-out`}>
        {/* Header Component */}
        <Header activeSection={activeSection} />

        {/* Content */}
        <main className="p-6">
          {activeSection === "dashboard" && (
            <Dashboard empleados={empleados} setActiveSection={setActiveSection} />
          )}
          
          {activeSection === "empleados" && (
            <EmpleadosSection 
              empleados={empleados}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearch={handleSearch}
              loadEmpleados={loadEmpleados}
              isLoading={isLoading}
              error={error}
            />
          )}

          {/* Otras secciones - mantenemos temporalmente */}
          {activeSection === "registros" && (
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Registros
              </h3>
              <p className="text-gray-600">
                Funcionalidad de registros en desarrollo...
              </p>
            </div>
          )}

          {activeSection === "cargos" && (
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cargos</h3>
              <p className="text-gray-600">
                Funcionalidad de cargos en desarrollo...
              </p>
            </div>
          )}

          {activeSection === "historial" && (
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Historial
              </h3>
              <p className="text-gray-600">
                Funcionalidad de historial en desarrollo...
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}