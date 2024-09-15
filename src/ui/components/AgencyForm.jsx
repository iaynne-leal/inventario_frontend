import React, { useState } from 'react';
import axios from 'axios';

const AgencyForm = ({ onClose, onCreateAgency }) => {
  const [nombre, setNombre] = useState('');
  const [especial, setEspecial] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim()) {
      setError('El nombre de la agencia es requerido');
      return;
    }

    try {
      // Verificar si ya existe una agencia con el mismo nombre
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/agencias`, {
        headers: { 'token': token }
      });
      const agencias = response.data.agencias;
      
      if (agencias.some(agencia => agencia.nombre_agencia.toLowerCase() === nombre.toLowerCase())) {
        setError('Ya existe una agencia con este nombre');
        return;
      }

      const newAgency = { 
        nombre_agencia: nombre,
        especial: especial
      };
      onCreateAgency(newAgency);
    } catch (error) {
      console.error('Error al verificar agencias:', error);
      setError('Error al verificar el nombre de la agencia. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h3 className="text-xl font-bold mb-4 text-blue-900">Crear Nueva Agencia</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Nombre de la Agencia"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={especial}
                onChange={(e) => setEspecial(e.target.checked)}
              />
              <span className="ml-2">¿Agencia especial?</span>
            </label>
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgencyForm;