import React, { useState } from 'react'; // Importamos React y el hook useState 
import { Link, useNavigate } from 'react-router-dom'; // Importamos Link y useNavigate de React Router para la navegación

const Navbar = () => {
  const navigate = useNavigate(); // useNavigate para redirigir al usuario 
  const token = localStorage.getItem('token'); // Se obtiene el token del localStorage para verificar si el usuario está autenticado
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Verificamos si el usuario es administrador
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar la apertura/cierre del menú

  // Eliminamos el token y otros datos del usuario de localStorage
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    navigate('/login'); // Mandamos al usuario a la página de inicio de sesión
  };

  // Función para abrir/cerrar el menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Función para cerrar el menú 
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar"> 
      <button className="hamburger-icon" onClick={toggleMenu}>
        ☰ {/* Menu de hamburguesa para abrir/cerrar el menú en dispositivos móviles */}
      </button>
      <ul className={`navbar-list ${isMenuOpen ? 'open' : ''}`}> {/* Aquí preguntamos si el menú está abierto */}
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/products" onClick={closeMenu}>Videojuegos</Link></li>
        <li><Link to="/merch" onClick={closeMenu}>Merch</Link></li> 
        
        {/* Enlace para añadir producto, solo visible si es administrador */}
        {isAdmin && <li><Link to="/add-product" onClick={closeMenu}>Añadir Juego</Link></li>}
        
        {!token ? (
          <>
            {/* Enlaces de inicio de sesión y registro visibles si el usuario no está logueado */}
            <li><Link to="/login" onClick={closeMenu}>Inicio Sesión</Link></li>
            <li><Link to="/register" onClick={closeMenu}>Registro</Link></li>
          </>
        ) : (
          <>
            {/* Enlaces de carrito y botón de salir visibles si el usuario está logueado */}
            <li><Link to="/cart" onClick={closeMenu}>Carrito</Link></li>
            <li><button onClick={handleLogout}>Salir</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
