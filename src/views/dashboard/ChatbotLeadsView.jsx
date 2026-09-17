import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Stack,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import { fetchContactRequests } from "../../api/contactRequests";

const LEAD_TAG = "Chatbot Lead";

/**
 * The general contact-requests endpoint stores everything (furniture
 * quotes, chatbot leads, etc.) in one table, tagging each with a subject
 * line prepended to the message. This view filters down to just the ones
 * tagged "Chatbot Lead" and parses out the nationality / looking-for
 * fields we asked for in the pre-chat form.
 */
const parseLead = (request) => {
  const message = request.message || "";
  const nationalityMatch = message.match(/Nationality:\s*(.*)/i);
  const lookingForMatch = message.match(/Looking for:\s*(.*)/i);
  return {
    ...request,
    nationality: nationalityMatch ? nationalityMatch[1].trim() : "-",
    lookingFor: lookingForMatch ? lookingForMatch[1].trim() : "-",
  };
};

const ChatbotLeadsView = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchContactRequests();
        const leads = (data || [])
          .filter((r) => (r.message || "").startsWith(LEAD_TAG))
          .map(parseLead);
        setRequests(leads);
      } catch (err) {
        console.error(err);
        setError("Could not load chatbot leads.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase();
    return (
      !q ||
      r.name?.toLowerCase().includes(q) ||
      r.phone?.toLowerCase().includes(q) ||
      r.nationality?.toLowerCase().includes(q) ||
      r.lookingFor?.toLowerCase().includes(q)
    );
  });

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
        <SmartToyRoundedIcon color="primary" />
        <Typography variant="h5" fontWeight={800}>Chatbot Leads</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Visitors who filled in their details before chatting with the Nexus Assistant.
      </Typography>

      <TextField
        fullWidth
        size="small"
        placeholder="Search by name, phone, nationality, or interest..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, maxWidth: 420 }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : filtered.length === 0 ? (
        <Alert severity="info">No chatbot leads yet.</Alert>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Nationality</TableCell>
                <TableCell>Looking for</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>
                    {r.phone ? (
                      <a href={`tel:${r.phone}`} style={{ color: "inherit" }}>{r.phone}</a>
                    ) : "-"}
                  </TableCell>
                  <TableCell>{r.nationality}</TableCell>
                  <TableCell>{r.lookingFor}</TableCell>
                  <TableCell>
                    <Chip size="small" label={new Date(r.created_at).toLocaleDateString()} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ChatbotLeadsView;
