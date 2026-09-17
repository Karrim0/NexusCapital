import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  TextField,
  Button,
  IconButton,
  Grid2,
  Snackbar,
  Alert,
  CircularProgress,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import {
  fetchAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../../api/teamMembers";

const DEPARTMENTS = ["Sales Team", "Rental Team", "Marketing Team", "Management", "Customer Service"];

const emptyMember = {
  name: "",
  title: "",
  bio: "",
  department: DEPARTMENTS[0],
  years_of_experience: "",
  specialization: "",
  location: "",
  expertise: [],
  languages: [],
  phone: "",
  whatsapp: "",
  email: "",
  linkedin_url: "",
  sort_order: 0,
  is_active: true,
};

const StringListEditor = ({ label, items = [], onChange }) => {
  const update = (i, val) => {
    const next = [...items];
    next[i] = val;
    onChange(next);
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, ""]);

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: "0.8rem", mb: 1 }}>{label}</Typography>
      <Stack spacing={1}>
        {items.map((item, i) => (
          <Stack key={i} direction="row" spacing={1} alignItems="center">
            <TextField value={item} onChange={(e) => update(i, e.target.value)} fullWidth size="small" />
            <IconButton size="small" color="error" onClick={() => remove(i)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
        <Button startIcon={<AddIcon />} onClick={add} size="small" sx={{ alignSelf: "flex-start" }}>
          Add
        </Button>
      </Stack>
    </Box>
  );
};

const MemberFormDialog = ({ open, initial, onClose, onSaved }) => {
  const [form, setForm] = useState(emptyMember);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initial ? { ...emptyMember, ...initial } : emptyMember);
    setPhotoFile(null);
    setPhotoPreview(null);
    setError("");
  }, [initial, open]);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.name) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (initial?.id) {
        await updateTeamMember(initial.id, form, photoFile);
      } else {
        await createTeamMember(form, photoFile);
      }
      onSaved();
    } catch (err) {
      console.error(err);
      setError("Failed to save. Please check the fields and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial?.id ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={photoPreview || (form.photo && !form.photo.startsWith("[") ? form.photo : undefined)}
              variant="rounded"
              sx={{ width: 84, height: 84, bgcolor: "action.hover" }}
            />
            <Button component="label" variant="outlined" size="small" startIcon={<UploadFileIcon />}>
              Upload photo
              <input type="file" hidden accept="image/*" onChange={handlePhoto} />
            </Button>
          </Stack>

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField label="Full name" fullWidth size="small" value={form.name} onChange={set("name")} required />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField label="Job title / position" fullWidth size="small" value={form.title} onChange={set("title")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField select label="Department" fullWidth size="small" value={form.department} onChange={set("department")}>
                {DEPARTMENTS.map((d) => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </TextField>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField label="Years of experience" fullWidth size="small" value={form.years_of_experience} onChange={set("years_of_experience")} />
            </Grid2>
            <Grid2 size={12}>
              <TextField label="Short bio" fullWidth multiline minRows={3} size="small" value={form.bio} onChange={set("bio")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField label="Specialization" fullWidth size="small" value={form.specialization} onChange={set("specialization")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField label="Location / areas covered" fullWidth size="small" value={form.location} onChange={set("location")} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Area of expertise" items={form.expertise} onChange={(v) => setForm((p) => ({ ...p, expertise: v }))} />
            </Grid2>
            <Grid2 size={12}>
              <StringListEditor label="Languages spoken" items={form.languages} onChange={(v) => setForm((p) => ({ ...p, languages: v }))} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField label="Phone" fullWidth size="small" value={form.phone} onChange={set("phone")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField label="WhatsApp" fullWidth size="small" value={form.whatsapp} onChange={set("whatsapp")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField label="Email" fullWidth size="small" value={form.email} onChange={set("email")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField label="LinkedIn URL" fullWidth size="small" value={form.linkedin_url} onChange={set("linkedin_url")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField label="Sort order" type="number" fullWidth size="small" value={form.sort_order} onChange={set("sort_order")} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }} sx={{ display: "flex", alignItems: "center" }}>
              <FormControlLabel
                control={<Switch checked={!!form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} />}
                label="Visible on public site"
              />
            </Grid2>
          </Grid2>

          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TeamMembersSettingsView = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAllTeamMembers();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, severity: "error", message: "Could not load team members." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleEdit = (member) => {
    setEditing(member);
    setDialogOpen(true);
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`Remove ${member.name} from the team page?`)) return;
    try {
      await deleteTeamMember(member.id);
      setSnackbar({ open: true, severity: "success", message: "Team member removed." });
      load();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, severity: "error", message: "Failed to remove team member." });
    }
  };

  const handleSaved = () => {
    setDialogOpen(false);
    setSnackbar({ open: true, severity: "success", message: "Team member saved. Changes are live now." });
    load();
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <GroupsRoundedIcon color="primary" />
          <Box>
            <Typography variant="h5" fontWeight={800}>Meet Our Team</Typography>
            <Typography variant="body2" color="text.secondary">
              Add, edit, or remove team member profiles shown on the public "Meet Our Team" page.
            </Typography>
          </Box>
        </Stack>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add team member
        </Button>
      </Stack>

      {members.length === 0 ? (
        <Alert severity="info">No team members yet. Click "Add team member" to create the first profile.</Alert>
      ) : (
        <Grid2 container spacing={2}>
          {members.map((member) => (
            <Grid2 key={member.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                    <Avatar src={member.photo && !member.photo.startsWith("[") ? member.photo : undefined} variant="rounded" sx={{ width: 56, height: 56 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography fontWeight={700} noWrap>{member.name}</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>{member.title}</Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                    <Chip label={member.department} size="small" />
                    {!member.is_active && <Chip label="Hidden" size="small" color="warning" />}
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(member)}>Edit</Button>
                    <Button size="small" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => handleDelete(member)}>Remove</Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      )}

      <MemberFormDialog open={dialogOpen} initial={editing} onClose={() => setDialogOpen(false)} onSaved={handleSaved} />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TeamMembersSettingsView;
