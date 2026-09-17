import { useState } from "react";
import { Box, Container, Grid2, Stack, Typography, CircularProgress } from "@mui/material";
import SEOHead from "../components/seo/SEOHead";
import useHomeContent from "../hooks/useHomeContent";
import useTeamMembers from "../hooks/useTeamMembers";
import NxLegalHero from "../components/legal/nexus/NxLegalHero";
import NxTeamMemberCard from "../components/team/nexus/NxTeamMemberCard";
import NxTeamMemberModal from "../components/team/nexus/NxTeamMemberModal";
import { nx, fontHeading } from "../theme/nexusHomeTheme";

const DEPARTMENT_ORDER = ["Sales Team", "Rental Team", "Marketing Team", "Management", "Customer Service"];

const TeamView = () => {
  const { content: home } = useHomeContent();
  const { members, loading } = useTeamMembers();
  const [selected, setSelected] = useState(null);

  const grouped = DEPARTMENT_ORDER
    .map((dept) => ({ dept, people: members.filter((m) => m.department === dept) }))
    .filter((g) => g.people.length > 0);

  // Any department not in the known order still gets shown, at the end.
  const known = new Set(DEPARTMENT_ORDER);
  const extra = [...new Set(members.filter((m) => !known.has(m.department)).map((m) => m.department))]
    .map((dept) => ({ dept, people: members.filter((m) => m.department === dept) }));

  const sections = [...grouped, ...extra];

  return (
    <>
      <SEOHead
        title={`Meet Our Team | ${home.brand_name || "Nexus Capital"}`}
        description="Meet the Nexus Capital team behind our sales, rentals, marketing, management, and customer service — the people helping you buy, rent, and invest with confidence in Hurghada and the Red Sea."
        keywords="Nexus Capital team, real estate team Hurghada, property sales team Egypt, rental team Hurghada, customer service Red Sea real estate"
        url="/about/team"
      />
      <Box>
        <NxLegalHero
          content={{
            eyebrow: "About Us",
            title: "Meet Our Team",
            description: "The people behind Nexus Capital — sales, rentals, marketing, management, and customer service, working together to help you buy, rent, and invest with confidence.",
          }}
          variant="page"
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10, bgcolor: nx.ink }}>
            <CircularProgress />
          </Box>
        ) : sections.length === 0 ? (
          <Box sx={{ bgcolor: nx.ink, py: 10, textAlign: "center" }}>
            <Typography sx={{ color: nx.textOnDarkMuted }}>Team profiles are coming soon.</Typography>
          </Box>
        ) : (
          sections.map((section, idx) => (
            <Box key={section.dept} sx={{ bgcolor: idx % 2 === 0 ? nx.ink : "#0f1420", py: { xs: 6, md: 8 } }}>
              <Container maxWidth="lg">
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                  <Box sx={{ width: 32, height: 2, bgcolor: nx.gold }} />
                  <Typography sx={{ fontFamily: fontHeading, color: nx.textOnDark, fontWeight: 600, fontSize: { xs: "1.3rem", md: "1.6rem" } }}>
                    {section.dept}
                  </Typography>
                </Stack>
                <Grid2 container spacing={3}>
                  {section.people.map((member) => (
                    <Grid2 key={member.id} size={{ xs: 12, sm: 6, md: 3 }}>
                      <NxTeamMemberCard member={member} onClick={() => setSelected(member)} />
                    </Grid2>
                  ))}
                </Grid2>
              </Container>
            </Box>
          ))
        )}
      </Box>

      <NxTeamMemberModal member={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </>
  );
};

export default TeamView;
