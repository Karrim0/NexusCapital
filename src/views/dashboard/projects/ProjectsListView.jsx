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
  Menu,
  MenuItem,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCustomizer } from "../../../context/CustomizerContext";
import { useAuth } from "../../../context/AuthContext";
import {
  MotionBox,
  MotionStack,
  MotionCard,
} from "../../../components/common/MotionComponents";
import { fadeInUp } from "../../../components/common/motionVariants";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import { useNavigate } from "react-router-dom";
import { fetchProjects, deleteProject } from "../../../api/projects";

const statusColor = (status) => {
  if (!status) return "default";
  const s = status.toLowerCase();
  if (s === "completed") return "success";
  if (s === "upcoming") return "warning";
  return "info";
};

const ProjectsListView = () => {
  const { t } = useTranslation();
  const { settings } = useCustomizer();
  const { user } = useAuth();
  const isRTL = settings.direction === "rtl";
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setError(t("dashboard.projectsList.error", "Failed to load projects."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        (p.name || p.title || "").toLowerCase().includes(q) ||
        (p.location || "").toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  const handleMenuOpen = (e, project) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    setDeleting(true);
    try {
      await deleteProject(selectedProject.id);
      setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
      setDeleteDialogOpen(false);
      setSelectedProject(null);
    } catch (err) {
      console.error("Failed to delete project:", err);
      alert(t("dashboard.projectsList.deleteError", "Failed to delete project."));
    } finally {
      setDeleting(false);
    }
  };

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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography variant="h4" fontWeight={800}>
                {t("dashboard.projectsList.title", "Projects List")}
              </Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                {filtered.length} {t("dashboard.projectsList.projectsFound", "projects")}
              </Typography>
            </Box>
            {isAdmin && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/dashboard/projects/add")}
                sx={{ borderRadius: 99 }}
              >
                {t("dashboard.projectsList.addProject", "Add Project")}
              </Button>
            )}
          </Stack>

          {/* Search */}
          <TextField
            placeholder={t("dashboard.projectsList.search", "Search projects...")}
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

          {/* Table */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            sx={{
              bgcolor: "background.paper",
              border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 2px 8px rgba(0,0,0,0.2)"
                  : "0 2px 8px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                    }}
                  >
                    <TableCell sx={{ fontWeight: 700 }}>
                      {t("dashboard.projectsList.project", "Project")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {t("dashboard.projectsList.location", "Location")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {t("dashboard.projectsList.delivery", "Delivery")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {t("dashboard.projectsList.price", "Starting Price")}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {t("dashboard.projectsList.status", "Status")}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      {t("dashboard.projectsList.actions", "Actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">
                          {t("dashboard.projectsList.loading", "Loading...")}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && error && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography color="error">{error}</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && !error && filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <Stack alignItems="center" spacing={1}>
                          <ApartmentRoundedIcon
                            sx={{ fontSize: 48, color: "text.disabled" }}
                          />
                          <Typography color="text.secondary">
                            {t("dashboard.projectsList.noProjects", "No projects found.")}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading &&
                    !error &&
                    filtered.map((project) => (
                      <TableRow
                        key={project.id}
                        hover
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: (theme) =>
                              alpha(theme.palette.primary.main, 0.04),
                          },
                        }}
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        {/* Project name + image */}
                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar
                              src={project.main_image || project.image}
                              variant="rounded"
                              sx={{ width: 48, height: 48, borderRadius: 1.5 }}
                            >
                              <ApartmentRoundedIcon />
                            </Avatar>
                            <Box>
                              <Typography
                                variant="body2"
                                fontWeight={700}
                                sx={{ lineHeight: 1.3 }}
                              >
                                {project.name || project.title}
                              </Typography>
                              {project.total_units && (
                                <Typography variant="caption" color="text.secondary">
                                  {project.total_units}{" "}
                                  {t("dashboard.projectsList.units", "units")}
                                </Typography>
                              )}
                            </Box>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {project.location || project.district || "—"}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2">
                            {project.delivery_date || "—"}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {project.starting_price ? (
                            <Typography variant="body2" fontWeight={700} color="primary">
                              {project.currency === "EUR"
                                ? "€"
                                : project.currency === "GBP"
                                ? "£"
                                : project.currency === "EGP"
                                ? "E£"
                                : "$"}
                              {Number(project.starting_price).toLocaleString()}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.disabled">
                              —
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={project.status || "under_construction"}
                            size="small"
                            color={statusColor(project.status)}
                            sx={{ fontWeight: 600, fontSize: "0.72rem" }}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="flex-end"
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/projects/${project.id}`);
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            {isAdmin && (
                              <>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                      `/dashboard/projects/${project.id}/edit`
                                    );
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProject(project);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MotionCard>
        </MotionStack>
      </Container>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle fontWeight={700}>
          {t("dashboard.projectsList.deleteTitle", "Delete Project")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(
              "dashboard.projectsList.deleteConfirm",
              "Are you sure you want to delete"
            )}{" "}
            <strong>{selectedProject?.name || selectedProject?.title}</strong>?{" "}
            {t(
              "dashboard.projectsList.deleteWarning",
              "This action cannot be undone."
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: 99 }}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            sx={{ borderRadius: 99 }}
          >
            {deleting
              ? t("common.deleting", "Deleting...")
              : t("common.delete", "Delete")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Row menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            navigate(`/projects/${selectedProject?.id}`);
            handleMenuClose();
          }}
        >
          <VisibilityIcon sx={{ mr: 1, fontSize: 18 }} />
          {t("common.view", "View")}
        </MenuItem>
        {isAdmin && (
          <MenuItem
            onClick={() => {
              navigate(`/dashboard/projects/${selectedProject?.id}/edit`);
              handleMenuClose();
            }}
          >
            <EditIcon sx={{ mr: 1, fontSize: 18 }} />
            {t("common.edit", "Edit")}
          </MenuItem>
        )}
        {isAdmin && (
          <MenuItem
            onClick={() => {
              setDeleteDialogOpen(true);
              handleMenuClose();
            }}
            sx={{ color: "error.main" }}
          >
            <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
            {t("common.delete", "Delete")}
          </MenuItem>
        )}
      </Menu>
    </MotionBox>
  );
};

export default ProjectsListView;
