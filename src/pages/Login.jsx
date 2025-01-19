import { useState } from 'react'; // Importa useState para manejar el estado
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la navegación
import { useUser } from '../context/UserContext'; // Importa el contexto de usuario

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' }); // Estado para manejar tanto el nombre de usuario como la contraseña
  const [error, setError] = useState(''); // Estado para manejar errores
  const navigate = useNavigate(); // Usamos useNavigate para redirigir
  const { login } = useUser(); // Obtenemos la función de login del contexto de usuario

  // Función para manejar el envío del formulario
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevenimos el comportamiento por defecto del formulario
    setError(''); // Limpiamos cualquier mensaje de error previo

    try {
      await login(formData.username, formData.password); // Intentamos iniciar sesión con los datos
      navigate('/Products'); // Si el login es exitoso, redirigimos a la página de productos
    } catch (err) {
      setError(err.message); // Si ocurre un error, mostramos el mensaje de error
    }
  };

  // Función para manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Extraemos el nombre y el valor del campo
    setFormData(prevData => ({ ...prevData, [name]: value })); // Actualizamos el estado de formData
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}> {/* Envío del formulario */}
        <input 
          type="text" 
          name="username" 
          value={formData.username} 
          onChange={handleInputChange} // Usamos handleInputChange para actualizar el estado
          placeholder="Usuario" 
          required 
        />
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleInputChange} // Usamos handleInputChange para actualizar el estado
          placeholder="Contraseña" 
          required 
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
      {error && <p>{error}</p>} {/* Mostrar mensaje de error si existe */}
    </div>
  );
};

export default Login;
