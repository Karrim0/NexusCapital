import { createTheme } from "@mui/material/styles";
import { lightPalette, darkPalette } from "./palette";

const fontFamilies = {
  Inter: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  Cairo: "'Cairo', -apple-system, BlinkMacSystemFont, sans-serif",
  Roboto: "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
  Poppins: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
  OpenSans: "'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  Montserrat: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
};

const generatePalette = (mode, primaryColor) => {
  const basePalette = mode === "light" ? lightPalette : darkPalette;

  // Generate color variations from primary color
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHex = (r, g, b) => {
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  };

  const lighten = (hex, percent) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const amount = Math.round(255 * (percent / 100));
    return rgbToHex(
      Math.min(255, rgb.r + amount),
      Math.min(255, rgb.g + amount),
      Math.min(255, rgb.b + amount)
    );
  };

  const darken = (hex, percent) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const amount = Math.round(255 * (percent / 100));
    return rgbToHex(
      Math.max(0, rgb.r - amount),
      Math.max(0, rgb.g - amount),
      Math.max(0, rgb.b - amount)
    );
  };

  return {
    ...basePalette,
    primary: {
      main: primaryColor,
      dark: darken(primaryColor, 20),
      light: lighten(primaryColor, 20),
      contrastText: "#ffffff",
    },
  };
};

const baseTheme = {
  typography: {
    h1: { fontWeight: 700, fontSize: "3.25rem" },
    h2: { fontWeight: 700, fontSize: "2.5rem" },
    h3: { fontWeight: 600, fontSize: "1.9rem" },
    h4: { fontWeight: 600, fontSize: "1.5rem" },
    h5: { fontWeight: 600, fontSize: "1.25rem" },
    h6: { fontWeight: 600, fontSize: "1rem" },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 18 },
  components: {
    MuiContainer: {
      defaultProps: { maxWidth: "lg" },
      styleOverrides: {
        root: {
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: "1.75rem",
          paddingBlock: "0.85rem",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 26,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 22,
        },
      },
    },
  },
};

export const getTheme = (settings = {}) => {
  const {
    mode = "light",
    themeColor = "#3498db",
    fontFamily = "Cairo",
    direction = "ltr",
  } = settings;

  return createTheme({
    ...baseTheme,
    direction: direction,
    palette: generatePalette(mode, themeColor),
    typography: {
      ...baseTheme.typography,
      fontFamily: fontFamilies[fontFamily] || fontFamilies.Cairo,
    },
  });
};
