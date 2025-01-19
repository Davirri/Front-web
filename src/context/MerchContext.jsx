import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext'; // Importamos el contexto de usuario para gestionar la autenticación

// Creamos un contexto para los artículos de merch
const MerchContext = createContext();

// Proveedor del contexto de merch que envuelve a los componentes hijos
export const MerchProvider = ({ children }) => {
  const { isAdmin } = useUser(); // Obtenemos si el usuario es administrador desde el contexto de usuario
  const [merchItems, setMerchItems] = useState([]); // Estado para almacenar los artículos de merch
  const [newMerch, setNewMerch] = useState({ name: '', description: '', price: '', image: '' }); // Estado para el nuevo artículo de merch
  const [editMerchId, setEditMerchId] = useState(null); // Estado para almacenar el ID del artículo que se está editando
  const [editMerch, setEditMerch] = useState({ name: '', description: '', price: '', image: '' }); // Estado para los datos del artículo que se está editando
  const Vite = import.meta.env.VITE_API_BASE_URL; // Obtenemos la URL base de la API desde las variables de entorno

  // Función para obtener los artículos de merch desde el servidor
  const fetchMerchItems = async () => {
    try {
      const response = await axios.get(`${Vite}/merch`); // Hacemos una solicitud GET a la API
      setMerchItems(response.data); // Almacenamos los artículos en el estado
    } catch (error) {
      console.error('Error al obtener artículos de merch:', error.response ? error.response.data : error); // Manejamos errores en la solicitud
    }
  };

  // Función para añadir un nuevo artículo de merch
  const handleAddMerch = async (e) => {
    e.preventDefault(); // Prevenimos el comportamiento por defecto del formulario
    if (!isAdmin) return; // Si el usuario no es administrador, no permitimos añadir merch
    try {
      const response = await axios.post(
        `${Vite}/merch/add`, // Hacemos una solicitud POST para añadir el artículo
        newMerch,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Incluimos el token de autorización
          },
        }
      );
      setMerchItems((prevItems) => [...prevItems, response.data]); // Añadimos el nuevo artículo a la lista
      setNewMerch({ name: '', description: '', price: '', image: '' }); // Reiniciamos el estado del nuevo artículo
    } catch (error) {
      console.error('Error al añadir artículo de merch:', error.response ? error.response.data : error); // Manejamos errores en la solicitud
    }
  };

  // Función para iniciar la edición de un artículo de merch
  const handleEditMerch = (item) => {
    setEditMerchId(item._id); // Guardamos el ID del artículo que se está editando
    setEditMerch({ ...item }); // Llenamos el estado de edición con los datos del artículo
  };

  // Función para actualizar un artículo de merch
  const handleUpdateMerch = async (e) => {
    e.preventDefault(); // Prevenimos el comportamiento por defecto del formulario
    if (!isAdmin || !editMerchId) return; // Si el usuario no es admin o no hay un ID, no hacemos nada

    try {
      const response = await axios.put(
        `${Vite}/merch/${editMerchId}`, // Hacemos una solicitud PUT para actualizar el artículo
        editMerch,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Incluimos el token de autorización
          },
        }
      );

      // Actualizamos la lista de artículos con los datos del artículo actualizado
      const updatedItems = merchItems.map((item) => (item._id === editMerchId ? response.data : item));
      setMerchItems(updatedItems);
      setEditMerch({ name: '', description: '', price: '', image: '' }); // Reiniciamos el estado de edición
      setEditMerchId(null); // Limpiamos el ID de edición
    } catch (error) {
      console.error('Error al actualizar artículo de merch:', error.response ? error.response.data : error); // Manejamos errores en la solicitud
    }
  };

  // Función para eliminar un artículo de merch
  const handleDeleteMerch = async (id) => {
    if (!isAdmin) return; // Si el usuario no es administrador, no permitimos eliminar merch
    try {
      await axios.delete(`${Vite}/merch/${id}`, { // Hacemos una solicitud DELETE para eliminar el artículo
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Incluimos el token de autorización
        },
      });
      setMerchItems((prevItems) => prevItems.filter((item) => item._id !== id)); // Filtramos el artículo eliminado de la lista
    } catch (error) {
      console.error('Error al eliminar artículo de merch:', error.response ? error.response.data : error); // Manejamos errores en la solicitud
    }
  };

  // Efecto para cargar los artículos de merch al montar el contexto
  useEffect(() => {
    fetchMerchItems(); // Llamamos a la función para obtener los artículos de merch
  }, []);

  // Proporcionamos el contexto a los componentes hijos
  return (
    <MerchContext.Provider
      value={{
        merchItems,
        newMerch,
        setNewMerch,
        editMerchId,
        editMerch,
        setEditMerch,
        setEditMerchId,
        handleAddMerch,
        handleEditMerch,
        handleUpdateMerch,
        handleDeleteMerch,
      }}
    >
      {children} /
    </MerchContext.Provider>
  );
};

// Hook para utilizar el contexto de merch en otros componentes
export const useMerch = () => useContext(MerchContext);
