import { useState } from "react";
import { Box, Container, Grid2, Stack, Typography, Collapse } from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { nx, fontHeading } from "../../../theme/nexusHomeTheme";

const NxFaqSection = ({ content }) => {
  const s = content.faq_section;
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Box sx={{ bgcolor: nx.cream, py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid2 container spacing={{ xs: 4, md: 6 }}>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
              <Typography sx={{ color: nx.gold, fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.14em" }}>
                {s.eyebrow}
              </Typography>
            </Stack>
            <Typography sx={{ fontFamily: fontHeading, fontWeight: 600, color: nx.textOnCream, fontSize: { xs: "1.9rem", md: "2.4rem" }, lineHeight: 1.15, mb: 2 }}>
              {s.title}
            </Typography>
            <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.95rem", lineHeight: 1.75 }}>
              {s.description}
            </Typography>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 8 }}>
            <Stack spacing={1.5}>
              {(s.items || []).map((item, i) => {
                const open = openIndex === i;
                return (
                  <Box
                    key={i}
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    sx={{ bgcolor: nx.creamPaper, borderRadius: 3, p: 2.5, cursor: "pointer", boxShadow: "0 10px 26px rgba(25,21,16,0.05)" }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography sx={{ color: nx.textOnCream, fontWeight: 700, fontSize: "0.95rem" }}>{item.question}</Typography>
                      <ExpandMoreRoundedIcon sx={{ color: nx.gold, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                    </Stack>
                    <Collapse in={open}>
                      <Typography sx={{ color: nx.textOnCreamMuted, fontSize: "0.88rem", lineHeight: 1.7, mt: 1.5 }}>
                        {item.answer}
                      </Typography>
                    </Collapse>
                  </Box>
                );
              })}
            </Stack>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default NxFaqSection;
