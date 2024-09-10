import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const DeleteUserModal = ({ onClose, onDeleteUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/usuarios', {
          headers: {
            'x-token': token
          }
        });
        setUsers(response.data.usuarios);
      } catch (err) {
        console.error('Error al obtener usuarios:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = (userId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteUser(userId);
      }
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blue-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-blue-900">Eliminar Usuario</h2>
        <ul className="mb-4">
          {users.map(user => (
            <li key={user.id_usuario} className="flex justify-between items-center mb-2">
              <span>{user.usuario}</span>
              <button 
                onClick={() => handleDelete(user.id_usuario)} 
                className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
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

export default DeleteUserModal;
