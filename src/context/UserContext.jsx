import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

// Provider del contexto
export const UserProvider = ({ children }) => {
  // Estado para almacenar el nombre de usuario
  const [user, setUser] = useState(localStorage.getItem('username') || null);
  // Estado para verificar si el usuario es administrador
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  // URL de las variables de entorno de Vite
  const Vite = import.meta.env.VITE_API_BASE_URL;

  // Efecto que ejecutamos al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    // Si no hay token, reseteamos los estados de usuario y administrador
    if (!token) {
      setUser(null);
      setIsAdmin(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      // Envíamos una solicitud POST al endpoint de login con las credenciales
      const response = await axios.post(`${Vite}/login`, { username, password });
      const { token, isAdmin: isAdminStatus } = response.data;
      
      // Guardamos el token y el estado de administrador en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('isAdmin', isAdminStatus);
      // Actualizamos los estados de usuario y administrador
      setUser(username);
      setIsAdmin(isAdminStatus);
      
      return response.data; 
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw new Error('Credenciales incorrectas.'); 
    }
  };

  const register = async (username, password, email) => {
    try {
      // Envíamos una solicitud POST al endpoint de registro con los datos del nuevo usuario
      await axios.post(`${Vite}/register`, { username, password, email });
      return 'Registro exitoso'; 
    } catch (error) {
      console.error('Error en el registro:', error);
      throw new Error('Error al registrarse'); 
    }
  };

  const logout = () => {
    // Eliminamos los datos de usuario de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    setUser(null);
    setIsAdmin(false);
  };

  // Proporcionamos el contexto a los componentes hijos
  return (
    <UserContext.Provider value={{ user, isAdmin, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para el contexto de usuario
export const useUser = () => {
  return useContext(UserContext);
};
