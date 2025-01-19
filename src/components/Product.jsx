import React from 'react';

const Product = ({ product, addToCart, navigate, sectionTitle }) => {
  return (
    <div className="product-card">
      <h2>{sectionTitle}</h2>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>Precio: ${product.price.toFixed(2)}</p>
      <img src={product.image} alt={product.name} className="product-image" />
      <button onClick={() => addToCart(product, navigate)}>
        Añadir al Carrito
      </button>
    </div>
  );
};

export default Product;
