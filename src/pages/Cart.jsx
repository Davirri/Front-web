import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook para la navegación

const Cart = () => {
  // Estado para almacenar los items del carrito
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate(); // Navegación al checkout o a otra página

  // Efecto para cargar los items del carrito desde localStorage 
  useEffect(() => {
    // Obtenemos los items del carrito guardados en localStorage (si existen)
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(items); // Establecemos el estado del carrito con los items obtenidos
  }, []);

  // Función para eliminar un item del carrito (reduciendo su cantidad en 1)
  const removeItem = (id) => {
    // Mapeamos los items y decrementamos la cantidad del producto seleccionado en 1
    const updatedItems = cartItems.map(item => {
      if (item.id === id && item.quantity > 1) {
        // Si la cantidad es mayor a 1, la reducimos en 1
        return {
          ...item,
          quantity: item.quantity - 1
        };
      }
      if (item.id === id && item.quantity === 1) {
        // Si la cantidad es 1, eliminamos el item del carrito
        return null;
      }
      return item; // No modificamos otros items
    }).filter(item => item !== null); // Filtramos los items nulos (eliminados)

    // Actualizamos el estado del carrito con los items modificados
    setCartItems(updatedItems);
    // Guardamos el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  // Calculamos la cantidad total de productos en el carrito
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculamos el precio total del carrito
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);

  return (
    <div className='cart'>
      <h2>Carrito de Compras</h2>
      {/* Si el carrito está vacío, mostramos un mensaje */}
      {cartItems.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        // Si hay items en el carrito, los mostramos
        cartItems.map((item, index) => ( // Usamos el índice como key si item.id no es único
          <div key={item.id || index} className="cart-item"> {/* Usamos una key única para cada item */}
            <img src={item.image} alt={item.name} style={{ width: '100px', height: 'auto' }} />
            <p>Precio: ${item.price.toFixed(2)}</p>
            <h3>{item.name}</h3>
            <p>Cantidad: {item.quantity}</p>
            {/* Botón para eliminar el item */}
            <button onClick={() => removeItem(item.id)}>Eliminar</button>
          </div>
        ))
      )}
      {/* Si hay productos en el carrito, mostramos el resumen */}
      {cartItems.length > 0 && (
        <div className="cart-summary">
          <h3>Total de productos: {totalQuantity}</h3>
          <h3>Total a pagar: ${totalPrice}</h3>
          {/* Botón para ir al checkout */}
          <button onClick={() => navigate('/checkout')} className='cart-checkout'>
            Ir al Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
