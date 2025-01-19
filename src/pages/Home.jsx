import React, { useEffect, useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import Product from '../components/Product'; // Importamos el componente Product

const Home = () => {
  // Extraemos los productos y la función para añadir al carrito del contexto de productos
  const { products, addToCart } = useProducts();
  const navigate = useNavigate(); // Hook para redireccionar a otra ruta

  // Estados para manejar el índice del producto actual y los productos destacados, más vendidos, recomendados y noticias
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestsellingProducts, setBestsellingProducts] = useState([]);
  const [recommendationProducts, setRecommendationProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true); // Estado para cargar las noticias

  // Efecto que cambia el producto actual cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProductIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 4000);

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente.
  }, [products.length]);

  // Función para obtener productos aleatorios, excluyendo algunos por sus IDs
  const getRandomProducts = (num, excludeIds = []) => {
    const filteredProducts = products.filter((product) => !excludeIds.includes(product._id)); // Cambiamos 'id' a '_id' para Mongoose
    const shuffled = [...filteredProducts].sort(() => 0.5 - Math.random()); // Mezclamos los productos
    return shuffled.slice(0, num); // Devolvemos los primeros 'num' productos
  };

  // Efecto para seleccionar productos destacados, más vendidos y recomendados al cargar los productos
  useEffect(() => {
    if (products.length > 0) {
      const selectedFeatured = getRandomProducts(3); // Seleccionamos 3 productos destacados
      setFeaturedProducts(selectedFeatured);
      const featuredIds = selectedFeatured.map((product) => product._id); // IDs de productos destacados

      const selectedBestselling = getRandomProducts(3, featuredIds); // Seleccionamos 3 productos más vendidos excluyendo los destacados
      setBestsellingProducts(selectedBestselling);

      const allExcludedIds = [...featuredIds, ...selectedBestselling.map(product => product._id)]; // IDs excluidos combinados
      const selectedRecommendations = getRandomProducts(3, allExcludedIds); // Seleccionamos recomendaciones
      setRecommendationProducts(selectedRecommendations);
    }
  }, [products]);

  // Efecto para obtener noticias desde una API.
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/news`);
        if (!response.ok) {
          throw new Error('Error al obtener las noticias');
        }
        const data = await response.json(); // Conversión de la respuesta a JSON
        setNews(data); // Guardamos las noticias en el estado
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingNews(false); // Indicamos que hemos terminado de cargar las noticias
      }
    };

    fetchNews(); // Función para obtener noticias
  }, []);

  const currentProduct = products[currentProductIndex]; // Obtenemos el producto actual según el índice

  return (
    <div className='Home'>
      <div className='entrance'>
        <h2 className='Principal'>Vive las mejores experiencias</h2>
        <p className='entrance-paragraph'>
          GamingZone es la tienda ideal para los amantes de los videojuegos, ofreciendo una amplia selección de títulos para todas las consolas, accesorios y merchandising de tus sagas favoritas.
          Desde las últimas novedades hasta clásicos imprescindibles, en GamingZone encontrarás productos de alta calidad y servicio personalizado para jugadores de todos los niveles.
          Únete a nuestra comunidad gamer y descubre las mejores opciones para vivir la experiencia de juego definitiva.
        </p>

        {currentProduct && (
          <div className="product-card">
            <h2>Novedades</h2>

            <h3>{currentProduct.name}</h3>
            <p>{currentProduct.description}</p>
            <p>Precio: ${currentProduct.price.toFixed(2)}</p>
            <img src={currentProduct.image} alt={currentProduct.name} className="home-image" />
            <button onClick={() => addToCart(currentProduct, navigate)}>
              Añadir al Carrito
            </button>
          </div>
        )}
      </div>
      
      {/* Productos destacados */}
      <div className="featured">
        {featuredProducts.map((product) => (
          <Product key={product._id} product={product} addToCart={addToCart} navigate={navigate} />
        ))}
      </div>

      {/* Lo más vendido */}
      <div className="sell">
        {bestsellingProducts.map((product) => (
          <Product key={product._id} product={product} addToCart={addToCart} navigate={navigate} />
        ))}
      </div>

      {/* Recomendaciones */}
      <div className="recomend">
        {recommendationProducts.map((product) => (
          <Product key={product._id} product={product} addToCart={addToCart} navigate={navigate} />
        ))}
      </div>

      {/* Noticias */}
      {loadingNews ? (
        <p>Cargando noticias...</p>
      ) : (
        <div className="news">
          <h2>Noticias</h2>

          {news.length > 0 ? (
            news.map((item) => (
              <div key={item._id} className="news-card">
                {item.image && <img src={item.image} alt={item.title} className="news-image" />}
                <h3>{item.title}</h3>
                <p className='news-paragraph'>{item.content}</p>
              </div>
            ))
          ) : (
            <p>No hay noticias disponibles.</p> // Mensaje cuando no hay noticias.
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
