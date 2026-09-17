import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import AdminSidebar from "../components/admin/AdminSidebar";
import {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_COLLAPSED,
} from "../components/admin/sidebarConstants";
import AdminNavbar from "../components/admin/AdminNavbar";
import Customizer from "../components/customizer/Customizer";
import { useCustomizer } from "../context/CustomizerContext";
import { useAuth } from "../context/AuthContext";
import PageSpinner from "../components/common/PageSpinner";

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { settings } = useCustomizer();
  const { user, initializing } = useAuth();
  const isRTL = settings.direction === "rtl";

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const role = user?.role;
  const isAdmin = role === "admin";
  const isAgent = role === "agent";

  if (initializing) {
    return <PageSpinner visible />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin && !isAgent) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        direction: settings.direction,
        flexDirection: isRTL ? "row-reverse" : "row",
        overflow: "hidden",
      }}
    >
      <AdminSidebar
        open={sidebarOpen}
        onToggle={handleToggleSidebar}
        isMobile={isMobile}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: {
            xs: "100%",
            md: `calc(100% - ${
              sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_COLLAPSED
            }px)`,
          },
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          minWidth: 0,
          order: isRTL ? -1 : 1,
          overflow: "hidden",
        }}
      >
        <AdminNavbar onToggleSidebar={handleToggleSidebar} isMobile={isMobile} />
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            px: { xs: 1, sm: 2, md: 0 },
            py: { xs: 1, sm: 2 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
      {isAdmin && <Customizer />}
    </Box>
  );
};

export default AdminLayout;
