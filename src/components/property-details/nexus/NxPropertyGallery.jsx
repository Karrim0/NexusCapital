import { useState, useEffect, useRef } from "react";
import { Box, Container, Stack, Typography, IconButton, Modal, Fade } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { useTranslation } from "react-i18next";

const NxPropertyGallery = ({ images = [] }) => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const autoplayRef = useRef(null);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  useEffect(() => {
    if (images.length <= 1 || isPaused || lightboxOpen) return undefined;
    autoplayRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(autoplayRef.current);
  }, [images.length, isPaused, lightboxOpen]);

  if (!images.length) return null;

  return (
    <Box id="gallery" sx={{ bgcolor: nx.ink, py: { xs: 6, md: 8 } }}>
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 3 }}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{t("nxPropertyGallery.projectGallery")}</Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: { xs: "1.6rem", md: "2rem" } }}>
              {t("nxPropertyGallery.exploreTheSetting")}
            </Typography>
          </Box>
          {images.length > 1 && (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton onClick={prev} sx={{ bgcolor: nx.panel, color: nx.textOnDark, border: `1px solid ${nx.panelBorder}` }}>
                <ArrowBackIosNewRoundedIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.8rem", minWidth: 50, textAlign: "center" }}>
                {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </Typography>
              <IconButton onClick={next} sx={{ bgcolor: nx.panel, color: nx.textOnDark, border: `1px solid ${nx.panelBorder}` }}>
                <ArrowForwardIosRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          )}
        </Stack>

        <Box
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={() => setLightboxOpen(true)}
          sx={{
            position: "relative",
            borderRadius: 4,
            overflow: "hidden",
            height: { xs: 320, sm: 420, md: 560, lg: 620 },
            backgroundImage: `url(${images[index]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            bgcolor: "#1b2436",
            cursor: "pointer",
            "&:hover .nx-gallery-zoom-hint": { opacity: 1 },
          }}
        >
          <Box
            className="nx-gallery-zoom-hint"
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(10,12,16,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.25s ease",
            }}
          >
            <Box sx={{ bgcolor: "rgba(10,12,16,0.6)", borderRadius: "50%", p: 1.5, display: "flex" }}>
              <ZoomInRoundedIcon sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
          </Box>
        </Box>

        {images.length > 1 && (
          <Stack direction="row" spacing={1.5} sx={{ mt: 2, overflowX: "auto", pb: 1 }}>
            {images.map((img, i) => (
              <Box
                key={i}
                onClick={() => setIndex(i)}
                sx={{
                  flexShrink: 0,
                  width: 84,
                  height: 60,
                  borderRadius: 1.5,
                  cursor: "pointer",
                  backgroundImage: `url(${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: i === index ? `2px solid ${nx.gold}` : "2px solid transparent",
                  opacity: i === index ? 1 : 0.6,
                }}
              />
            ))}
          </Stack>
        )}
      </Container>

      <Modal open={lightboxOpen} onClose={() => setLightboxOpen(false)} closeAfterTransition>
        <Fade in={lightboxOpen}>
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              bgcolor: "rgba(5,6,8,0.94)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1400,
            }}
            onClick={() => setLightboxOpen(false)}
          >
            <IconButton
              onClick={() => setLightboxOpen(false)}
              sx={{ position: "absolute", top: 20, right: 20, color: "#fff", bgcolor: "rgba(255,255,255,0.1)" }}
            >
              <CloseRoundedIcon />
            </IconButton>

            {images.length > 1 && (
              <IconButton
                onClick={(e) => { e.stopPropagation(); prev(); }}
                sx={{ position: "absolute", left: { xs: 8, md: 32 }, color: "#fff", bgcolor: "rgba(255,255,255,0.1)" }}
              >
                <ArrowBackIosNewRoundedIcon />
              </IconButton>
            )}

            <Box
              component="img"
              src={images[index]}
              alt=""
              onClick={(e) => e.stopPropagation()}
              sx={{
                maxWidth: { xs: "92vw", md: "82vw" },
                maxHeight: "86vh",
                objectFit: "contain",
                borderRadius: 2,
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            />

            {images.length > 1 && (
              <IconButton
                onClick={(e) => { e.stopPropagation(); next(); }}
                sx={{ position: "absolute", right: { xs: 8, md: 32 }, color: "#fff", bgcolor: "rgba(255,255,255,0.1)" }}
              >
                <ArrowForwardIosRoundedIcon />
              </IconButton>
            )}

            {images.length > 1 && (
              <Typography sx={{ position: "absolute", bottom: 24, color: "rgba(255,255,255,0.7)", fontSize: "0.8rem" }}>
                {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </Typography>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default NxPropertyGallery;
