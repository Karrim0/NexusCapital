import { IconButton, Tooltip, Box, alpha } from "@mui/material";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { useTranslation } from "react-i18next";
import { useCustomizer } from "../../context/CustomizerContext";

const ThemeToggle = () => {
  const { t } = useTranslation();
  const { settings, updateSetting } = useCustomizer();
  const isDark = settings.mode === "dark";

  const toggleMode = () => {
    updateSetting("mode", settings.mode === "light" ? "dark" : "light");
  };

  return (
    <Tooltip
      title={
        isDark
          ? t("theme.switchToLight", "Switch to Light Mode")
          : t("theme.switchToDark", "Switch to Dark Mode")
      }
      arrow
    >
      <IconButton
        onClick={toggleMode}
        color="inherit"
        sx={{
          border: "1px solid",
          borderColor: "rgba(148,163,184,0.3)",
          borderRadius: 2.5,
          width: 44,
          height: 44,
          position: "relative",
          overflow: "hidden",
          bgcolor:
            settings.mode === "light"
              ? "rgba(255,255,255,0.12)"
              : "rgba(15,23,42,0.65)",
          backdropFilter: "blur(16px)",
          boxShadow: (theme) =>
            `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
          "&::before": {
            content: '""',
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 0,
            height: 0,
            borderRadius: "50%",
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.25),
            transform: "translate(-50%, -50%)",
            transition: "width 0.6s ease, height 0.6s ease",
          },
          "&:hover": {
            bgcolor:
              settings.mode === "light"
                ? "rgba(255,255,255,0.2)"
                : "rgba(15,23,42,0.85)",
            borderColor: "primary.main",
            transform: "translateY(-2px) scale(1.05)",
            boxShadow: (theme) =>
              `0 10px 28px ${alpha(
                theme.palette.primary.main,
                0.3
              )}, 0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
            "&::before": {
              width: "120%",
              height: "120%",
            },
            "& .theme-icon": {
              transform: "rotate(180deg) scale(1.1)",
            },
          },
          "&:active": {
            transform: "translateY(0px) scale(0.97)",
          },
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Box
          className="theme-icon"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {isDark ? (
            <LightModeRoundedIcon
              sx={{
                fontSize: "1.3rem",
                color: "primary.main", // Dark mode: icon = theme color
              }}
            />
          ) : (
            <DarkModeRoundedIcon
              sx={{
                fontSize: "1.3rem",
                color: "#ffffff", // Light mode: icon = white
              }}
            />
          )}
        </Box>
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
