import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        usuario,
        contrasenia,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        window.location.href = '/dashboard'; // Redirige a la página principal
      }
    } catch (error) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="flex min-h-screen">
      
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center">
        <img 
          src='https://sicov.micoopecoban.com/assets/images/Cooperativa.jpg' 
          alt="Cooperativa" 
          className="w-full h-full object-cover" 
        />
      </div>
      {/* Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-100">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-900">Ingrese a su cuenta</h2>
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className="mb-6">
              <input
                className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="usuario"
                type="text"
                placeholder="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <input
                className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="********"
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded-xl focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Ingresar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
