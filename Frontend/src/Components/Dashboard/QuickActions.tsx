import React from "react";

// Importar iconos
import LupaLogo from "../../assets/lupay";
import AñadirLogo from "../../assets/añadir";
import HistorialLogo from "../../assets/historial";
import OrdenarLogo from "../../assets/ordenar";

interface QuickActionsProps {
  setActiveSection: (section: string) => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  onClick?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ setActiveSection }) => {
  const quickActions: QuickAction[] = [
    {
      id: "search",
      label: "Buscar Empleados",
      icon: LupaLogo,
      color: "#10B981",
      onClick: () => setActiveSection("empleados"),
    },
    {
      id: "add",
      label: "Añadir Empleado",
      icon: AñadirLogo,
      color: "#059669",
    },
    {
      id: "history",
      label: "Ver Historial",
      icon: HistorialLogo,
      color: "#F59E0B",
    },
    {
      id: "report",
      label: "Generar Reporte",
      icon: OrdenarLogo,
      color: "#8B5CF6",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Icon width={24} height={24} fill={action.color} />
              <span className="text-gray-700 text-sm mt-2">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;