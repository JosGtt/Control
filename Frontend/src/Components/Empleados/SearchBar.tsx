import React from "react";

// Importar iconos
import LupaLogo from "../../assets/lupay";
import FiltroLogo from "../../assets/filtro";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onLoadAll: () => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  onLoadAll,
  isLoading,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <form onSubmit={onSearch} className="flex gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LupaLogo width={20} height={20} fill="#6B7280" />
          </div>
          <input
            type="text"
            placeholder="Buscar empleados por nombre, apellido, CI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
        >
          <LupaLogo width={16} height={16} fill="white" />
          Buscar
        </button>
        <button
          type="button"
          onClick={onLoadAll}
          className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 flex items-center gap-2 border border-gray-300"
        >
          <FiltroLogo width={16} height={16} fill="currentColor" />
          Todos
        </button>
      </form>
    </div>
  );
};

export default SearchBar;