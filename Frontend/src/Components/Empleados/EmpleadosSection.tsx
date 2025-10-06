import React, { useState } from "react";
import { type Empleado, type EmpleadoFormData, empleadoService } from "../../services/api";
import SearchBar from "./SearchBar";
import EmpleadosTable from "./EmpleadosTable";
import EmpleadoModal from "../EmpleadoModal";
import DeleteConfirmModal from "../DeleteConfirmModal";

interface EmpleadosSectionProps {
  empleados: Empleado[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  loadEmpleados: (showErrorOnFail?: boolean) => void;
  isLoading: boolean;
  error: string;
}

const EmpleadosSection: React.FC<EmpleadosSectionProps> = ({
  empleados,
  searchTerm,
  setSearchTerm,
  handleSearch,
  loadEmpleados,
  isLoading,
  error,
}) => {
  // Estados para los modales
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Funciones para manejar las acciones
  const handleAdd = () => {
    setSelectedEmpleado(null);
    setShowModal(true);
  };

  const handleEdit = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setShowModal(true);
  };

  const handleDelete = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setShowDeleteModal(true);
  };

  const handleSaveEmpleado = async (formData: EmpleadoFormData) => {
    setModalLoading(true);
    try {
      if (selectedEmpleado) {
        // Editar empleado existente
        await empleadoService.update(selectedEmpleado.id, formData);
      } else {
        // Crear nuevo empleado
        await empleadoService.create(formData);
      }
      
      // Recargar la lista de empleados
      loadEmpleados(true);
      setShowModal(false);
      setSelectedEmpleado(null);
    } catch (error) {
      console.error("Error al guardar empleado:", error);
      throw error; // Permitir que el modal maneje el error
    } finally {
      setModalLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmpleado) return;
    
    setModalLoading(true);
    try {
      await empleadoService.delete(selectedEmpleado.id);
      
      // Recargar la lista de empleados
      loadEmpleados(true);
      setShowDeleteModal(false);
      setSelectedEmpleado(null);
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmpleado(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedEmpleado(null);
  };

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
        onLoadAll={() => loadEmpleados(true)}
        isLoading={isLoading}
      />

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Lista de empleados */}
      <EmpleadosTable 
        empleados={empleados} 
        isLoading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal para agregar/editar empleado */}
      <EmpleadoModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveEmpleado}
        empleado={selectedEmpleado}
        title={selectedEmpleado ? "Editar Empleado" : "Nuevo Empleado"}
      />

      {/* Modal de confirmación para eliminar */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        empleadoNombre={selectedEmpleado ? `${selectedEmpleado.nombre} ${selectedEmpleado.apellido}` : ""}
        loading={modalLoading}
      />
    </div>
  );
};

export default EmpleadosSection;