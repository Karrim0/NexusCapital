import { Box } from "@mui/material";
import SEOHead from "../components/seo/SEOHead";
import useHomeContent from "../hooks/useHomeContent";
import useFaqContent from "../hooks/useFaqContent";
import NxFaqHero from "../components/faq/nexus/NxFaqHero";
import NxFaqTopics from "../components/faq/nexus/NxFaqTopics";
import NxFaqBrowser from "../components/faq/nexus/NxFaqBrowser";

const FaqView = () => {
  const { content: home } = useHomeContent();
  const { content: faq } = useFaqContent();
  const whatsappNumber = home.topbar?.whatsapp_number;

  return (
    <>
      <SEOHead
        title={`FAQ | ${home.brand_name} | Buying Property in Hurghada`}
        description={faq.hero?.description}
        keywords={`${home.brand_name}, Hurghada property FAQ, buying property Egypt questions, Red Sea real estate FAQ, Green Contract, Taukil, property ownership Egypt`}
        url="/faq"
      />
      <Box>
        <NxFaqHero content={faq} brandName={home.brand_name} whatsappNumber={whatsappNumber} email={home.topbar?.email} />
        <NxFaqTopics content={faq} />
        <NxFaqBrowser content={faq} whatsappNumber={whatsappNumber} />
      </Box>
    </>
  );
};

export default FaqView;
