import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import AppRouter from "./routes/AppRouter";
import { CustomizerProvider, useCustomizer } from "./context/CustomizerContext";
import { getTheme } from "./theme";
import { AuthProvider } from "./context/AuthContext";
import NxChatbotWidget from "./components/chatbot/NxChatbotWidget";

const AppShell = () => {
  const { settings } = useCustomizer();
  const theme = useMemo(() => getTheme(settings), [settings]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          "*": {
            fontFamily: theme.typography.fontFamily,
          },
          "html, body": {
            fontFamily: theme.typography.fontFamily,
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          },
          "*, *::before, *::after": {
            boxSizing: "border-box",
          },
          "h1, h2, h3, h4, h5, h6": {
            fontFamily: theme.typography.fontFamily,
          },
          "p, span, div, a, button, input, textarea, select": {
            fontFamily: theme.typography.fontFamily,
          },
        }}
      />
      <AppRouter />
      <NxChatbotWidget />
    </ThemeProvider>
  );
};

const App = () => (
  <CustomizerProvider>
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  </CustomizerProvider>
);

export default App;

