import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

/**
 * World-Class SEO Component for Nexus Capital
 * 
 * Features:
 * - Automatic canonical URL generation with duplicate content prevention
 * - Smart fallbacks for missing OG images and descriptions
 * - Dynamic robots meta control (noindex for search result pages)
 * - Enhanced structured data support
 * - Image preloading for LCP optimization
 * - Multi-language support with hreflang
 */
const SEOHead = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  structuredData,
  noIndex = false, // Control indexing for search result pages
  noFollow = false, // Control following for specific pages
  preloadImage = null, // LCP optimization - image to preload
  imageAlt = null, // Alt text for OG image
}) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const currentLang = i18n.language;
  const siteUrl = "https://nexuscapitalredsea.com";
  
  // Smart defaults
  const defaultTitle = "Nexus Capital | Your Key to the Red Sea | Luxury Properties";
  const defaultDescription = "Nexus Capital - Your trusted partner for home development and resale apartments in the Red Sea region since 2012. Discover luxury properties in Hurghada, El Gouna, Sahl Hasheesh.";
  const defaultImage = `${siteUrl}/og-image.jpg`;
  const defaultKeywords = "Nexus Capital, Hurghada properties, El Gouna real estate, Red Sea properties, luxury villas Egypt";
  
  // Fallback logic
  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = image || defaultImage;
  const finalKeywords = keywords || defaultKeywords;
  const finalImageAlt = imageAlt || finalTitle;
  
  // Canonical URL generation (prevents duplicate content issues)
  // Remove query parameters that don't affect content (like utm_, fbclid, etc.)
  const cleanUrl = url || location.pathname;
  const canonicalUrl = `${siteUrl}${cleanUrl}`.split('?')[0].split('#')[0];
  
  // Robots meta control
  let robotsContent = [];
  if (noIndex) robotsContent.push("noindex");
  else robotsContent.push("index");
  
  if (noFollow) robotsContent.push("nofollow");
  else robotsContent.push("follow");
  
  robotsContent.push("max-image-preview:large");
  robotsContent.push("max-snippet:-1");
  robotsContent.push("max-video-preview:-1");
  
  const robotsValue = robotsContent.join(", ");

  // Default structured data for organization
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Nexus Capital",
    url: siteUrl,
    logo: `${siteUrl}/ruya-icon.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Al-Kawther, Hurghada",
      addressLocality: "Hurghada",
      addressRegion: "Red Sea",
      addressCountry: "Egypt",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+20-102-518-6677",
      email: "info@nexuscapital.com",
      contactType: "Customer Service",
      availableLanguage: ["English", "Arabic"],
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "27.2574",
      longitude: "33.8129",
    },
    sameAs: [
      "https://web.facebook.com/profile.php?id=61557983228398",
      "https://www.instagram.com/nexuscapital/",
    ],
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="robots" content={robotsValue} />
      
      {/* Canonical URL - Critical for duplicate content prevention */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:secure_url" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={finalImageAlt} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:site_name" content="Nexus Capital" />
      <meta property="og:locale" content={currentLang === "ar" ? "ar_EG" : "en_US"} />
      <meta property="og:locale:alternate" content={currentLang === "ar" ? "en_US" : "ar_EG"} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:image:alt" content={finalImageAlt} />

      {/* Structured Data - JSON-LD */}
      {finalStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(finalStructuredData, null, 2)}
        </script>
      )}

      {/* Language Alternates - hreflang for international SEO */}
      <link rel="alternate" hreflang="en" href={`${siteUrl}${cleanUrl}`} />
      <link rel="alternate" hreflang="ar" href={`${siteUrl}/ar${cleanUrl}`} />
      <link rel="alternate" hreflang="x-default" href={`${siteUrl}${cleanUrl}`} />
      
      {/* LCP Optimization - Preload critical images */}
      {preloadImage && (
        <link
          rel="preload"
          as="image"
          href={preloadImage}
          fetchPriority="high"
        />
      )}
    </Helmet>
  );
};

export default SEOHead;
