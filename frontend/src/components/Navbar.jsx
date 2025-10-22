// frontend/src/components/NavBar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 20px',
        borderBottom: '1px solid #ddd',
        background: '#fff',
        alignItems: 'center',
      }}
    >
      <div>
        <Link to="/" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>
          Grocery Store
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>

        {/* Show My Orders only when logged in */}
        {user && <Link to="/orders">My Orders</Link>}

        {/* Admin/Manager dashboard */}
        {user && (user.role === 'admin' || user.role === 'manager') && (
          <Link to="/admin/dashboard">Dashboard</Link>
        )}

        {/* If no user, show Register + Login */}
        {!user ? (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={{ border: 'none', background: 'none', color: 'blue', cursor: 'pointer' }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}