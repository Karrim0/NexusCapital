import { useState, useEffect, useRef } from "react";
import { Box, Container, Grid2, Stack, Typography, IconButton, Button, Modal, Fade } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const currencySymbol = (c) => ({ USD: "$", EUR: "€", GBP: "£", EGP: "E£" }[c] || c || "€");

const NxProjectGalleryOverview = ({ project, whatsappNumber, phoneNumber }) => {
  const images = Array.isArray(project.images) && project.images.length
    ? project.images
    : project.cover_image
    ? [{ url: project.cover_image, caption: null }]
    : [];
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const autoplayRef = useRef(null);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  // Auto-advance the main gallery image every 4s; pauses on hover and
  // while the lightbox is open, resumes automatically otherwise.
  useEffect(() => {
    if (images.length <= 1 || isPaused || lightboxOpen) return undefined;
    autoplayRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(autoplayRef.current);
  }, [images.length, isPaused, lightboxOpen]);

  const handleWhatsApp = () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`Hello! I'd like more details about ${project.name || project.title}.`)}`, "_blank", "noopener");
  };

  return (
    <>
      {images.length > 0 && (
        <Box id="gallery" sx={{ bgcolor: nx.ink, py: { xs: 6, md: 8 } }}>
          <Container maxWidth="xl">
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 3 }}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                  <Box sx={{ width: 32, height: 2, bgcolor: "#5ce6d0" }} />
                  <Typography sx={{ color: "#5ce6d0", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>PROJECT GALLERY</Typography>
                </Stack>
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
                backgroundImage: `url(${images[index]?.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                bgcolor: "#1b2436",
                cursor: "pointer",
                "&:hover .nx-gallery-zoom-hint": { opacity: 1 },
              }}
            >
              {images[index]?.caption && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    bgcolor: "rgba(10,12,16,0.72)",
                    color: nx.textOnDark,
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    fontStyle: "italic",
                    px: 2,
                    py: 0.8,
                    borderRadius: 999,
                    zIndex: 1,
                  }}
                >
                  {images[index].caption}
                </Box>
              )}
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
                      backgroundImage: `url(${img.url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      border: i === index ? "2px solid #5ce6d0" : "2px solid transparent",
                      opacity: i === index ? 1 : 0.6,
                    }}
                  />
                ))}
              </Stack>
            )}

            {project.video_url && (
              <Box sx={{ mt: 4 }}>
                <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: "1.15rem", mb: 1.5 }}>
                  Watch the Video
                </Typography>
                <Box sx={{ position: "relative", width: "100%", pt: "56.25%", borderRadius: 3, overflow: "hidden", bgcolor: "#000" }}>
                  {(() => {
                    const url = project.video_url;
                    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
                    if (ytMatch) {
                      return (
                        <Box
                          component="iframe"
                          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                          title="Project video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                        />
                      );
                    }
                    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
                    if (vimeoMatch) {
                      return (
                        <Box
                          component="iframe"
                          src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
                          title="Project video"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                        />
                      );
                    }
                    return (
                      <Box
                        component="video"
                        src={url}
                        controls
                        sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    );
                  })()}
                </Box>
              </Box>
            )}
          </Container>
        </Box>
      )}

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
              src={images[index]?.url}
              alt={images[index]?.caption || project.name || project.title}
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

      <Box id="overview" sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
            <Box sx={{ width: 32, height: 2, bgcolor: "#0f9d78" }} />
            <Typography sx={{ color: "#0f9d78", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>PROJECT OVERVIEW</Typography>
          </Stack>
          <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.9rem", md: "2.4rem" }, lineHeight: 1.2, mb: 4 }}>
            Where luxury meets smart coastal living
          </Typography>

          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: { xs: 3, md: 4 }, height: "100%", boxShadow: "0 14px 34px rgba(25,21,16,0.06)" }}>
                <Typography sx={{ fontWeight: 700, color: nx.textOnCream, fontSize: "1.15rem", mb: 1 }}>
                  {project.name || project.title} is more than just a residential project
                </Typography>
                <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.88rem", lineHeight: 1.75, mb: 2.5 }}>
                  {project.architectural_vision || project.project_details || "It is a destination for people who appreciate elegance, comfort, and a modern coastal lifestyle."}
                </Typography>
                <Grid2 container spacing={1.5}>
                  {[
                    { label: "Location", value: project.location || "—" },
                    { label: "Starting Price", value: project.starting_price ? `${currencySymbol(project.currency)}${Number(project.starting_price).toLocaleString()}` : "On request" },
                    { label: "Concept", value: project.district ? `${project.district} coastal living` : "Modern coastal living" },
                    { label: "Delivery", value: project.delivery_date || "—" },
                  ].map((d) => (
                    <Grid2 key={d.label} size={6}>
                      <Box sx={{ bgcolor: "rgba(25,21,16,0.04)", borderRadius: 2, p: 1.5 }}>
                        <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.62rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>{d.label}</Typography>
                        <Typography sx={{ color: nx.textOnCream, fontWeight: 700, fontSize: "0.85rem" }}>{d.value}</Typography>
                      </Box>
                    </Grid2>
                  ))}
                </Grid2>
                <Box sx={{ mt: 2.5, bgcolor: "rgba(15,157,120,0.08)", border: "1px solid rgba(15,157,120,0.25)", borderRadius: 2, p: 1.5 }}>
                  <Typography sx={{ color: nx.textOnCream, fontSize: "0.78rem", lineHeight: 1.6 }}>
                    Whether you are looking for your dream seaside home or a high-performing investment, {project.name || project.title} is an opportunity designed to deliver both.
                  </Typography>
                </Box>
              </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box sx={{ bgcolor: nx.ink, borderRadius: 3, p: { xs: 3, md: 4 }, height: "100%" }}>
                <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: "1.3rem", mb: 1 }}>
                  Invest in your future. Live by the sea.
                </Typography>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem", lineHeight: 1.75, mb: 2.5 }}>
                  {project.investment_potential || `Inspired by the Red Sea coast, the project is shaped around peaceful sea views, fresh breeze, warm resort colors, and a lifestyle where every day feels like a vacation.`}
                </Typography>
                <Grid2 container spacing={1.5} sx={{ mb: 2.5 }}>
                  {[
                    { label: "Project", value: project.name || project.title },
                    { label: "Area", value: project.district || project.location || "—" },
                    { label: "Starting price", value: project.starting_price ? `${currencySymbol(project.currency)}${Number(project.starting_price).toLocaleString()}` : "On request" },
                    { label: "Offer", value: project.offer_discount_percent ? `${project.offer_discount_percent}% ${project.offer_deadline_label || "limited time"}` : "Contact advisor" },
                    { label: "Payment option", value: project.down_payment_percent ? `${project.down_payment_percent}% down + ${project.installment_years || "flexible"} years` : "Flexible" },
                    { label: "Delivery", value: project.delivery_date || "—" },
                  ].map((d) => (
                    <Grid2 key={d.label} size={6}>
                      <Box sx={{ bgcolor: "rgba(245,241,230,0.05)", border: `1px solid ${nx.panelBorder}`, borderRadius: 2, p: 1.5 }}>
                        <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.62rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>{d.label}</Typography>
                        <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.85rem" }}>{d.value}</Typography>
                      </Box>
                    </Grid2>
                  ))}
                </Grid2>
                <Stack direction="row" spacing={1.5}>
                  <Button onClick={handleWhatsApp} sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, borderRadius: 999, px: 3, fontSize: "0.78rem", "&:hover": { bgcolor: nx.goldLight } }}>
                    Request Details
                  </Button>
                  {phoneNumber && (
                    <Button href={`tel:${phoneNumber.replace(/\s/g, "")}`} variant="outlined" sx={{ color: nx.textOnDark, borderColor: "rgba(245,241,230,0.3)", fontWeight: 700, borderRadius: 999, px: 3, fontSize: "0.78rem" }}>
                      Call Advisor
                    </Button>
                  )}
                </Stack>
              </Box>
            </Grid2>
          </Grid2>
        </Container>
      </Box>
    </>
  );
};

export default NxProjectGalleryOverview;
