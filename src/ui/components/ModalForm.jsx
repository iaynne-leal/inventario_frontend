import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ModalForm = ({ closeModal, type, idAgencia }) => {
  const [nombre, setNombre] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (type === 'departamento') {
        await axios.post(`/agencias/${idAgencia}/departamentos`, { nombre_departamento: nombre });
      } else if (type === 'puesto') {
        await axios.post(`/departamentos/${idAgencia}/puestos`, { nombre_puesto: nombre });
      }

      Swal.fire('¡Éxito!', `Nuevo ${type} creado con éxito`, 'success');
      closeModal();
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al crear el registro', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h3 className="text-xl font-bold mb-4">{`Crear Nuevo ${type}`}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder={`Nombre del ${type}`}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-900 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
