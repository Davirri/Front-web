import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    // Estado para almacenar los datos del formulario de pago
    const [formData, setFormData] = useState({
        name: '',          // Nombre en la tarjeta
        cardNumber: '',    // Número de tarjeta
        expiration: '',    // Fecha de expiración
        cvv: '',           // Código de seguridad (CVV)
    });

    // Estado para almacenar el precio total del carrito
    const [totalPrice, setTotalPrice] = useState(0);

    // Estado para mostrar un mensaje de confirmación de pago
    const [paymentMessage, setPaymentMessage] = useState('');

    // Hook para navegar a otras páginas después de completar el pago
    const navigate = useNavigate();

    // Efecto para calcular el precio total del carrito al cargar el componente
    useEffect(() => {
        // Obtenemos los elementos del carrito desde el localStorage
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        // Calculamos el precio total sumando el precio de cada elemento multiplicado por su cantidad
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

        // Actualizamos el estado con el precio total
        setTotalPrice(total);
    }, []); // El efecto se ejecuta una sola vez cuando el componente se monta

    // Manejamos los cambios en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Actualizamos el estado del formulario con los valores ingresados por el usuario
        setFormData(prevData => ({
            ...prevData,        // Conservamos los valores previos
            [name]: value       // Actualizamos el campo que ha cambiado
        }));
    };

    // Manejamos el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevenir la recarga de la página al enviar el formulario

        // Mostramos los datos del formulario en la consola (solo para pruebas)
        console.log('Datos de pago:', formData);

        // Eliminamos los elementos del carrito del localStorage (simulando una compra exitosa)
        localStorage.removeItem('cart');

        // Mostramos un mensaje de confirmación de pago
        setPaymentMessage('Pago completado con éxito!');

        // Redirigimos al usuario a la página de inicio después de 2 segundos
        setTimeout(() => {
            navigate('/'); // Redirigimos a la página de inicio
        }, 2000);
    };

    return (
        <div>
            <div className="checkout">

                <h2>Checkout</h2>
                {/* Mostramos el precio total que se debe pagar */}
                <h3>Total a pagar: ${totalPrice}</h3>

                {/* Mostramos un mensaje de confirmación de pago si existe */}
                {paymentMessage && <p className="payment-message">{paymentMessage}</p>}

                {/* Formulario para ingresar los datos de pago */}
                <form onSubmit={handleSubmit}>
                    {/* Campo para el nombre en la tarjeta */}
                    <div>
                        <label>Nombre en la tarjeta:</label>
                        <input
                            type="text"
                            name="name" // Nombre del campo en el estado
                            value={formData.name} // Valor actual del estado
                            placeholder="Nombre en la tarjeta:" // Texto de ayuda
                            onChange={handleInputChange} // Manejamos los cambios
                            required // Campo obligatorio
                        />
                    </div>

                    {/* Campo para el número de la tarjeta */}
                    <div>
                        <label>Número de tarjeta:</label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            placeholder="Número de tarjeta:"
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Campo para la fecha de expiración de la tarjeta */}
                    <div>
                        <label>Fecha de expiración:</label>
                        <input
                            type="text"
                            name="expiration"
                            value={formData.expiration}
                            placeholder="Fecha de expiración:"
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Campo para el CVV de la tarjeta */}
                    <div>
                        <label>CVV:</label>
                        <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            placeholder="CVV:"
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Botón para enviar el formulario */}
                    <button type="submit">Pagar</button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
