import { useState, useRef, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Fab, Paper, Stack, Typography, TextField, IconButton, CircularProgress, Fade, Chip, Button, Alert } from "@mui/material";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import { nx, fontHeading } from "../../theme/nexusHomeTheme";
import { sendChatMessage, submitChatbotLead } from "../../api/chatbot";
import { fetchProperties } from "../../api/properties";

const WELCOME_MESSAGE = {
  role: "assistant",
  content: "Hi! I'm the Nexus Capital assistant. Ask me about properties, prices, payment plans, or our services — or I can point you to a human advisor on WhatsApp.",
};

const QUICK_PROMPTS = [
  "Show me available projects",
  "What are your payment plans?",
  "Properties under €50,000",
  "I want to speak to an advisor",
];

// Matches an internal link the bot may include, either to a multi-unit
// project ("/projects/aqua-orgwan-resort") or a single property/unit
// ("/properties/42"), so we can render it as a clickable in-app link.
const LINK_REGEX = /\/projects\/[a-z0-9-]+|\/properties\/\d+/gi;

/**
 * Renders a bot/user message, turning any "/projects/{slug}" mentions into
 * real clickable links to that project's page (opens within the app, no
 * full page reload).
 */
// Detects a rough budget figure typed in a message, in English or Arabic,
// e.g. "under 50k", "50,000 euros", "٥٠ الف يورو", "50 ألف" — so we can show
// a live catalog of matching units without waiting on the AI to mention one.
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const toWesternDigits = (str) => str.replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)));

const detectBudget = (text) => {
  const normalized = toWesternDigits(text);
  const thousandWord = /(ألف|الف|k\b|thousand)/i.test(normalized);
  const match = normalized.match(/(\d[\d,.]*)\s*(k\b|ألف|الف|thousand)?/i);
  if (!match) return null;

  let value = parseFloat(match[1].replace(/,/g, ""));
  if (!value || Number.isNaN(value)) return null;

  const hasMultiplierWord = match[2] || thousandWord;
  if (hasMultiplierWord && value < 1000) {
    value *= 1000;
  }
  // Ignore tiny numbers that are almost certainly not a budget (e.g. "3 bedrooms").
  if (value < 5000) return null;
  return value;
};

const MessageText = ({ text, onNavigate }) => {
  const parts = text.split(LINK_REGEX);
  const links = text.match(LINK_REGEX) || [];

  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {links[i] && (
            <Box
              component={RouterLink}
              to={links[i]}
              onClick={onNavigate}
              sx={{ color: "inherit", fontWeight: 700, textDecoration: "underline", display: "inline" }}
            >
              {links[i].startsWith("/properties/") ? "View unit →" : "View project →"}
            </Box>
          )}
        </span>
      ))}
    </>
  );
};

