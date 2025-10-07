import React from "react";
import { type Empleado } from "../../services/api";

// Importar iconos
import UsuarioLogo from "../../assets/usario";
import CargoLogo from "../../assets/cargo";
import UserCheckLogo from "../../assets/userCheck";
import UserXLogo from "../../assets/userX";

interface StatsCardsProps {
  empleados: Empleado[];
}

interface StatCard {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
}

const StatsCards: React.FC<StatsCardsProps> = ({ empleados }) => {
  // Estadísticas del dashboard
  const stats: StatCard[] = [
    {
      title: "Total Empleados",
      value: empleados.length,
      icon: UsuarioLogo,
      color: "bg-emerald-600",
    },
    {
      title: "Empleados Activos",
      value: empleados.filter(e => e.estado === 'activo').length,
      icon: UserCheckLogo,
      color: "bg-emerald-600",
    },
    {
      title: "Empleados Finalizados",
      value: empleados.filter(e => e.estado === 'finalizado').length,
      icon: UserXLogo,
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon width={24} height={24} fill="white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;