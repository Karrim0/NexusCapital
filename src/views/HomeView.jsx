import { Box, CircularProgress } from "@mui/material";
import SEOHead from "../components/seo/SEOHead";
import useHomeContent from "../hooks/useHomeContent";
import { nx } from "../theme/nexusHomeTheme";
import NxHeroSection from "../components/home/nexus/NxHeroSection";
import NxStatsStrip from "../components/home/nexus/NxStatsStrip";
import NxSearchSection from "../components/home/nexus/NxSearchSection";
import NxDestinationsSection from "../components/home/nexus/NxDestinationsSection";
import NxFeaturedPropertiesSection from "../components/home/nexus/NxFeaturedPropertiesSection";
import NxFeaturedProjectsSection from "../components/home/nexus/NxFeaturedProjectsSection";
import NxOffersSection from "../components/home/nexus/NxOffersSection";
import NxJourneySection from "../components/home/nexus/NxJourneySection";
import NxServicesSection from "../components/home/nexus/NxServicesSection";
import NxLegalHomeTeaser from "../components/legal/nexus/NxLegalHomeTeaser";
import useLegalServicesContent from "../hooks/useLegalServicesContent";
import NxShortlistSection from "../components/home/nexus/NxShortlistSection";
import NxTestimonialsSection from "../components/home/nexus/NxTestimonialsSection";
import NxFaqSection from "../components/home/nexus/NxFaqSection";
import NxCtaBanners from "../components/home/nexus/NxCtaBanners";

const HomeView = () => {
  const { content, loading } = useHomeContent();
  const { content: legalContent } = useLegalServicesContent();
  const whatsappNumber = content.topbar?.whatsapp_number;

  return (
    <>
      <SEOHead
        title={`${content.brand_name} | Your Key to the Red Sea | Luxury Properties in Hurghada`}
        description={content.hero?.subtitle}
        keywords={`${content.brand_name}, Hurghada properties, Red Sea properties, luxury villas Egypt, apartments for sale Hurghada, Sahl Hasheesh, Makadi Bay, real estate Egypt, property investment Red Sea`}
        url="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: content.brand_name,
          url: "https://nexuscapitalredsea.com",
          logo: content.logo_url || "https://nexuscapitalredsea.com/ruya-icon.png",
          description: content.footer?.about,
          address: {
            "@type": "PostalAddress",
            streetAddress: content.footer?.contact?.address,
            addressLocality: "Hurghada",
            addressRegion: "Red Sea",
            addressCountry: "Egypt",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: "27.2574",
            longitude: "33.8129",
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: content.footer?.contact?.phone,
            email: content.footer?.contact?.email,
            contactType: "Customer Service",
          },
          areaServed: {
            "@type": "City",
            name: "Hurghada",
          },
        }}
      />
      {loading && (
        <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1400 }}>
          <Box sx={{ height: 2, bgcolor: nx.gold, width: "40%", animation: "nxLoadingBar 1.1s ease-in-out infinite" }} />
          <style>{`@keyframes nxLoadingBar {0%{margin-left:-40%} 50%{margin-left:60%} 100%{margin-left:-40%}}`}</style>
        </Box>
      )}
      <Box>
        <NxHeroSection content={content} whatsappNumber={whatsappNumber} />
        <NxStatsStrip stats={content.stats} />
        <NxSearchSection content={content} />
        <NxDestinationsSection content={content} />
        <NxFeaturedProjectsSection whatsappNumber={whatsappNumber} />
        <NxOffersSection whatsappNumber={whatsappNumber} />
        <NxFeaturedPropertiesSection content={content} whatsappNumber={whatsappNumber} />
        <NxJourneySection content={content} />
        <NxServicesSection content={content} />
        <NxLegalHomeTeaser content={legalContent.hero} />
        <Box id="shortlist-form">
          <NxShortlistSection content={content} whatsappNumber={whatsappNumber} />
        </Box>
        <NxTestimonialsSection content={content} whatsappNumber={whatsappNumber} />
        <NxFaqSection content={content} />
        <NxCtaBanners content={content} whatsappNumber={whatsappNumber} />
      </Box>
    </>
  );
};

export default HomeView;
