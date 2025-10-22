import React, { useContext, useState } from 'react';
import { CartContext } from '../components/CartProvider';
import { AuthContext } from '../components/AuthProvider';
import api from '../api/api';
import { Button, TextField } from '@mui/material';

export default function Checkout() {
  const { cart, total, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    if (!address) return alert('Enter delivery address');
    try {
      setLoading(true);
      const payload = {
        items: cart.map(c => ({ product: c._id, qty: c.qty })),
        shippingAddress: { line1: address },
      };
      const res = await api.post('/orders', payload);
      alert('✅ Order placed successfully!');
      console.log('Order:', res.data);
      clearCart();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Checkout</h3>
      <p>Total amount: ₹{total}</p>
      <TextField
        label="Delivery Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        fullWidth
        multiline
        margin="normal"
      />
      <Button variant="contained" color="success" onClick={handleOrder} disabled={loading}>
        {loading ? 'Processing...' : 'Place Order'}
      </Button>
    </div>
  );
}
