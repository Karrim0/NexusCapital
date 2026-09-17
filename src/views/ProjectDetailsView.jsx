import { useEffect, useState } from "react";
import { Box, CircularProgress, Container, Typography, Button } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { fetchProjectById } from "../api/projects";
import useHomeContent from "../hooks/useHomeContent";
import SEOHead from "../components/seo/SEOHead";
import { sanitizeMetaDescription } from "../utils/seoHelpers";
import { nx } from "../theme/nexusHomeTheme";
import NxProjectHero from "../components/project-details/nexus/NxProjectHero";
import NxProjectGalleryOverview from "../components/project-details/nexus/NxProjectGalleryOverview";
import NxProjectResidences from "../components/project-details/nexus/NxProjectResidences";
import NxProjectFacilities from "../components/project-details/nexus/NxProjectFacilities";
import NxProjectOverview from "../components/project-details/nexus/NxProjectOverview";
import NxProjectBuyerJourney from "../components/project-details/nexus/NxProjectBuyerJourney";
import NxProjectInvestmentLifestyle from "../components/project-details/nexus/NxProjectInvestmentLifestyle";
import NxProjectOfferPayment from "../components/project-details/nexus/NxProjectOfferPayment";
import NxProjectLocationJourney from "../components/project-details/nexus/NxProjectLocationJourney";
import NxProjectLocationCard from "../components/project-details/nexus/NxProjectLocationCard";
import NxProjectFaqEnquiry from "../components/project-details/nexus/NxProjectFaqEnquiry";
import NxProjectConstructionProgress from "../components/project-details/nexus/NxProjectConstructionProgress";
import NxProjectMasterPlan from "../components/project-details/nexus/NxProjectMasterPlan";
import NxProjectTrackRecord from "../components/project-details/nexus/NxProjectTrackRecord";

const ProjectDetailsView = () => {
  const { id } = useParams();
  const { content: home } = useHomeContent();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchProjectById(id);
        if (!cancelled) {
          if (data) setProject(data);
          else setError("Project not found.");
        }
      } catch (err) {
        console.error("Failed to load project:", err);
        if (!cancelled) setError("Failed to load this project. Please try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 16, bgcolor: nx.ink, minHeight: "60vh" }}>
        <CircularProgress sx={{ color: nx.gold }} />
      </Box>
    );
  }

  if (error || !project) {
    return (
      <Box sx={{ bgcolor: nx.ink, minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", py: 10 }}>
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "1.4rem", mb: 2 }}>
            {error || "Project not found."}
          </Typography>
          <Button component={Link} to="/projects" variant="contained" sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, borderRadius: 999, px: 3 }}>
            Back to projects
          </Button>
        </Container>
      </Box>
    );
  }

  const whatsappNumber = home.topbar?.whatsapp_number;
  const phoneNumber = home.topbar?.phone;
  const brandName = home.brand_name;
  const hasOffer = !!project.offer_discount_percent;
  const hasMap = !!project.map_embed_url;
  const hasResidences = true; // always has defaults
  const hasInvestment = true;
  const hasLifestyle = true;
  const hasJourney = true;
  const hasFaq = true;

  return (
    <>
      <SEOHead
        title={`${project.name || project.title} | ${brandName}`}
        description={sanitizeMetaDescription(project.overview || project.description) || `${project.name} in ${project.location || "the Red Sea"} — starting price, payment plans, and availability.`}
        keywords={`${brandName}, ${project.name}, ${project.location}, Red Sea developer projects, off-plan property Egypt`}
        url={`/projects/${project.id}`}
      />
      <Box>
        <NxProjectHero
          project={project}
          whatsappNumber={whatsappNumber}
          hasOffer={hasOffer}
          hasMap={hasMap}
          hasJourney={hasJourney}
          hasResidences={hasResidences}
          hasInvestment={hasInvestment}
          hasLifestyle={hasLifestyle}
          hasFaq={hasFaq}
        />
        <NxProjectGalleryOverview project={project} whatsappNumber={whatsappNumber} phoneNumber={phoneNumber} />
        <NxProjectOverview project={project} />
        <NxProjectFacilities project={project} />
        <NxProjectLocationCard project={project} whatsappNumber={whatsappNumber} />
        <NxProjectResidences project={project} whatsappNumber={whatsappNumber} />
        <NxProjectInvestmentLifestyle project={project} />
        <NxProjectConstructionProgress project={project} whatsappNumber={whatsappNumber} />
        <NxProjectOfferPayment project={project} />
        <NxProjectLocationJourney project={project} />
        <NxProjectMasterPlan project={project} whatsappNumber={whatsappNumber} />
        <NxProjectTrackRecord project={project} />
        <NxProjectBuyerJourney />
        <NxProjectFaqEnquiry
          project={project}
          whatsappNumber={whatsappNumber}
          phoneNumber={phoneNumber}
          brandName={brandName}
          consultTitle={home.cta_section?.consult_title || "Ready to own property by the Red Sea?"}
          consultDescription={home.cta_section?.consult_description}
          consultCtaLabel={home.cta_section?.consult_cta_label || "BOOK WHATSAPP CONSULTATION"}
        />
      </Box>
    </>
  );
};

export default ProjectDetailsView;
