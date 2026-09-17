import { Box } from "@mui/material";
import SEOHead from "../components/seo/SEOHead";
import useHomeContent from "../hooks/useHomeContent";
import useAboutContent from "../hooks/useAboutContent";
import NxAboutHero from "../components/about/nexus/NxAboutHero";
import NxAboutCompanyChairman from "../components/about/nexus/NxAboutCompanyChairman";
import NxAboutCertifications from "../components/about/nexus/NxAboutCertifications";
import NxAboutWhyChoose from "../components/about/nexus/NxAboutWhyChoose";
import NxAboutDestinationsMethod from "../components/about/nexus/NxAboutDestinationsMethod";
import NxAboutContact from "../components/about/nexus/NxAboutContact";
import NxAboutCtaBanners from "../components/about/nexus/NxAboutCtaBanners";

const AboutView = () => {
  const { content: home } = useHomeContent();
  const { content: about } = useAboutContent();
  const whatsappNumber = home.topbar?.whatsapp_number;

  return (
    <>
      <SEOHead
        title={`About Us | ${home.brand_name} | Red Sea Real Estate Experts`}
        description={about.hero?.description}
        keywords={`${home.brand_name}, about us, Hurghada real estate company, Red Sea property experts, real estate investment Egypt`}
        url="/about"
      />
      <Box>
        <NxAboutHero content={about} whatsappNumber={whatsappNumber} />
        <NxAboutCompanyChairman content={about} whatsappNumber={whatsappNumber} />
        <NxAboutCertifications content={about} />
        <NxAboutWhyChoose content={about} />
        <NxAboutDestinationsMethod content={about} />
        <NxAboutContact
          content={about}
          whatsappNumber={whatsappNumber}
          phone={home.topbar?.phone}
          email={home.topbar?.email}
          address={home.footer?.contact?.address}
        />
        <NxAboutCtaBanners content={about} whatsappNumber={whatsappNumber} />
      </Box>
    </>
  );
};

export default AboutView;
