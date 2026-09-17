import { useMemo, useState } from "react";
import { Box, Container, Grid2, Stack, Typography, TextField, InputAdornment, Button, Collapse, Snackbar } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";
import { useTranslation } from "react-i18next";

const NxFaqBrowser = ({ content, whatsappNumber }) => {
  const { t } = useTranslation();
  const s = content.browser_section;
  const categories = content.categories || [];
  const questions = content.questions || [];

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(s.all_questions_label);
  const [openIds, setOpenIds] = useState(() => new Set());
  const [copiedId, setCopiedId] = useState(null);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchesCategory = activeCategory === s.all_questions_label || q.category === activeCategory;
      const matchesSearch =
        !search ||
        q.question.toLowerCase().includes(search.toLowerCase()) ||
        q.answer.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [questions, activeCategory, search, s.all_questions_label]);

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openAll = () => setOpenIds(new Set(filtered.map((q) => q.number)));
  const closeAll = () => setOpenIds(new Set());

  const copyLink = (id) => {
    const url = `${window.location.origin}${window.location.pathname}#faq-${id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedId(id);
  };

  const handleWhatsApp = () => {
    const phone = (whatsappNumber || "").replace(/[^\d+]/g, "").replace("+", "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(t("nxFaqBrowser.advisorSupportMessage"))}`, "_blank", "noopener");
  };

  const descriptionText = (s.description_template || t("nxFaqBrowser.descriptionTemplate")).replace("{count}", filtered.length);

  return (
    <Box id="faq-browser" sx={{ bgcolor: nx.cream, py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
          <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em" }}>{s.eyebrow}</Typography>
        </Stack>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={2} sx={{ mb: 3 }}>
          <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.8rem", md: "2.2rem" }, lineHeight: 1.2 }}>
            {s.title}
          </Typography>
          <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", maxWidth: 340 }}>{descriptionText}</Typography>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 4 }}>
          <TextField
            placeholder={s.search_placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            size="small"
            sx={{ bgcolor: nx.creamPaper, borderRadius: 1.5 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }}
          />
          <Stack direction="row" spacing={1}>
            <Button onClick={openAll} sx={{ bgcolor: nx.ink, color: nx.textOnDark, fontWeight: 700, fontSize: "0.72rem", borderRadius: 999, px: 2.5, whiteSpace: "nowrap", "&:hover": { bgcolor: "#1a1f2b" } }}>
              {s.open_all_label}
            </Button>
            <Button onClick={closeAll} sx={{ bgcolor: "#0f9d78", color: "#fff", fontWeight: 700, fontSize: "0.72rem", borderRadius: 999, px: 2.5, whiteSpace: "nowrap", "&:hover": { bgcolor: "#0c7f61" } }}>
              {s.close_all_label}
            </Button>
          </Stack>
        </Stack>

        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 3 }}>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: "1.3rem", mb: 2 }}>{t("nxFaqBrowser.topics")}</Typography>
            <Stack spacing={1} sx={{ mb: 2.5 }}>
              {[s.all_questions_label, ...categories].map((cat) => (
                <Button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    borderRadius: 999,
                    px: 2.5,
                    py: 1,
                    bgcolor: activeCategory === cat ? nx.ink : nx.creamPaper,
                    color: activeCategory === cat ? nx.textOnDark : nx.textOnCream,
                    "&:hover": { bgcolor: activeCategory === cat ? nx.ink : "rgba(25,21,16,0.06)" },
                  }}
                >
                  {cat}
                </Button>
              ))}
            </Stack>

            <Box sx={{ bgcolor: nx.ink, borderRadius: 3, p: 2.5 }}>
              <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontWeight: 600, fontSize: "1.1rem", mb: 1 }}>{s.sidebar_title}</Typography>
              <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.8rem", lineHeight: 1.6, mb: 2 }}>{s.sidebar_description}</Typography>
              <Button onClick={handleWhatsApp} startIcon={<WhatsAppIcon fontSize="small" />} fullWidth sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, fontSize: "0.74rem", borderRadius: 999, py: 1, "&:hover": { bgcolor: nx.goldLight } }}>
                {s.sidebar_cta_label}
              </Button>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 9 }}>
            {filtered.length === 0 ? (
              <Typography sx={{ color: nx.textOnCreamMuted, textAlign: "center", py: 6 }}>{t("nxFaqBrowser.noResults")}</Typography>
            ) : (
              <Stack spacing={2}>
                {filtered.map((q) => {
                  const open = openIds.has(q.number);
                  return (
                    <Box key={q.number} id={`faq-${q.number}`} sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 2.5, boxShadow: "0 10px 26px rgba(25,21,16,0.05)" }}>
                      <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ cursor: "pointer" }} onClick={() => toggle(q.number)}>
                        <Box sx={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", bgcolor: "rgba(201,162,75,0.15)", color: "#a9822f", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.72rem" }}>
                          {String(q.number).padStart(2, "0")}
                        </Box>
                        <Typography sx={{ flex: 1, color: nx.textOnCream, fontWeight: 700, fontSize: "0.92rem" }}>{q.question}</Typography>
                        <ExpandMoreRoundedIcon sx={{ color: nx.gold, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                      </Stack>
                      <Collapse in={open}>
                        <Box sx={{ pl: { xs: 0, sm: 5.5 }, pt: 1.5 }}>
                          <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.85rem", lineHeight: 1.75, mb: 1 }}>{q.answer}</Typography>
                          <Stack direction="row" spacing={0.5} alignItems="center" onClick={() => copyLink(q.number)} sx={{ cursor: "pointer", color: "#a9822f", fontWeight: 700, fontSize: "0.7rem", width: "fit-content" }}>
                            <LinkRoundedIcon sx={{ fontSize: 14 }} />
                            <span>{s.copy_link_label}</span>
                          </Stack>
                        </Box>
                      </Collapse>
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Grid2>
        </Grid2>
      </Container>

      <Snackbar
        open={!!copiedId}
        autoHideDuration={2000}
        onClose={() => setCopiedId(null)}
        message={s.copied_label || t("nxFaqBrowser.linkCopied")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default NxFaqBrowser;
