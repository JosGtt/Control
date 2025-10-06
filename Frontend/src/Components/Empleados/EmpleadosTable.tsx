import React from "react";
import { type Empleado } from "../../services/api";

// Importar iconos
import UsuarioLogo from "../../assets/usario";
import AñadirLogo from "../../assets/añadir";
import EditarLogo from "../../assets/editar";
import RemoverLogo from "../../assets/remover";

interface EmpleadosTableProps {
  empleados: Empleado[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (empleado: Empleado) => void;
  onDelete: (empleado: Empleado) => void;
}

const EmpleadosTable: React.FC<EmpleadosTableProps> = ({ empleados, isLoading, onAdd, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Empleados (0)
          </h2>
          <button 
            onClick={onAdd}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2"
          >
            <AñadirLogo width={16} height={16} fill="white" />
            Nuevo Empleado
          </button>
        </div>
        <div className="p-8 text-center">
          <div className="text-gray-500">Cargando empleados...</div>
        </div>
      </div>
    );
  }

  if (empleados.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Empleados (0)
          </h2>
          <button 
            onClick={onAdd}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2"
          >
            <AñadirLogo width={16} height={16} fill="white" />
            Nuevo Empleado
          </button>
        </div>
        <div className="p-8 text-center">
          <div className="text-gray-500">No se encontraron empleados</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Empleados ({empleados.length})
        </h2>
        <button 
          onClick={onAdd}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2"
        >
          <AñadirLogo width={16} height={16} fill="white" />
          Nuevo Empleado
        </button>
      </div>

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
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {empleados.map((empleado) => (
              <tr key={empleado.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-emerald-100 p-2 rounded-full mr-3">
                      <UsuarioLogo width={16} height={16} fill="#059669" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {empleado.nombre} {empleado.apellido}
                      </div>
                      <div className="text-sm text-gray-500">
                        {empleado.nacionalidad}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {empleado.ci}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {empleado.area.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {empleado.cargo.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    empleado.estado === 'activo' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : empleado.estado === 'finalizado'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {empleado.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onEdit(empleado)}
                      className="bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700"
                      title="Editar empleado"
                    >
                      <EditarLogo width={14} height={14} fill="white" />
                    </button>
                    <button 
                      onClick={() => onDelete(empleado)}
                      className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                      title="Eliminar empleado"
                    >
                      <RemoverLogo width={14} height={14} fill="white" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmpleadosTable;