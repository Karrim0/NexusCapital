import { Box, Typography, alpha } from "@mui/material";
import { keyframes } from "@mui/system";
import { MotionBox } from "./MotionComponents";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import { useTranslation } from "react-i18next";
import { nx } from "../../theme/nexusHomeTheme";

const rotateRing = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulseDot = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.6); opacity: 0.4; }
`;

const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const PageSpinner = ({ visible }) => {
  const { t } = useTranslation();

  if (!visible) {
    return null;
  }

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: `linear-gradient(135deg, ${nx.ink}, #0d1119)`,
        backdropFilter: "blur(12px)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: { xs: 120, md: 150 },
          height: { xs: 120, md: 150 },
          borderRadius: "50%",
          background: `linear-gradient(120deg, ${alpha(nx.gold, 0.18)}, ${alpha(nx.goldLight, 0.12)})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 20px 45px ${alpha(nx.gold, 0.25)}`,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 6,
            borderRadius: "50%",
            border: `2px solid ${alpha(nx.gold, 0.2)}`,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            borderWidth: 3,
            borderStyle: "solid",
            borderColor: `${alpha(nx.gold, 0)} ${alpha(nx.gold, 0.5)} ${alpha(nx.gold, 0.5)} ${alpha(nx.gold, 0)}`,
            animation: `${rotateRing} 2s linear infinite`,
          }}
        />

        <HomeWorkRoundedIcon
          sx={{
            fontSize: { xs: 48, md: 56 },
            color: nx.gold,
          }}
        />

        {[0, 1, 2].map((dot) => (
          <Box
            key={dot}
            sx={{
              position: "absolute",
              width: { xs: 8, md: 10 },
              height: { xs: 8, md: 10 },
              borderRadius: "50%",
              bgcolor: nx.gold,
              opacity: 0.7,
              animation: `${pulseDot} 1.4s ease-in-out infinite`,
              animationDelay: `${dot * 0.2}s`,
              transformOrigin: "center",
              top: dot === 0 ? 10 : dot === 1 ? "auto" : "50%",
              bottom: dot === 1 ? 10 : "auto",
              left: dot === 2 ? 10 : "50%",
              right: dot === 2 ? "auto" : "50%",
            }}
          />
        ))}
      </Box>

      <Typography
        variant="subtitle1"
        sx={{
          mt: 4,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontWeight: 600,
          color: nx.textOnDark,
        }}
      >
        {t("spinner.brand", "Real Estate")}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          mt: 1,
          color: nx.textOnDarkMuted,
          textAlign: "center",
          px: 3,
          maxWidth: 360,
        }}
      >
        {t(
          "spinner.tagline",
          "Crafting premium properties tailored to how you live, invest, and grow."
        )}
      </Typography>

      <Box
        sx={{
          mt: 3,
          width: 180,
          height: 4,
          borderRadius: 2,
          overflow: "hidden",
          background: alpha(nx.gold, 0.15),
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent, ${alpha(nx.gold, 0.7)}, transparent)`,
            backgroundSize: "200% 100%",
            animation: `${shimmer} 1.5s linear infinite`,
          },
        }}
      />
    </MotionBox>
  );
};

export default PageSpinner;
