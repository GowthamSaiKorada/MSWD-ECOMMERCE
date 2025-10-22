// frontend/src/pages/Admin/AdminProductEdit.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import {
  TextField,
  Button,
  CircularProgress,
  Paper,
  MenuItem,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import CATEGORIES from '../../utils/categories';

const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4MB

export default function AdminProductEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [origImage, setOrigImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Load product
  useEffect(() => {
    let mounted = true;
    async function loadProduct() {
      try {
        const res = await api.get(`/products/${id}`);
        if (!mounted) return;
        const p = res.data;
        setForm({
          title: p.title || "",
          description: p.description || "",
          price: p.price ?? "",
          stock: p.stock ?? "",
          category: p.category || "",
        });
        setOrigImage(p.image || null);
        setPreview(p.image ? `http://localhost:5000${p.image}` : null);
      } catch (err) {
        console.error("Failed to load product", err);
        alert("Failed to load product");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadProduct();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const openFileDialog = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const setFileAndPreview = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setRemoveImage(false); // if new file chosen, cancel remove flag
  };

  const handleFileSelect = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      if (!f.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (f.size > MAX_FILE_BYTES) {
        alert("File too large — maximum 4 MB");
        return;
      }
      setFileAndPreview(f);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files.length) {
      const f = dt.files[0];
      if (!f.type.startsWith("image/")) {
        alert("Please drop an image file");
        return;
      }
      if (f.size > MAX_FILE_BYTES) {
        alert("File too large — maximum 4 MB");
        return;
      }
      setFileAndPreview(f);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) {
      alert("Please fill Title and Price");
      return;
    }
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description || "");
      fd.append("price", form.price);
      fd.append("stock", form.stock || 0);
      fd.append("category", form.category || "");
      if (file) {
        fd.append("image", file);
      }
      if (removeImage) {
        fd.append("removeImage", "true");
      }

      await api.put(`/products/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product updated");
      nav("/admin/products");
    } catch (err) {
      console.error("Update failed", err);
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <CircularProgress />
      </div>
    );

  return (
    <Paper sx={{ padding: 3, maxWidth: 900, margin: "20px auto" }}>
      <h3>Edit Product</h3>

      <form onSubmit={handleSubmit}>
        <TextField
          name="title"
          label="Title *"
          fullWidth
          margin="dense"
          value={form.title}
          onChange={handleChange}
          required
        />

        <TextField
          name="price"
          label="Price *"
          fullWidth
          margin="dense"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />

        <TextField
          name="stock"
          label="Stock"
          fullWidth
          margin="dense"
          type="number"
          value={form.stock}
          onChange={handleChange}
        />

        <TextField
          name="category"
          label="Category"
          select
          fullWidth
          margin="dense"
          value={form.category}
          onChange={handleChange}
          helperText="Pick existing category"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          {CATEGORIES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          name="description"
          label="Description"
          fullWidth
          margin="dense"
          multiline
          rows={4}
          value={form.description}
          onChange={handleChange}
          style={{ marginTop: 12 }}
        />

        <div style={{ marginTop: 12 }}>
          <input
            ref={fileInputRef}
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <Button variant="outlined" onClick={openFileDialog}>Choose Image</Button>
          <span style={{ marginLeft: 12 }}>
            {file ? file.name : origImage ? "current image shown below" : "No file chosen"}
          </span>
        </div>

        <div style={{ marginTop: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={removeImage}
                onChange={(e) => {
                  const val = e.target.checked;
                  setRemoveImage(val);
                  if (val) {
                    setFile(null);
                    setPreview(null);
                  } else {
                    if (origImage) setPreview(`http://localhost:5000${origImage}`);
                  }
                }}
              />
            }
            label="Remove current image"
          />
        </div>

        {/* Drag & drop area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
          role="button"
          aria-label="Drop image here"
          style={{
            marginTop: 16,
            height: 200,
            border: `3px dashed ${dragOver ? "#1976d2" : "#ccc"}`,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: dragOver ? "#f0f7ff" : "#fafafa",
            color: "#666",
            cursor: "pointer",
            overflow: "hidden",
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="preview"
              style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
            />
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 600 }}>Drop your image here</div>
              <div style={{ fontSize: 13, marginTop: 6, color: "#888" }}>
                or click Choose Image above
              </div>
              <div style={{ fontSize: 12, marginTop: 6, color: "#999" }}>
                Max size 4 MB
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <Button type="submit" variant="contained" color="primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => nav("/admin/products")}>
            Cancel
          </Button>
        </div>
      </form>
    </Paper>
  );
}
