import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import Product from '../components/Product'; // Importamos el componente Product

const Products = () => {
  // Obtenemos los productos, addToCart y el usuario del contexto
  const { products, addToCart, user } = useProducts();
  const navigate = useNavigate();

  return (
    <div className="Product">
      {/* Mostramos un saludo si hay un usuario autenticado */}
      {user && <h3 className="Principal">Hola, {user}!</h3>}
      <h2>Videojuegos</h2>
      <div className="product-list">
        {/* Mapeamos sobre la lista de productos y pasamos cada uno al componente Product */}
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            addToCart={addToCart}
            navigate={navigate}
            sectionTitle="Videojuegos" 
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
