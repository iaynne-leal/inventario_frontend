import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const EquipoDetails = ({ puesto, onCreateEquipo, onBack }) => {
  const [activeTab, setActiveTab] = useState('hardware');
  const [equipo, setEquipo] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newEquipo, setNewEquipo] = useState({
    hardware: {
      codigo_contable: '',
      marca: '',
      escritorio_laptop: 'escritorio',
      almacenamiento: '',
      motherboard: '',
      procesador: '',
      frecuencia: '',
      nucleos: '',
      hilos: '',
      arquitectura: '',
      gpu: '',
      ram: '',
      ssd: '',
      ssd2: ''
    },
    software: {
      sistema_operativo: '',
      winrar: 'no instalado',
      adobe_acrobat: 'no instalado',
      crystaldesk: 'no instalado',
      eset: 'no instalado',
      navegadores: '',
      cpu_z: 'no instalado',
      microsoft_office: 'no instalado',
      topaz: 'no instalado',
      sparck: 'no instalado',
      tally_dascom: 'no instalado',
      ultra_vnc: 'no instalado',
      autocad: 'no instalado',
      anydesk: 'no instalado',
      google_earth: 'no instalado',
      drivereasy: 'no instalado',
      nitropro: 'no instalado',
      brother_ads: 'no instalado',
      obs_studio: 'no instalado',
      zoom: 'no instalado',
      putty: 'no instalado',
      epson: 'no instalado',
      kyocera: 'no instalado',
      adobe_photoshop: 'no instalado',
      adobe_lightroom: 'no instalado',
      batery_alarm_analytics: 'no instalado'
    }
  });

  useEffect(() => {
    fetchEquipo();
  }, [puesto.id_puesto]);

  const fetchEquipo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      const response = await axios.get(`http://localhost:3000/equipo/${puesto.id_puesto}`, {
        headers: {
          'token': token
        }
      });
      if (response.data) {
        setEquipo(response.data);
      } else {
        setEquipo(null);
      }
    } catch (error) {
      console.error('Error al obtener equipo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo obtener la información del equipo. Intenta de nuevo.',
      });
    }
  };

  const handleInputChange = (category, field, value) => {
    setNewEquipo(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleCreateEquipo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      await axios.post('http://localhost:3000/equipo', {
        id_puesto: puesto.id_puesto,
        hardware: newEquipo.hardware,
        software: newEquipo.software
      }, {
        headers: {
          'token': token
        }
      });
      setIsCreating(false);
      await fetchEquipo();
      Swal.fire({
        icon: 'success',
        title: 'Equipo creado con éxito',
        text: 'El nuevo equipo ha sido creado correctamente.',
      });
    } catch (error) {
      console.error('Error al crear equipo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al crear equipo',
        text: error.response?.data?.msg || error.message || 'Hubo un error al crear el equipo. Por favor, intente de nuevo.',
      });
    }
  };

  const renderFields = (data, category, editable = false) => {
    return Object.entries(data).map(([field, value]) => (
      <tr key={field}>
        <td className="border border-gray-300 p-2 font-semibold">{field.replace('_', ' ').toUpperCase()}</td>
        <td className="border border-gray-300 p-2">
          {editable ? (
            category === 'hardware' && field === 'escritorio_laptop' ? (
              <select
                value={newEquipo[category][field]}
                onChange={(e) => handleInputChange(category, field, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="escritorio">Escritorio</option>
                <option value="laptop">Laptop</option>
              </select>
            ) : category === 'software' && field !== 'sistema_operativo' && field !== 'navegadores' ? (
              <select
                value={newEquipo[category][field]}
                onChange={(e) => handleInputChange(category, field, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="licencia">Licencia</option>
                <option value="sin licencia">Sin licencia</option>
                <option value="no instalado">No instalado</option>
              </select>
            ) : (
              <input
                type="text"
                value={newEquipo[category][field]}
                onChange={(e) => handleInputChange(category, field, e.target.value)}
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
        <tr className="bg-gray-100">
          <th className="border border-gray-300 p-2">Campo</th>
          <th className="border border-gray-300 p-2">Valor</th>
        </tr>
      </thead>
      <tbody>
        {renderFields(data, category, editable)}
      </tbody>
    </table>
  );

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <button onClick={onBack} className="mb-4 text-blue-500 hover:text-blue-700">
        ← Volver a Puestos
      </button>
      <h2 className="text-2xl font-bold mb-4 text-blue-900">
        Equipo para el puesto: {puesto.nombre_puesto}
      </h2>

      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded-t-lg ${activeTab === 'hardware' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('hardware')}
        >
          Hardware
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg ${activeTab === 'software' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('software')}
        >
          Software
        </button>
      </div>

      <div className="bg-white border rounded-b-lg p-4">
        {equipo ? (
          <div>
            {activeTab === 'hardware' && (
              <>
                <h3 className="text-lg font-semibold mb-2">Hardware</h3>
                {renderEquipoTable(equipo.hardware, 'hardware')}
              </>
            )}
            {activeTab === 'software' && (
              <>
                <h3 className="text-lg font-semibold mb-2">Software</h3>
                {renderEquipoTable(equipo.software, 'software')}
              </>
            )}
          </div>
        ) : isCreating ? (
          <form onSubmit={handleCreateEquipo}>
            <div className="mb-4">
              {activeTab === 'hardware' && (
                <>
                  <h3 className="text-lg font-semibold mb-2">Hardware</h3>
                  {renderEquipoTable(newEquipo.hardware, 'hardware', true)}
                </>
              )}
              {activeTab === 'software' && (
                <>
                  <h3 className="text-lg font-semibold mb-2">Software</h3>
                  {renderEquipoTable(newEquipo.software, 'software', true)}
                </>
              )}
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Crear Equipo
            </button>
          </form>
        ) : (
          <div>
            <p className="mb-4">No hay equipo asignado a este puesto.</p>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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