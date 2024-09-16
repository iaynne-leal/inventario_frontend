import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const DeleteDepartmentModal = ({ onClose, onDeleteDepartment }) => {
  const [departments, setDepartments] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState('');

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/agencias', {
          headers: {
            'token': token
          }
        });
        setAgencies(response.data.agencias);
      } catch (err) {
        console.error('Error al obtener agencias:', err);
      }
    };

    fetchAgencies();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (selectedAgency) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:8080/departamentos/${selectedAgency}`, {
            headers: {
              'token': token
            }
          });
          setDepartments(response.data);
        } catch (err) {
          console.error('Error al obtener departamentos:', err);
        }
      } else {
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, [selectedAgency]);

  const handleDelete = (departmentId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteDepartment(departmentId);
      }
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blue-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-blue-900">Eliminar Departamento</h2>
        
        <select
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={selectedAgency}
          onChange={(e) => setSelectedAgency(e.target.value)}
        >
          <option value="">Seleccione una agencia</option>
          {agencies.map(agency => (
            <option key={agency.id_agencia} value={agency.id_agencia}>
              {agency.nombre_agencia}
            </option>
          ))}
        </select>

        {departments.length > 0 ? (
          <ul className="mb-4">
            {departments.map(department => (
              <li key={department.id_departamento} className="flex justify-between items-center mb-2">
                <span>{department.nombre_departamento}</span>
                <button 
                  onClick={() => handleDelete(department.id_departamento)} 
                  className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4 text-gray-600">
            {selectedAgency 
              ? "No hay departamentos disponibles para esta agencia." 
              : "Seleccione una agencia para ver sus departamentos."}
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default DeleteDepartmentModal;