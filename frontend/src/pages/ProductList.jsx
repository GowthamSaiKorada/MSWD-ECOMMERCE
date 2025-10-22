// frontend/src/pages/ProductList.jsx
import React, { useEffect, useState } from "react";
import api from "../api/api";
import CategorySidebar from "../components/CategorySidebar";
import ProductCard from "../components/ProductCard";
import { Box, Grid, TextField, Button, Paper } from "@mui/material";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  async function load(p = page, cat = category, query = q) {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (cat) params.set("category", cat);
      params.set("page", p);
      params.set("limit", 12);
      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.items || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error("load products", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1, category, q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, q]);

  useEffect(() => {
    load(page, category, q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
      <Box sx={{ width: 260 }}>
        <CategorySidebar onSelect={(c) => { setCategory(c); setPage(1); }} />
      </Box>

      <Box sx={{ flex: 1 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Search all products..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              size="small"
            />
            <Button variant="contained" onClick={() => { setPage(1); load(1, category, q); }}>
              Search
            </Button>
            <Button onClick={() => { setQ(""); setCategory(null); setPage(1); }}>
              Reset
            </Button>
          </Box>
        </Paper>

        <Grid container spacing={2}>
          {products.map((p) => (
            <Grid item key={p._id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={p} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button disabled={page <= 1} onClick={() => setPage((s) => Math.max(1, s - 1))}>
            Prev
          </Button>
          <span style={{ margin: "0 12px" }}>Page {page} / {pages}</span>
          <Button disabled={page >= pages} onClick={() => setPage((s) => Math.min(pages, s + 1))}>
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
