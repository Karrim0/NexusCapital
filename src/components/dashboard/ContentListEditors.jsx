import { useState } from "react";
import { Box, Stack, TextField, Button, IconButton, Typography, Avatar, CircularProgress, Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText, Chip, OutlinedInput, Switch, FormControlLabel } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { uploadContentImage } from "../../api/contentImages";
import { DISTRICT_GROUPS, DISTRICTS } from "../../constants/hurghadaDistricts";
import { NAV_MENU_ITEMS } from "../../constants/navMenu";
import { useTranslation } from "react-i18next";

// A "linked district" picker for a list item (e.g. one Destinations card).
// Stores the same district key used by the Buy/Rent/Lands "District" filter,
// so clicking the card on the public site reliably filters to matching
// properties — instead of relying on free-text name matching.
export const DistrictSelectField = ({ label, value, onChange }) => {
  const { t } = useTranslation();
  return (
    <FormControl fullWidth size="small">
      {label && <InputLabel>{label}</InputLabel>}
      <Select label={label} value={value || ""} onChange={(e) => onChange(e.target.value)}>
        <MenuItem value="">
          <em>{t("common.notSpecified", "Not linked to a district")}</em>
        </MenuItem>
        {DISTRICT_GROUPS.map((group) => [
          <MenuItem key={`group-${group.key}`} disabled sx={{ fontWeight: 700, opacity: 0.7 }}>
            {t(group.translationKey)}
          </MenuItem>,
          ...DISTRICTS.filter((d) => d.group === group.key).map((district) => (
            <MenuItem key={district.key} value={district.key} sx={{ pl: 3 }}>
              {t(district.translationKey)}
            </MenuItem>
          )),
        ])}
      </Select>
    </FormControl>
  );
};

// Pick MULTIPLE districts to control which area "pills" show up on the
// public site (e.g. the Featured Properties quick-filter chips). Stores an
// array of district keys — order picked = order shown on the site.
export const DistrictMultiSelectField = ({ label, value, onChange }) => {
  const { t } = useTranslation();
  const selected = value || [];

  return (
    <FormControl fullWidth size="small">
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        label={label}
        multiple
        value={selected}
        onChange={(e) => {
          // Selecting a disabled group-header MenuItem is impossible (no
          // `value` prop on those), so e.target.value only ever contains
          // real district keys.
          onChange(typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value);
        }}
        input={<OutlinedInput label={label} />}
        renderValue={(vals) => (
          <Stack direction="row" flexWrap="wrap" gap={0.5}>
            {vals.length === 0 && <em>None selected</em>}
            {vals.map((key) => {
              const d = DISTRICTS.find((d) => d.key === key);
              return <Chip key={key} label={d ? t(d.translationKey) : key} size="small" />;
            })}
          </Stack>
        )}
      >
        {DISTRICT_GROUPS.map((group) => [
          <MenuItem key={`group-${group.key}`} disabled sx={{ fontWeight: 700, opacity: 0.7 }}>
            {t(group.translationKey)}
          </MenuItem>,
          ...DISTRICTS.filter((d) => d.group === group.key).map((district) => (
            <MenuItem key={district.key} value={district.key} sx={{ pl: 3 }}>
              <Checkbox checked={selected.includes(district.key)} size="small" />
              <ListItemText primary={t(district.translationKey)} />
            </MenuItem>
          )),
        ])}
      </Select>
    </FormControl>
  );
};

