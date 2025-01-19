import { createContext, useContext, useEffect, useState } from 'react'; 
import axios from 'axios'; // Importamos Axios para realizar peticiones HTTP
import { useUser } from './UserContext'; // Importamos el hook useUser para acceder al contexto del usuario

const ProductContext = createContext(); // Creamos un nuevo contexto para los productos

export const useProducts = () => {
  return useContext(ProductContext); // Devolvemos el contexto de productos
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]); // Estado para almacenar la lista de productos
  const [message, setMessage] = useState(''); // Estado para almacenar mensajes de éxito o error
  const { user } = useUser(); 
  const Vite = import.meta.env.VITE_API_BASE_URL; // Obtenemos la URL base de la API desde las variables de entorno

  const fetchProducts = async () => {
    const token = localStorage.getItem('token'); // Obtenemos el token de autenticación del localStorage.
    try {
      const response = await axios.get(`${Vite}/products`, { // Se realiza una petición para obtener los productos
        headers: { Authorization: `Bearer ${token}` }, // Incluimos el token en los headers
      });
      setProducts(response.data); // Almacenamos los productos en el estado
    } catch (error) {
      // Mensaje de error
      setMessage(`Error al cargar los productos: ${error.response?.data.message || error.message}`);
    }
  };

  const addProduct = async (newProduct) => {
    const token = localStorage.getItem('token'); 
    try {
      const response = await axios.post(`${Vite}/products/add`, newProduct, { // Realizamos una petición POST para añadir un nuevo producto
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Producto añadido exitosamente'); // Mensaje de éxito.
      fetchProducts(); // Llamamos a fetchProducts para obtener la lista actualizada de productos
    } catch (error) {
      setMessage(`Error al añadir el producto: ${error.response?.data.message || error.message}`);
    }
  };

  const deleteProduct = async (id) => {
    const token = localStorage.getItem('token'); 
    try {
      await axios.delete(`${Vite}/products/${id}`, { // Realizamos una petición DELETE para eliminar un producto
        headers: { Authorization: `Bearer ${token}` }, 
      });
      setMessage('Producto eliminado exitosamente'); 
      fetchProducts(); 
    } catch (error) {
      if (error.response?.status === 404) {
        setMessage('Producto no encontrado'); 
      } else {
        setMessage(`Error al eliminar el producto: ${error.response?.data.message || error.message}`);
      }
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    const token = localStorage.getItem('token'); 
    try {
      await axios.put(`${Vite}/products/${id}`, updatedProduct, { // Realizamos una petición PUT para actualizar un producto
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Producto actualizado exitosamente'); 
      fetchProducts(); 
    } catch (error) {
      setMessage(`Error al actualizar el producto: ${error.response?.data.message || error.message}`);
    }
  };

  const addToCart = (product, navigate) => { 
    if (!localStorage.getItem('token')) { // Verificamos si el usuario no está autenticado, si no lo mandamos a login
      navigate('/login'); 
    } else {
      const cartItems = JSON.parse(localStorage.getItem('cart')) || []; // Obtenemos los artículos del carrito o lo ponemos como vacío.
      const existingProduct = cartItems.find(item => item._id === product._id); // Buscamos si el producto ya está en el carrito
      
      if (existingProduct) {
        existingProduct.quantity += 1; // Incrementamos la cantidad si ya existe
      } else {
        const productWithImage = {
          _id: product._id, // Cambiamos 'id' a '_id' para trabajar con Mongoose
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          quantity: 1 // Añadimos 1 a la cantidad del producto.
        };
        cartItems.push(productWithImage); // Añadimos el nuevo producto al carrito
      }
      
      localStorage.setItem('cart', JSON.stringify(cartItems)); // Actualizamos el carrito en el localStorage
      alert(`${product.name} añadido al carrito.`); // Mensaje de confirmación
    }
  };

  useEffect(() => {
    fetchProducts(); 
  }, []);

  return (
    <ProductContext.Provider value={{ 
      products, // Proporcionamos la lista de productos
      message, // Proporcionamos el mensaje de éxito o error
      fetchProducts, // Proporcionamos la función para obtener productos
      addProduct, // Proporcionamos la función para añadir un nuevo producto
      deleteProduct, // Proporcionamos la función para eliminar un producto
      updateProduct, // Proporcionamos la función para actualizar un producto
      addToCart, // Proporcionamos la función para añadir al carrito
      user // Proporcionamos el usuario autenticado
    }}>
      {children}
    </ProductContext.Provider>
  );
};
