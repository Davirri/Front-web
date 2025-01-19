import { useState } from 'react';
import { useUser } from '../context/UserContext'; 

const Register = () => {
  // Estado único para manejar todos los campos del formulario
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    termsAccepted: false
  });
  const [message, setMessage] = useState(''); 
  const { register } = useUser(); // Obtenemos la función de registro del contexto

  // Función para manejar los cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    // Verificamos si se han aceptado los términos antes de continuar
    if (!formData.termsAccepted) {
      setMessage('Debes aceptar los términos y condiciones para registrarte.');
      return; 
    }

    try {
      // Llamamos a la función de registro y esperamos el mensaje de éxito
      const successMessage = await register(formData.username, formData.password, formData.email);
      setMessage(successMessage);
  
      // Reiniciamos los campos del formulario
      setFormData({
        username: '',
        password: '',
        email: '',
        termsAccepted: false
      });
    } catch (error) {
      setMessage(error.message); 
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister}>
        <h2>Registro</h2>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange} // Manejo del cambio con la función única
          placeholder="Usuario"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange} // Manejo del cambio con la función única
          placeholder="Correo Electrónico"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange} // Manejo del cambio con la función única
          placeholder="Contraseña"
          required
        />
        <div>
          <label>
            Acepto los <a href="" target="_blank">términos y condiciones</a> 
          </label>
        </div>
        <input
          type="checkbox"
          name="termsAccepted"
          checked={formData.termsAccepted}
          onChange={handleInputChange} // Manejo del cambio con la función única
          required
        />
        <button type="submit">Registrarse</button>
        {message && <p>{message}</p>} 
      </form>
    </div>
  );
};

export default Register;
