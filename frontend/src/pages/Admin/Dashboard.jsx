// frontend/src/pages/Admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

export default function Dashboard() {
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load stats", err);
        setError(err?.response?.data?.message || "Error loading stats");
      }
    }
    fetchStats();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <p><strong>Total Products:</strong> {stats.totalProducts}</p>
      <p><strong>Total Orders:</strong> {stats.totalOrders}</p>
      <p><strong>Total Revenue:</strong> ₹{stats.totalRevenue}</p>

      {/* Add link to Manage Products */}
      <div style={{ marginTop: 20 }}>
        <Link to="/admin/products">
          <Button variant="contained" color="primary">
            Manage Products
          </Button>
        </Link>
      </div>
    </div>
  );
}
