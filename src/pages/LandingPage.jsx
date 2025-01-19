import React, { useState } from 'react'; // Importa React y el hook useState
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la navegación

const LandingPage = () => {
  const navigate = useNavigate(); // Inicializa el hook de navegación
  const [isVisible, setIsVisible] = useState(true); // Estado para controlar la visibilidad de la landing page

  // Función que ejecutamos al hacer clic en el botón
  const handleNavigateToHome = () => {
    setIsVisible(false); // Ponemos la página como oculta
    setTimeout(() => {
      navigate('/home'); // Redirige a la página de home después de 1.5 segundos
    }, 1500);
  };

  return (
    <div className={`landing-page ${isVisible ? 'visible' : 'hidden'}`}>
      {/*Preguntamos si es visible para mostrar/ocultar la landing page usando clases CSS */}
      <img src="https://i.gifer.com/origin/2c/2c366a7f62ec0e89e07459370b9e89a9_w200.gif" alt="Gif-man" />
      <h1 className='Principal'>Bienvenido a GamingZone</h1>
      <p>Tu destino para todos tus videojuegos.</p>
      <button onClick={handleNavigateToHome}>Empieza tu aventura</button>
    </div>
  );
};

export default LandingPage;
