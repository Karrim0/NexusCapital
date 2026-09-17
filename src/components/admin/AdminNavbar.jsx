import { useState, useEffect, useRef } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip,
  alpha,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import EditIcon from "@mui/icons-material/Edit";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LanguageSelector from "../navigation/LanguageSelector";
import ThemeToggle from "../navigation/ThemeToggle";
import { useCustomizer } from "../../context/CustomizerContext";
import { useAuth } from "../../context/AuthContext";
import LogoutIcon from "@mui/icons-material/Logout";
import { fetchContactRequests } from "../../api/contactRequests";
import { fetchPendingAgents } from "../../api/agents";

const AdminNavbar = ({ onToggleSidebar, isMobile = false }) => {
  const { t } = useTranslation();
  const { settings } = useCustomizer();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isRTL = settings.direction === "rtl";
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [contactRequests, setContactRequests] = useState([]);
  const [agentRequests, setAgentRequests] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [readContactRequestIds, setReadContactRequestIds] = useState(new Set());
  const [readAgentRequestIds, setReadAgentRequestIds] = useState(new Set());
  const isFirstLoadRef = useRef(true);
  const lastUserIdRef = useRef(null);
  const localStorageLoadedRef = useRef(false);
  const skipSaveRef = useRef(false);

  // Load read state from localStorage on mount
  useEffect(() => {
    if (!user) {
      localStorageLoadedRef.current = false;
      return;
    }

    const storageKey = `readNotifications_${user.id}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Skip saving when loading from localStorage to prevent overwriting
        skipSaveRef.current = true;
        if (
          parsed.contactRequestIds &&
          Array.isArray(parsed.contactRequestIds)
        ) {
          const contactIds = new Set(parsed.contactRequestIds);
          setReadContactRequestIds(contactIds);
        }
        if (parsed.agentRequestIds && Array.isArray(parsed.agentRequestIds)) {
          const agentIds = new Set(parsed.agentRequestIds);
          setReadAgentRequestIds(agentIds);
        }
        // Reset skip flag after state updates
        setTimeout(() => {
          skipSaveRef.current = false;
        }, 100);
      }
      localStorageLoadedRef.current = true;
    } catch (err) {
      console.error(
        "Failed to load read notifications from localStorage:",
        err
      );
      localStorageLoadedRef.current = true;
    }
  }, [user]);

  // Save read state to localStorage whenever it changes
  useEffect(() => {
    if (!user) return;
    if (skipSaveRef.current) {
      return;
    }

    const storageKey = `readNotifications_${user.id}`;
    try {
      const data = {
        contactRequestIds: Array.from(readContactRequestIds),
        agentRequestIds: Array.from(readAgentRequestIds),
      };
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (err) {
      console.error("Failed to save read notifications to localStorage:", err);
    }
  }, [readContactRequestIds, readAgentRequestIds, user]);
  const open = Boolean(anchorEl);
  const notificationsOpen = Boolean(notificationsAnchorEl);

  const avatarLetter =
    (user?.name && user.name.charAt(0).toUpperCase()) ||
    (user?.email && user.email.charAt(0).toUpperCase()) ||
    "A";

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
    // Don't mark as read when opening the menu - only when clicking on a notification
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const toggleFullscreen = () => {
    if (!fullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setFullscreen(!fullscreen);
  };

  // Fetch requests for notifications
  useEffect(() => {
    const loadRequests = async () => {
      try {
        const isAdmin = user?.role === "admin";
        const isAgent = user?.role === "agent";

        if (isAdmin || isAgent) {
          const contactReqs = await fetchContactRequests();
          setContactRequests(contactReqs || []);

          // Clean up read state: remove IDs that no longer exist in the data
          if (contactReqs && contactReqs.length > 0) {
            const existingIds = new Set(contactReqs.map((req) => req.id));
            setReadContactRequestIds((prev) => {
              const cleaned = new Set();
              prev.forEach((id) => {
                if (existingIds.has(id)) {
                  cleaned.add(id);
                }
              });
              return cleaned;
            });
          }
        }

        if (isAdmin) {
          const agentReqs = await fetchPendingAgents();
          setAgentRequests(agentReqs || []);

          // Clean up read state: remove IDs that no longer exist in the data
          if (agentReqs && agentReqs.length > 0) {
            const existingIds = new Set(agentReqs.map((agent) => agent.id));
            setReadAgentRequestIds((prev) => {
              const cleaned = new Set();
              prev.forEach((id) => {
                if (existingIds.has(id)) {
                  cleaned.add(id);
                }
              });
              return cleaned;
            });
          }
        }

        // Mark first load as complete after loading all requests
        if (isFirstLoadRef.current) {
          isFirstLoadRef.current = false;
        }
      } catch {
        // Failed to load requests
      }
    };

    if (user) {
      // Reset first load flag when user changes
      if (lastUserIdRef.current !== user.id) {
        isFirstLoadRef.current = true;
        lastUserIdRef.current = user.id;
        // Read state will be loaded from localStorage in the useEffect above
      }

      loadRequests();
      // Refresh every 30 seconds
      const interval = setInterval(loadRequests, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Calculate notifications count (only unread notifications)
  useEffect(() => {
    const isAdmin = user?.role === "admin";
    const isAgent = user?.role === "agent";

    let count = 0;
    if (isAdmin || isAgent) {
      // Separate general messages (no property_id) from property contact requests
      const generalMessages = contactRequests.filter((req) => !req.property_id);
      const propertyRequests = contactRequests.filter((req) => req.property_id);

      // Count unread general messages (for admin only)
      if (isAdmin) {
        const unreadGeneralMessages = generalMessages.filter(
          (req) => req.status === "new" && !readContactRequestIds.has(req.id)
        );
        count += unreadGeneralMessages.length;
      }

      // Count unread property contact requests
      const unreadPropertyRequests = propertyRequests.filter(
        (req) => req.status === "new" && !readContactRequestIds.has(req.id)
      );
      count += unreadPropertyRequests.length;
    }
    if (isAdmin) {
      // Count only unread agent requests
      const unreadAgentRequests = agentRequests.filter(
        (agent) => !readAgentRequestIds.has(agent.id)
      );
      count += unreadAgentRequests.length;
    }
    setNotificationsCount(count);
  }, [
    contactRequests,
    agentRequests,
    readContactRequestIds,
    readAgentRequestIds,
    user,
  ]);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: (theme) =>
          `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        direction: settings.direction,
      }}
    >
      <Toolbar
        sx={{
          px: { xs: 1.5, sm: 2, md: 3 },
          py: { xs: 1, md: 1.5 },
          flexDirection: isRTL ? "row-reverse" : "row",
          gap: { xs: 0.5, sm: 1 },
        }}
      >
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            onClick={onToggleSidebar}
            sx={{
              mr: isRTL ? 0 : 1,
              ml: isRTL ? 1 : 0,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              "&:hover": {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Search Bar - Hidden on very small screens */}
        {!isSmallScreen && (
          <TextField
            placeholder={t("dashboard.searchPlaceholder") || "Search..."}
            size="small"
            sx={{
              flex: { xs: 0, sm: 1 },
              maxWidth: { xs: 200, sm: 300, md: 400 },
              mr: isRTL ? 0 : { xs: 1, sm: 2 },
              ml: isRTL ? { xs: 1, sm: 2 } : 0,
              "& .MuiOutlinedInput-root": {
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.background.default, 0.5)
                    : alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2,
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.default, 0.7)
                      : alpha(theme.palette.primary.main, 0.08),
                },
                "&.Mui-focused": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.default, 0.8)
                      : alpha(theme.palette.primary.main, 0.1),
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        )}

        {isRTL ? (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, sm: 1 },
                flexDirection: "row-reverse",
                ml: "auto",
              }}
            >
              {/* Profile */}
              <Tooltip title={t("dashboard.profile.title") || "Profile"} arrow>
                <IconButton
                  onClick={handleProfileClick}
                  sx={{
                    p: 0.5,
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "primary.main",
                      fontWeight: 700,
                    }}
                  >
                    {avatarLetter}
                  </Avatar>
                </IconButton>
              </Tooltip>

              {/* Notifications */}
              <Tooltip
                title={t("dashboard.notifications") || "Notifications"}
                arrow
              >
                <IconButton
                  onClick={handleNotificationsClick}
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    "&:hover": {
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                >
                  <Badge
                    badgeContent={
                      notificationsCount > 0 ? notificationsCount : null
                    }
                    color="error"
                    max={99}
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Theme Toggle - Hidden on very small screens */}
              {!isSmallScreen && (
                <Box
                  sx={{
                    "& .theme-icon svg, & .MuiIconButton-root .theme-icon svg":
                      {
                        color:
                          settings.mode === "light"
                            ? "rgba(0,0,0,0.7) !important"
                            : undefined,
                      },
                  }}
                >
                  <ThemeToggle />
                </Box>
              )}

              {/* Language Selector - Hidden on very small screens */}
              {!isSmallScreen && (
                <Box
                  sx={{
                    "& .lang-icon, & button .lang-icon": {
                      color:
                        settings.mode === "light"
                          ? "rgba(0,0,0,0.7) !important"
                          : undefined,
                    },
                  }}
                >
                  <LanguageSelector />
                </Box>
              )}

              {/* Home - Hidden on small screens */}
              {!isSmallScreen && (
                <Tooltip title={t("nav.home") || "Home"} arrow>
                  <IconButton
                    onClick={() => navigate("/")}
                    sx={{
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.1),
                      "&:hover": {
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    <HomeRoundedIcon />
                  </IconButton>
                </Tooltip>
              )}

              {/* Fullscreen - Hidden on small screens */}
              {!isSmallScreen && (
                <Tooltip
                  title={t("dashboard.fullscreen") || "Fullscreen"}
                  arrow
                >
                  <IconButton
                    onClick={toggleFullscreen}
                    sx={{
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.1),
                      "&:hover": {
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexDirection: "row-reverse",
                justifyContent: "flex-end",
              }}
            >
              {/* Search Bar - Responsive */}
              <TextField
                placeholder={t("dashboard.searchPlaceholder") || "Search..."}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon
                        sx={{ fontSize: 20, color: "text.secondary" }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  flexGrow: 1,
                  maxWidth: { xs: "100%", sm: 300, md: 400, lg: 500 },
                  display: { xs: "none", sm: "flex" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.background.paper, 0.5)
                        : alpha(theme.palette.primary.main, 0.05),
                    "&:hover": {
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.background.paper, 0.7)
                          : alpha(theme.palette.primary.main, 0.08),
                    },
                    "&.Mui-focused": {
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.background.paper, 0.7)
                          : alpha(theme.palette.primary.main, 0.08),
                    },
                  },
                }}
              />
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexDirection: "row",
              }}
            >
              {/* Search Bar - Responsive */}
              <TextField
                placeholder={t("dashboard.searchPlaceholder") || "Search..."}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{ fontSize: 20, color: "text.secondary" }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  flexGrow: 1,
                  maxWidth: { xs: "100%", sm: 300, md: 400, lg: 500 },
                  display: { xs: "none", sm: "flex" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.background.paper, 0.5)
                        : alpha(theme.palette.primary.main, 0.05),
                    "&:hover": {
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.background.paper, 0.7)
                          : alpha(theme.palette.primary.main, 0.08),
                    },
                    "&.Mui-focused": {
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.background.paper, 0.7)
                          : alpha(theme.palette.primary.main, 0.08),
                    },
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, sm: 1 },
                flexDirection: "row",
              }}
            >
              {/* Home - Hidden on small screens */}
              {!isSmallScreen && (
                <Tooltip title={t("nav.home") || "Home"} arrow>
                  <IconButton
                    onClick={() => navigate("/")}
                    sx={{
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.1),
                      "&:hover": {
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    <HomeRoundedIcon />
                  </IconButton>
                </Tooltip>
              )}

              {/* Fullscreen - Hidden on small screens */}
              {!isSmallScreen && (
                <Tooltip
                  title={t("dashboard.fullscreen") || "Fullscreen"}
                  arrow
                >
                  <IconButton
                    onClick={toggleFullscreen}
                    sx={{
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.1),
                      "&:hover": {
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                  </IconButton>
                </Tooltip>
              )}

              {/* Language Selector - Hidden on very small screens */}
              {!isSmallScreen && (
                <Box
                  sx={{
                    "& .lang-icon, & button .lang-icon": {
                      color:
                        settings.mode === "light"
                          ? "rgba(0,0,0,0.7) !important"
                          : undefined,
                    },
                  }}
                >
                  <LanguageSelector />
                </Box>
              )}

              {/* Theme Toggle - Hidden on very small screens */}
              {!isSmallScreen && (
                <Box
                  sx={{
                    "& .theme-icon svg, & .MuiIconButton-root .theme-icon svg":
                      {
                        color:
                          settings.mode === "light"
                            ? "rgba(0,0,0,0.7) !important"
                            : undefined,
                      },
                  }}
                >
                  <ThemeToggle />
                </Box>
              )}

              {/* Notifications */}
              <Tooltip
                title={t("dashboard.notifications") || "Notifications"}
                arrow
              >
                <IconButton
                  onClick={handleNotificationsClick}
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    "&:hover": {
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                >
                  <Badge
                    badgeContent={
                      notificationsCount > 0 ? notificationsCount : null
                    }
                    color="error"
                    max={99}
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Profile */}
              <Tooltip title={t("dashboard.profile.title") || "Profile"} arrow>
                <IconButton
                  onClick={handleProfileClick}
                  sx={{
                    p: 0.5,
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "primary.main",
                      fontWeight: 700,
                    }}
                  >
                    {avatarLetter}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </>
        )}
      </Toolbar>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={notificationsOpen}
        onClose={handleNotificationsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: isRTL ? "left" : "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: isRTL ? "left" : "right",
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 320,
            maxWidth: 400,
            maxHeight: 500,
            borderRadius: 2,
            boxShadow: (theme) =>
              `0 12px 40px ${alpha(theme.palette.common.black, 0.15)}`,
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            direction: settings.direction,
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: (theme) =>
              `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography variant="subtitle2" fontWeight={700}>
            {t("dashboard.notifications") || "Notifications"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("dashboard.recentRequests") || "Recent requests"}
          </Typography>
        </Box>
        <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
          {(() => {
            // Combine all notifications (contact requests + agent requests)
            const allNotifications = [];

            // Add contact requests (separate general messages from property requests)
            if (contactRequests.length > 0) {
              contactRequests
                .filter((req) => req.status === "new")
                .forEach((req) => {
                  const isGeneralMessage = !req.property_id;
                  allNotifications.push({
                    id: `contact-${req.id}`,
                    type: isGeneralMessage ? "general-message" : "contact",
                    data: req,
                    createdAt: req.created_at,
                  });
                });
            }

            // Add agent requests (Admin only)
            if (user?.role === "admin" && agentRequests.length > 0) {
              agentRequests.forEach((agent) => {
                allNotifications.push({
                  id: `agent-${agent.id}`,
                  type: "agent",
                  data: agent,
                  createdAt: agent.created_at,
                });
              });
            }

            // Sort by date (newest first)
            allNotifications.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            // Show only first 10 notifications
            const notificationsToShow = allNotifications.slice(0, 10);

            if (notificationsToShow.length === 0) {
              return (
                <Box sx={{ px: 2, py: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    {t("dashboard.notificationsDetails.noNotifications") ||
                      "No new notifications"}
                  </Typography>
                </Box>
              );
            }

            return notificationsToShow.map((notification) => {
              if (
                notification.type === "contact" ||
                notification.type === "general-message"
              ) {
                const req = notification.data;
                const isGeneralMessage =
                  notification.type === "general-message";
                return (
                  <MenuItem
                    key={notification.id}
                    onClick={() => {
                      handleNotificationsClose();

                      // Handle general messages - go to messages page only
                      if (isGeneralMessage) {
                        // Mark all general messages as read
                        const allGeneralMessageIds = contactRequests
                          .filter((r) => !r.property_id && r.status === "new")
                          .map((r) => r.id);
                        if (allGeneralMessageIds.length > 0) {
                          setReadContactRequestIds((prev) => {
                            const newSet = new Set(prev);
                            allGeneralMessageIds.forEach((id) =>
                              newSet.add(id)
                            );
                            return newSet;
                          });
                        }
                        // Navigate to messages page only
                        navigate("/dashboard/requests/messages");
                      } else {
                        // Handle property contact requests - go to properties requests page
                        const allPropertyRequestIds = contactRequests
                          .filter((r) => r.property_id && r.status === "new")
                          .map((r) => r.id);
                        if (allPropertyRequestIds.length > 0) {
                          setReadContactRequestIds((prev) => {
                            const newSet = new Set(prev);
                            allPropertyRequestIds.forEach((id) =>
                              newSet.add(id)
                            );
                            return newSet;
                          });
                        }
                        // Navigate to properties requests page
                        navigate("/dashboard/properties/requests");
                      }
                    }}
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderBottom: (theme) =>
                        `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.05),
                      "&:hover": {
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        justifyContent: isRTL ? "flex-end" : "flex-start",
                      }}
                    >
                      {isGeneralMessage ? (
                        <MailOutlineIcon
                          sx={{
                            color: "secondary.main",
                            fontSize: 24,
                          }}
                        />
                      ) : (
                        <PersonIcon
                          sx={{
                            color: "primary.main",
                            fontSize: 24,
                          }}
                        />
                      )}
                    </ListItemIcon>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {isGeneralMessage
                          ? t(
                              "dashboard.notificationsDetails.generalMessage"
                            ) || "New General Message"
                          : t(
                              "dashboard.notificationsDetails.contactRequest"
                            ) || "New Contact Request"}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {req.name}
                        {!isGeneralMessage && req.property?.title
                          ? ` - ${req.property.title}`
                          : ""}
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              } else {
                const agent = notification.data;
                return (
                  <MenuItem
                    key={notification.id}
                    onClick={() => {
                      handleNotificationsClose();

                      // Mark all agent requests as read when navigating to the page
                      const allAgentIds = agentRequests.map((a) => a.id);
                      if (allAgentIds.length > 0) {
                        setReadAgentRequestIds((prev) => {
                          const newSet = new Set(prev);
                          allAgentIds.forEach((id) => newSet.add(id));
                          return newSet;
                        });
                      }

                      navigate("/dashboard/requests/agents");
                    }}
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderBottom: (theme) =>
                        `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.05),
                      "&:hover": {
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        justifyContent: isRTL ? "flex-end" : "flex-start",
                      }}
                    >
                      <BusinessIcon
                        sx={{
                          color: "primary.main",
                          fontSize: 24,
                        }}
                      />
                    </ListItemIcon>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {t("dashboard.notificationsDetails.agentRequest") ||
                          "New Agent Request"}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        {agent.name || agent.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              }
            });
          })()}
        </Box>
      </Menu>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: isRTL ? "left" : "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: isRTL ? "left" : "right",
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: (theme) =>
              `0 12px 40px ${alpha(theme.palette.common.black, 0.15)}`,
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            direction: settings.direction,
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: (theme) =>
              `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography variant="subtitle2" fontWeight={700}>
            {user?.name || t("dashboard.user.name") || "User"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email || t("dashboard.user.email") || ""}
          </Typography>
        </Box>
        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/dashboard/users/profile");
          }}
          sx={{
            flexDirection: isRTL ? "row-reverse" : "row",
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: isRTL ? 36 : 40,
              [isRTL ? "mr" : "ml"]: 0,
              [isRTL ? "ml" : "mr"]: 2,
            }}
          >
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={t("dashboard.editProfile") || "Edit Profile"}
            sx={{
              textAlign: isRTL ? "right" : "left",
            }}
          />
        </MenuItem>
        <MenuItem
          onClick={async () => {
            handleClose();
            try {
              await logout();
            } finally {
              window.alert(
                t(
                  "dashboard.logoutSuccess",
                  "You have been logged out successfully ✅."
                )
              );
              navigate("/");
            }
          }}
          sx={{
            flexDirection: isRTL ? "row-reverse" : "row",
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: isRTL ? 36 : 40,
              [isRTL ? "mr" : "ml"]: 0,
              [isRTL ? "ml" : "mr"]: 2,
            }}
          >
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={t("dashboard.logout") || "Logout"}
            sx={{
              textAlign: isRTL ? "right" : "left",
            }}
          />
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default AdminNavbar;
