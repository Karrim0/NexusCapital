import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Stack,
  alpha,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useCustomizer } from "../../context/CustomizerContext";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "../../i18n";
import englishFlag from "../../assets/images/english.png";
import arabicFlag from "../../assets/images/arabic.png";
import germanyFlag from "../../assets/images/germany.png";
import polandFlag from "../../assets/images/poland.png";
import czechFlag from "../../assets/images/czech.png";

const languages = [
  { code: "en", name: "English", nameKey: "english", flag: englishFlag },
  { code: "ar", name: "Arabic", nameKey: "arabic", flag: arabicFlag },
  { code: "de", name: "German", nameKey: "german", flag: germanyFlag },
  { code: "pl", name: "Polish", nameKey: "polish", flag: polandFlag },
  { code: "cs", name: "Czech", nameKey: "czech", flag: czechFlag },
  { code: "nl", name: "Dutch", nameKey: "dutch", emoji: "🇳🇱" },
  { code: "hu", name: "Hungarian", nameKey: "hungarian", emoji: "🇭🇺" },
  { code: "ro", name: "Romanian", nameKey: "romanian", emoji: "🇷🇴" },
  { code: "ru", name: "Russian", nameKey: "russian", emoji: "🇷🇺" },
  { code: "fr", name: "French", nameKey: "french", emoji: "🇫🇷" },
];

/** Strips any leading language-code segment (e.g. /de/about -> /about). */
const stripLangPrefix = (pathname) => {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length && SUPPORTED_LANGUAGES.includes(parts[0])) {
    return "/" + parts.slice(1).join("/");
  }
  return "/" + parts.join("/");
};

/** Builds the equivalent URL for the same page in a different language. */
const buildLocalizedPath = (langCode, pathname) => {
  const bare = stripLangPrefix(pathname); // e.g. "/" or "/about"
  if (langCode === DEFAULT_LANGUAGE) return bare;
  return bare === "/" ? `/${langCode}` : `/${langCode}${bare}`;
};

