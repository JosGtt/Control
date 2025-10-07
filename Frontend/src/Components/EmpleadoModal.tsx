import React, { useState, useEffect } from "react";
import { type Empleado, type EmpleadoFormData, type Area, type Cargo, areaService, cargoService } from "../services/api";
import CerrarLogo from "../assets/cerrar";

interface EmpleadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (empleado: EmpleadoFormData) => Promise<void>;
  empleado?: Empleado | null;
  title: string;
}

const EmpleadoModal: React.FC<EmpleadoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  empleado,
  title,
}) => {
  const [formData, setFormData] = useState<EmpleadoFormData>({
    nombre: "",
    apellido: "",
    ci: "",
    nacionalidad: "V",
    fecha_entrada: "",
    fecha_salida: "",
    estado: "activo",
    observaciones: "",
    area_id: 0,
    cargo_id: 0,
  });

  const [areas, setAreas] = useState<Area[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Cargar datos iniciales
  useEffect(() => {
    if (isOpen) {
      console.log("🚀 Modal abierto, cargando datos iniciales...");
      loadAreas();
      // También cargar todos los cargos para debug

    }
  }, [isOpen]);



  // Cargar datos del empleado si estamos editando
  useEffect(() => {
    if (empleado) {
      console.log("Empleado a editar:", empleado);
      console.log("Area del empleado:", empleado.area);
      setFormData({
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        ci: empleado.ci,
        nacionalidad: empleado.nacionalidad,
        fecha_entrada: empleado.fecha_entrada.split('T')[0], // Formatear fecha para input date
        fecha_salida: empleado.fecha_salida ? empleado.fecha_salida.split('T')[0] : "",
        estado: empleado.estado,
        observaciones: empleado.observaciones || "",
        area_id: empleado.area.id,
        cargo_id: empleado.cargo.id,
      });
      // Cargar cargos del área del empleado
      loadCargosByArea(empleado.area.id);
    } else {
      // Resetear formulario para nuevo empleado
      setFormData({
        nombre: "",
        apellido: "",
        ci: "",
        nacionalidad: "",
        fecha_entrada: new Date().toISOString().split('T')[0],
        fecha_salida: "",
        estado: "activo",
        observaciones: "",
        area_id: 0,
        cargo_id: 0,
      });
      setCargos([]);
    }
  }, [empleado]);

  // Cargar cargos cuando cambia el área
  useEffect(() => {
    if (formData.area_id > 0) {
      loadCargosByArea(formData.area_id);
    } else {
      setCargos([]);
    }
  }, [formData.area_id]);

  const loadAreas = async () => {
    try {
      console.log("🔄 Intentando cargar áreas...");
      const areasData = await areaService.getAll();
      console.log("✅ Áreas cargadas exitosamente:", areasData);
      setAreas(areasData);
    } catch (error: any) {
      console.error("❌ Error al cargar áreas:", error);
      console.error("Detalles del error:", error.response?.data);
      console.error("Status del error:", error.response?.status);
    }
  };

  const loadCargosByArea = async (areaId: number) => {
    try {
      const cargosData = await cargoService.getByArea(areaId);
      setCargos(cargosData);
      
      // Si estamos creando un nuevo empleado, limpiar el cargo seleccionado
      if (!empleado) {
        setFormData(prev => ({ ...prev, cargo_id: 0 }));
      } else {
        // Si estamos editando, verificar si el cargo actual pertenece a la nueva área
        const cargoExisteEnArea = cargosData.some(cargo => cargo.id === empleado.cargo.id);
        if (!cargoExisteEnArea) {
          setFormData(prev => ({ ...prev, cargo_id: 0 }));
        }
      }
    } catch (error) {
      console.error("Error al cargar cargos:", error);
      setCargos([]);
      setFormData(prev => ({ ...prev, cargo_id: 0 }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!formData.apellido.trim()) newErrors.apellido = "El apellido es requerido";
    if (!formData.ci.trim()) newErrors.ci = "La cédula es requerida";
    if (!formData.nacionalidad.trim()) newErrors.nacionalidad = "La nacionalidad es requerida";
    if (!formData.fecha_entrada) newErrors.fecha_entrada = "La fecha de entrada es requerida";
    if (formData.area_id === 0) newErrors.area_id = "Debe seleccionar un área";
    if (formData.cargo_id === 0) newErrors.cargo_id = "Debe seleccionar un cargo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error al guardar empleado:", error);
      setErrors({ general: "Error al guardar el empleado" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md border border-white/20 shadow-xl rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <CerrarLogo width={20} height={20} fill="currentColor" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.nombre ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ingrese el nombre"
              />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.apellido ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ingrese el apellido"
              />
              {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
            </div>

            {/* Nacionalidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nacionalidad *
              </label>
              <input
                type="text"
                name="nacionalidad"
                value={formData.nacionalidad}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.nacionalidad ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ejemplo: Boliviana, Peruana, Colombiana..."
              />
              {errors.nacionalidad && <p className="text-red-500 text-xs mt-1">{errors.nacionalidad}</p>}
            </div>

            {/* Cédula */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cédula de Identidad *
              </label>
              <input
                type="text"
                name="ci"
                value={formData.ci}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.ci ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ejemplo: 12345678"
              />
              {errors.ci && <p className="text-red-500 text-xs mt-1">{errors.ci}</p>}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado *
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="activo">Activo</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>

            {/* Área */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Área *
              </label>
              <select
                name="area_id"
                value={formData.area_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.area_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value={0}>Seleccione un área</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>{area.nombre}</option>
                ))}
              </select>
              {errors.area_id && <p className="text-red-500 text-xs mt-1">{errors.area_id}</p>}
            </div>

            {/* Cargo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo *
              </label>
              <select
                name="cargo_id"
                value={formData.cargo_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.cargo_id ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={cargos.length === 0}
              >
                <option value={0}>Seleccione un cargo</option>
                {cargos.map(cargo => (
                  <option key={cargo.id} value={cargo.id}>{cargo.nombre}</option>
                ))}
              </select>
              {errors.cargo_id && <p className="text-red-500 text-xs mt-1">{errors.cargo_id}</p>}
            </div>

            {/* Fecha de Entrada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Entrada *
              </label>
              <input
                type="date"
                name="fecha_entrada"
                value={formData.fecha_entrada}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.fecha_entrada ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.fecha_entrada && <p className="text-red-500 text-xs mt-1">{errors.fecha_entrada}</p>}
            </div>

            {/* Fecha de Salida */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Salida
              </label>
              <input
                type="date"
                name="fecha_salida"
                value={formData.fecha_salida}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Observaciones adicionales..."
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpleadoModal;