import { Box } from "@mui/material";
import SEOHead from "../components/seo/SEOHead";
import useHomeContent from "../hooks/useHomeContent";
import useRentContent from "../hooks/useRentContent";
import NxRentHero from "../components/rent/nexus/NxRentHero";
import NxRentFeatureStrip from "../components/rent/nexus/NxRentFeatureStrip";
import NxRentListingSection from "../components/rent/nexus/NxRentListingSection";

const RentView = () => {
  const { content: home } = useHomeContent();
  const { content: rent } = useRentContent();
  const whatsappNumber = home.topbar?.whatsapp_number;

  return (
    <>
      <SEOHead
        title={`Properties for Rent | ${home.brand_name} | Rent Homes in Hurghada & Sahl Hasheesh`}
        description={rent.hero?.subtitle}
        keywords={`${home.brand_name}, properties for rent Hurghada, rent apartment Egypt, villas for rent Sahl Hasheesh, Red Sea holiday rentals`}
        url="/rent"
      />
      <Box>
        <NxRentHero
          content={rent}
          brandName={home.brand_name}
          whatsappNumber={whatsappNumber}
          email={home.topbar?.email}
          logoUrl={home.logo_url}
        />
        <NxRentFeatureStrip items={rent.feature_strip} />
        <NxRentListingSection content={rent} whatsappNumber={whatsappNumber} />
      </Box>
    </>
  );
};

export default RentView;
