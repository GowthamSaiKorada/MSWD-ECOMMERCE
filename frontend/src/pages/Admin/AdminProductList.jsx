// frontend/src/pages/Admin/AdminProductList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Grid,
  TextField,
  MenuItem,
  Typography
} from "@mui/material";
import CATEGORIES from '../../utils/categories';

export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // currently chosen category filter (empty string means 'all')
  const [categoryFilter, setCategoryFilter] = useState("");

  const fetchProducts = async (category = "", q = "") => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (q) params.set("q", q);
      params.set("limit", 500); // admin: load many

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.items || []);
    } catch (err) {
      console.error("Failed to load products", err);
      alert("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCats(true);
    try {
      // Fetch many products and derive categories
      const res = await api.get("/products?limit=500");
      const items = res.data.items || [];
      const fromServer = Array.from(
        new Set(items.map((p) => (p.category || "").toString().trim()).filter(Boolean))
      );

      // Merge server categories with defaults (CATEGORIES). Keep unique and sorted
      const merged = Array.from(new Set([...CATEGORIES, ...fromServer]));
      merged.sort((a, b) => a.localeCompare(b));
      setCategories(merged);
    } catch (err) {
      console.error("Failed to load categories", err);
      // fallback to default categories if server fails
      setCategories(CATEGORIES.slice());
    } finally {
      setLoadingCats(false);
    }
  };

  useEffect(() => {
    // load categories and products on mount
    fetchCategories();
    fetchProducts("");
  }, []);

  // when category changes, reload products
  useEffect(() => {
    fetchProducts(categoryFilter);
  }, [categoryFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      // refresh both product list and categories
      await fetchProducts(categoryFilter);
      await fetchCategories();
      alert("Deleted successfully");
    } catch (err) {
      console.error("Delete failed", err);
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  if (loading)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <CircularProgress />
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h2" gutterBottom>
            Manage Products
          </Typography>
        </Grid>

        <Grid item xs={12} md={6} sx={{ textAlign: { xs: "left", md: "right" } }}>
          <Link to="/admin/products/new">
            <Button variant="contained" color="primary">
              + Add Product
            </Button>
          </Link>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 2, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              label="Filter by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              fullWidth
              select
              size="small"
            >
              <MenuItem value="">
                <em>All categories</em>
              </MenuItem>

              {loadingCats ? (
                <MenuItem disabled>Loading…</MenuItem>
              ) : (
                categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Quick search title"
              size="small"
              fullWidth
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  const qstr = e.target.value.trim();
                  await fetchProducts(categoryFilter, qstr);
                }
              }}
              helperText="Type and press Enter to search titles/descriptions"
            />
          </Grid>

          <Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <Button
              variant="outlined"
              onClick={() => {
                setCategoryFilter("");
                fetchProducts("");
              }}
              sx={{ mr: 1 }}
            >
              Reset Filter
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                fetchCategories();
                fetchProducts(categoryFilter);
              }}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", py: 6 }}>
                    No products found.
                  </TableCell>
                </TableRow>
              )}

              {products.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>
                    {p.image ? (
                      <img
                        src={`http://localhost:5000${p.image}`}
                        alt={p.title}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  <TableCell>{p.title}</TableCell>

                  <TableCell>₹{p.price}</TableCell>

                  <TableCell>{p.stock}</TableCell>

                  <TableCell>{p.category || "—"}</TableCell>

                  <TableCell>
                    <Link to={`/admin/products/${p._id}/edit`}>
                      <Button size="small">Edit</Button>
                    </Link>
                    <Button color="error" size="small" onClick={() => handleDelete(p._1d || p._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
