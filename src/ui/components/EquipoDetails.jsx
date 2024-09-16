import axios from "axios";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const EquipoDetails = ({ puesto, onBack }) => {
  const [activeTab, setActiveTab] = useState("hardware");
  const [equipo, setEquipo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEquipo, setEditedEquipo] = useState(null);

  useEffect(() => {
    fetchEquipo();
  }, [puesto.id_puesto]);

  const fetchEquipo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }
      const response = await axios.get(
        `http://localhost:8080/equipo/${puesto.id_puesto}`,
        {
          headers: {
            token: token,
          },
        }
      );
      if (response.data && response.data.hardware && response.data.software) {
        setEquipo(response.data);
        setEditedEquipo(response.data);
      } else {
        setEquipo(null);
        setEditedEquipo(null);
      }
    } catch (error) {
      console.error("Error al obtener equipo:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.msg || error.message || "No se pudo obtener la información del equipo. Intenta de nuevo.",
      });
      setEquipo(null);
      setEditedEquipo(null);
    }
  };

  const handleInputChange = (category, field, value) => {
    setEditedEquipo((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleEditEquipo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }
      await axios.put(
        `http://localhost:8080/equipo/${puesto.id_puesto}`,
        {
          hardware: editedEquipo.hardware,
          software: editedEquipo.software,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      setIsEditing(false);
      await fetchEquipo();
      Swal.fire({
        icon: "success",
        title: "Equipo actualizado con éxito",
        text: "El equipo ha sido actualizado correctamente.",
      });
    } catch (error) {
      console.error("Error al actualizar equipo:", error);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar equipo",
        text: error.response?.data?.msg || error.message || "Hubo un error al actualizar el equipo. Por favor, intente de nuevo.",
      });
    }
  };

  const renderFields = (data, category, editable = false) => {
    return Object.entries(data).map(([field, value]) => (
      <tr key={field}>
        <td className="border border-gray-300 p-2 font-semibold">
          {field.replace("_", " ").toUpperCase()}
        </td>
        <td className="border border-gray-300 p-2">
          {editable ? (
            category === "hardware" && field === "escritorio_laptop" ? (
              <select
                value={editedEquipo[category][field]}
                onChange={(e) =>
                  handleInputChange(category, field, e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="escritorio">Escritorio</option>
                <option value="laptop">Laptop</option>
              </select>
            ) : category === "software" &&
              field !== "sistema_operativo" &&
              field !== "navegadores" ? (
              <select
                value={editedEquipo[category][field]}
                onChange={(e) =>
                  handleInputChange(category, field, e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="licencia">Licencia</option>
                <option value="sin licencia">Sin licencia</option>
                <option value="no instalado">No instalado</option>
              </select>
            ) : (
              <input
                type="text"
                value={editedEquipo[category][field]}
                onChange={(e) =>
                  handleInputChange(category, field, e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            )
          ) : (
            value
          )}
        </td>
      </tr>
    ));
  };

  const renderEquipoTable = (data, category, editable = false) => (
    <table className="w-full border-collapse mb-4">
      <thead>
        <tr className="bg-blue-900">
          <th className="border border-gray-300 p-2 text-white">Campo</th>
          <th className="border border-gray-300 p-2 text-white">Valor</th>
        </tr>
      </thead>
      <tbody>{renderFields(data, category, editable)}</tbody>
    </table>
  );

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <button
        onClick={onBack}
        className="mb-4 text-blue-900 hover:text-blue-700"
      >
        ← Volver a Puestos
      </button>
      <h2 className="text-2xl font-bold mb-4 text-blue-900">
        Equipo para el puesto: {puesto.nombre_puesto}
      </h2>
  
      {equipo && (
        <div className="mb-4">
          <button
            className={`mr-2 px-4 py-2 rounded-t-lg ${
              activeTab === "hardware" ? "bg-blue-900 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("hardware")}
          >
            Hardware
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === "software" ? "bg-blue-900 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("software")}
          >
            Software
          </button>
        </div>
      )}
  
      <div className="bg-white border rounded-b-lg p-4">
        {equipo ? (
          <div>
            {activeTab === "hardware" && (
              <>
                <h3 className="text-lg font-semibold mb-2">Hardware</h3>
                {renderEquipoTable(isEditing ? editedEquipo.hardware : equipo.hardware, "hardware", isEditing)}
              </>
            )}
            {activeTab === "software" && (
              <>
                <h3 className="text-lg font-semibold mb-2">Software</h3>
                {renderEquipoTable(isEditing ? editedEquipo.software : equipo.software, "software", isEditing)}
              </>
            )}
            {isEditing ? (
              <div className="mt-4">
                <button
                  onClick={handleEditEquipo}
                  className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedEquipo(equipo);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Editar Equipo
              </button>
            )}
          </div>
        ) : (
          <div>
            <p className="mb-4">No hay equipo asignado a este puesto.</p>
            <button
              onClick={() => {}}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Crear Equipo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipoDetails;