import { Box } from "@mui/material";
import SEOHead from "../components/seo/SEOHead";
import useHomeContent from "../hooks/useHomeContent";
import useLandsContent from "../hooks/useLandsContent";
import NxLandsHero from "../components/lands/nexus/NxLandsHero";
import NxLandsFeatureStrip from "../components/lands/nexus/NxLandsFeatureStrip";
import NxLandsListingSection from "../components/lands/nexus/NxLandsListingSection";

const LandsView = () => {
  const { content: home } = useHomeContent();
  const { content: lands } = useLandsContent();
  const whatsappNumber = home.topbar?.whatsapp_number;

  return (
    <>
      <SEOHead
        title={`Land & Buildings for Sale | ${home.brand_name} | Hurghada & Sahl Hasheesh`}
        description={lands.hero?.subtitle}
        keywords={`${home.brand_name}, land for sale Hurghada, buildings for sale Egypt, commercial property Red Sea, plot for sale Sahl Hasheesh`}
        url="/lands-buildings"
      />
      <Box>
        <NxLandsHero
          content={lands}
          brandName={home.brand_name}
          whatsappNumber={whatsappNumber}
          email={home.topbar?.email}
          logoUrl={home.logo_url}
        />
        <NxLandsFeatureStrip items={lands.feature_strip} />
        <NxLandsListingSection content={lands} whatsappNumber={whatsappNumber} />
      </Box>
    </>
  );
};

export default LandsView;
