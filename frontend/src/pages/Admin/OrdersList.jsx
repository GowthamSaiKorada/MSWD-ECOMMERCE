// frontend/src/pages/Admin/OrdersList.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/api';

export default function AdminOrdersList(){
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    (async()=> {
      try {
        const res = await api.get('/admin/orders'); // admin route
        console.log('GET /admin/orders =>', res.data);
        setOrders(res.data || []);
      } catch(err) {
        console.error('Failed to fetch admin orders', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{padding:20}}>Loading orders…</div>;
  if (!orders.length) return <div style={{padding:20}}>No orders found.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h3>All Orders</h3>
      {orders.map(o => (
        <div key={o._id} style={{ padding: 12, border: '1px solid #eee', marginBottom: 8, background: '#fff' }}>
          <div><strong>OrderId:</strong> {o._id}</div>
          <div><strong>User:</strong> {o.user?.email || o.user?.name || (o.user && o.user._id) || 'Unknown'}</div>
          <div><strong>Status:</strong> {o.status}</div>
          <div><strong>Total:</strong> ₹{o.total}</div>

          <div style={{ marginTop: 8 }}>
            <strong>Items:</strong>
            <ul>
              {Array.isArray(o.items) && o.items.length ? o.items.map((i, idx) => {
                const p = i.product;
                // p can be: populated object, ObjectId string, or null
                const title = p && typeof p === 'object'
                  ? (p.title || p.name || 'Untitled product')
                  : (typeof p === 'string' ? p : 'Product removed');
                const pid = p && typeof p === 'object'
                  ? (p._id || p.id)
                  : (typeof p === 'string' ? p : 'n/a');

                return <li key={idx}>{title} (id: {pid}) — qty: {i.qty || 1}</li>;
              }) : <li>No items</li>}
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
