// frontend/src/components/CategorySidebar.jsx
import React from 'react';
import CATEGORIES from '../utils/categories';

export default function CategorySidebar({ onSelect, active }) {
  return (
    <aside style={{
      width: 220,
      padding: 12,
      borderRight: '1px solid #eee',
      height: '100vh',
      overflowY: 'auto',
      background: '#fff'
    }}>
      <h3 style={{ color: '#ff6b6b' }}>Categories</h3>
      <div style={{ marginTop: 8 }}>
        {CATEGORIES.map(cat => (
          <div
            key={cat}
            onClick={() => onSelect && onSelect(cat)}
            style={{
              padding: '10px 8px',
              cursor: 'pointer',
              background: active === cat ? '#f5f5f5' : 'transparent',
              borderRadius: 4,
              marginBottom: 6
            }}
          >
            {cat}
          </div>
        ))}
      </div>
    </aside>
  );
}
