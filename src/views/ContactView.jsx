import { Box } from "@mui/material";
import SEOHead from "../components/seo/SEOHead";
import useHomeContent from "../hooks/useHomeContent";
import useContactContent from "../hooks/useContactContent";
import NxContactHero from "../components/contact/nexus/NxContactHero";
import NxContactHelpDetails from "../components/contact/nexus/NxContactHelpDetails";
import NxContactForm from "../components/contact/nexus/NxContactForm";
import NxContactLocation from "../components/contact/nexus/NxContactLocation";
import NxContactAskFaqCta from "../components/contact/nexus/NxContactAskFaqCta";

const ContactView = () => {
  const { content: home } = useHomeContent();
  const { content: contact } = useContactContent();
  const whatsappNumber = home.topbar?.whatsapp_number;
  const phone = home.topbar?.phone;
  const email = home.topbar?.email;
  const address = home.footer?.contact?.address;
  const mapUrl = contact.location_section?.map_embed_url
    ? undefined
    : address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : undefined;

  return (
    <>
      <SEOHead
        title={`Contact Us | ${home.brand_name} | Red Sea Property Advisor`}
        description={contact.hero?.description}
        keywords={`${home.brand_name}, contact Hurghada real estate, Red Sea property advisor, WhatsApp property enquiry Egypt`}
        url="/contact"
      />
      <Box>
        <NxContactHero content={contact} whatsappNumber={whatsappNumber} phone={phone} email={email} mapUrl={mapUrl} />
        <NxContactHelpDetails content={contact} whatsappNumber={whatsappNumber} phone={phone} email={email} address={address} mapUrl={mapUrl} />
        <NxContactForm content={contact} whatsappNumber={whatsappNumber} email={email} />
        <NxContactLocation
          content={contact}
          address={address}
          hours={contact.hero?.quick_info?.[2]?.title}
          phone={phone}
          email={email}
          taxRegistration={home.footer?.tax_registration}
          mapEmbedUrl={contact.location_section?.map_embed_url}
          mapUrl={mapUrl || contact.location_section?.map_embed_url}
        />
        <NxContactAskFaqCta content={contact} whatsappNumber={whatsappNumber} />
      </Box>
    </>
  );
};

export default ContactView;
