// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [agencias, setAgencias] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgencias = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/'); // Redirige al login si no hay token
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/agencias', {
          headers: {
            'token': token
          }
        });

        setAgencias(response.data.agencias);
      } catch (err) {
        console.error('Error al obtener agencias:', err);
        setError('No se pudieron cargar las agencias. Intenta de nuevo.');
        if (err.response && err.response.status === 401) {
          navigate('/'); // Redirige al login si el token es inválido
        }
      }
    };

    fetchAgencias();
  }, [navigate]);

  const handleAgenciaClick = (agencia) => {
   
    console.log(`Agencia seleccionada: ${agencia.nombre_agencia}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Agencias</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
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
};

export default Dashboard;
