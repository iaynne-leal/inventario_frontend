import React, { useState } from 'react';
import axios from 'axios';

const DepartmentForm = ({ onClose, onCreateDepartment, agenciaId, areaId, isAgenciaEspecial }) => {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim()) {
      setError('El nombre del departamento es requerido');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/departamentos/${agenciaId}`, {
        headers: { 'token': token }
      });
      const departamentos = response.data;
      
      if (departamentos.some(dep => dep.nombre_departamento.toLowerCase() === nombre.toLowerCase())) {
        setError('Ya existe un departamento con este nombre en esta agencia');
        return;
      }

      const newDepartment = { 
        nombre_departamento: nombre,
        id_agencia: agenciaId,
        ...(isAgenciaEspecial ? { id_area: areaId } : {})
      };
      await onCreateDepartment(newDepartment);
      setNombre('');  // Limpiar el campo después de crear
    } catch (error) {
      console.error('Error al verificar departamentos:', error);
      setError('Error al verificar el nombre del departamento. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h3 className="text-xl font-bold mb-4 text-blue-900">Crear Nuevo Departamento</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Nombre del Departamento"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

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

export default DepartmentForm;