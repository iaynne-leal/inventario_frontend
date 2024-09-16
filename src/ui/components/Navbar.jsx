import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserForm from './UserForm';
import DeleteUserModal from './DeleteUserModal';
import AgencyForm from './AgencyForm'; 
import Swal from 'sweetalert2';

const Navbar = ({ onAgencyCreated }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateAgencyModalOpen, setIsCreateAgencyModalOpen] = useState(false); 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setDropdownOpen(false);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setDropdownOpen(false);
  };

  const openCreateAgencyModal = () => {
    setIsCreateAgencyModalOpen(true);
    setDropdownOpen(false);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsCreateAgencyModalOpen(false);
  };

  const handleCreateUser = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/usuarios', userData, {
        headers: {
          'token': token,
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Usuario creado con éxito',
        text: 'El nuevo usuario ha sido creado correctamente.',
      });

      closeModal();
    } catch (err) {
      console.error('Error al crear usuario:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/usuarios/${userId}`, {
        headers: {
          'token': token,
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Usuario eliminado con éxito',
        text: 'El usuario ha sido eliminado correctamente.',
      });

      closeModal();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
  };

  const handleCreateAgency = async (agencyData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/agencias', agencyData, {
        headers: {
          'token': token,
          'Content-Type': 'application/json',
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Agencia creada con éxito',
        text: 'La nueva agencia ha sido creada correctamente.',
      });

      closeModal();

      // Llama a la función para actualizar la lista de agencias
      if (onAgencyCreated) {
        onAgencyCreated();
      }
    } catch (err) {
      console.error('Error al crear agencia:', err);
    if (err.response && err.response.status === 400 && err.response.data.msg === 'Ya existe una agencia con este nombre') {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear agencia',
        text: 'Ya existe una agencia con este nombre. Por favor, elige un nombre diferente.',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear agencia',
        text: 'Ha ocurrido un error al crear la agencia. Por favor, inténtalo de nuevo.',
      });
    }
    }
  };
  
  return (
    <>
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center ">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqtgxcN0rOfpeLREAwpdSoBcolZtTlIciyOQ&s"
            alt="Icono"
            className="h-12 w-15"
          />
          <Link to="/dashboard" className="text-blue-900 ml-5 mr-5 font-bold hover:underline">
            Inicio
          </Link>
          <div className="relative">
            <button onClick={toggleDropdown} className="text-blue-900 font-bold hover:underline">
              Usuarios
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                <button
                  onClick={openCreateModal}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full text-left"
                >
                  Crear Usuario
                </button>
                <button
                  onClick={openDeleteModal}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 w-full text-left"
                >
                  Eliminar Usuario
                </button>
              </div>
            )}
          </div>
          {/* Agregar botón para Agencias */}
          <div className="relative ml-5">
            <button onClick={openCreateAgencyModal} className="text-blue-900 font-bold hover:underline">
              Agencias
            </button>
          </div>
        </div>

        <button onClick={handleLogout} className="text-blue-900 font-bold hover:underline">
          Cerrar Sesión
        </button>
      </nav>

      {/* Modal de creación de usuarios */}
      {isCreateModalOpen && <UserForm onClose={closeModal} onCreateUser={handleCreateUser} />}

      {/* Modal de eliminación de usuarios */}
      {isDeleteModalOpen && <DeleteUserModal onClose={closeModal} onDeleteUser={handleDeleteUser} />}

      {/* Modal de creación de agencias */}
      {isCreateAgencyModalOpen && <AgencyForm onClose={closeModal} onCreateAgency={handleCreateAgency} />}
    </>
  );
};

export default Navbar;
