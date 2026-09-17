import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { sendGeneralContactRequest } from "../../api/contactRequests";
import { nx, fontHeading } from "../../theme/nexusHomeTheme";

// A lightweight "Book a Tour" enquiry form. Submits to the general
// contact-requests endpoint (visible to admins in the dashboard),
// tagged with the project/property name in the subject line.
const BookTourDialog = ({ open, onClose, itemName }) => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    if (status !== "sending") {
      onClose();
      setTimeout(() => {
        setStatus("idle");
        setForm({ name: "", phone: "", email: "", date: "", message: "" });
      }, 300);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setStatus("sending");
    try {
      await sendGeneralContactRequest({
        name: form.name,
        phone: form.phone || undefined,
        email: form.email || undefined,
        subject: `Book a Tour: ${itemName || "Property"}`,
        message: [
          form.date ? `Preferred date: ${form.date}` : null,
          form.message || null,
        ]
          .filter(Boolean)
          .join("\n"),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        <Typography sx={{ fontFamily: fontHeading, fontWeight: 700 }}>Book a Tour</Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {status === "sent" ? (
          <Alert severity="success" sx={{ mt: 1 }}>
            Thanks! We've received your request and will contact you shortly to confirm the tour.
          </Alert>
        ) : (
          <Stack component="form" onSubmit={handleSubmit} spacing={2} sx={{ mt: 0.5 }}>
            <Typography sx={{ color: "#6b6558", fontSize: "0.85rem" }}>
              Fill in your details and we'll arrange a tour of {itemName || "this property"} for you.
            </Typography>
            <TextField
              name="name"
              label="Full name"
              required
              fullWidth
              value={form.name}
              onChange={handleChange}
            />
            <TextField
              name="phone"
              label="Phone / WhatsApp"
              fullWidth
              value={form.phone}
              onChange={handleChange}
            />
            <TextField
              name="email"
              label="Email (optional)"
              type="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              name="date"
              label="Preferred date (optional)"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.date}
              onChange={handleChange}
            />
            <TextField
              name="message"
              label="Message (optional)"
              fullWidth
              multiline
              minRows={2}
              value={form.message}
              onChange={handleChange}
            />
            {status === "error" && (
              <Alert severity="error">Something went wrong. Please try again.</Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={status === "sending" || !form.name.trim()}
              sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, borderRadius: 999, py: 1.2, "&:hover": { bgcolor: nx.gold, opacity: 0.9 } }}
            >
              {status === "sending" ? "Sending..." : "Request Tour"}
            </Button>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookTourDialog;