// Direct image upload for a single list item (e.g. one Destinations card).
// Unlike the fixed logo/hero-background uploaders, list items don't have a
// stable field name to bundle into the page's main save request — so the
// image is uploaded to the server the moment it's picked, and `onChange`
// receives the final URL to store on that item.
export const ImageUploadField = ({ label, value, onChange, folder }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const { url } = await uploadContentImage(file, folder);
      onChange(url);
    } catch (err) {
      console.error("Image upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      {label && (
        <Typography sx={{ fontWeight: 600, fontSize: "0.8rem", mb: 0.75, color: "text.secondary" }}>
          {label}
        </Typography>
      )}
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar src={value || undefined} variant="rounded" sx={{ width: 64, height: 64, bgcolor: "action.hover" }}>
          {!value && <ImageRoundedIcon color="disabled" />}
        </Avatar>
        <Button
          component="label"
          variant="outlined"
          size="small"
          disabled={uploading}
          startIcon={uploading ? <CircularProgress size={14} color="inherit" /> : <UploadFileIcon />}
        >
          {uploading ? "Uploading..." : value ? "Replace image" : "Upload image"}
          <input type="file" hidden accept="image/*" onChange={handleFile} />
        </Button>
        {value && !uploading && (
          <IconButton size="small" color="error" onClick={() => onChange("")} title="Remove image">
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>
      {error && (
        <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

// Simple array-of-strings editor (badges, bullet points...)
export const StringListEditor = ({ label, items = [], onChange }) => {
  const update = (i, val) => {
    const next = [...items];
    next[i] = val;
    onChange(next);
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, ""]);

  return (
    <Box>
      {label && (
        <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", mb: 1 }}>{label}</Typography>
      )}
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

// Generic array-of-objects editor (cards, steps, FAQ items, payment rows...)
export const ObjectListEditor = ({ label, items = [], fields, onChange, template }) => {
  const updateItem = (i, key, val) => {
    const next = items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it));
    onChange(next);
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, { ...template }]);

  return (
    <Box>
      {label && (
        <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", mb: 1.5 }}>{label}</Typography>
      )}
      <Stack spacing={2}>
        {items.map((item, i) => (
          <Box key={i} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2, position: "relative" }}>
            <IconButton size="small" color="error" onClick={() => remove(i)} sx={{ position: "absolute", top: 6, right: 6 }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
            <Stack spacing={1.5} sx={{ pr: 4 }}>
              {fields.map((f) =>
                f.type === "image" ? (
                  <ImageUploadField
                    key={f.key}
                    label={f.label}
                    value={item[f.key]}
                    onChange={(v) => updateItem(i, f.key, v)}
                    folder={f.folder}
                  />
                ) : f.type === "district" ? (
                  <DistrictSelectField
                    key={f.key}
                    label={f.label}
                    value={item[f.key]}
                    onChange={(v) => updateItem(i, f.key, v)}
                  />
                ) : (
                  <TextField
                    key={f.key}
                    label={f.label}
                    value={item[f.key] ?? ""}
                    onChange={(e) => updateItem(i, f.key, e.target.value)}
                    fullWidth
                    size="small"
                    multiline={f.multiline}
                    minRows={f.multiline ? f.minRows || 2 : undefined}
                    type={f.type || "text"}
                  />
                )
              )}
            </Stack>
          </Box>
        ))}
        <Button startIcon={<AddIcon />} onClick={add} size="small" sx={{ alignSelf: "flex-start" }}>
          Add {label ? label.toLowerCase() : "item"}
        </Button>
      </Stack>
    </Box>
  );
};

// Controls which pages appear in the header navigation menu and in what
// order. Deliberately does NOT let the admin edit label text or path —
// those always come from NAV_MENU_ITEMS (translated safely, valid
// routes only). This only toggles visibility and reorders via up/down.
export const NavMenuEditor = ({ label, items = [], onChange }) => {
  const { t } = useTranslation();

  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const toggleVisible = (index) => {
    const next = items.map((item, i) => (i === index ? { ...item, visible: item.visible === false } : item));
    onChange(next);
  };

  const updateLabel = (index, value) => {
    const next = items.map((item, i) => (i === index ? { ...item, label: value } : item));
    onChange(next);
  };

  return (
    <Box>
      {label && (
        <Typography sx={{ fontWeight: 600, fontSize: "0.8rem", mb: 0.75, color: "text.secondary" }}>
          {label}
        </Typography>
      )}
      <Stack spacing={1}>
        {items.map((item, i) => {
          const meta = NAV_MENU_ITEMS[item.key];
          if (!meta) return null;
          return (
            <Stack
              key={item.key}
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, px: 1.5, py: 0.75 }}
            >
              <Stack direction="column" spacing={0}>
                <IconButton size="small" disabled={i === 0} onClick={() => move(i, -1)}>
                  <ArrowUpwardIcon fontSize="inherit" />
                </IconButton>
                <IconButton size="small" disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                  <ArrowDownwardIcon fontSize="inherit" />
                </IconButton>
              </Stack>
              <TextField
                size="small"
                value={item.label || ""}
                onChange={(e) => updateLabel(i, e.target.value)}
                placeholder={t(meta.translationKey)}
                helperText="Leave blank to use the default translated name"
                sx={{ flex: 1 }}
              />
              <Typography sx={{ color: "text.secondary", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                {meta.path}
              </Typography>
              <FormControlLabel
                control={<Switch checked={item.visible !== false} onChange={() => toggleVisible(i)} size="small" />}
                label={item.visible !== false ? "Shown" : "Hidden"}
                sx={{ ml: 1, whiteSpace: "nowrap", "& .MuiFormControlLabel-label": { fontSize: "0.75rem" } }}
              />
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};
