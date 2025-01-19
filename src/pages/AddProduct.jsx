import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext'; 
import { useNavigate } from 'react-router-dom'; 

const ProductList = () => {
  // Desestructuramos las funciones y variables del contexto
  const { products, message, addProduct, deleteProduct, updateProduct } = useProducts();
  const navigate = useNavigate(); // Hook de navegación

  // Estado para manejar los productos nuevos y la edición de un producto existente
  const [formData, setFormData] = useState({
    newProduct: { name: '', description: '', price: '', image: '' },
    editProductId: null,
    editProduct: { name: '', description: '', price: '', image: '' }
  });

  // Función con la que manejamos el envío del formulario para agregar un nuevo producto
  const handleAddProduct = (e) => {
    e.preventDefault(); // Evitamos el comportamiento por defecto del formulario
    addProduct(formData.newProduct); 
    setFormData(prevState => ({
      ...prevState,
      newProduct: { name: '', description: '', price: '', image: '' } // Reiniciamos el estado del nuevo producto
    }));
  };

  // Función para editar un producto
  const handleEdit = (product) => {
    setFormData(prevState => ({
      ...prevState,
      editProductId: product._id, // Establecemos el ID del producto a editar (_id para Mongoose)
      editProduct: { ...product } // Copiamos los datos del producto a editar en el estado
    }));
  };

  // Función para el envío del formulario de actualización de un producto
  const handleUpdateProduct = (e) => {
    e.preventDefault(); 
    updateProduct(formData.editProductId, formData.editProduct); // Utilizamos la función para actualizar el producto
    setFormData(prevState => ({
      ...prevState,
      editProductId: null // Reseteamos el ID del producto a editar
    }));
  };

  // Función para manejar los cambios en los campos de los formularios
  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'newProduct') {
      setFormData(prevState => ({
        ...prevState,
        newProduct: { ...prevState.newProduct, [name]: value } // Utilizamos spread para actualizar sin mutar el estado
      }));
    } else if (formType === 'editProduct') {
      setFormData(prevState => ({
        ...prevState,
        editProduct: { ...prevState.editProduct, [name]: value } // Utilizamos spread para actualizar sin mutar el estado
      }));
    }
  };

  return (
    <div className='add-product'>
      <h2>Lista de Videojuegos</h2>
      {message && <p>{message}</p>}

      {/* Lista de productos */}
      <ul className="product-list">
        {products.map((product) => (
          <li key={product._id} className="product-card">
            {formData.editProductId === product._id ? (
              // Si el producto se está editando, mostramos el formulario de edición
              <form onSubmit={handleUpdateProduct} className="add-product-form">
                <input
                  type="text"
                  name="name"
                  value={formData.editProduct.name}
                  onChange={(e) => handleInputChange(e, 'editProduct')}
                  placeholder="Nombre del producto"
                  required
                />
                <textarea
                  name="description"
                  value={formData.editProduct.description}
                  onChange={(e) => handleInputChange(e, 'editProduct')}
                  placeholder="Descripción del producto"
                  required
                />
                <input
                  type="number"
                  name="price"
                  value={formData.editProduct.price}
                  onChange={(e) => handleInputChange(e, 'editProduct')}
                  placeholder="Precio del producto"
                  required
                />
                <input
                  type="text"
                  name="image"
                  value={formData.editProduct.image}
                  onChange={(e) => handleInputChange(e, 'editProduct')}
                  placeholder="URL de la imagen"
                  required
                />
                <button type="submit">Guardar Cambios</button>
                <button type="button" onClick={() => setFormData(prevState => ({ ...prevState, editProductId: null }))}>Cancelar</button>
              </form>
            ) : (
              // Si el producto no se está editando, muestra los detalles del producto
              <>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Precio: ${product.price}</p>
                <img src={product.image} alt={product.name} className="product-image" />
                <button onClick={() => handleEdit(product)}>Editar</button>
                <button className='product-button' onClick={() => deleteProduct(product._id)}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Formulario para añadir un nuevo producto */}
      <form onSubmit={handleAddProduct} className="add-product-form">
        <h3>Añadir Nuevo</h3>
        <input
          type="text"
          name="name"
          value={formData.newProduct.name}
          onChange={(e) => handleInputChange(e, 'newProduct')}
          placeholder="Nombre del producto"
          required
        />
        <textarea
          name="description"
          value={formData.newProduct.description}
          onChange={(e) => handleInputChange(e, 'newProduct')}
          placeholder="Descripción del producto"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.newProduct.price}
          onChange={(e) => handleInputChange(e, 'newProduct')}
          placeholder="Precio del producto"
          required
        />
        <input
          type="text"
          name="image"
          value={formData.newProduct.image}
          onChange={(e) => handleInputChange(e, 'newProduct')}
          placeholder="URL de la imagen"
          required
        />
        <button type="submit">Añadir Producto</button>
      </form>
    </div>
  );
};

export default ProductList;
