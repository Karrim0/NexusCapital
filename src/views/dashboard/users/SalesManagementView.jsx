import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  CardContent,
  Stack,
  TextField,
  Button,
  IconButton,
  alpha,
  Chip,
  Avatar,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  Switch,
  FormControlLabel,
  Grid2,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCustomizer } from "../../../context/CustomizerContext";
import { useAuth } from "../../../context/AuthContext";
import {
  MotionBox,
  MotionStack,
  MotionCard,
} from "../../../components/common/MotionComponents";
import { fadeInUp, staggerContainer, staggerItem } from "../../../components/common/motionVariants";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LockResetIcon from "@mui/icons-material/LockReset";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SellIcon from "@mui/icons-material/Sell";
import {
  fetchUsers,
  createUser,
  updateUser,
  changeUserPassword,
  toggleUserStatus,
  deleteUser,
} from "../../../api/users";
import { validatePassword } from "../../../utils/passwordValidation";

// ─── Add/Edit Sales Dialog ────────────────────────────────────────────────────
const SalesDialog = ({ open, onClose, onSave, editUser = null }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (editUser) {
      setForm({
        fullName: editUser.full_name || editUser.name || "",
        email: editUser.email || "",
        phone: editUser.phone || "",
        password: "",
        confirmPassword: "",
      });
      setAvatarPreview(editUser.avatar || null);
      setRemoveAvatar(false);
    } else {
      setForm({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
      setAvatarPreview(null);
      setRemoveAvatar(false);
    }
    setAvatarFile(null);
    setErrors({});
  }, [editUser, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = t("dashboard.sales.nameRequired", "Name is required");
    if (!form.email.trim()) newErrors.email = t("dashboard.sales.emailRequired", "Email is required");
    if (!editUser) {
      if (!form.password) newErrors.password = t("dashboard.sales.passwordRequired", "Password is required");
      else {
        const pwResult = validatePassword(form.password);
        if (!pwResult.isValid) newErrors.password = t("dashboard.sales.passwordWeak", "Password must be at least 8 characters with uppercase, lowercase, number, and special character");
      }
      if (form.password !== form.confirmPassword)
        newErrors.confirmPassword = t("dashboard.sales.passwordMismatch", "Passwords do not match");
    }
    return newErrors;
  };

  const handleSave = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("full_name", form.fullName);
      payload.append("email", form.email);
      if (form.phone) payload.append("phone", form.phone);
      payload.append("role", "agent");
      if (!editUser && form.password) payload.append("password", form.password);
      if (avatarFile) payload.append("avatar", avatarFile);
      if (removeAvatar && !avatarFile) payload.append("remove_avatar", "1");

      const result = editUser
        ? await updateUser(editUser.id, payload)
        : await createUser(payload);
      onSave(result, !!editUser);
      onClose();
    } catch (err) {
      console.error("Failed to save sales:", err);
      alert(t("dashboard.sales.saveError", "Failed to save. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={700}>
        {editUser
          ? t("dashboard.sales.editSales", "Edit Sales Member")
          : t("dashboard.sales.addSales", "Add Sales Member")}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Avatar */}
          <Stack alignItems="center" spacing={1.5}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={avatarPreview}
                sx={{ width: 90, height: 90, fontSize: "2rem" }}
              >
                {form.fullName ? form.fullName[0]?.toUpperCase() : <PersonIcon />}
              </Avatar>
              <Tooltip title={t("dashboard.sales.changePhoto", "Change Photo")}>
                <IconButton
                  component="label"
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "primary.main",
                    color: "white",
                    width: 28,
                    height: 28,
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  <PhotoCameraIcon sx={{ fontSize: 16 }} />
                  <input type="file" accept="image/*" hidden onChange={handleAvatar} />
                </IconButton>
              </Tooltip>
              {avatarPreview && (
                <Tooltip title={t("dashboard.sales.removePhoto", "Remove Photo")}>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setAvatarFile(null);
                      setAvatarPreview(null);
                      setRemoveAvatar(true);
                    }}
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      bgcolor: "error.main",
                      color: "white",
                      width: 28,
                      height: 28,
                      "&:hover": { bgcolor: "error.dark" },
                    }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {t("dashboard.sales.photoHint", "Upload a profile photo (optional)")}
            </Typography>
          </Stack>

          <Divider />

          {/* Name */}
          <TextField
            fullWidth
            label={t("dashboard.sales.fullName", "Full Name")}
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Email */}
          <TextField
            fullWidth
            label={t("dashboard.sales.email", "Email")}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Phone */}
          <TextField
            fullWidth
            label={t("dashboard.sales.phone", "Phone")}
            name="phone"
            value={form.phone}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Password — only for new user */}
          {!editUser && (
            <>
              <TextField
                fullWidth
                label={t("dashboard.sales.password", "Password")}
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((p) => !p)} edge="end" size="small">
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label={t("dashboard.sales.confirmPassword", "Confirm Password")}
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ borderRadius: 99 }}>
          {t("common.cancel", "Cancel")}
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
          sx={{ borderRadius: 99 }}
        >
          {saving ? t("common.saving", "Saving...") : t("common.save", "Save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Change Password Dialog ────────────────────────────────────────────────────
const ChangePasswordDialog = ({ open, onClose, userId, userName }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ password: "", confirmPassword: "" });
      setErrors({});
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!form.password) newErrors.password = t("dashboard.sales.passwordRequired", "Password is required");
    else {
      const pwResult = validatePassword(form.password);
      if (!pwResult.isValid) newErrors.password = t("dashboard.sales.passwordWeak", "Password must be at least 8 characters with uppercase, lowercase, number, and special character");
    }
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = t("dashboard.sales.passwordMismatch", "Passwords do not match");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      await changeUserPassword(userId, { password: form.password, password_confirmation: form.confirmPassword });
      alert(t("dashboard.sales.passwordChanged", "Password changed successfully!"));
      onClose();
    } catch (err) {
      console.error("Failed to change password:", err);
      alert(t("dashboard.sales.passwordError", "Failed to change password."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={700}>
        {t("dashboard.sales.changePassword", "Change Password")}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t("dashboard.sales.changePasswordFor", "Changing password for")}: <strong>{userName}</strong>
        </Typography>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label={t("dashboard.sales.newPassword", "New Password")}
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((p) => !p)} edge="end" size="small">
                    {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label={t("dashboard.sales.confirmPassword", "Confirm Password")}
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ borderRadius: 99 }}>
          {t("common.cancel", "Cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={<LockResetIcon />}
          sx={{ borderRadius: 99 }}
        >
          {saving ? t("common.saving", "Saving...") : t("dashboard.sales.updatePassword", "Update Password")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Sales Card ────────────────────────────────────────────────────────────────
const SalesCard = ({ salesUser, onEdit, onChangePassword, onToggleStatus, onDelete }) => {
  const { t } = useTranslation();
  const isActive = salesUser.is_active !== false && salesUser.status !== "inactive";
  const name = salesUser.full_name || salesUser.name || "—";

  return (
    <MotionCard
      variants={staggerItem}
      whileHover={{ y: -4 }}
      sx={{
        bgcolor: "background.paper",
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 4px 20px rgba(0,0,0,0.3)"
            : "0 4px 20px rgba(0,0,0,0.07)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Status bar */}
      <Box
        sx={{
          height: 4,
          bgcolor: isActive ? "success.main" : "error.main",
          transition: "background-color 0.3s ease",
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          {/* Avatar + Name + Status */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={salesUser.avatar}
              sx={{
                width: 56,
                height: 56,
                bgcolor: "primary.main",
                fontSize: "1.4rem",
                border: (theme) => `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              {name[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                noWrap
                sx={{ lineHeight: 1.3 }}
              >
                {name}
              </Typography>
              <Chip
                label={isActive ? t("dashboard.sales.active", "Active") : t("dashboard.sales.inactive", "Inactive")}
                size="small"
                icon={isActive ? <CheckCircleIcon sx={{ fontSize: "14px !important" }} /> : <BlockIcon sx={{ fontSize: "14px !important" }} />}
                color={isActive ? "success" : "error"}
                sx={{ fontSize: "0.7rem", height: 22, mt: 0.5 }}
              />
            </Box>
          </Stack>

          <Divider />

          {/* Contact info */}
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <EmailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {salesUser.email}
              </Typography>
            </Stack>
            {salesUser.phone && (
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary">
                  {salesUser.phone}
                </Typography>
              </Stack>
            )}
          </Stack>

          <Divider />

          {/* Actions */}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Tooltip title={t("common.edit", "Edit")}>
              <IconButton
                size="small"
                onClick={() => onEdit(salesUser)}
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  "&:hover": { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16) },
                }}
              >
                <EditIcon fontSize="small" color="primary" />
              </IconButton>
            </Tooltip>

            <Tooltip title={t("dashboard.sales.changePassword", "Change Password")}>
              <IconButton
                size="small"
                onClick={() => onChangePassword(salesUser)}
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.warning.main, 0.08),
                  "&:hover": { bgcolor: (theme) => alpha(theme.palette.warning.main, 0.16) },
                }}
              >
                <LockResetIcon fontSize="small" color="warning" />
              </IconButton>
            </Tooltip>

            <Tooltip title={isActive ? t("dashboard.sales.deactivate", "Deactivate") : t("dashboard.sales.activate", "Activate")}>
              <IconButton
                size="small"
                onClick={() => onToggleStatus(salesUser)}
                sx={{
                  bgcolor: (theme) => alpha(isActive ? theme.palette.error.main : theme.palette.success.main, 0.08),
                  "&:hover": {
                    bgcolor: (theme) => alpha(isActive ? theme.palette.error.main : theme.palette.success.main, 0.16),
                  },
                }}
              >
                {isActive
                  ? <BlockIcon fontSize="small" color="error" />
                  : <CheckCircleIcon fontSize="small" color="success" />}
              </IconButton>
            </Tooltip>

            <Tooltip title={t("common.delete", "Delete")}>
              <IconButton
                size="small"
                onClick={() => onDelete(salesUser)}
                sx={{
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                  "&:hover": { bgcolor: (theme) => alpha(theme.palette.error.main, 0.16) },
                  ml: "auto",
                }}
              >
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </CardContent>
    </MotionCard>
  );
};

// ─── Main View ─────────────────────────────────────────────────────────────────
const SalesManagementView = () => {
  const { t } = useTranslation();
  const { settings } = useCustomizer();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [salesList, setSalesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialogs
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [changePasswordUser, setChangePasswordUser] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      // Fetch users with role=sales
      const data = await fetchUsers({ role: "agent" });
      setSalesList(data);
    } catch (err) {
      console.error("Failed to load sales:", err);
      setError(t("dashboard.sales.loadError", "Failed to load sales members."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const filtered = useMemo(() => {
    if (!searchQuery) return salesList;
    const q = searchQuery.toLowerCase();
    return salesList.filter(
      (u) =>
        (u.full_name || u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q)
    );
  }, [salesList, searchQuery]);

  const handleSaved = (savedUser, isEdit) => {
    if (isEdit) {
      setSalesList((prev) =>
        prev.map((u) => (u.id === savedUser?.id ? { ...u, ...savedUser } : u))
      );
    } else {
      if (savedUser) setSalesList((prev) => [...prev, savedUser]);
      else load(); // reload if no user returned
    }
  };

  const handleToggleStatus = async (salesUser) => {
    try {
      await toggleUserStatus(salesUser.id);
      setSalesList((prev) =>
        prev.map((u) =>
          u.id === salesUser.id
            ? { ...u, is_active: !u.is_active, status: u.is_active ? "inactive" : "active" }
            : u
        )
      );
    } catch (err) {
      console.error("Failed to toggle status:", err);
      alert(t("dashboard.sales.toggleError", "Failed to update status."));
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.user) return;
    setDeleting(true);
    try {
      await deleteUser(deleteDialog.user.id);
      setSalesList((prev) => prev.filter((u) => u.id !== deleteDialog.user.id));
      setDeleteDialog({ open: false, user: null });
    } catch (err) {
      console.error("Failed to delete:", err);
      alert(t("dashboard.sales.deleteError", "Failed to delete sales member."));
    } finally {
      setDeleting(false);
    }
  };

  if (!isAdmin) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography color="error" variant="h6">
          {t("dashboard.forbidden.title", "Access Denied — Admins Only")}
        </Typography>
      </Box>
    );
  }

  return (
    <MotionBox
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 4 },
        bgcolor: "background.default",
        direction: settings.direction,
      }}
    >
      <Container maxWidth="xl">
        <MotionStack
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          spacing={3}
        >
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <SellIcon sx={{ color: "primary.main", fontSize: 28 }} />
                <Typography variant="h4" fontWeight={800}>
                  {t("dashboard.sales.title", "Sales Management")}
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                {filtered.length} {t("dashboard.sales.membersFound", "sales members")}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingUser(null);
                setAddEditOpen(true);
              }}
              sx={{ borderRadius: 99 }}
            >
              {t("dashboard.sales.addSales", "Add Sales")}
            </Button>
          </Stack>

          {/* Search */}
          <TextField
            placeholder={t("dashboard.sales.search", "Search by name or email...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />

          {/* Loading / Error */}
          {loading && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography color="text.secondary">
                {t("dashboard.sales.loading", "Loading sales members...")}
              </Typography>
            </Box>
          )}

          {!loading && error && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

          {/* Empty state */}
          {!loading && !error && filtered.length === 0 && (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <SellIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
              <Typography color="text.secondary" variant="h6" gutterBottom>
                {searchQuery
                  ? t("dashboard.sales.noResults", "No sales members match your search.")
                  : t("dashboard.sales.noSales", "No sales members yet.")}
              </Typography>
              {!searchQuery && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setEditingUser(null);
                    setAddEditOpen(true);
                  }}
                  sx={{ mt: 2, borderRadius: 99 }}
                >
                  {t("dashboard.sales.addFirst", "Add First Sales Member")}
                </Button>
              )}
            </Box>
          )}

          {/* Cards Grid */}
          {!loading && !error && filtered.length > 0 && (
            <MotionBox
              component={Grid2}
              container
              spacing={{ xs: 2, sm: 3 }}
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {filtered.map((salesUser) => (
                <Grid2 key={salesUser.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <SalesCard
                    salesUser={salesUser}
                    onEdit={(u) => {
                      setEditingUser(u);
                      setAddEditOpen(true);
                    }}
                    onChangePassword={(u) => {
                      setChangePasswordUser(u);
                      setChangePasswordOpen(true);
                    }}
                    onToggleStatus={handleToggleStatus}
                    onDelete={(u) => setDeleteDialog({ open: true, user: u })}
                  />
                </Grid2>
              ))}
            </MotionBox>
          )}
        </MotionStack>
      </Container>

      {/* Add / Edit Dialog */}
      <SalesDialog
        open={addEditOpen}
        onClose={() => {
          setAddEditOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaved}
        editUser={editingUser}
      />

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordOpen}
        onClose={() => {
          setChangePasswordOpen(false);
          setChangePasswordUser(null);
        }}
        userId={changePasswordUser?.id}
        userName={changePasswordUser?.full_name || changePasswordUser?.name}
      />

      {/* Delete Confirm Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, user: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle fontWeight={700}>
          {t("dashboard.sales.deleteTitle", "Delete Sales Member")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("dashboard.sales.deleteConfirm", "Are you sure you want to delete")}{" "}
            <strong>{deleteDialog.user?.full_name || deleteDialog.user?.name}</strong>?{" "}
            {t("dashboard.sales.deleteWarning", "This action cannot be undone.")}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, user: null })}
            sx={{ borderRadius: 99 }}
          >
            {t("common.cancel", "Cancel")}
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            sx={{ borderRadius: 99 }}
          >
            {deleting ? t("common.deleting", "Deleting...") : t("common.delete", "Delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </MotionBox>
  );
};

export default SalesManagementView;
