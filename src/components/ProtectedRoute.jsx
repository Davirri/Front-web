import { Navigate } from 'react-router-dom'; 
import { useUser } from '../context/UserContext'; // Importamos el useUser para acceder al estado del usuario

const ProtectedRoute = ({ element, isAdmin }) => {
  const { user } = useUser(); // Obtenemos el usuario del contexto UserContext

  // Verificamos si el usuario no está autenticado o si se requiere ser administrador y no lo es
  if (!user || (isAdmin !== undefined && !isAdmin)) {
    return <Navigate to="/login" />; 
  }

  return element; // Si el usuario está autenticado y cumple con los requisitos mostramos el elemento protegido
};

export default ProtectedRoute; 
