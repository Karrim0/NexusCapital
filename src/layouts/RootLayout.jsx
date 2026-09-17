import { Outlet, useLocation, Link as RouterLink } from "react-router-dom";
import { Box, Fab, Tooltip, alpha, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useCustomizer } from "../context/CustomizerContext";
import useHomeContent from "../hooks/useHomeContent";
import Header from "../components/navigation/Header";
import Footer from "../components/navigation/Footer";
import { nx } from "../theme/nexusHomeTheme";
import { MotionBox } from "../components/common/MotionComponents";
import LoadingBar from "react-top-loading-bar";
import PageSpinner from "../components/common/PageSpinner";

const RootLayout = () => {
  const { t } = useTranslation();
  const { settings } = useCustomizer();
  const location = useLocation();
  const { content: home } = useHomeContent();
  const isRTL = settings.direction === "rtl";
  const whatsappNumber = "201034418770"; // WhatsApp: 01034418770
  const callPhone = home?.topbar?.phone || "+201034418770";
  const whatsappMessage = encodeURIComponent(
    t("contact.whatsappMessage") || "Hello, I'm interested in your properties"
  );
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(progress);
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const startFrame = requestAnimationFrame(() => {
      setPageLoading(true);
      setLoadingProgress(30);
    });
    const timer = setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => setPageLoading(false), 350);
    }, 250);
    return () => {
      cancelAnimationFrame(startFrame);
      clearTimeout(timer);
    };
  }, [location]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        pb: { xs: "68px", md: 0 },
      }}
    >
      <LoadingBar
        color={
          settings.mode === "light" ? "#1976d2" : "rgba(144, 202, 249, 0.9)"
        }
        progress={loadingProgress}
        height={3}
        shadow={false}
        waitingTime={200}
        onLoaderFinished={() => setLoadingProgress(0)}
      />
      <PageSpinner visible={pageLoading} />
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />

      {/* Sticky mobile action bar: Call / WhatsApp / Book Tour — mobile only, stays fixed while scrolling */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 1300,
          px: 1.5,
          pb: `calc(10px + env(safe-area-inset-bottom))`,
          pt: 1.2,
          background: "linear-gradient(to top, rgba(5,6,8,0.92) 30%, rgba(5,6,8,0))",
        }}
      >
        <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
          <Box
            component="a"
            href={`tel:${callPhone.replace(/\s/g, "")}`}
            sx={{
              flex: "1 1 0",
              minWidth: 0,
              py: 1.1,
              px: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.6,
              textDecoration: "none",
              borderRadius: 999,
              bgcolor: "rgba(20,22,26,0.92)",
              border: "1px solid rgba(245,241,230,0.18)",
              color: "#f4e2b0",
              boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
            }}
          >
            <PhoneRoundedIcon sx={{ fontSize: 17 }} />
            <Typography noWrap sx={{ fontSize: "0.74rem", fontWeight: 700, color: "#f4e2b0" }}>
              {t("contact.call", "Call")}
            </Typography>
          </Box>

          <Box
            component="a"
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              flex: "1 1 0",
              minWidth: 0,
              py: 1.1,
              px: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.6,
              textDecoration: "none",
              borderRadius: 999,
              bgcolor: "#25D366",
              color: "#0a0c10",
              boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
            }}
          >
            <WhatsAppIcon sx={{ fontSize: 17 }} />
            <Typography noWrap sx={{ fontSize: "0.74rem", fontWeight: 700, color: "#0a0c10" }}>
              {t("contact.whatsapp", "WhatsApp")}
            </Typography>
          </Box>

          <Box
            component="a"
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              t("contact.bookTourMessage") || "Hello! I'd like to book a viewing tour."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              flex: "1 1 0",
              minWidth: 0,
              py: 1.1,
              px: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.6,
              textDecoration: "none",
              borderRadius: 999,
              bgcolor: "rgba(20,22,26,0.92)",
              border: "1px solid rgba(245,241,230,0.18)",
              color: "#f4e2b0",
              boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
            }}
          >
            <CalendarMonthRoundedIcon sx={{ fontSize: 17 }} />
            <Typography noWrap sx={{ fontSize: "0.74rem", fontWeight: 700, color: "#f4e2b0" }}>
              {t("contact.bookTour", "Book Tour")}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Floating Action Buttons - WhatsApp & Scroll to Top */}
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 150, md: 30 },
          [isRTL ? "right" : "left"]: { xs: 20, md: 30 },
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        {/* WhatsApp Button — hidden on mobile, the sticky bottom bar covers it there */}
        <Tooltip
          title={t("contact.contactWhatsApp") || "Contact us on WhatsApp"}
          placement={isRTL ? "right" : "left"}
          arrow
        >
          <MotionBox
            sx={{ display: { xs: "none", md: "block" } }}
            initial={{ opacity: 0, scale: 0.8, x: isRTL ? -20 : 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <Fab
              component="a"
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                bgcolor: "#25D366",
                color: "white",
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                boxShadow: `0 8px 24px ${alpha("#25D366", 0.4)}`,
                "&:hover": {
                  bgcolor: "#20BA5A",
                  boxShadow: `0 12px 32px ${alpha("#25D366", 0.5)}`,
                  transform: "translateY(-4px)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <WhatsAppIcon sx={{ fontSize: { xs: 28, md: 32 } }} />
            </Fab>
          </MotionBox>
        </Tooltip>

        {/* Scroll to Top Button */}
        <Tooltip
          title={t("common.scrollToTop") || "Scroll to Top"}
          placement={isRTL ? "right" : "left"}
          arrow
        >
          <MotionBox
            initial={{ opacity: 0, scale: 0.8, x: isRTL ? -20 : 20 }}
            animate={{
              opacity: showScrollTop ? 1 : 0.6,
              scale: 1,
              x: 0,
            }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              pointerEvents: "auto",
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                p: 0.85,
                borderRadius: "50%",
                background: `conic-gradient(${nx.gold} ${
                    Math.min(Math.max(scrollProgress, 0), 1) * 360
                  }deg, ${alpha(nx.gold, 0.15)} ${
                    Math.min(Math.max(scrollProgress, 0), 1) * 360
                  }deg)`,
                transition: "background 0.15s linear",
              }}
            >
              <Fab
                onClick={scrollToTop}
                disabled={!showScrollTop}
                sx={{
                  bgcolor: nx.gold,
                  color: "#171208",
                  width: { xs: 30, md: 35 },
                  height: { xs: 30, md: 35 },
                  boxShadow: `0 8px 24px ${alpha(nx.gold, 0.4)}`,
                  opacity: showScrollTop ? 1 : 0.6,
                  "&:hover": {
                    bgcolor: nx.goldLight,
                    boxShadow: `0 12px 32px ${alpha(nx.gold, 0.5)}`,
                    transform: "translateY(-4px)",
                    opacity: 1,
                  },
                  "&.Mui-disabled": {
                    bgcolor: nx.gold,
                    opacity: 0.6,
                  },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: showScrollTop ? "pointer" : "default",
                }}
              >
                <KeyboardArrowUpIcon sx={{ fontSize: { xs: 28, md: 32 } }} />
              </Fab>
            </Box>
          </MotionBox>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default RootLayout;
