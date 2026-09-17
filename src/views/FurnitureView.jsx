import { Box, CircularProgress } from "@mui/material";
import SEOHead from "../components/seo/SEOHead";
import useHomeContent from "../hooks/useHomeContent";
import useFurnitureContent from "../hooks/useFurnitureContent";
import NxLegalHero from "../components/legal/nexus/NxLegalHero";
import NxLegalServicesGrid from "../components/legal/nexus/NxLegalServicesGrid";
import NxFurniturePackages from "../components/furniture/nexus/NxFurniturePackages";
import NxFurnitureCta from "../components/furniture/nexus/NxFurnitureCta";
import NxFurnitureQuoteForm from "../components/furniture/nexus/NxFurnitureQuoteForm";

const QUOTE_FORM_ID = "furniture-quote-form";

const FurnitureView = () => {
  const { content: home } = useHomeContent();
  const { content, loading } = useFurnitureContent();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const scrollToForm = () => {
    document.getElementById(QUOTE_FORM_ID)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SEOHead
        title={`Furniture & Furnishing | ${home.brand_name || "Nexus Capital"}`}
        description="Furnish your Red Sea property with Basic, Premium, or Luxury packages: bedroom, living room, kitchen, lighting, and complete ready-to-move furnishing solutions."
        keywords="furniture packages Hurghada, apartment furnishing Egypt, ready to move furniture Red Sea, rental property furnishing Hurghada, furniture packages Egypt"
        url="/furniture-furnishing"
      />
      <Box>
        <NxLegalHero content={content.hero} variant="page" />
        <NxLegalServicesGrid services={content.service_types} />
        <NxFurniturePackages packages={content.packages} onRequestQuote={scrollToForm} />
        <NxFurnitureCta cta={content.cta} targetId={QUOTE_FORM_ID} />
        <NxFurnitureQuoteForm id={QUOTE_FORM_ID} packages={content.packages} />
      </Box>
    </>
  );
};

export default FurnitureView;
