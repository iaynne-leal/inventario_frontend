import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Cambia esto a la URL de tu backend

export const getAgencias = async () => {
  try {
    const response = await axios.get(`${API_URL}/agencias`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener agencias:", error);
    throw error;
  }
};
