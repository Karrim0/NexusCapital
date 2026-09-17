import { Box, Stack, Typography, Chip, IconButton } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxTeamMemberCard = ({ member, onClick }) => {
  const hasPhoto = member.photo && !member.photo.startsWith("[");

  const stop = (e) => e.stopPropagation();

  return (
    <Box
      onClick={onClick}
      sx={{
        bgcolor: nx.panel,
        border: `1px solid ${nx.panelBorder}`,
        borderRadius: 3,
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.2s, transform 0.2s",
        "&:hover": { borderColor: nx.gold, transform: "translateY(-3px)" },
      }}
    >
      <Box
        sx={{
          height: 220,
          position: "relative",
          overflow: "hidden",
          bgcolor: "#1b2436",
        }}
      >
        {hasPhoto ? (
          <Box
            component="img"
            src={member.photo}
            alt={member.name}
            sx={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }}
          />
        ) : (
          <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.72rem", px: 2, textAlign: "center" }}>
              No photo yet
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontWeight: 600, fontSize: "1.05rem" }}>
              {member.name}
            </Typography>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.8rem", mb: 1.5 }}>{member.title}</Typography>
          </Box>
          <Stack direction="row" spacing={0.5} onClick={stop}>
            {member.whatsapp && (
              <IconButton
                component="a"
                href={`https://wa.me/${member.whatsapp.replace(/[^\d+]/g, "").replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{ color: "#25D366" }}
              >
                <WhatsAppIcon fontSize="small" />
              </IconButton>
            )}
            {member.phone && (
              <IconButton component="a" href={`tel:${member.phone}`} size="small" sx={{ color: nx.gold }}>
                <PhoneRoundedIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </Stack>
        {member.specialization && (
          <Chip
            label={member.specialization}
            size="small"
            sx={{ bgcolor: "rgba(201,162,75,0.12)", color: nx.gold, fontSize: "0.68rem" }}
          />
        )}
      </Box>
    </Box>
  );
};

export default NxTeamMemberCard;
