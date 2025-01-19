import React from 'react';
import { Link} from 'react-router-dom';

const Footer = () => {

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} GamingZone. Todos los derechos reservados.</p>
        <p className="description">
          GamingZone es tu destino para todos los artículos de videojuegos y más. 
          ¡Explora nuestra tienda y encuentra lo mejor en juegos!
        </p>
        <div className="links">
          <Link to="/Conditions">Política de privacidad</Link> | 
          <Link to="/Conditions">Términos y condiciones</Link> | 
          <Link to="/Conditions">Contacto</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
