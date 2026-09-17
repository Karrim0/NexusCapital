import { Box, Container, Grid2, Stack, Typography, IconButton, Divider } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import useHomeContent from "../../hooks/useHomeContent";
import { nx, fontHeading } from "../../theme/nexusHomeTheme";
import logoDark from "../../assets/images/logo_dark.png";

const SOCIAL_ICONS = {
  facebook: FacebookIcon,
  x: XIcon,
  youtube: YouTubeIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  tiktok: MusicNoteRoundedIcon,
};

const Footer = () => {
  const { content } = useHomeContent();
  const footer = content.footer || {};
  const brandName = content.brand_name || "Nexus Capital";
  const brandTagline = content.brand_tagline || "";
  const logoUrl = content.logo_url || logoDark;

  return (
    <Box component="footer" sx={{ bgcolor: nx.ink, borderTop: `1px solid ${nx.panelBorder}` }}>
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 6 } }}>
        <Grid2 container spacing={{ xs: 4, md: 5 }}>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <Box component="img" src={logoUrl} alt={brandName} sx={{ height: 42, width: "auto", objectFit: "contain" }} />
              <Box>
                <Typography sx={{ fontFamily: fontHeading, color: nx.gold, fontWeight: 700, fontSize: "1rem", lineHeight: 1.1 }}>
                  {brandName}
                </Typography>
                {brandTagline && (
                  <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.65rem", letterSpacing: "0.08em" }}>{brandTagline}</Typography>
                )}
              </Box>
            </Stack>
            <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem", lineHeight: 1.75, mb: 2.5, maxWidth: 320 }}>
              {footer.about}
            </Typography>
            <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.1em", mb: 1 }}>FOLLOW US</Typography>
            <Stack direction="row" spacing={1}>
              {(footer.social || []).map((s, i) => {
                const Icon = SOCIAL_ICONS[s.platform] || FacebookIcon;
                return (
                  <IconButton
                    key={i}
                    component={s.url ? "a" : "button"}
                    href={s.url || undefined}
                    target={s.url ? "_blank" : undefined}
                    rel={s.url ? "noopener" : undefined}
                    size="small"
                    sx={{ bgcolor: "rgba(245,241,230,0.06)", color: nx.textOnDark, border: `1px solid ${nx.panelBorder}`, "&:hover": { bgcolor: "rgba(201,162,75,0.15)", color: nx.gold } }}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                );
              })}
            </Stack>
          </Grid2>

          <Grid2 size={{ xs: 6, sm: 3, md: 2.5 }}>
            <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em", mb: 2 }}>QUICK LINKS</Typography>
            <Stack spacing={1.2}>
              {(footer.quick_links || []).map((link, i) => (
                <Typography
                  key={i}
                  component={RouterLink}
                  to={link.url || "/"}
                  sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem", textDecoration: "none", "&:hover": { color: nx.gold } }}
                >
                  {link.label}
                </Typography>
              ))}
            </Stack>
          </Grid2>

          <Grid2 size={{ xs: 6, sm: 3, md: 2.5 }}>
            <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em", mb: 2 }}>POPULAR AREAS</Typography>
            <Stack spacing={1.2}>
              {(footer.popular_areas || []).map((area, i) => (
                <Typography
                  key={i}
                  component={RouterLink}
                  to={area.url || "/buy"}
                  sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem", textDecoration: "none", "&:hover": { color: nx.gold } }}
                >
                  {area.label}
                </Typography>
              ))}
            </Stack>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em", mb: 2 }}>CONTACT</Typography>
            <Stack spacing={1.4}>
              {footer.contact?.phone && (
                <Stack direction="row" spacing={1} alignItems="center" component="a" href={`tel:${footer.contact.phone.replace(/\s/g, "")}`} sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem", textDecoration: "none", "&:hover": { color: nx.gold } }}>
                  <PhoneRoundedIcon sx={{ fontSize: 16 }} />
                  <span>{footer.contact.phone}</span>
                </Stack>
              )}
              {footer.contact?.email && (
                <Stack direction="row" spacing={1} alignItems="center" component="a" href={`mailto:${footer.contact.email}`} sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem", textDecoration: "none", "&:hover": { color: nx.gold } }}>
                  <EmailRoundedIcon sx={{ fontSize: 16 }} />
                  <span>{footer.contact.email}</span>
                </Stack>
              )}
              {footer.contact?.address && (
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <PlaceRoundedIcon sx={{ fontSize: 16, color: nx.textOnDarkMuted, mt: 0.3 }} />
                  <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem", lineHeight: 1.6 }}>{footer.contact.address}</Typography>
                </Stack>
              )}
              {footer.contact?.whatsapp_label && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <WhatsAppIcon sx={{ fontSize: 16, color: nx.gold }} />
                  <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.85rem" }}>{footer.contact.whatsapp_label}</Typography>
                </Stack>
              )}
            </Stack>
          </Grid2>
        </Grid2>
      </Container>

      <Divider sx={{ borderColor: nx.panelBorder }} />

      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={1} sx={{ py: 2.5 }}>
          <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.75rem" }}>{footer.copyright_note}</Typography>
          <Typography sx={{ color: nx.textOnDarkMuted, fontSize: "0.75rem" }}>
            {footer.tax_registration && `Tax Registration: ${footer.tax_registration}`}
            {footer.tax_registration && footer.privacy_note && " · "}
            {footer.privacy_note}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