const PropertyCatalogCard = ({ property, onNavigate }) => (
  <Box
    component={RouterLink}
    to={`/properties/${property.id}`}
    onClick={onNavigate}
    sx={{
      display: "flex",
      gap: 1.2,
      textDecoration: "none",
      color: "inherit",
      bgcolor: "#fff",
      borderRadius: 2,
      p: 1,
      border: `1px solid ${nx.divider}`,
      "&:hover": { borderColor: nx.gold },
    }}
  >
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: 1.5,
        flexShrink: 0,
        backgroundImage: property.image ? `url(${property.image})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        bgcolor: "#1b2436",
      }}
    />
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: nx.textOnCream, lineHeight: 1.3 }} noWrap>
        {property.title}
      </Typography>
      <Typography sx={{ fontSize: "0.72rem", color: nx.textOnCreamMuted }} noWrap>
        {property.location}
      </Typography>
      <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: nx.gold }}>
        {property.price ? `€${Number(property.price).toLocaleString()}` : "Price on request"}
      </Typography>
    </Box>
  </Box>
);

/**
 * Gate shown before the chat itself: collects name, phone, nationality, and
 * what the visitor is looking for, then hands off to the actual chat. Also
 * saved as a lead visible under "Chatbot Leads" in the dashboard.
 */
const LeadCaptureForm = ({ onDone }) => {
  const [form, setForm] = useState({ name: "", phone: "", nationality: "", lookingFor: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please add your name and phone number so we can follow up.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await submitChatbotLead(form);
    } catch {
      // Even if saving the lead fails, don't block the visitor from chatting.
    } finally {
      setSaving(false);
      onDone(form);
    }
  };

  const fieldSx = {
    "& .MuiInputBase-input": { color: nx.textOnCream },
    "& .MuiInputBase-input::placeholder": { color: nx.textOnCreamMuted, opacity: 1 },
    "& .MuiInputLabel-root": { color: nx.textOnCreamMuted },
    "& .MuiOutlinedInput-root": { bgcolor: "#fff" },
  };

  return (
    <Box sx={{ flex: 1, overflowY: "auto", p: 2.5, bgcolor: nx.cream }}>
      <Typography sx={{ fontFamily: fontHeading, color: nx.textOnCream, fontWeight: 700, fontSize: "1.05rem", mb: 0.5 }}>
        Let's get you connected
      </Typography>
      <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.8rem", mb: 2 }}>
        A few quick details so our assistant (and our team) can help you better.
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={1.5}>
          <TextField sx={fieldSx} label="Full name" size="small" value={form.name} onChange={set("name")} required />
          <TextField sx={fieldSx} label="Phone / WhatsApp" size="small" value={form.phone} onChange={set("phone")} required />
          <TextField sx={fieldSx} label="Nationality" size="small" value={form.nationality} onChange={set("nationality")} />
          <TextField sx={fieldSx} label="What are you looking for?" size="small" placeholder="e.g. 2-bedroom apartment in Sahl Hasheesh" value={form.lookingFor} onChange={set("lookingFor")} />
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            type="submit"
            disabled={saving}
            fullWidth
            sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, borderRadius: 999, py: 1.1, "&:hover": { bgcolor: nx.goldLight } }}
          >
            {saving ? "Saving..." : "Start chatting"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

const NxChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [leadInfo, setLeadInfo] = useState(null);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState(null); // null = not loaded, [] = loaded but empty, [...] = results
  const [catalogLoading, setCatalogLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, catalog, catalogLoading]);

  const handleNavigateAway = () => setOpen(false);

  const sendText = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    const budget = detectBudget(trimmed);
    if (budget) {
      handleShowCatalog(budget);
    }

    try {
      const history = nextMessages.slice(1).map(({ role, content }) => ({ role, content }));
      const { reply } = await sendChatMessage(trimmed, history.slice(0, -1));
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again or reach us on WhatsApp." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();
    sendText(input);
  };

  const handleShowCatalog = async (maxPrice) => {
    setCatalogLoading(true);
    try {
      const list = await fetchProperties(undefined, { extraParams: { limit: 50 } });
      const valid = (Array.isArray(list) ? list : []).filter((p) => p && p.id);
      const filtered = maxPrice ? valid.filter((p) => Number(p.price) > 0 && Number(p.price) <= maxPrice) : valid;
      setCatalog(filtered.slice(0, 6));
    } catch {
      setCatalog([]);
    } finally {
      setCatalogLoading(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    if (prompt === "Show me available projects") {
      setMessages((prev) => [...prev, { role: "user", content: prompt }]);
      handleShowCatalog();
      return;
    }
    if (prompt === "Properties under €50,000") {
      setMessages((prev) => [...prev, { role: "user", content: prompt }]);
      handleShowCatalog(50000);
      return;
    }
    sendText(prompt);
  };

  const handleLeadDone = (info) => {
    setLeadInfo(info);
    if (info.name) {
      setMessages([{ role: "assistant", content: `Hi ${info.name.split(" ")[0]}! ${WELCOME_MESSAGE.content}` }]);
    }
  };

  const showQuickPrompts = messages.length === 1 && !loading;

  return (
    <>
      <Fade in={open}>
        <Paper
          elevation={12}
          sx={{
            position: "fixed",
            bottom: { xs: 160, sm: 100 },
            right: { xs: 16, sm: 24 },
            width: { xs: "calc(100vw - 32px)", sm: 380 },
            maxWidth: 400,
            height: { xs: 500, sm: 540 },
            display: open ? "flex" : "none",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
            zIndex: 1300,
            border: `1px solid ${nx.panelBorder}`,
          }}
        >
          <Box sx={{ bgcolor: nx.ink, px: 2, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <SmartToyRoundedIcon sx={{ color: nx.gold, fontSize: 22 }} />
              <Box>
                <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.2 }}>
                  Nexus Assistant
                </Typography>
                <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.65rem" }}>Usually replies instantly</Typography>
              </Box>
            </Stack>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: nx.textOnDark }}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Box>

          {!leadInfo ? (
            <LeadCaptureForm onDone={handleLeadDone} />
          ) : (
            <>
          <Box ref={scrollRef} sx={{ flex: 1, overflowY: "auto", p: 1.5, bgcolor: nx.cream, display: "flex", flexDirection: "column", gap: 1 }}>
            {messages.map((m, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  bgcolor: m.role === "user" ? nx.gold : nx.creamPaper,
                  color: m.role === "user" ? "#171208" : nx.textOnCream,
                  borderRadius: 2.5,
                  px: 1.6,
                  py: 1,
                  maxWidth: "85%",
                  fontSize: "0.85rem",
                  lineHeight: 1.55,
                  boxShadow: m.role === "assistant" ? "0 2px 8px rgba(25,21,16,0.06)" : "none",
                  whiteSpace: "pre-wrap",
                }}
              >
                <MessageText text={m.content} onNavigate={handleNavigateAway} />
              </Box>
            ))}

            {loading && (
              <Box sx={{ alignSelf: "flex-start", px: 1.6, py: 1 }}>
                <CircularProgress size={16} sx={{ color: nx.gold }} />
              </Box>
            )}

            {showQuickPrompts && (
              <Stack direction="row" flexWrap="wrap" gap={0.8} sx={{ mt: 0.5 }}>
                {QUICK_PROMPTS.map((prompt) => (
                  <Chip
                    key={prompt}
                    label={prompt}
                    size="small"
                    onClick={() => handleQuickPrompt(prompt)}
                    sx={{
                      bgcolor: "#fff",
                      border: `1px solid ${nx.divider}`,
                      fontSize: "0.72rem",
                      color: nx.textOnCream,
                      fontWeight: 600,
                      "& .MuiChip-label": { color: nx.textOnCream },
                      "&:hover": { borderColor: nx.gold },
                    }}
                  />
                ))}
              </Stack>
            )}

            {catalogLoading && (
              <Box sx={{ alignSelf: "flex-start", px: 1.6, py: 1 }}>
                <CircularProgress size={16} sx={{ color: nx.gold }} />
              </Box>
            )}

            {catalog && catalog.length > 0 && (
              <Stack spacing={0.8} sx={{ maxWidth: "95%" }}>
                <Typography sx={{ fontSize: "0.72rem", color: nx.textOnCreamMuted, fontWeight: 700 }}>
                  A few live listings:
                </Typography>
                {catalog.map((p) => (
                  <PropertyCatalogCard key={p.id} property={p} onNavigate={handleNavigateAway} />
                ))}
                <Button
                  component={RouterLink}
                  to="/buy"
                  onClick={handleNavigateAway}
                  size="small"
                  startIcon={<ApartmentRoundedIcon fontSize="small" />}
                  sx={{ alignSelf: "flex-start", color: nx.textOnCream, fontSize: "0.72rem", textDecoration: "underline" }}
                >
                  See all properties
                </Button>
              </Stack>
            )}

            {catalog && catalog.length === 0 && !catalogLoading && (
              <Typography sx={{ fontSize: "0.78rem", color: nx.textOnCreamMuted, px: 1.6 }}>
                No live listings loaded right now — try the Buy page directly.
              </Typography>
            )}
          </Box>

          <Box component="form" onSubmit={handleSend} sx={{ display: "flex", gap: 1, p: 1.2, bgcolor: nx.creamPaper, borderTop: `1px solid ${nx.divider}` }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              sx={{
                "& .MuiInputBase-input": { color: nx.textOnCream },
                "& .MuiInputBase-input::placeholder": { color: nx.textOnCreamMuted, opacity: 1 },
                "& .MuiOutlinedInput-root": { bgcolor: "#fff", borderRadius: 999 },
              }}
            />
            <IconButton
              type="submit"
              disabled={loading || !input.trim()}
              sx={{ bgcolor: nx.gold, color: "#171208", "&:hover": { bgcolor: nx.goldLight }, "&.Mui-disabled": { bgcolor: "rgba(0,0,0,0.08)" } }}
            >
              <SendRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
            </>
          )}
        </Paper>
      </Fade>

      <Fab
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          position: "fixed",
          bottom: { xs: 110, sm: 40 },
          right: { xs: 16, sm: 24 },
          zIndex: 1300,
          bgcolor: nx.gold,
          color: "#171208",
          "&:hover": { bgcolor: nx.goldLight },
        }}
      >
        {open ? <CloseRoundedIcon /> : <ChatBubbleRoundedIcon />}
      </Fab>
    </>
  );
};

export default NxChatbotWidget;
