import React, { useContext } from 'react';
import { CartContext } from '../components/CartProvider';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, clearCart, total } = useContext(CartContext);

  if (!cart.length) return <div><h3>Your cart is empty</h3></div>;

  return (
    <div>
      <h3>Your Cart</h3>
      <table style={{ width: '100%', background:'#fff', borderRadius:8 }}>
        <thead>
          <tr><th>Item</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item._id}>
              <td>{item.title}</td>
              <td>₹{item.price}</td>
              <td>{item.qty}</td>
              <td>₹{item.price * item.qty}</td>
              <td><Button color="error" onClick={()=>removeFromCart(item._id)}>Remove</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 style={{textAlign:'right'}}>Total: ₹{total}</h3>
      <div style={{display:'flex', justifyContent:'space-between', marginTop:10}}>
        <Button onClick={clearCart}>Clear Cart</Button>
        <Link to="/checkout"><Button variant="contained" color="primary">Proceed to Checkout</Button></Link>
      </div>
    </div>
  );
}
