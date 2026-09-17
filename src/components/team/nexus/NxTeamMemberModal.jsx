import { Dialog, DialogContent, IconButton, Box, Stack, Typography, Chip, Button } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxTeamMemberModal = ({ member, open, onClose }) => {
  if (!member) return null;
  const hasPhoto = member.photo && !member.photo.startsWith("[");

  const contactLinks = [
    member.whatsapp && {
      icon: <WhatsAppIcon fontSize="small" />,
      label: "WhatsApp",
      href: `https://wa.me/${member.whatsapp.replace(/[^\d+]/g, "").replace("+", "")}`,
    },
    member.phone && { icon: <PhoneRoundedIcon fontSize="small" />, label: "Call", href: `tel:${member.phone}` },
    member.email && { icon: <EmailRoundedIcon fontSize="small" />, label: "Email", href: `mailto:${member.email}` },
    member.linkedin_url && { icon: <LinkedInIcon fontSize="small" />, label: "LinkedIn", href: member.linkedin_url },
  ].filter(Boolean);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: nx.ink, borderRadius: 3 } }}>
      <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8, color: nx.textOnDark, zIndex: 1 }}>
        <CloseRoundedIcon />
      </IconButton>
      <Box
        sx={{
          height: 220,
          position: "relative",
          overflow: "hidden",
          bgcolor: "#1b2436",
        }}
      >
        {hasPhoto && (
          <Box
            component="img"
            src={member.photo}
            alt={member.name}
            sx={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }}
          />
        )}
      </Box>
      <DialogContent sx={{ p: 3 }}>
        <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontWeight: 700, fontSize: "1.5rem" }}>{member.name}</Typography>
        <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.9rem", mb: 2 }}>{member.title}</Typography>

        {member.bio && (
          <>
            <Typography sx={{ fontWeight: 700, color: nx.textOnDark, fontSize: "0.85rem", mb: 0.5 }}>About</Typography>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem", lineHeight: 1.7, mb: 2 }}>{member.bio}</Typography>
          </>
        )}

        <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ mb: 2 }}>
          {member.years_of_experience && (
            <Chip label={`Experience: ${member.years_of_experience}`} size="small" sx={{ bgcolor: "rgba(201,162,75,0.12)", color: nx.gold, fontSize: "0.7rem" }} />
          )}
          {member.location && (
            <Chip label={`Covers: ${member.location}`} size="small" sx={{ bgcolor: "rgba(201,162,75,0.12)", color: nx.gold, fontSize: "0.7rem" }} />
          )}
        </Stack>

        {member.specialization && (
          <>
            <Typography sx={{ fontWeight: 700, color: nx.textOnDark, fontSize: "0.85rem", mb: 0.5 }}>Specialization</Typography>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem", mb: 2 }}>{member.specialization}</Typography>
          </>
        )}

        {Array.isArray(member.expertise) && member.expertise.length > 0 && (
          <>
            <Typography sx={{ fontWeight: 700, color: nx.textOnDark, fontSize: "0.85rem", mb: 1 }}>Area of Expertise</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
              {member.expertise.map((item) => (
                <Chip key={item} label={item} size="small" sx={{ bgcolor: nx.panel, border: `1px solid ${nx.panelBorder}`, color: nx.textOnDark, fontSize: "0.7rem" }} />
              ))}
            </Stack>
          </>
        )}

        {Array.isArray(member.languages) && member.languages.length > 0 && (
          <>
            <Typography sx={{ fontWeight: 700, color: nx.textOnDark, fontSize: "0.85rem", mb: 1 }}>Languages</Typography>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem", mb: 2 }}>{member.languages.join(" · ")}</Typography>
          </>
        )}

        {contactLinks.length > 0 && (
          <>
            <Typography sx={{ fontWeight: 700, color: nx.textOnDark, fontSize: "0.85rem", mb: 1 }}>Contact</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {contactLinks.map((link) => (
                <Button
                  key={link.label}
                  component="a"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={link.icon}
                  size="small"
                  sx={{ border: `1px solid ${nx.gold}`, color: nx.gold, borderRadius: 999, fontSize: "0.72rem", "&:hover": { bgcolor: "rgba(201,162,75,0.1)" } }}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NxTeamMemberModal;
