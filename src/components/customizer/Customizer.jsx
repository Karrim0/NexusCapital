import { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Stack,
  Typography,
  Divider,
  Button,
  Tooltip,
  Grid,
  alpha,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PaletteIcon from "@mui/icons-material/Palette";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FontDownloadIcon from "@mui/icons-material/FontDownload";
import LanguageIcon from "@mui/icons-material/Language";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";
import { useCustomizer } from "../../context/CustomizerContext";
import { useTranslation } from "react-i18next";
import englishFlag from "../../assets/images/english.png";
import arabicFlag from "../../assets/images/arabic.png";
import germanyFlag from "../../assets/images/germany.png";
import polandFlag from "../../assets/images/poland.png";
import czechFlag from "../../assets/images/czech.png";

const themeColors = [
  { name: "Blue", value: "#3498db" },
  { name: "Purple", value: "#9b59b6" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Orange", value: "#F59E0B" },
  { name: "Red", value: "#EF4444" },
  { name: "Asphalt", value: "#34495e" },
];

const fontFamilies = [
  { name: "Cairo", value: "Cairo" },
  { name: "Inter", value: "Inter" },
  { name: "Roboto", value: "Roboto" },
  { name: "Poppins", value: "Poppins" },
  { name: "Open Sans", value: "OpenSans" },
  { name: "Montserrat", value: "Montserrat" },
];

const languages = [
  { code: "en", name: "English", flag: englishFlag },
  { code: "ar", name: "Arabic", flag: arabicFlag },
  { code: "de", name: "German", flag: germanyFlag },
  { code: "pl", name: "Polish", flag: polandFlag },
  { code: "cs", name: "Czech", flag: czechFlag },
];

const Customizer = () => {
  const { i18n, t } = useTranslation();
  const { settings, updateSetting, resetSettings } = useCustomizer();
  const [open, setOpen] = useState(false);

  const handleColorChange = (color) => {
    updateSetting("themeColor", color);
  };

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      updateSetting("mode", newMode);
    }
  };

  const handleDirectionChange = (event, newDirection) => {
    if (newDirection !== null) {
      updateSetting("direction", newDirection);
    }
  };

  const handleFontChange = (font) => {
    updateSetting("fontFamily", font);
  };

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
  };

  const isRTL = settings.direction === "rtl";

  return (
    <>
      <Tooltip title="Customize Theme">
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: 24,
            [isRTL ? "left" : "right"]: 24,
            zIndex: 1000,
            bgcolor: "primary.main",
            color: "white",
            width: 56,
            height: 56,
            boxShadow: (theme) =>
              `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
            "&:hover": {
              bgcolor: "primary.dark",
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>

      <Drawer
        anchor={isRTL ? "left" : "right"}
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 420 },
            p: 3,
            bgcolor: "background.paper",
            boxShadow: (theme) =>
              `0 16px 48px ${alpha(theme.palette.common.black, 0.2)}`,
          },
        }}
      >
        <Stack spacing={3.5}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 1,
            }}
          >
            <Typography variant="h5" fontWeight={700}>
              Customize Theme
            </Typography>
            <IconButton
              onClick={() => setOpen(false)}
              size="small"
              sx={{
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                  color: "error.main",
                },
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          <Divider />

          {/* Theme Color */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2.5}>
              <PaletteIcon color="primary" sx={{ fontSize: "1.3rem" }} />
              <Typography variant="subtitle1" fontWeight={700} fontSize="1rem">
                Theme Color
              </Typography>
            </Stack>
            <Grid container spacing={1.5}>
              {themeColors.map((color) => {
                const isSelected = settings.themeColor === color.value;
                return (
                  <Grid item xs={3} key={color.value}>
                    <Tooltip title={color.name} arrow>
                      <Box
                        onClick={() => handleColorChange(color.value)}
                        sx={{
                          width: "100%",
                          maxWidth: 70,
                          aspectRatio: "1",
                          bgcolor: color.value,
                          borderRadius: 2.5,
                          cursor: "pointer",
                          position: "relative",
                          border: isSelected ? "3px solid" : "2px solid",
                          borderColor: isSelected
                            ? "primary.main"
                            : alpha(color.value, 0.3),
                          boxShadow: isSelected
                            ? (theme) =>
                                `0 0 0 3px ${alpha(
                                  theme.palette.primary.main,
                                  0.2
                                )}, 0 4px 12px ${alpha(color.value, 0.4)}`
                            : `0 2px 6px ${alpha(color.value, 0.2)}`,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "translateY(-3px) scale(1.08)",
                            boxShadow: `0 6px 16px ${alpha(color.value, 0.5)}`,
                            borderColor: color.value,
                          },
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            top: 3,
                            right: 3,
                            width: isSelected ? 18 : 0,
                            height: isSelected ? 18 : 0,
                            borderRadius: "50%",
                            bgcolor: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s ease",
                            overflow: "hidden",
                          },
                        }}
                      >
                        {isSelected && (
                          <CheckIcon
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              fontSize: "0.85rem",
                              color: color.value,
                              zIndex: 1,
                            }}
                          />
                        )}
                      </Box>
                    </Tooltip>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          <Divider />

          {/* Dark/Light Mode */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2.5}>
              {settings.mode === "light" ? (
                <LightModeIcon color="primary" sx={{ fontSize: "1.3rem" }} />
              ) : (
                <DarkModeIcon color="primary" sx={{ fontSize: "1.3rem" }} />
              )}
              <Typography variant="subtitle1" fontWeight={700} fontSize="1rem">
                Theme Mode
              </Typography>
            </Stack>
            <Box
              sx={{
                display: "flex",
                gap: 0.5,
                width: "100%",
              }}
            >
              <ToggleButtonGroup
                value={settings.mode}
                exclusive
                onChange={handleModeChange}
                fullWidth
                sx={{
                  display: "flex",
                  "& .MuiToggleButton-root": {
                    py: 1,
                    px: 1.5,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    flex: 1,
                    "&:not(:first-of-type)": {
                      marginLeft: isRTL ? 0 : 0.5,
                      marginRight: isRTL ? 0.5 : 0,
                    },
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "white",
                      borderColor: "primary.main",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    },
                    "&:hover": {
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.08),
                    },
                  },
                }}
              >
                <ToggleButton value="light">
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <LightModeIcon sx={{ fontSize: "1rem" }} />
                    <Typography fontSize="0.875rem">Light</Typography>
                  </Stack>
                </ToggleButton>
                <ToggleButton value="dark">
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <DarkModeIcon sx={{ fontSize: "1rem" }} />
                    <Typography fontSize="0.875rem">Dark</Typography>
                  </Stack>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          <Divider />

          {/* RTL/LTR */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2.5}>
              {settings.direction === "ltr" ? (
                <FormatAlignLeftIcon
                  color="primary"
                  sx={{ fontSize: "1.3rem" }}
                />
              ) : (
                <FormatAlignRightIcon
                  color="primary"
                  sx={{ fontSize: "1.3rem" }}
                />
              )}
              <Typography variant="subtitle1" fontWeight={700} fontSize="1rem">
                Text Direction
              </Typography>
            </Stack>
            <Box
              sx={{
                display: "flex",
                gap: 0.5,
                width: "100%",
              }}
            >
              <ToggleButtonGroup
                value={settings.direction}
                exclusive
                onChange={handleDirectionChange}
                fullWidth
                sx={{
                  display: "flex",
                  "& .MuiToggleButton-root": {
                    py: 1,
                    px: 1.5,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    flex: 1,
                    "&:not(:first-of-type)": {
                      marginLeft: isRTL ? 0 : 0.5,
                      marginRight: isRTL ? 0.5 : 0,
                    },
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "white",
                      borderColor: "primary.main",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    },
                    "&:hover": {
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.08),
                    },
                  },
                }}
              >
                <ToggleButton value="ltr">
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <FormatAlignLeftIcon sx={{ fontSize: "1rem" }} />
                    <Typography fontSize="0.875rem">LTR</Typography>
                  </Stack>
                </ToggleButton>
                <ToggleButton value="rtl">
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <FormatAlignRightIcon sx={{ fontSize: "1rem" }} />
                    <Typography fontSize="0.875rem">RTL</Typography>
                  </Stack>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          <Divider />

          {/* Font Family */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2.5}>
              <FontDownloadIcon color="primary" sx={{ fontSize: "1.3rem" }} />
              <Typography variant="subtitle1" fontWeight={700} fontSize="1rem">
                Font Family
              </Typography>
            </Stack>
            <Grid container spacing={1.5}>
              {fontFamilies.map((font) => {
                const isSelected = settings.fontFamily === font.value;
                return (
                  <Grid item xs={6} key={font.value}>
                    <Button
                      onClick={() => handleFontChange(font.value)}
                      variant={isSelected ? "contained" : "outlined"}
                      fullWidth
                      sx={{
                        py: 1.25,
                        px: 1.5,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: isSelected ? 700 : 500,
                        fontFamily: font.value,
                        borderColor: isSelected ? "primary.main" : "divider",
                        bgcolor: isSelected ? "primary.main" : "transparent",
                        color: isSelected ? "white" : "text.primary",
                        "&:hover": {
                          bgcolor: isSelected
                            ? "primary.dark"
                            : (theme) =>
                                alpha(theme.palette.primary.main, 0.08),
                          borderColor: "primary.main",
                          transform: "translateY(-2px)",
                          boxShadow: isSelected
                            ? (theme) =>
                                `0 4px 12px ${alpha(
                                  theme.palette.primary.main,
                                  0.3
                                )}`
                            : (theme) =>
                                `0 2px 8px ${alpha(
                                  theme.palette.primary.main,
                                  0.15
                                )}`,
                        },
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      {font.name}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          <Divider />

          {/* Language */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2.5}>
              <LanguageIcon color="primary" sx={{ fontSize: "1.3rem" }} />
              <Typography variant="subtitle1" fontWeight={700} fontSize="1rem">
                Language
              </Typography>
            </Stack>
            <Grid container spacing={1.5}>
              {languages.map((lang) => {
                const isSelected = i18n.language === lang.code;
                return (
                  <Grid item xs={6} key={lang.code}>
                    <Button
                      onClick={() => handleLanguageChange(lang.code)}
                      variant={isSelected ? "contained" : "outlined"}
                      fullWidth
                      startIcon={
                        <Box
                          component="img"
                          src={lang.flag}
                          alt={lang.name}
                          sx={{
                            width: 30,
                            height: 22,
                            objectFit: "cover",
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: isSelected
                              ? "primary.main"
                              : "divider",
                            boxShadow: isSelected
                              ? (theme) =>
                                  `0 2px 8px ${alpha(
                                    theme.palette.primary.main,
                                    0.3
                                  )}`
                              : "none",
                            filter: isSelected ? "none" : "opacity(0.8)",
                            transition: "all 0.3s ease",
                          }}
                        />
                      }
                      endIcon={
                        isSelected ? (
                          <CheckIcon sx={{ fontSize: "1rem" }} />
                        ) : null
                      }
                      sx={{
                        position: "relative",
                        py: 1.1,
                        px: 1.75,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: isSelected ? 700 : 500,
                        borderColor: isSelected ? "primary.main" : "divider",
                        bgcolor: isSelected
                          ? (theme) => alpha(theme.palette.primary.main, 0.12)
                          : "transparent",
                        color: isSelected ? "primary.main" : "text.primary",
                        justifyContent: "flex-start",
                        gap: 1,
                        alignItems: "center",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: isSelected ? 4 : 0,
                          bgcolor: "primary.main",
                          transition: "width 0.3s ease",
                        },
                        "&:hover": {
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.08),
                          borderColor: "primary.main",
                          transform: "translateX(4px)",
                          boxShadow: isSelected
                            ? (theme) =>
                                `0 4px 12px ${alpha(
                                  theme.palette.primary.main,
                                  0.3
                                )}`
                            : (theme) =>
                                `0 2px 8px ${alpha(
                                  theme.palette.primary.main,
                                  0.15
                                )}`,
                          "&::before": {
                            width: 4,
                          },
                        },
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      {t(
                        `language.${
                          lang.code === "en"
                            ? "english"
                            : lang.code === "ar"
                            ? "arabic"
                            : lang.code === "de"
                            ? "german"
                            : lang.code === "pl"
                            ? "polish"
                            : "czech"
                        }`
                      )}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          <Divider />

          {/* Reset Button */}
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={resetSettings}
            fullWidth
            sx={{
              borderRadius: 2,
              py: 1.75,
              fontWeight: 600,
              borderColor: "divider",
              color: "text.secondary",
              "&:hover": {
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                borderColor: "error.main",
                color: "error.main",
                transform: "translateY(-2px)",
                boxShadow: (theme) =>
                  `0 4px 12px ${alpha(theme.palette.error.main, 0.2)}`,
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Reset to Default
          </Button>
        </Stack>
      </Drawer>
    </>
  );
};

export default Customizer;
