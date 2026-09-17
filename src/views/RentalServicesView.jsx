import { Box, CircularProgress } from "@mui/material";
import SEOHead from "../components/seo/SEOHead";
import useHomeContent from "../hooks/useHomeContent";
import useRentalServicesContent from "../hooks/useRentalServicesContent";
import NxLegalHero from "../components/legal/nexus/NxLegalHero";
import NxLegalLawyerProfile from "../components/legal/nexus/NxLegalLawyerProfile";
import NxLegalServicesGrid from "../components/legal/nexus/NxLegalServicesGrid";
import NxLegalProcess from "../components/legal/nexus/NxLegalProcess";
import NxLegalTrustCta from "../components/legal/nexus/NxLegalTrustCta";
import NxLegalForeignInvestors from "../components/legal/nexus/NxLegalForeignInvestors";
import NxLegalFaq from "../components/legal/nexus/NxLegalFaq";

const RentalServicesView = () => {
  const { content: home } = useHomeContent();
  const { content, loading } = useRentalServicesContent();
  const generalWhatsappNumber = home.topbar?.whatsapp_number;
  // Every button on this page should reach the rental manager directly, not
  // the site's general number — falls back to the general number only if no
  // manager phone has been set yet in the dashboard.
  const managerPhone = content.manager?.phone;
  const pageWhatsappNumber = managerPhone && !managerPhone.startsWith("[") ? managerPhone : generalWhatsappNumber;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <SEOHead
        title={`Rental Services | ${home.brand_name || "Nexus Capital"}`}
        description="Full-service property rental management in Hurghada and the Red Sea: listing, tenant screening, contracts, rent collection, maintenance coordination, and support for overseas owners."
        keywords="rental services Hurghada, property management Hurghada, Red Sea rental management, tenant screening Egypt, rental contracts Hurghada, furnished rental setup, holiday rental management Hurghada, overseas landlord support Egypt"
        url="/rental-services"
      />
      <Box>
        <NxLegalHero content={content.hero} variant="page" />
        <NxLegalLawyerProfile lawyer={content.manager} whatsappNumber={pageWhatsappNumber} />
        <NxLegalServicesGrid services={content.services} />
        <NxLegalProcess steps={content.process} />
        <NxLegalTrustCta trust={content.trust} whatsappNumber={pageWhatsappNumber} />
        <NxLegalForeignInvestors
          content={{
            title: content.foreign_investors?.title,
            description: content.foreign_investors?.description,
            languagesHighlight: content.foreign_investors?.languages_highlight,
          }}
        />
        <NxLegalFaq faqs={content.faq} disclaimer={content.disclaimer} />
      </Box>
    </>
  );
};

export default RentalServicesView;
