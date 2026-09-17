import { useEffect, useState } from "react";
import { Box, CircularProgress, Container, Typography, Button } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { fetchPropertyById } from "../api/properties";
import useHomeContent from "../hooks/useHomeContent";
import SEOHead from "../components/seo/SEOHead";
import {
  generateRealEstateListingSchema,
  sanitizeMetaDescription,
  generatePropertyKeywords,
} from "../utils/seoHelpers";
import { nx } from "../theme/nexusHomeTheme";
import NxPropertyHero from "../components/property-details/nexus/NxPropertyHero";
import NxPropertyGallery from "../components/property-details/nexus/NxPropertyGallery";
import NxPropertyAbout from "../components/property-details/nexus/NxPropertyAbout";
import NxPropertyFacilities from "../components/property-details/nexus/NxPropertyFacilities";
import NxPropertyPayment from "../components/property-details/nexus/NxPropertyPayment";
import NxPropertyLocationFaq from "../components/property-details/nexus/NxPropertyLocationFaq";
import NxPropertyEnquiry from "../components/property-details/nexus/NxPropertyEnquiry";

const PropertyDetailsView = () => {
  const { id } = useParams();
  const { content: home } = useHomeContent();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchPropertyById(id);
        if (!cancelled) {
          if (data) setProperty(data);
          else setError("Property not found.");
        }
      } catch (err) {
        console.error("Failed to load property:", err);
        if (!cancelled) setError("Failed to load this property. Please try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 16, bgcolor: nx.ink, minHeight: "60vh" }}>
        <CircularProgress sx={{ color: nx.gold }} />
      </Box>
    );
  }

  if (error || !property) {
    return (
      <Box sx={{ bgcolor: nx.ink, minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", py: 10 }}>
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Typography sx={{ color: nx.textOnDark, fontWeight: 700, fontSize: "1.4rem", mb: 2 }}>
            {error || "Property not found."}
          </Typography>
          <Button component={Link} to="/buy" variant="contained" sx={{ bgcolor: nx.gold, color: "#171208", fontWeight: 700, borderRadius: 999, px: 3 }}>
            Back to listings
          </Button>
        </Container>
      </Box>
    );
  }

  const whatsappNumber = home.topbar?.whatsapp_number;
  const phoneNumber = home.topbar?.phone;
  const brandName = home.brand_name;
  const images = Array.isArray(property.images) && property.images.length ? property.images : (property.image ? [property.image] : []);

  return (
    <>
      <SEOHead
        title={`${property.title} | ${brandName}`}
        description={sanitizeMetaDescription(property.description) || `${property.title} in ${property.location || "the Red Sea"} — view price, payment plan, and availability.`}
        keywords={generatePropertyKeywords(property)}
        url={`/properties/${property.id}`}
        structuredData={generateRealEstateListingSchema(property)}
      />
      <Box>
        <NxPropertyHero
          property={property}
          whatsappNumber={whatsappNumber}
          hasVideo={!!property.video_url}
          hasMap={!!property.map_embed_url}
        />
        <NxPropertyGallery images={images} />
        <NxPropertyAbout property={property} />
        <NxPropertyFacilities features={property.features} videoUrl={property.video_url} whatsappNumber={whatsappNumber} />
        <NxPropertyPayment property={property} />
        <NxPropertyLocationFaq property={property} />
        <NxPropertyEnquiry
          property={property}
          whatsappNumber={whatsappNumber}
          phoneNumber={phoneNumber}
          brandName={brandName}
          consultTitle={home.cta_section?.consult_title || "Ready to own property by the Red Sea?"}
          consultDescription={home.cta_section?.consult_description}
          consultCtaLabel={home.cta_section?.consult_cta_label || "BOOK WHATSAPP CONSULTATION"}
        />
      </Box>
    </>
  );
};

export default PropertyDetailsView;
