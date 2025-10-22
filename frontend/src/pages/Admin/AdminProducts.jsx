// frontend/src/pages/Admin/AdminProducts.jsx
import React, { useEffect, useState } from "react";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Button } from "@mui/material";
import api from "../../api/api";
import AdminLayout from "./AdminLayout";
import { useNavigate } from "react-router-dom";

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  useEffect(() => { load(); }, []);
  async function load() {
    const res = await api.get("/products?limit=500");
    setItems(res.data.items || []);
  }

  const del = async (id) => {
    if (!confirm("Delete product?")) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <AdminLayout>
      <Box>
        <Button variant="contained" onClick={() => nav("/admin/products/new")} sx={{ mb: 2 }}>
          Add product
        </Button>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(p => (
              <TableRow key={p._id}>
                <TableCell>{p.title}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>₹{p.price}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>
                  <Button onClick={() => nav(`/admin/products/${p._id}/edit`)}>Edit</Button>
                  <Button color="error" onClick={() => del(p._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </AdminLayout>
  );
}