const FlagGlyph = ({ lang, className, sx }) => {
  if (lang.flag) {
    return (
      <Box
        className={className}
        component="img"
        src={lang.flag}
        alt={lang.name}
        sx={sx}
      />
    );
  }
  return (
    <Box
      className={className}
      component="span"
      role="img"
      aria-label={lang.name}
      sx={{
        ...sx,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: sx?.height ? Math.round(sx.height * 0.8) : 18,
        lineHeight: 1,
        bgcolor: "rgba(148,163,184,0.15)",
      }}
    >
      {lang.emoji}
    </Box>
  );
};

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const { settings } = useCustomizer();
  const navigate = useNavigate();
  const location = useLocation();
  const isRTL = settings.direction === "rtl";
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    // Blur active element to prevent aria-hidden warning
    if (document.activeElement) {
      document.activeElement.blur();
    }
    setAnchorEl(null);
  };

  const handleLanguageChange = (langCode) => {
    // Navigating to the equivalent /xx/... URL is what actually switches the
    // language now (LocaleLayout picks it up from the route) — this keeps
    // every language on its own indexable, shareable URL.
    const targetPath = buildLocalizedPath(langCode, location.pathname);
    navigate(`${targetPath}${location.search}`);
    handleClose();
  };

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <>
      <Box
        component="button"
        onClick={handleClick}
        sx={{
          border: "1px solid",
          borderColor: "rgba(148,163,184,0.3)",
          borderRadius: 2.5,
          width: 76,
          height: 44,
          position: "relative",
          overflow: "hidden",
          bgcolor: (theme) =>
            settings.mode === "light"
              ? "rgba(255,255,255,0.12)"
              : "rgba(15,23,42,0.65)",
          backdropFilter: "blur(16px)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 0,
          m: 0,
          boxShadow: (theme) =>
            `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: (theme) =>
              `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.2
              )}, ${alpha(theme.palette.secondary.main, 0.15)})`,
            opacity: 0,
            transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          },
          "&::after": {
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
            bgcolor: (theme) =>
              settings.mode === "light"
                ? "rgba(255,255,255,0.2)"
                : "rgba(15,23,42,0.85)",
            borderColor: "primary.main",
            transform: "translateY(-2px) scale(1.03)",
            boxShadow: (theme) =>
              `0 10px 28px ${alpha(
                theme.palette.primary.main,
                0.3
              )}, 0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
            "&::before": {
              opacity: 1,
            },
            "&::after": {
              width: "120%",
              height: "120%",
            },
            "& .flag-image": {
              transform: "scale(1.2) rotate(8deg)",
              boxShadow: (theme) =>
                `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`,
            },
            "& .lang-icon": {
              transform: "rotate(360deg) scale(1.15)",
              color: "primary.main",
            },
          },
          "&:active": {
            transform: "translateY(0px) scale(0.97)",
          },
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        aria-label={t("language.select", "Select language")}
      >
        <Stack
          direction="row"
          spacing={0.75}
          alignItems="center"
          sx={{ position: "relative", zIndex: 2 }}
        >
          <FlagGlyph
            className="flag-image"
            lang={currentLanguage}
            sx={{
              width: 26,
              height: 20,
              objectFit: "cover",
              borderRadius: 1.2,
              border: "1.5px solid",
              borderColor: "rgba(148,163,184,0.4)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: (theme) =>
                `0 2px 6px ${alpha(theme.palette.common.black, 0.15)}`,
            }}
          />
          <LanguageIcon
            className="lang-icon"
            sx={{
              fontSize: "1.25rem",
              opacity: 0.95,
              color: settings.mode === "light" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.85)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </Stack>
      </Box>
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
            borderRadius: 1,
            boxShadow: (theme) =>
              `0 12px 32px ${alpha(
                theme.palette.common.black,
                0.15
              )}, 0 4px 8px ${alpha(theme.palette.common.black, 0.08)}`,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
            bgcolor: (theme) => theme.palette.background.paper,
            backdropFilter: "blur(20px)",
            backgroundImage: (theme) =>
              `linear-gradient(135deg, ${alpha(
                theme.palette.background.paper,
                0.95
              )}, ${alpha(theme.palette.background.paper, 0.98)})`,
          },
        }}
        MenuListProps={{
          sx: { py: 1 },
        }}
      >
        {languages.map((lang) => {
          const isSelected = i18n.language === lang.code;
          return (
            <MenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              selected={isSelected}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                py: 1.25,
                px: 2,
                mx: 1,
                mb: 1,
                mt: 0.75,
                borderRadius: 2,
                position: "relative",
                overflow: "hidden",
                bgcolor: isSelected
                  ? (theme) => alpha(theme.palette.primary.main, 0.15)
                  : "transparent",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  [isRTL ? "right" : "left"]: 0,
                  top: 0,
                  bottom: 0,
                  width: isSelected ? 4 : 0,
                  bgcolor: "primary.main",
                  transition: "width 0.3s ease",
                },
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  transform: isRTL ? "translateX(-4px)" : "translateX(4px)",
                  "&::before": {
                    width: 4,
                  },
                },
                "&.Mui-selected": {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.15),
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                  },
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <ListItemIcon sx={{ minWidth: 56, justifyContent: "center" }}>
                <FlagGlyph
                  lang={lang}
                  sx={{
                    width: 30,
                    height: 30,
                    objectFit: "cover",
                    borderRadius: 1,
                    filter: isSelected ? "none" : "opacity(0.75)",
                    transition: "all 0.3s ease",
                    border: isSelected ? "2px solid" : "1px solid",
                    borderColor: isSelected ? "primary.main" : "divider",
                    boxShadow: isSelected
                      ? (theme) =>
                          `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`
                      : "none",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={t(`language.${lang.nameKey}`)}
                primaryTypographyProps={{
                  fontSize: "1rem",
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? "primary.main" : "#191510",
                  letterSpacing: "0.01em",
                }}
              />
              {isSelected && (
                <CheckIcon
                  sx={{
                    fontSize: "1.2rem",
                    color: "primary.main",
                    [isRTL ? "mr" : "ml"]: 1.5,
                    animation: "fadeIn 0.3s ease",
                    "@keyframes fadeIn": {
                      from: {
                        opacity: 0,
                        transform: "scale(0.8)",
                      },
                      to: {
                        opacity: 1,
                        transform: "scale(1)",
                      },
                    },
                  }}
                />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default LanguageSelector;
