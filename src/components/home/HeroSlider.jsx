import { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Chip,
  Container,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { heroSlides } from "../../utils/data";
import FilterBar from "./FilterBar";
import { useCustomizer } from "../../context/CustomizerContext";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { MotionBox, MotionStack } from "../common/MotionComponents";

const SLIDE_DURATION = 6500;

// Ken Burns effect configurations for each slide
// Each config has start and end positions for continuous movement
const kenBurnsConfigs = [
  {
    start: { scale: 1, x: "0%", y: "0%" },
    end: { scale: 1.2, x: "-10%", y: "-5%" },
  }, // Slide 1: zoom in + pan left-up
  {
    start: { scale: 1, x: "0%", y: "0%" },
    end: { scale: 1.15, x: "5%", y: "-8%" },
  }, // Slide 2: zoom in + pan right-up
  {
    start: { scale: 1, x: "0%", y: "0%" },
    end: { scale: 1.25, x: "-5%", y: "3%" },
  }, // Slide 3: zoom in + pan left-down
];

const HeroSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { settings } = useCustomizer();
  const isDarkMode = settings.mode === "dark";
  const { t } = useTranslation();
  const intervalRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const startTimeRef = useRef(0);

  // Slide navigation functions
  const goToNextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  const goToPrevSlide = useCallback(() => {
    setActiveSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  const goToSlide = useCallback((index) => {
    setActiveSlide(index);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowLeft") {
        goToPrevSlide();
      } else if (event.key === "ArrowRight") {
        goToNextSlide();
      } else if (event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        togglePause();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [goToNextSlide, goToPrevSlide, togglePause]);

  // Auto-slide functionality with pause support
  useEffect(() => {
    if (isPaused || isHovered) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }

    // Progress bar animation
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(newProgress);
    }, 50);

    // Slide change
    intervalRef.current = setInterval(() => {
      goToNextSlide();
    }, SLIDE_DURATION);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPaused, isHovered, goToNextSlide]);

  // Initialize start time on mount
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const slide = heroSlides[activeSlide];
  const kenBurnsConfig = kenBurnsConfigs[activeSlide] || kenBurnsConfigs[0];

  return (
    <Box
      id="hero"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: "relative",
        minHeight: { xs: 640, md: 780 },
        display: "flex",
        alignItems: "center",
        bgcolor: "background.hero",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Background media with Ken Burns effect (video-like movement) - Continuous */}
      <AnimatePresence mode="wait">
        <Box
          key={slide.id}
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          sx={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
          }}
        >
          <Box
            component={motion.div}
            key={`kenburns-${slide.id}`}
            animate={{
              scale: [
                kenBurnsConfig.start.scale,
                kenBurnsConfig.end.scale,
                kenBurnsConfig.start.scale,
              ],
              x: [
                kenBurnsConfig.start.x,
                kenBurnsConfig.end.x,
                kenBurnsConfig.start.x,
              ],
              y: [
                kenBurnsConfig.start.y,
                kenBurnsConfig.end.y,
                kenBurnsConfig.start.y,
              ],
            }}
            transition={{
              duration: (SLIDE_DURATION / 1000) * 3,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            }}
            sx={{
              position: "absolute",
              inset: "-20%",
              backgroundImage: `linear-gradient(120deg, rgba(5, 11, 22, 0.75), rgba(5, 11, 22, 0.35)), url(${slide.media})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.95)",
              willChange: "transform",
            }}
          />
        </Box>
      </AnimatePresence>

      {/* Top mist under header so navigation stays readable */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: { xs: 140, md: 190 },
          background: isDarkMode
            ? "linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(255,255,255,0.3), transparent)"
            : "linear-gradient(to bottom, rgba(3,7,18,0.95), rgba(3,7,18,0.75), transparent)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Bottom gradient overlay for better text readability */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: { xs: "60%", md: "55%" },
          background:
            "linear-gradient(to top, rgba(5, 11, 22, 0.95) 0%, rgba(5, 11, 22, 0.7) 40%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Side gradient for depth */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: { xs: "40%", md: "50%" },
          background:
            "linear-gradient(to right, rgba(5, 11, 22, 0.85) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <Container sx={{ position: "relative", zIndex: 2 }}>
        <Box sx={{ mt: 4 }}>
          <MotionStack
            spacing={{ xs: 4, md: 5 }}
            pt={{ xs: 10, md: 14 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Main hero content - Direct text on image (no card) */}
            <AnimatePresence mode="wait">
              <MotionBox
                key={slide.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                sx={{
                  maxWidth: { xs: "100%", md: 760 },
                  position: "relative",
                }}
              >
                <Stack spacing={2.5}>
                  <Chip
                    label={t("hero.tagline")}
                    sx={{
                      alignSelf: "flex-start",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 999,
                      bgcolor: (theme) =>
                        `rgba(${parseInt(
                          theme.palette.secondary.main.slice(1, 3),
                          16
                        )}, ${parseInt(
                          theme.palette.secondary.main.slice(3, 5),
                          16
                        )}, ${parseInt(
                          theme.palette.secondary.main.slice(5, 7),
                          16
                        )}, 0.25)`,
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "#ffffff",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 6px 25px rgba(0,0,0,0.4)",
                      },
                    }}
                  />
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" },
                      lineHeight: 1.1,
                      fontWeight: 900,
                      color: "#ffffff",
                      textShadow:
                        "0 4px 20px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.4)",
                      letterSpacing: "-0.02em",
                      mb: 1,
                    }}
                  >
                    {t(slide.titleKey)}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      maxWidth: { xs: "100%", md: 640 },
                      lineHeight: 1.7,
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.95)",
                      textShadow:
                        "0 2px 15px rgba(0,0,0,0.7), 0 1px 5px rgba(0,0,0,0.5)",
                      fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
                    }}
                  >
                    {t(slide.subtitleKey)}
                  </Typography>
                </Stack>
              </MotionBox>
            </AnimatePresence>

            {/* Slide meta information */}
            <MotionStack
              direction="row"
              spacing={3}
              alignItems="center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              sx={{
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Stack>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.7)",
                    textShadow: "0 2px 10px rgba(0,0,0,0.6)",
                  }}
                >
                  {t("hero.city")}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#ffffff",
                    textShadow:
                      "0 2px 15px rgba(0,0,0,0.8), 0 1px 5px rgba(0,0,0,0.6)",
                  }}
                >
                  {t(slide.cityKey)}
                </Typography>
              </Stack>
            </MotionStack>

            <MotionBox
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            >
              <FilterBar />
            </MotionBox>

            {/* Slider controls & indicators */}
            <MotionBox
              sx={{
                mt: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                px: { xs: 0.5, md: 1 },
                flexWrap: "wrap",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            >
              {/* Navigation Buttons */}
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Tooltip
                  title={t("hero.controls.previous", "Previous slide")}
                  arrow
                >
                  <IconButton
                    onClick={goToPrevSlide}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      color: "#ffffff",
                      border: "1px solid rgba(255,255,255,0.3)",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.25)",
                        transform: "scale(1.1)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
                      },
                      transition: "all 0.3s ease",
                    }}
                    aria-label={t("hero.controls.previous", "Previous slide")}
                  >
                    <ArrowBackIosRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip
                  title={
                    isPaused
                      ? t("hero.controls.play", "Play")
                      : t("hero.controls.pause", "Pause")
                  }
                  arrow
                >
                  <IconButton
                    onClick={togglePause}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      color: "#ffffff",
                      border: "1px solid rgba(255,255,255,0.3)",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.25)",
                        transform: "scale(1.1)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
                      },
                      transition: "all 0.3s ease",
                    }}
                    aria-label={
                      isPaused
                        ? t("hero.controls.playSlideshow", "Play slideshow")
                        : t("hero.controls.pauseSlideshow", "Pause slideshow")
                    }
                  >
                    {isPaused ? (
                      <PlayArrowRoundedIcon fontSize="small" />
                    ) : (
                      <PauseRoundedIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>

                <Tooltip title={t("hero.controls.next", "Next slide")} arrow>
                  <IconButton
                    onClick={goToNextSlide}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      color: "#ffffff",
                      border: "1px solid rgba(255,255,255,0.3)",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.25)",
                        transform: "scale(1.1)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
                      },
                      transition: "all 0.3s ease",
                    }}
                    aria-label={t("hero.controls.next", "Next slide")}
                  >
                    <ArrowForwardIosRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>

              {/* Slide Indicators (Dots) */}
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {heroSlides.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => goToSlide(index)}
                    sx={{
                      width: activeSlide === index ? 32 : 8,
                      height: 8,
                      borderRadius: 999,
                      bgcolor:
                        activeSlide === index
                          ? "#ffffff"
                          : "rgba(255,255,255,0.5)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.8)",
                        transform: "scaleY(1.5)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                      },
                    }}
                    aria-label={t("hero.controls.goToSlide", {
                      index: index + 1,
                    })}
                  />
                ))}
              </Stack>

              {/* Progress Bar */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: { xs: "100%", sm: 200 },
                  maxWidth: { xs: "100%", sm: 300 },
                }}
              >
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 4,
                    borderRadius: 999,
                    bgcolor: "rgba(255,255,255,0.2)",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#ffffff",
                      boxShadow: "0 0 10px rgba(255,255,255,0.5)",
                    },
                  }}
                />
              </Box>
            </MotionBox>
          </MotionStack>
        </Box>
      </Container>

      {/* Slide Counter */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 20, md: 30 },
          right: { xs: 20, md: 40 },
          zIndex: 3,
          bgcolor: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          px: 2,
          py: 1,
          borderRadius: 2,
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "0.875rem",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          {activeSlide + 1} / {heroSlides.length}
        </Typography>
      </Box>
    </Box>
  );
};

export default HeroSlider;
