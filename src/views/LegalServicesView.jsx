import { Box, CircularProgress } from "@mui/material";
import SEOHead from "../components/seo/SEOHead";
import useHomeContent from "../hooks/useHomeContent";
import useLegalServicesContent from "../hooks/useLegalServicesContent";
import NxLegalHero from "../components/legal/nexus/NxLegalHero";
import NxLegalLawyerProfile from "../components/legal/nexus/NxLegalLawyerProfile";
import NxLegalServicesGrid from "../components/legal/nexus/NxLegalServicesGrid";
import NxLegalProcess from "../components/legal/nexus/NxLegalProcess";
import NxLegalTrustCta from "../components/legal/nexus/NxLegalTrustCta";
import NxLegalForeignInvestors from "../components/legal/nexus/NxLegalForeignInvestors";
import NxLegalFaq from "../components/legal/nexus/NxLegalFaq";

const LegalServicesView = () => {
  const { content: home } = useHomeContent();
  const { content, loading } = useLegalServicesContent();
  const generalWhatsappNumber = home.topbar?.whatsapp_number;
  // Every button on this page should reach the lawyer directly, not the
  // site's general number — falls back to the general number only if no
  // lawyer phone has been set yet in the dashboard.
  const lawyerPhone = content.lawyer?.phone;
  const pageWhatsappNumber = lawyerPhone && !lawyerPhone.startsWith("[") ? lawyerPhone : generalWhatsappNumber;

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
        title={`Legal Services & Property Documentation | ${home.brand_name || "Nexus Capital"}`}
        description="Professional legal assistance for property buyers and investors in Hurghada and the Red Sea: due diligence, contract review, ownership verification, power of attorney, and registration support."
        keywords="legal services Hurghada, property lawyer Hurghada, real estate lawyer Egypt, property legal services Egypt, property due diligence Egypt, property contract review Egypt, property registration Egypt, legal support for foreign property buyers, Hurghada real estate legal services, Red Sea property investment"
        url="/legal-services"
      />
      <Box>
        <NxLegalHero content={content.hero} variant="page" />
        <NxLegalLawyerProfile lawyer={content.lawyer} whatsappNumber={pageWhatsappNumber} />
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

export default LegalServicesView;

