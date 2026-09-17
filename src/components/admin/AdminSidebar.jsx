import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  alpha,
  Tooltip,
  Collapse,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useCustomizer } from "../../context/CustomizerContext";
import { useAuth } from "../../context/AuthContext";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PaymentIcon from "@mui/icons-material/Payment";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ReceiptIcon from "@mui/icons-material/Receipt";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SellIcon from "@mui/icons-material/Sell";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SellRoundedIcon from "@mui/icons-material/SellRounded";
import DomainRoundedIcon from "@mui/icons-material/DomainRounded";
import DesignServicesRoundedIcon from "@mui/icons-material/DesignServicesRounded";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import ChairRoundedIcon from "@mui/icons-material/ChairRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import ContactMailRoundedIcon from "@mui/icons-material/ContactMailRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import TerrainRoundedIcon from "@mui/icons-material/TerrainRounded";
import logoLight from "../../assets/images/logo_light.png";
import logoDark from "../../assets/images/logo_dark.png";
import { MotionBox, MotionStack } from "../common/MotionComponents";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from "./sidebarConstants";

const AdminSidebar = ({ open, onToggle, isMobile = false }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useCustomizer();
  const { user } = useAuth();
  const isRTL = settings.direction === "rtl";
  const [propertiesMenuOpen, setPropertiesMenuOpen] = useState(() => {
    return location.pathname.startsWith("/dashboard/properties");
  });
  const [projectsMenuOpen, setProjectsMenuOpen] = useState(() => {
    return location.pathname.startsWith("/dashboard/projects");
  });
  const [blogMenuOpen, setBlogMenuOpen] = useState(() => {
    return location.pathname.startsWith("/dashboard/blog");
  });
  const [usersMenuOpen, setUsersMenuOpen] = useState(() => {
    return location.pathname.startsWith("/dashboard/users");
  });
  const [agentsMenuOpen, setAgentsMenuOpen] = useState(() => {
    return location.pathname.startsWith("/dashboard/agents");
  });
  const [requestsMenuOpen, setRequestsMenuOpen] = useState(() => {
    return location.pathname.startsWith("/dashboard/requests");
  });

  // Update menu open state when location changes
  React.useEffect(() => {
    if (location.pathname.startsWith("/dashboard/properties")) {
      setPropertiesMenuOpen(true);
    }
    if (location.pathname.startsWith("/dashboard/projects")) {
      setProjectsMenuOpen(true);
    }
    if (location.pathname.startsWith("/dashboard/blog")) {
      setBlogMenuOpen(true);
    }
    if (location.pathname.startsWith("/dashboard/users")) {
      setUsersMenuOpen(true);
    }
    if (location.pathname.startsWith("/dashboard/agents")) {
      setAgentsMenuOpen(true);
    }
    if (location.pathname.startsWith("/dashboard/requests")) {
      setRequestsMenuOpen(true);
    }
  }, [location.pathname]);

  const role = user?.role;
  const isAgent = role === "agent";

  const baseMenuItems = [
    {
      id: "dashboard",
      label: t("dashboard.menu.dashboard"),
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      id: "properties",
      label: t("dashboard.menu.myProperties"),
      icon: <HomeWorkIcon />,
      path: "/dashboard/properties",
      submenu: [
        {
          id: "add-property",
          label: t("dashboard.menu.addProperty") || "Add Property",
          icon: <AddIcon />,
          path: "/dashboard/properties/add",
        },
        {
          id: "properties-list",
          label: t("dashboard.menu.propertiesList") || "Properties List",
          icon: <ListIcon />,
          path: "/dashboard/properties/list",
        },
        {
          id: "favorites",
          label: t("dashboard.menu.favorites") || "Favorites",
          icon: <FavoriteIcon />,
          path: "/dashboard/properties/favorites",
        },
        {
          id: "deleted-properties",
          label: t("dashboard.menu.deletedProperties") || "Deleted properties",
          icon: <DeleteIcon />,
          path: "/dashboard/properties/deleted",
        },
        {
          id: "contact-requests",
          label: t("dashboard.menu.contactRequests") || "Contact requests",
          icon: <MailOutlineIcon />,
          path: "/dashboard/properties/requests",
        },
      ],
    },
    {
      id: "projects",
      label: t("dashboard.menu.projects", "Projects"),
      icon: <ApartmentRoundedIcon />,
      path: "/dashboard/projects",
      submenu: [
        {
          id: "add-project",
          label: t("dashboard.menu.addProject", "Add Project"),
          icon: <AddIcon />,
          path: "/dashboard/projects/add",
        },
        {
          id: "projects-list",
          label: t("dashboard.menu.projectsList", "Projects List"),
          icon: <ListIcon />,
          path: "/dashboard/projects/list",
        },
      ],
    },
    {
      id: "blog",
      label: t("dashboard.menu.blog", "Blog"),
      icon: <ArticleRoundedIcon />,
      path: "/dashboard/blog",
      submenu: [
        {
          id: "add-blog-post",
          label: t("dashboard.menu.addBlogPost", "Add Blog Post"),
          icon: <AddIcon />,
          path: "/dashboard/blog/add",
        },
        {
          id: "blog-posts-list",
          label: t("dashboard.menu.blogPostsList", "Blog Posts List"),
          icon: <ListIcon />,
          path: "/dashboard/blog/list",
        },
      ],
    },
    {
      id: "users",
      label: t("dashboard.menu.manageUsers"),
      icon: <PeopleIcon />,
      path: "/dashboard/users",
      submenu: [
        {
          id: "profile",
          label: t("dashboard.menu.profile") || "Profile",
          icon: <PersonIcon />,
          path: "/dashboard/users/profile",
        },
        {
          id: "add-user",
          label: t("dashboard.menu.addUser") || "Add User",
          icon: <PersonAddIcon />,
          path: "/dashboard/users/add",
        },
        {
          id: "all-users",
          label: t("dashboard.menu.allUsers") || "All Users",
          icon: <PeopleIcon />,
          path: "/dashboard/users/all",
        },
        {
          id: "sales",
          label: t("dashboard.menu.sales", "Sales"),
          icon: <SellIcon />,
          path: "/dashboard/users/sales",
        },
      ],
    },
    {
      id: "agents",
      label: t("dashboard.menu.agents"),
      icon: <PersonIcon />,
      path: "/dashboard/agents",
      submenu: [
        {
          id: "add-agent",
          label: t("dashboard.menu.addAgent") || "Add Agent",
          icon: <PersonAddIcon />,
          path: "/dashboard/agents/add",
        },
        {
          id: "all-agents",
          label: t("dashboard.menu.allAgents") || "All Agents",
          icon: <PeopleIcon />,
          path: "/dashboard/agents/all",
        },
      ],
    },
    {
      id: "home-content",
      label: t("dashboard.menu.homeContent", "Home Page Content"),
      icon: <HomeRoundedIcon />,
      path: "/dashboard/home-content",
    },
    {
      id: "buy-content",
      label: t("dashboard.menu.buyContent", "Buy Page Content"),
      icon: <SellRoundedIcon />,
      path: "/dashboard/buy-content",
    },
    {
      id: "projects-content",
      label: t("dashboard.menu.projectsContent", "Projects Page Content"),
      icon: <DomainRoundedIcon />,
      path: "/dashboard/projects-content",
    },
    {
      id: "services-content",
      label: t("dashboard.menu.servicesContent", "Services Page Content"),
      icon: <DesignServicesRoundedIcon />,
      path: "/dashboard/services-content",
    },
    {
      id: "legal-services-content",
      label: t("dashboard.menu.legalServicesContent", "Legal Services Page Content"),
      icon: <GavelRoundedIcon />,
      path: "/dashboard/legal-services-content",
    },
    {
      id: "rental-services-content",
      label: t("dashboard.menu.rentalServicesContent", "Rental Services Page Content"),
      icon: <KeyRoundedIcon />,
      path: "/dashboard/rental-services-content",
    },
    {
      id: "furniture-content",
      label: t("dashboard.menu.furnitureContent", "Furniture & Furnishing Page Content"),
      icon: <ChairRoundedIcon />,
      path: "/dashboard/furniture-content",
    },
    {
      id: "team-members",
      label: t("dashboard.menu.teamMembers", "Meet Our Team"),
      icon: <GroupsRoundedIcon />,
      path: "/dashboard/team-members",
    },
    {
      id: "chatbot-leads",
      label: t("dashboard.menu.chatbotLeads", "Chatbot Leads"),
      icon: <SmartToyRoundedIcon />,
      path: "/dashboard/chatbot-leads",
    },
    {
      id: "faq-content",
      label: t("dashboard.menu.faqContent", "FAQ Page Content"),
      icon: <QuizRoundedIcon />,
      path: "/dashboard/faq-content",
    },
    {
      id: "about-content",
      label: t("dashboard.menu.aboutContent", "About Page Content"),
      icon: <InfoRoundedIcon />,
      path: "/dashboard/about-content",
    },
    {
      id: "contact-content",
      label: t("dashboard.menu.contactContent", "Contact Page Content"),
      icon: <ContactMailRoundedIcon />,
      path: "/dashboard/contact-content",
    },
    {
      id: "rent-content",
      label: t("dashboard.menu.rentContent", "Rent Page Content"),
      icon: <HomeWorkRoundedIcon />,
      path: "/dashboard/rent-content",
    },
    {
      id: "lands-content",
      label: t("dashboard.menu.landsContent", "Land & Buildings Content"),
      icon: <TerrainRoundedIcon />,
      path: "/dashboard/lands-content",
    },
    {
      id: "requests",
      label: t("dashboard.menu.requests", "Requests"),
      icon: <MailOutlineIcon />,
      path: "/dashboard/requests/agents",
      submenu: [
        {
          id: "general-messages",
          label: t("dashboard.menu.generalMessages", "General Messages"),
          icon: <MailOutlineIcon />,
          path: "/dashboard/requests/messages",
        },
        {
          id: "customer-requests",
          label: t("dashboard.requests.customersTab", "Customer requests"),
          icon: <MailOutlineIcon />,
          path: "/dashboard/properties/requests",
        },
        {
          id: "agent-requests",
          label: t("dashboard.requests.agentsTab", "Agent requests"),
          icon: <PersonIcon />,
          path: "/dashboard/requests/agents",
        },
      ],
    },
  ];

  // Apply role-based restrictions for agent / admin
  const menuItems = (() => {
    // Admin (and other non-agent roles)
    if (!isAgent) {
      return baseMenuItems.map((item) => {
        // Admin لا يرى "طلبات العملاء" تحت العقارات
        if (item.id === "properties" && item.submenu) {
          return {
            ...item,
            submenu: item.submenu.filter(
              (sub) => sub.id !== "contact-requests"
            ),
          };
        }
        return item;
      });
    }

    // Agent: إخفاء بعض الأقسام، والإبقاء على "طلبات العملاء" لعقاراته فقط
    return baseMenuItems
      .filter(
        (item) =>
          !["agents", "requests", "home-content", "buy-content", "projects-content", "services-content", "legal-services-content", "rental-services-content", "furniture-content", "team-members", "chatbot-leads", "faq-content", "about-content", "contact-content", "rent-content", "lands-content"].includes(item.id)
      )
      .map((item) => {
        if (item.id === "users" && item.submenu) {
          return {
            ...item,
            submenu: item.submenu.filter((sub) => sub.id === "profile"),
          };
        }
        return item;
      });
  })();

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={onToggle}
      anchor={isRTL ? "right" : "left"}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      sx={{
        width: open ? SIDEBAR_WIDTH : isMobile ? 0 : SIDEBAR_WIDTH_COLLAPSED,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open
            ? SIDEBAR_WIDTH
            : isMobile
            ? SIDEBAR_WIDTH
            : SIDEBAR_WIDTH_COLLAPSED,
          boxSizing: "border-box",
          [isRTL ? "borderLeft" : "borderRight"]: (theme) =>
            `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowX: "hidden",
          bgcolor: "background.paper",
          direction: isRTL ? "rtl" : "ltr",
          ...(isMobile && {
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(0,0,0,0.5)"
                : "0 8px 32px rgba(0,0,0,0.15)",
          }),
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Logo & Toggle */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: isRTL ? "row-reverse" : "row",
            borderBottom: (theme) =>
              `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            minHeight: 80,
          }}
        >
          {isRTL ? (
            <>
              <IconButton
                onClick={onToggle}
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
              <MotionBox
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  overflow: "hidden",
                  flexDirection: "row-reverse",
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {open && (
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                      fontSize: "1.5rem",
                      background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    NEXUS
                  </Typography>
                )}
                <Box
                  component="img"
                  src={settings.mode === "light" ? logoDark : logoLight}
                  alt="NEXUS"
                  sx={{
                    height: 40,
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
              </MotionBox>
            </>
          ) : (
            <>
              <MotionBox
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  overflow: "hidden",
                  flexDirection: "row",
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  component="img"
                  src={settings.mode === "light" ? logoDark : logoLight}
                  alt="NEXUS"
                  sx={{
                    height: 40,
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
                {open && (
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                      fontSize: "1.5rem",
                      background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    NEXUS
                  </Typography>
                )}
              </MotionBox>
              <IconButton
                onClick={onToggle}
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </>
          )}
        </Box>

        {/* User Profile */}
        <Box
          sx={{
            p: 2,
            borderBottom: (theme) =>
              `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <MotionStack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              flexDirection: isRTL ? "row-reverse" : "row",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Avatar
              sx={{
                width: open ? 48 : 40,
                height: open ? 48 : 40,
                bgcolor: "primary.main",
                fontWeight: 700,
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </Avatar>
            {open && (
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{
                    fontSize: "0.95rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.name || t("dashboard.user.name") || "User"}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: "0.8rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  {user?.email || t("dashboard.user.email") || ""}
                </Typography>
              </Box>
            )}
          </MotionStack>
        </Box>

        {/* Menu Items */}
        <Box sx={{ flex: 1, overflowY: "auto", py: 2 }}>
          <List sx={{ px: 1 }}>
            {menuItems.map((item) => {
              const active = isActive(item.path);
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isPropertiesItem = item.id === "properties";
              const isProjectsItem = item.id === "projects";
              const isBlogItem = item.id === "blog";
              const isUsersItem = item.id === "users";
              const isAgentsItem = item.id === "agents";
              const isRequestsItem = item.id === "requests";
              const submenuOpen = isPropertiesItem
                ? propertiesMenuOpen
                : isProjectsItem
                ? projectsMenuOpen
                : isBlogItem
                ? blogMenuOpen
                : isUsersItem
                ? usersMenuOpen
                : isAgentsItem
                ? agentsMenuOpen
                : isRequestsItem
                ? requestsMenuOpen
                : false;

              return (
                <React.Fragment key={item.id}>
                  <ListItem disablePadding sx={{ mb: 0.5, px: 1 }}>
                    {open ? (
                      <ListItemButton
                        onClick={() => {
                          if (hasSubmenu) {
                            if (isPropertiesItem) {
                              setPropertiesMenuOpen(!propertiesMenuOpen);
                            } else if (isProjectsItem) {
                              setProjectsMenuOpen(!projectsMenuOpen);
                            } else if (isBlogItem) {
                              setBlogMenuOpen(!blogMenuOpen);
                            } else if (isUsersItem) {
                              setUsersMenuOpen(!usersMenuOpen);
                            } else if (isAgentsItem) {
                              setAgentsMenuOpen(!agentsMenuOpen);
                            } else if (isRequestsItem) {
                              setRequestsMenuOpen(!requestsMenuOpen);
                            }
                          } else {
                            navigate(item.path);
                          }
                        }}
                        sx={{
                          borderRadius: 2,
                          py: 1.5,
                          px: 2,
                          bgcolor: active
                            ? (theme) => alpha(theme.palette.primary.main, 0.12)
                            : "transparent",
                          color: active ? "primary.main" : "text.primary",
                          "&:hover": {
                            bgcolor: active
                              ? (theme) =>
                                  alpha(theme.palette.primary.main, 0.2)
                              : (theme) =>
                                  alpha(theme.palette.primary.main, 0.08),
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 40,
                            color: active ? "primary.main" : "text.secondary",
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontWeight: active ? 700 : 500,
                            fontSize: "0.95rem",
                            textAlign: isRTL ? "right" : "left",
                          }}
                        />
                        {hasSubmenu && open && (
                          <Box
                            sx={{
                              ml: isRTL ? 0 : 1,
                              mr: isRTL ? 1 : 0,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {submenuOpen ? (
                              <ExpandLessIcon fontSize="small" />
                            ) : (
                              <ExpandMoreIcon fontSize="small" />
                            )}
                          </Box>
                        )}
                      </ListItemButton>
                    ) : (
                      <Tooltip
                        title={item.label}
                        placement={isRTL ? "left" : "right"}
                        arrow
                      >
                        <ListItemButton
                          onClick={() => navigate(item.path)}
                          sx={{
                            borderRadius: 2,
                            py: 1.5,
                            justifyContent: "center",
                            bgcolor: active
                              ? (theme) =>
                                  alpha(theme.palette.primary.main, 0.12)
                              : "transparent",
                            color: active ? "primary.main" : "text.primary",
                            "&:hover": {
                              bgcolor: active
                                ? (theme) =>
                                    alpha(theme.palette.primary.main, 0.2)
                                : (theme) =>
                                    alpha(theme.palette.primary.main, 0.08),
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: "auto",
                              color: active ? "primary.main" : "text.secondary",
                              justifyContent: "center",
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                        </ListItemButton>
                      </Tooltip>
                    )}
                  </ListItem>
                  {hasSubmenu && open && (
                    <Collapse in={submenuOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.submenu.map((subItem) => {
                          const subActive = location.pathname === subItem.path;
                          return (
                            <ListItem
                              key={subItem.id}
                              disablePadding
                              sx={{ mb: 0.5, px: 1, pl: isRTL ? 1 : 4 }}
                            >
                              <ListItemButton
                                onClick={() => navigate(subItem.path)}
                                sx={{
                                  borderRadius: 2,
                                  py: 1.25,
                                  px: 2,
                                  bgcolor: subActive
                                    ? (theme) =>
                                        alpha(theme.palette.primary.main, 0.12)
                                    : "transparent",
                                  color: subActive
                                    ? "primary.main"
                                    : "text.primary",
                                  "&:hover": {
                                    bgcolor: subActive
                                      ? (theme) =>
                                          alpha(theme.palette.primary.main, 0.2)
                                      : (theme) =>
                                          alpha(
                                            theme.palette.primary.main,
                                            0.08
                                          ),
                                  },
                                  transition: "all 0.3s ease",
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    minWidth: 32,
                                    color: subActive
                                      ? "primary.main"
                                      : "text.secondary",
                                  }}
                                >
                                  {subItem.icon}
                                </ListItemIcon>
                                <ListItemText
                                  primary={subItem.label}
                                  primaryTypographyProps={{
                                    fontWeight: subActive ? 700 : 500,
                                    fontSize: "0.875rem",
                                    textAlign: isRTL ? "right" : "left",
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              );
            })}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
