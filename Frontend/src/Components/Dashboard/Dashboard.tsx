import React from "react";
import { type Empleado } from "../../services/api";
import StatsCards from "./StatsCards";
import QuickActions from "./QuickActions";

interface DashboardProps {
  empleados: Empleado[];
  setActiveSection: (section: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ empleados, setActiveSection }) => {
  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <StatsCards empleados={empleados} />

      {/* Acciones rápidas */}
      <QuickActions setActiveSection={setActiveSection} />
    </div>
  );
};

export default Dashboard;