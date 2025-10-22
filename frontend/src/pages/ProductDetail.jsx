import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import { CartContext } from '../components/CartProvider';
import { Button } from '@mui/material';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    api.get(`/products/${id}`).then(r => setProduct(r.data)).catch(err => console.error(err));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const imgSrc =
    product?.image && product.image.trim()
      ? (product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`)
      : null;

  return (
    <div style={{ display: 'flex', gap: 20, padding: '1rem' }}>
      {imgSrc ? (
        <img src={imgSrc} alt={product.title} style={{ width: 320, height: 320, objectFit: 'cover', borderRadius: 8, background: '#f8f8f8' }} />
      ) : (
        <div style={{ width: 320, height: 320, borderRadius: 8, background: '#f0f0f0' }} />
      )}

      <div style={{ flex: 1 }}>
        <h2>{product.title}</h2>
        <p style={{ color: '#444' }}>{product.description}</p>
        <h3 style={{ marginTop: '1rem' }}>₹{product.price}</h3>
        <p style={{ color: '#666' }}>Stock: {product.stock || 0}</p>

        <Button variant="contained" color="primary" onClick={() => addToCart(product)} style={{ marginTop: 20 }}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
