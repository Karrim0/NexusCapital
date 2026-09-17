import { Box } from "@mui/material";
import SEOHead from "../components/seo/SEOHead";
import useHomeContent from "../hooks/useHomeContent";
import useBuyContent from "../hooks/useBuyContent";
import NxBuyHero from "../components/buy/nexus/NxBuyHero";
import NxBuyFeatureStrip from "../components/buy/nexus/NxBuyFeatureStrip";
import NxBuyListingSection from "../components/buy/nexus/NxBuyListingSection";
import NxBuyJourney from "../components/buy/nexus/NxBuyJourney";
import NxBuyConsultation from "../components/buy/nexus/NxBuyConsultation";
import NxCtaBanners from "../components/home/nexus/NxCtaBanners";

const BuyView = () => {
  const { content: home } = useHomeContent();
  const { content: buy } = useBuyContent();
  const whatsappNumber = home.topbar?.whatsapp_number;

  return (
    <>
      <SEOHead
        title={`Properties for Sale | ${home.brand_name} | Buy Homes in Hurghada & Sahl Hasheesh`}
        description={buy.hero?.subtitle}
        keywords={`${home.brand_name}, properties for sale Hurghada, buy property Egypt, apartments for sale Sahl Hasheesh, villas for sale Red Sea, real estate investment Hurghada`}
        url="/buy"
      />
      <Box>
        <NxBuyHero
          content={buy}
          brandName={home.brand_name}
          whatsappNumber={whatsappNumber}
          email={home.topbar?.email}
          logoUrl={home.logo_url}
        />
        <NxBuyFeatureStrip items={buy.feature_strip} />
        <NxBuyListingSection content={buy} whatsappNumber={whatsappNumber} />
        <NxBuyJourney content={buy} />
        <NxBuyConsultation content={buy} whatsappNumber={whatsappNumber} brandName={home.brand_name} />
        <NxCtaBanners content={buy} whatsappNumber={whatsappNumber} />
      </Box>
    </>
  );
};

export default BuyView;
