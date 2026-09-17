import { Box } from "@mui/material";
import SEOHead from "../components/seo/SEOHead";
import useHomeContent from "../hooks/useHomeContent";
import useServicesContent from "../hooks/useServicesContent";
import NxServicesHero from "../components/services/nexus/NxServicesHero";
import NxServicesGrid from "../components/services/nexus/NxServicesGrid";
import NxServiceSpotlight from "../components/services/nexus/NxServiceSpotlight";
import NxServiceFinder from "../components/services/nexus/NxServiceFinder";
import NxServicesProcessOwners from "../components/services/nexus/NxServicesProcessOwners";
import NxServicesFaqCta from "../components/services/nexus/NxServicesFaqCta";

const ServicesView = () => {
  const { content: home } = useHomeContent();
  const { content: services } = useServicesContent();
  const whatsappNumber = home.topbar?.whatsapp_number;

  return (
    <>
      <SEOHead
        title={`Real Estate Services | ${home.brand_name} | Hurghada & Red Sea`}
        description={services.hero?.description}
        keywords={`${home.brand_name}, real estate consulting Hurghada, property viewing trips, rental service Red Sea, developer project support, after-sales property support Egypt`}
        url="/services"
      />
      <Box>
        <NxServicesHero content={services} whatsappNumber={whatsappNumber} email={home.topbar?.email} />
        <NxServicesGrid content={services} />
        <NxServiceSpotlight content={services} />
        <NxServiceFinder content={services} whatsappNumber={whatsappNumber} />
        <NxServicesProcessOwners content={services} />
        <NxServicesFaqCta content={services} whatsappNumber={whatsappNumber} />
      </Box>
    </>
  );
};

export default ServicesView;
