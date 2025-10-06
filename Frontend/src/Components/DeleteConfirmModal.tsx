import React from "react";
import CerrarLogo from "../assets/cerrar";
import RemoverLogo from "../assets/remover";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  empleadoNombre: string;
  loading: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  empleadoNombre,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md border border-white/20 shadow-xl rounded-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Confirmar Eliminación</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            disabled={loading}
          >
            <CerrarLogo width={20} height={20} fill="currentColor" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <RemoverLogo width={24} height={24} fill="#DC2626" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">¿Está seguro?</h3>
              <p className="text-gray-600">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">
            Está a punto de eliminar al empleado <strong>{empleadoNombre}</strong>. 
            Todos sus datos serán eliminados permanentemente.
          </p>

          {/* Botones */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;