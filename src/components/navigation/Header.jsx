import { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  useScrollTrigger,
  Divider,
  alpha,
  Menu,
  MenuItem,
  Collapse,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCustomizer } from "../../context/CustomizerContext";
import { useAuth } from "../../context/AuthContext";
import useHomeContent from "../../hooks/useHomeContent";
import { nx } from "../../theme/nexusHomeTheme";
import LanguageSelector from "./LanguageSelector";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import logoLight from "../../assets/images/logo_light.png";
import logoDark from "../../assets/images/logo_dark.png";
import { NAV_MENU_ITEMS, DEFAULT_NAV_MENU, SERVICES_DROPDOWN_KEYS, ABOUT_DROPDOWN_KEYS } from "../../constants/navMenu";
import { getBarePathname, localizePathFromLocation } from "../../utils/localizedPath";

const useScrolled = (threshold = 40) => {
  return useScrollTrigger({ disableHysteresis: true, threshold });
};

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const { settings } = useCustomizer();
  const isRTL = settings.direction === "rtl";
  const { content: home } = useHomeContent();
  const whatsappNumber = (home.topbar?.whatsapp_number || "").replace(/[^\d+]/g, "").replace("+", "");
  const scrolled = useScrolled(40);
  const currentBarePath = getBarePathname(location.pathname);
  const localizedPath = (path) => localizePathFromLocation(path, location.pathname);

  const role = user?.role;
  const canAccessDashboard = role === "admin" || role === "agent";

  const navMenu = home.nav_menu?.length ? home.nav_menu : DEFAULT_NAV_MENU;
  const navLinks = [
    ...navMenu
      .filter((item) => item.visible !== false && NAV_MENU_ITEMS[item.key])
      .map((item) => ({
        label: item.label || t(NAV_MENU_ITEMS[item.key].translationKey),
        path: NAV_MENU_ITEMS[item.key].path,
      })),
    ...(canAccessDashboard
      ? [{ label: t("nav.dashboard"), path: "/dashboard" }]
      : []),
  ];

  // Sub-links shown inside the "Services" dropdown (Services overview,
  // Legal Services, Rental Services), in the header nav.
  const servicesDropdownLinks = SERVICES_DROPDOWN_KEYS.map((key) => ({
    label: t(NAV_MENU_ITEMS[key].translationKey),
    path: NAV_MENU_ITEMS[key].path,
  }));

  // Sub-links shown inside the "About Us" dropdown (About Us overview,
  // Meet Our Team).
  const aboutDropdownLinks = ABOUT_DROPDOWN_KEYS.map((key) => ({
    label: t(NAV_MENU_ITEMS[key].translationKey),
    path: NAV_MENU_ITEMS[key].path,
  }));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => {
    if (path === "/") {
      return currentBarePath === "/";
    }

    return currentBarePath === path || currentBarePath.startsWith(`${path}/`);
  };

  const NavButton = ({ link }) => {
    const active = isActive(link.path);

    return (
      <Box
        component={Link}
        to={localizedPath(link.path)}
        sx={{
          position: "relative",
          textDecoration: "none",
          color: active ? nx.gold : nx.textOnDark,
          px: 2,
          py: 1.5,
          borderRadius: 2,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&::before": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: active
              ? "translateX(-50%) scaleX(1)"
              : "translateX(-50%) scaleX(0)",
            width: "60%",
            height: 3,
            bgcolor: nx.gold,
            borderRadius: "2px 2px 0 0",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          },
          "&:hover": {
            bgcolor: "rgba(201,162,75,0.08)",
            color: nx.gold,
            "&::before": {
              transform: "translateX(-50%) scaleX(1)",
            },
          },
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: active ? 700 : 500,
            fontSize: "0.82rem",
            letterSpacing: "0.03em",
            textTransform: "uppercase",
            transition: "font-weight 0.2s ease",
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          {link.label}
        </Typography>
      </Box>
    );
  };

  // Desktop-only dropdown trigger for "Services" (Services overview, Legal
  // Services, Rental Services). Opens on click, closes on selection or
  // click-away, matching MUI Menu's default behavior.
  const NavDropdownButton = ({ label, links }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const active = links.some((l) => isActive(l.path));

    return (
      <>
        <Box
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            position: "relative",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 0.3,
            color: active || open ? nx.gold : nx.textOnDark,
            px: 2,
            py: 1.5,
            borderRadius: 2,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": { bgcolor: "rgba(201,162,75,0.08)", color: nx.gold },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: active ? 700 : 500,
              fontSize: "0.82rem",
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              direction: isRTL ? "rtl" : "ltr",
            }}
          >
            {label}
          </Typography>
          <KeyboardArrowDownRoundedIcon
            sx={{ fontSize: 18, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
          />
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: isRTL ? "right" : "left" }}
          transformOrigin={{ vertical: "top", horizontal: isRTL ? "right" : "left" }}
          slotProps={{ paper: { sx: { bgcolor: nx.ink, border: `1px solid ${nx.panelBorder}`, mt: 1, minWidth: 200 } } }}
        >
          {links.map((sub) => (
            <MenuItem
              key={sub.path}
              component={Link}
              to={localizedPath(sub.path)}
              onClick={() => setAnchorEl(null)}
              sx={{
                color: isActive(sub.path) ? nx.gold : nx.textOnDark,
                fontSize: "0.82rem",
                fontWeight: isActive(sub.path) ? 700 : 500,
                "&:hover": { bgcolor: "rgba(201,162,75,0.1)", color: nx.gold },
              }}
            >
              {sub.label}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  };

  const drawer = (
    <Box sx={{ width: 280, height: "100%", bgcolor: "background.paper" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          component="img"
          src={settings.mode === "light" ? logoLight : logoDark}
          alt="Joyā Estates"
          sx={{
            height: 50,
            width: "auto",
            objectFit: "contain",
          }}
        />
        <IconButton onClick={handleDrawerToggle} size="small">
          <CloseRoundedIcon />
        </IconButton>
      </Box>
      <List sx={{ px: 2, py: 3 }}>
        {navLinks.map((link) =>
          link.path === "/services" ? (
            <Box key={link.label}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => setMobileServicesOpen((prev) => !prev)}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    bgcolor: isActive(link.path)
                      ? (theme) => alpha(theme.palette.primary.main, 0.12)
                      : "transparent",
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{
                      fontWeight: isActive(link.path) ? 700 : 500,
                      fontSize: "1rem",
                    }}
                  />
                  <ExpandMoreRoundedIcon
                    sx={{ transform: mobileServicesOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                  />
                </ListItemButton>
              </ListItem>
              <Collapse in={mobileServicesOpen}>
                <List disablePadding sx={{ pl: 2 }}>
                  {servicesDropdownLinks.map((sub) => (
                    <ListItem key={sub.path} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        component={Link}
                        to={localizedPath(sub.path)}
                        onClick={handleDrawerToggle}
                        sx={{
                          borderRadius: 2,
                          py: 1,
                          px: 2,
                          bgcolor: isActive(sub.path)
                            ? (theme) => alpha(theme.palette.primary.main, 0.12)
                            : "transparent",
                        }}
                      >
                        <ListItemText
                          primary={sub.label}
                          primaryTypographyProps={{ fontWeight: isActive(sub.path) ? 700 : 500, fontSize: "0.9rem" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          ) : link.path === "/about" ? (
            <Box key={link.label}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => setMobileAboutOpen((prev) => !prev)}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    bgcolor: isActive(link.path)
                      ? (theme) => alpha(theme.palette.primary.main, 0.12)
                      : "transparent",
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{
                      fontWeight: isActive(link.path) ? 700 : 500,
                      fontSize: "1rem",
                    }}
                  />
                  <ExpandMoreRoundedIcon
                    sx={{ transform: mobileAboutOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                  />
                </ListItemButton>
              </ListItem>
              <Collapse in={mobileAboutOpen}>
                <List disablePadding sx={{ pl: 2 }}>
                  {aboutDropdownLinks.map((sub) => (
                    <ListItem key={sub.path} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        component={Link}
                        to={localizedPath(sub.path)}
                        onClick={handleDrawerToggle}
                        sx={{
                          borderRadius: 2,
                          py: 1,
                          px: 2,
                          bgcolor: isActive(sub.path)
                            ? (theme) => alpha(theme.palette.primary.main, 0.12)
                            : "transparent",
                        }}
                      >
                        <ListItemText
                          primary={sub.label}
                          primaryTypographyProps={{ fontWeight: isActive(sub.path) ? 700 : 500, fontSize: "0.9rem" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          ) : (
            <ListItem key={link.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={localizedPath(link.path)}
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  bgcolor: isActive(link.path)
                    ? (theme) => alpha(theme.palette.primary.main, 0.12)
                    : "transparent",
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    fontWeight: isActive(link.path) ? 700 : 500,
                    fontSize: "1rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
      <Divider sx={{ mx: 2 }} />
      <Box sx={{ p: 2 }}>
        {isAuthenticated && (
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            fullWidth
            sx={{ py: 1.5, borderRadius: 2 }}
            onClick={async () => {
              await logout();
              window.alert(
                t("auth.logoutSuccess", "You have logged out successfully.")
              );
              handleDrawerToggle();
              navigate(localizedPath("/"));
            }}
          >
            {t("auth.logout", "Logout")}
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          width: "100%",
          bgcolor: "#0a0806",
          py: { xs: 1, md: 1.5 },
          px: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            maxWidth: "lg",
            mx: "auto",
            bgcolor: nx.ink,
            borderRadius: { xs: 3, md: 4 },
            border: `1.5px solid ${nx.gold}`,
            boxShadow: `0 14px 34px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,162,75,0.15)`,
            overflow: "hidden",
          }}
        >
          {/* Top info strip — hidden once scrolled to save vertical space, main nav row stays */}
          {!scrolled && (
          <Box sx={{ display: { xs: "none", sm: "block" }, bgcolor: "#050608", borderBottom: `1px solid ${nx.panelBorder}` }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: { sm: 3, md: 4 }, py: 0.8 }}
            >
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em" }}>
                {home.topbar?.strip_text}
              </Typography>
              <Stack direction="row" spacing={2.5}>
                {home.topbar?.phone && (
                  <Stack direction="row" spacing={0.6} alignItems="center" component="a" href={`tel:${home.topbar.phone.replace(/\s/g, "")}`} sx={{ color: nx.textOnDarkMuted, textDecoration: "none", fontSize: "0.7rem", "&:hover": { color: nx.gold } }}>
                    <PhoneRoundedIcon sx={{ fontSize: 13 }} />
                    <span>{home.topbar.phone}</span>
                  </Stack>
                )}
                {home.topbar?.email && (
                  <Stack direction="row" spacing={0.6} alignItems="center" component="a" href={`mailto:${home.topbar.email}`} sx={{ color: nx.textOnDarkMuted, textDecoration: "none", fontSize: "0.7rem", "&:hover": { color: nx.gold } }}>
                    <EmailRoundedIcon sx={{ fontSize: 13 }} />
                    <span>{home.topbar.email}</span>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Box>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 3,
              py: { xs: 1.5, md: 1.8 },
              px: { xs: 2, sm: 3, md: 4 },
            }}
          >
            <Box
              component={Link}
              to={localizedPath("/")}
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Box
                component="img"
                src={home.logo_url || logoDark}
                alt={home.brand_name || "Nexus Capital"}
                sx={{
                  height: { xs: 42, md: 52 },
                  width: { xs: 63, md: 78 },
                  objectFit: "contain",
                }}
              />
              <Box sx={{ ml: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    color: nx.gold,
                    fontWeight: 800,
                    fontSize: { xs: "0.82rem", md: "1.05rem" },
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                    lineHeight: 1.15,
                    whiteSpace: "nowrap",
                  }}
                >
                  {home.brand_name || "Nexus Capital"}
                </Typography>
                {home.brand_tagline && (
                  <Typography
                    sx={{
                      color: nx.textOnDark,
                      fontWeight: 600,
                      fontSize: { xs: "0.46rem", md: "0.58rem" },
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      lineHeight: 1.3,
                      mt: 0.2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {home.brand_tagline}
                  </Typography>
                )}
              </Box>
            </Box>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                display: { xs: "none", md: "flex" },
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {navLinks.map((link) =>
                link.path === "/services" ? (
                  <NavDropdownButton key={link.label} label={link.label} links={servicesDropdownLinks} />
                ) : link.path === "/about" ? (
                  <NavDropdownButton key={link.label} label={link.label} links={aboutDropdownLinks} />
                ) : (
                  <NavButton key={link.label} link={link} />
                )
              )}
            </Stack>

            <Stack
              direction="row"
              spacing={{ xs: 0.7, md: 1.5 }}
              alignItems="center"
              sx={{
                ...(isRTL && {
                  "& > *:first-of-type": {
                    marginRight: 1.25,
                  },
                }),
              }}
            >
              <LanguageSelector />
              {home.topbar?.phone && (
                <Stack
                  direction="row"
                  spacing={0.6}
                  alignItems="center"
                  component="a"
                  href={`tel:${home.topbar.phone.replace(/\s/g, "")}`}
                  sx={{ display: { xs: "none", lg: "flex" }, color: nx.textOnDark, textDecoration: "none", fontSize: "0.82rem", fontWeight: 600, "&:hover": { color: nx.gold } }}
                >
                  <PhoneRoundedIcon sx={{ fontSize: 16 }} />
                  <span>Call Advisor</span>
                </Stack>
              )}
              <Button
                component="a"
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener"
                startIcon={<WhatsAppIcon sx={{ fontSize: { xs: 10, md: 16 } }} />}
                sx={{
                  bgcolor: nx.gold,
                  color: "#171208",
                  fontWeight: 700,
                  fontSize: { xs: "0.5rem", md: "0.74rem" },
                  borderRadius: 999,
                  px: { xs: 0.8, md: 2.2 },
                  py: { xs: 0.35, md: 0.9 },
                  minWidth: 0,
                  whiteSpace: "nowrap",
                  "& .MuiButton-startIcon": { mr: { xs: 0.3, md: 1 } },
                  "&:hover": { bgcolor: nx.goldLight },
                }}
              >
                WHATSAPP
              </Button>
              {isAuthenticated ? (
                <Button
                  variant="outlined"
                  startIcon={!isRTL ? <LogoutIcon /> : null}
                  endIcon={isRTL ? <LogoutIcon /> : null}
                  onClick={async () => {
                    await logout();
                    window.alert(
                      t(
                        "auth.logoutSuccess",
                        "You have logged out successfully."
                      )
                    );
                    navigate(localizedPath("/"));
                  }}
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    flexDirection: isRTL ? "row-reverse" : "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: isRTL ? 1 : 0,
                    px: 2.75,
                    py: 1.3,
                    borderRadius: 2.5,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    borderColor: "rgba(148,163,184,0.3)",
                    bgcolor:
                      settings.mode === "light"
                        ? "rgba(255,255,255,0.12)"
                        : "rgba(15,23,42,0.65)",
                    backdropFilter: "blur(16px)",
                    color:
                      settings.mode === "light"
                        ? "rgba(255,255,255,0.95)"
                        : "rgba(255,255,255,0.9)",
                    boxShadow: (theme) =>
                      `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: 0,
                      height: 0,
                      borderRadius: "50%",
                      bgcolor: alpha(nx.gold, 0.25),
                      transform: "translate(-50%, -50%)",
                      transition: "width 0.6s ease, height 0.6s ease",
                    },
                    "&:hover": {
                      borderColor: nx.gold,
                      bgcolor:
                        settings.mode === "light"
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(15,23,42,0.85)",
                      transform: "translateY(-2px) scale(1.02)",
                      boxShadow: `0 10px 28px ${alpha(nx.gold, 0.3)}, 0 4px 12px ${alpha(nx.gold, 0.2)}`,
                      "&::before": {
                        width: "120%",
                        height: "120%",
                      },
                      "& .MuiButton-startIcon, & .MuiButton-endIcon": {
                        transform: "scale(1.15)",
                      },
                    },
                    "&:active": {
                      transform: "translateY(0px) scale(0.98)",
                    },
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "& .MuiButton-startIcon, & .MuiButton-endIcon": {
                      transition: "transform 0.3s ease",
                    },
                  }}
                >
                  {t("auth.logout", "Logout")}
                </Button>
              ) : null}
              <IconButton
                onClick={handleDrawerToggle}
                sx={{
                  display: { xs: "inline-flex", md: "none" },
                  border: "1px solid",
                  borderColor: "rgba(245,241,230,0.25)",
                  borderRadius: 2,
                  color: nx.textOnDark,
                  "&:hover": {
                    bgcolor: "rgba(201,162,75,0.1)",
                    borderColor: nx.gold,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <MenuRoundedIcon />
              </IconButton>
            </Stack>
          </Box>
        </Box>
      </Box>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        anchor={isRTL ? "right" : "left"}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
