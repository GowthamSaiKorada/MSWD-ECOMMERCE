// frontend/src/pages/Admin/AdminLayout.jsx
import React from "react";
import { Box } from "@mui/material";
import CategorySidebar from "../../components/CategorySidebar";

/*
 Admin layout: left sidebar (categories) + right content area.
 Wrap admin pages with <AdminLayout>content</AdminLayout>
*/
export default function AdminLayout({ children }) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
      <Box component="aside" sx={{ width: 260 }}>
        <CategorySidebar onSelect={() => {}} compact />
      </Box>

      <Box component="main" sx={{ flex: 1, px: 2 }}>
        {children}
      </Box>
    </Box>
    
  );
}
