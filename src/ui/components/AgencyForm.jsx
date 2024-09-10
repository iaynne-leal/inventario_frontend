import React, { useState } from 'react';

const AgencyForm = ({ onClose, onCreateAgency }) => {
  const [nombre, setNombre] = useState('');
  const [especial, setEspecial] = useState(false); // Estado para gestionar si la agencia es especial

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAgency = { 
      nombre_agencia: nombre,
      especial: especial  // Añadir si la agencia es especial o no
    };
    onCreateAgency(newAgency);  // Llamar a la función proporcionada por el padre
  };

  return (
    <div className="fixed inset-0 bg-blue-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h3 className="text-xl font-bold mb-4 text-blue-900">Crear Nueva Agencia</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Nombre de la Agencia"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          
          {/* Checkbox para definir si es especial */}
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
