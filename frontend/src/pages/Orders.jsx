// frontend/src/pages/Orders.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/orders');
        console.log('GET /orders response:', res.data);
        setOrders(res.data || []);
      } catch (err) {
        console.error('Failed to load orders', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{padding:20}}>Loading orders…</div>;

  if (!orders.length) return <div style={{padding:20}}>No orders yet.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h3>Your Orders</h3>
      {orders.map(o => (
        <div key={o._id} style={{ padding: 12, border: '1px solid #eee', marginBottom: 8, background: '#fff' }}>
          <div><strong>OrderId:</strong> {o._id}</div>
          <div><strong>Status:</strong> {o.status}</div>
          <div><strong>Total:</strong> ₹{o.total}</div>

          <div style={{ marginTop: 8 }}>
            <strong>Items:</strong>
            <ul>
              {Array.isArray(o.items) && o.items.length ? (
                o.items.map((i, idx) => {
                  // i.product could be: populated object, string id, or null
                  const productObj = i.product;
                  const title = productObj && typeof productObj === 'object'
                    ? (productObj.title || (productObj.name || 'Untitled product'))
                    : (typeof productObj === 'string' ? productObj : 'Product removed');
                  const pid = productObj && typeof productObj === 'object'
                    ? (productObj._id || productObj.id)
                    : (typeof productObj === 'string' ? productObj : 'n/a');

                  return (
                    <li key={idx}>
                      <strong>{title}</strong> (id: {pid}) — qty: {i.qty || 1}
                    </li>
                  );
                })
              ) : (
                <li>No items</li>
              )}
            </ul>
          </div>

          <div style={{ fontSize: 12, color: '#666' }}>
            Created: {new Date(o.createdAt || o._id).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
