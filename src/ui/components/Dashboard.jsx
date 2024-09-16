import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DepartmentForm from "./DepartmentForm";
import Swal from "sweetalert2";
import PuestoForm from "./PuestoForm";
import EquipoDetails from "./EquipoDetails";

const Dashboard = ({ shouldUpdateAgencies, onAgenciesUpdated }) => {
  const [agencias, setAgencias] = useState([]);
  const [areas, setAreas] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [selectedAgencia, setSelectedAgencia] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  const [error, setError] = useState("");
  const [selectedPuesto, setSelectedPuesto] = useState(null);
  const [equipo, setEquipo] = useState(null);
  const [isCreateDepartmentModalOpen, setIsCreateDepartmentModalOpen] =
    useState(false);
  const [isCreatePuestoModalOpen, setIsCreatePuestoModalOpen] = useState(false);
  const [view, setView] = useState("agencias");
  const navigate = useNavigate();

  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return null;
    }
    return token;
  };

  const fetchAgencias = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8080/agencias", {
        headers: { token: token },
      });
      setAgencias(response.data.agencias);
    } catch (err) {
      console.error("Error al obtener agencias:", err);
      setError("No se pudieron cargar las agencias. Intenta de nuevo.");
      if (err.response && err.response.status === 401) {
        navigate("/");
      }
    }
  };

  const fetchAreasYDepartamentos = async (agencia) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      if (agencia.especial) {
        const areasResponse = await axios.get(
          `http://localhost:8080/areas/${agencia.id_agencia}`,
          {
            headers: { token: token },
          }
        );
        setAreas(areasResponse.data.areas);
        // No cargar departamentos aquí, esperar a que se seleccione un área
        setDepartamentos([]);
      } else {
        const departamentosResponse = await axios.get(
          `http://localhost:8080/departamentos/${agencia.id_agencia}`,
          {
            headers: { token: token },
          }
        );
        setDepartamentos(departamentosResponse.data);
        setAreas([]);
      }
    } catch (err) {
      console.error("Error al obtener áreas o departamentos:", err);
      setError(
        "No se pudieron cargar las áreas o departamentos. Intenta de nuevo."
      );
    }
  };

  const fetchPuestos = async (departamentoId) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await axios.get(
        `http://localhost:8080/puestos/${departamentoId}`,
        {
          headers: { token: token },
        }
      );
      setPuestos(response.data);
    } catch (err) {
      console.error("Error al obtener puestos:", err);
      setError("No se pudieron cargar los puestos. Intenta de nuevo.");
    }
  };

  useEffect(() => {
    fetchAgencias();
  }, []);

  useEffect(() => {
    if (shouldUpdateAgencies) {
      fetchAgencias();
      onAgenciesUpdated();
    }
  }, [shouldUpdateAgencies, onAgenciesUpdated]);

  const handleAgenciaClick = (agencia) => {
    setSelectedAgencia(agencia);
    setSelectedArea(null);
    fetchAreasYDepartamentos(agencia);
    setView(agencia.especial ? "areas" : "departamentos");
  };

  const handleAreaClick = async (area) => {
    setSelectedArea(area);
    const token = getAuthToken();
    if (!token || !selectedAgencia) return;

    try {
      const departamentosResponse = await axios.get(
        `http://localhost:8080/departamentos/${selectedAgencia.id_agencia}/${area.id_area}`,
        {
          headers: { token: token },
        }
      );
      setDepartamentos(departamentosResponse.data);
      setView("departamentos");
    } catch (err) {
      console.error("Error al obtener departamentos del área:", err);
      setError(
        "No se pudieron cargar los departamentos del área. Intenta de nuevo."
      );
      setDepartamentos([]);
    }
  };

  const handleDepartamentoClick = (departamento) => {
    setSelectedDepartamento(departamento);
    fetchPuestos(departamento.id_departamento);
    setView("puestos");
  };

  const handlePuestoClick = async (puesto) => {
    setSelectedPuesto(puesto);
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get(
        `http://localhost:8080/equipo/${puesto.id_puesto}`,
        {
          headers: { 'token': token },
        }
      );
      setEquipo(response.data);
    } catch (err) {
      console.error("Error al obtener equipo:", err);
      if (
        err.response &&
        err.response.data.msg === "Departamento no encontrado para este puesto"
      ) {
        setError(
          "No se pudo encontrar el departamento asociado a este puesto. Por favor, verifica la configuración del puesto."
        );
      } else {
        setError(
          "No se pudo obtener la información del equipo. Intenta de nuevo."
        );
      }
      setEquipo(null);
    }
    setView("equipo");
  };
  const handleCreateDepartment = async (departmentData) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      await axios.post("http://localhost:8080/departamentos", departmentData, {
        headers: { token: token },
      });

      // Actualizar la lista de departamentos
      if (selectedArea) {
        await handleAreaClick(selectedArea);
      } else {
        await fetchAreasYDepartamentos(selectedAgencia);
      }

      setIsCreateDepartmentModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Departamento creado con éxito",
        text: "El nuevo departamento ha sido creado correctamente.",
      });
    } catch (err) {
      console.error("Error al crear departamento:", err);
      setError("No se pudo crear el departamento. Intenta de nuevo.");
    }
  };

  const handleCreatePuesto = async (puestoData) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      await axios.post("http://localhost:8080/puestos", puestoData, {
        headers: { token: token },
      });

      // Actualizar la lista de puestos
      await fetchPuestos(selectedDepartamento.id_departamento);

      setIsCreatePuestoModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Puesto creado con éxito",
        text: "El nuevo puesto ha sido creado correctamente.",
      });
    } catch (err) {
      console.error("Error al crear puesto:", err);
      setError("No se pudo crear el puesto. Intenta de nuevo.");
    }
  };

  const handleCreateEquipo = async (equipoData) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      await axios.post("http://localhost:8080/equipo", equipoData, {
        headers: { token: token },
      });
      // Actualizar el equipo después de crearlo
      const response = await axios.get(
        `http://localhost:8080/equipo/${selectedPuesto.id_puesto}`,
        {
          headers: { token: token },
        }
      );
      setEquipo(response.data);
      Swal.fire({
        icon: "success",
        title: "Equipo creado con éxito",
        text: "El nuevo equipo ha sido creado correctamente.",
      });
    } catch (err) {
      console.error("Error al crear equipo:", err);
      Swal.fire({
        icon: "error",
        title: "Error al crear equipo",
        text: "No se pudo crear el equipo. Por favor, intente de nuevo.",
      });
    }
  };

  const renderAgencias = () => (
    <div>
      <h2 className="text-xl font-bold mb-4 text-blue-900">Agencias</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-12">
        {agencias.map((agencia) => (
          <button
            key={agencia.id_agencia}
            onClick={() => handleAgenciaClick(agencia)}
            className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {agencia.nombre_agencia}
          </button>
        ))}
      </div>
    </div>
  );

  const renderAreas = () => (
    <div>
      <h2 className="text-xl font-bold mb-4 text-blue-900">
        Áreas de {selectedAgencia?.nombre_agencia}
      </h2>
      <button
        onClick={() => setView("agencias")}
        className="mb-4 text-blue-500 hover:text-blue-700"
      >
        ← Volver a Agencias
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-12">
        {areas.map((area) => (
          <button
            key={area.id_area}
            onClick={() => handleAreaClick(area)}
            className="bg-blue-900 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {area.nombre_area}
          </button>
        ))}
      </div>
    </div>
  );

  const renderDepartamentos = () => (
    <div>
      <h2 className="text-xl font-bold mb-4 text-blue-900">
        {selectedArea
          ? `Departamentos de ${selectedArea.nombre_area}`
          : `Departamentos de ${selectedAgencia.nombre_agencia}`}
      </h2>
      <button
        onClick={() => setView(selectedAgencia.especial ? "areas" : "agencias")}
        className="mb-4 text-blue-500 hover:text-blue-700"
      >
        ← Volver a {selectedAgencia.especial ? "Áreas" : "Agencias"}
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departamentos.map((departamento) => (
          <button
            key={departamento.id_departamento}
            onClick={() => handleDepartamentoClick(departamento)}
            className="bg-blue-900 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {departamento.nombre_departamento}
          </button>
        ))}
        <button
          onClick={() => setIsCreateDepartmentModalOpen(true)}
          className="bg-green-600 hover:bg-green-400 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
        >
          <span className="text-2xl mr-2">+</span> Agregar Departamento
        </button>
      </div>
    </div>
  );

  const renderPuestos = () => (
    <div>
      <h2 className="text-xl font-bold mb-4 text-blue-900">
        Puestos de {selectedDepartamento.nombre_departamento}
      </h2>
      <button
        onClick={() => setView("departamentos")}
        className="mb-4 text-blue-500 hover:text-blue-700"
      >
        ← Volver a Departamentos
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {puestos.map((puesto) => (
          <button
            key={puesto.id_puesto}
            onClick={() => handlePuestoClick(puesto)}
            className="bg-blue-900 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {puesto.nombre_puesto}
          </button>
        ))}
        <button
          onClick={() => setIsCreatePuestoModalOpen(true)}
          className="bg-green-600 hover:bg-green-400 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
        >
          <span className="text-2xl mr-2">+</span> Agregar Puesto
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      

      {view === "agencias" && renderAgencias()}
      {view === "areas" && renderAreas()}
      {view === "departamentos" && renderDepartamentos()}
      {view === "puestos" && renderPuestos()}
      {view === "equipo" && (
        <EquipoDetails
          puesto={selectedPuesto}
          equipo={equipo}
          onCreateEquipo={handleCreateEquipo}
          onBack={() => setView("puestos")}
        />
      )}

      {isCreateDepartmentModalOpen && (
        <DepartmentForm
          onClose={() => setIsCreateDepartmentModalOpen(false)}
          onCreateDepartment={handleCreateDepartment}
          agenciaId={selectedAgencia?.id_agencia}
          areaId={selectedArea?.id_area}
          isAgenciaEspecial={selectedAgencia?.especial}
        />
      )}

      {isCreatePuestoModalOpen && (
        <PuestoForm
          onClose={() => setIsCreatePuestoModalOpen(false)}
          onCreatePuesto={handleCreatePuesto}
          departamentoId={selectedDepartamento?.id_departamento}
        />
      )}
    </div>
  );
};
export default Dashboard;
