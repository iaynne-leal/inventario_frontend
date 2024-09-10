import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ModalForm from './ModalForm'; // Componente para los formularios modales

const AgenciaDetails = ({ idAgencia }) => {
  const [esEspecial, setEsEspecial] = useState(false);
  const [areas, setAreas] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // Puede ser 'departamento' o 'puesto'

  useEffect(() => {
    // Lógica para determinar si la agencia es especial
    axios.get(`/agencias/${idAgencia}`)
      .then((res) => {
        setEsEspecial(res.data.especial);
        if (res.data.especial) {
          // Obtener las áreas de la agencia si es especial
          axios.get(`/agencias/${idAgencia}/areas`).then((response) => {
            setAreas(response.data);
          });
        } else {
          // Obtener los departamentos directamente si no es especial
          axios.get(`/agencias/${idAgencia}/departamentos`).then((response) => {
            setDepartamentos(response.data);
          });
        }
      })
      .catch((err) => {
        console.error('Error al obtener la agencia:', err);
      });
  }, [idAgencia]);

  const handleShowModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <h2>Detalles de Agencia</h2>
      {esEspecial ? (
        // Si la agencia es especial, mostramos las áreas
        <div>
          <h3>Áreas</h3>
          {areas.map((area) => (
            <button
              key={area.id_area}
              onClick={() => axios.get(`/areas/${area.id_area}/departamentos`).then((res) => setDepartamentos(res.data))}
              className="bg-blue-500 text-white p-2 rounded m-2"
            >
              {area.nombre_area}
            </button>
          ))}
          <button onClick={() => handleShowModal('departamento')} className="bg-green-500 text-white p-2 rounded">
            Crear Departamento
          </button>
        </div>
      ) : (
        // Si la agencia no es especial, mostramos directamente los departamentos
        <div>
          <h3>Departamentos</h3>
          {departamentos.map((dep) => (
            <button
              key={dep.id_departamento}
              onClick={() => console.log(`Mostrar puestos del departamento ${dep.nombre_departamento}`)}
              className="bg-blue-500 text-white p-2 rounded m-2"
            >
              {dep.nombre_departamento}
            </button>
          ))}
          <button onClick={() => handleShowModal('departamento')} className="bg-green-500 text-white p-2 rounded">
            Crear Departamento
          </button>
        </div>
      )}
      {departamentos.length > 0 && (
        <div>
          <h3>Puestos</h3>
          {departamentos.map((dep) => (
            <button
              key={dep.id_puesto}
              className="bg-blue-500 text-white p-2 rounded m-2"
            >
              {dep.nombre_puesto}
            </button>
          ))}
          <button onClick={() => handleShowModal('puesto')} className="bg-green-500 text-white p-2 rounded">
            Crear Puesto
          </button>
        </div>
      )}

      {showModal && (
        <ModalForm closeModal={closeModal} type={modalType} idAgencia={idAgencia} />
      )}
    </div>
  );
};

export default AgenciaDetails;
