import React, { useContext } from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { CartContext } from './CartProvider';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  const imgSrc =
    product?.image && product.image.trim()
      ? (product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`)
      : null;

  return (
    <Card>
      {imgSrc ? (
        <img src={imgSrc} alt={product.title} className="card-img" />
      ) : (
        <div style={{ height: 160, background: '#f0f0f0' }} />
      )}

      <CardContent>
        <Typography variant="h6">{product.title}</Typography>
        <Typography variant="body2">{product.description?.slice(0, 100)}</Typography>
        <Typography variant="subtitle1">₹{product.price}</Typography>
      </CardContent>

      <CardActions>
        <Link to={`/products/${product._id}`}><Button size="small">Details</Button></Link>
        <Button size="small" onClick={() => addToCart(product)}>Add</Button>
      </CardActions>
    </Card>
  );
}
