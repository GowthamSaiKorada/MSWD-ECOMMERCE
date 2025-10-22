import React, { useState } from 'react';
import api from '../api/api';
import { TextField, Button, MenuItem, CircularProgress } from '@mui/material';


export default function AdminProductForm({ onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', price: '', stock: '', category: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  // Example categories - replace or fetch dynamically
  const categories = [
    'Fruits', 'Vegetables', 'Dairy & Eggs', 'Bakery', 'Snacks', 'Beverages', 'Frozen', 'Meat & Seafood'
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleFileSelect(e) {
    const f = e.target.files && e.target.files[0];
    if (f) setFileAndPreview(f);
  }

  function setFileAndPreview(f) {
    setFile(f);
    try {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } catch (err) {
      setPreview(null);
    }
  }

  // Drag & drop handlers
  function onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }
  function onDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }
  function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const f = (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]);
    if (f) setFileAndPreview(f);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.price) return alert('Please enter title and price');

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description || '');
      fd.append('price', form.price);
      fd.append('stock', form.stock || 0);
      fd.append('category', form.category || '');
      if (file) fd.append('image', file);

      // POST to /api/products — backend expects upload.single('image')
      const res = await api.post('/products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Product created');
      setForm({ title: '', description: '', price: '', stock: '', category: '' });
      setFile(null);
      setPreview(null);
      if (onCreated) onCreated(res.data);
    } catch (err) {
      console.error('Upload failed', err);
      const msg = err?.response?.data?.message || err.message || 'Upload failed';
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      maxWidth: 720,
      margin: '12px auto',
      padding: 18,
      background: 'white',
      borderRadius: 10,
      boxShadow: '0 6px 18px rgba(0,0,0,0.06)'
    }}>
      <h3 style={{ marginTop: 0 }}>Add Product</h3>

      <form onSubmit={handleSubmit}>
        <TextField name="title" label="Name" value={form.title} onChange={handleChange} fullWidth margin="dense" required />
        <TextField name="price" label="Price" value={form.price} onChange={handleChange} fullWidth margin="dense" required type="number" />
        <TextField name="stock" label="Quantity" value={form.stock} onChange={handleChange} fullWidth margin="dense" type="number" />
        <TextField
          select
          name="category"
          label="Select Category"
          value={form.category}
          onChange={handleChange}
          fullWidth
          margin="dense"
        >
          <MenuItem value="">-- none --</MenuItem>
          {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>

        <div style={{ marginTop: 12 }}>
          <input
            id="image-file"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <label htmlFor="image-file">
            <Button variant="outlined" component="span">Choose File</Button>
            <span style={{ marginLeft: 12 }}>{file ? file.name : 'No file chosen'}</span>
          </label>
        </div>

        {/* Drag & Drop area */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          style={{
            marginTop: 16,
            height: 160,
            border: `2px dashed ${dragOver ? '#1976d2' : '#ccc'}`,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            position: 'relative',
            overflow: 'hidden',
            background: '#fafafa'
          }}
        >
          {preview ? (
            <img src={preview} alt="preview" style={{ height: '100%', objectFit: 'cover', width: '100%' }} />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, marginBottom: 6 }}>{dragOver ? 'Drop image to upload' : 'Drop your image here'}</div>
              <div style={{ fontSize: 12, color: '#999' }}>or click Choose File above</div>
            </div>
          )}
        </div>

        <TextField
          name="description"
          label="Description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          margin="dense"
          multiline
          rows={3}
          style={{ marginTop: 16 }}
        />

        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <><CircularProgress size={18} style={{ color: '#fff', marginRight: 8 }} /> Processing...</> : 'Add'}
          </Button>
        </div>
      </form>
    </div>
  );
}
