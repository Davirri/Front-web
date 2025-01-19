import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './context/UserContext';
import { ProductProvider } from './context/ProductContext';
import { MerchProvider } from './context/MerchContext'; 
import './App.css';
import ProductList from './pages/AddProduct';
import Products from './pages/Products';
import Checkout from './pages/Checkout';
import Footer from './pages/Footer';
import Merch from './pages/Merch'; 
import Conditions from './pages/Conditions';

function App() {
  return (
    // Proporcionamos el contexto de usuario y productos a toda la aplicación mediante el provider
    <UserProvider>
      <ProductProvider>
        <MerchProvider> {/* Envuelve el contenido con MerchProvider para el contexto de Merch */}
          <Router>
            <Navbar />
            <Routes>
              {/* Definimos las rutas de la aplicación */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/Conditions" element={<Conditions />} />
              <Route path="/merch" element={<Merch />} /> {/* Ruta para Merch */}
              {/* Ruta especial protegida para añadir productos o editarlos, solo accesible si se es administrador */}
              <Route
                path="/add-product"
                element={<ProtectedRoute element={<ProductList />} />}
              />
            </Routes>
            <Footer />
          </Router>
        </MerchProvider>
      </ProductProvider>
    </UserProvider>
  );
}

export default App;
