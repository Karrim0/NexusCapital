/**
 * Advanced SEO Helper - Additional Utilities
 * Professional-grade SEO enhancements
 */

/**
 * Generate ItemList structured data for property listings
 * Used on pages like BuyView, RentView, AllPropertiesView
 * Helps Google understand the list of properties
 * 
 * @param {Array} properties - Array of property objects
 * @param {string} listName - Name of the list (e.g., "Properties for Sale")
 * @returns {Object} - JSON-LD structured data
 */
export const generateItemListSchema = (properties, listName = "Properties") => {
  if (!properties || properties.length === 0) return null;

  const siteUrl = "https://nexuscapitalredsea.com";

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": listName,
    "numberOfItems": properties.length,
    "itemListElement": properties.slice(0, 20).map((property, index) => ({ // Google recommends max 20 items
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "RealEstateListing",
        "@id": `${siteUrl}/properties/${property.id}`,
        "name": property.title || `Property ${property.id}`,
        "url": `${siteUrl}/properties/${property.id}`,
        "image": property.images?.[0] || property.image || `${siteUrl}/og-image.jpg`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": property.location || "Hurghada",
          "addressRegion": "Red Sea",
          "addressCountry": "Egypt",
        },
        "offers": {
          "@type": "Offer",
          "price": property.price ? property.price.toString() : "0",
          "priceCurrency": property.currency || "USD",
          "availability": property.status === "available" || property.is_active
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
      },
    })),
  };
};

/**
 * Generate Article structured data for blog posts
 * 
 * @param {Object} article - Article/blog post object
 * @returns {Object} - JSON-LD structured data
 */
export const generateArticleSchema = (article) => {
  if (!article) return null;

  const siteUrl = "https://nexuscapitalredsea.com";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title || "",
    "description": article.description || article.excerpt || "",
    "image": article.image || `${siteUrl}/og-image.jpg`,
    "datePublished": article.published_at || article.created_at || new Date().toISOString(),
    "dateModified": article.updated_at || article.created_at || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Nexus Capital",
      "url": siteUrl,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Nexus Capital",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/ruya-icon.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${article.id || article.slug}`,
    },
  };
};

/**
 * Generate FAQ structured data
 * 
 * @param {Array} faqs - Array of {question, answer} objects
 * @returns {Object} - JSON-LD structured data
 */
export const generateFAQSchema = (faqs) => {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
};

/**
 * Generate LocalBusiness structured data
 * Enhanced version with more details
 * 
 * @returns {Object} - JSON-LD structured data
 */
export const generateLocalBusinessSchema = () => {
  const siteUrl = "https://nexuscapitalredsea.com";

  return {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "LocalBusiness"],
    "name": "Nexus Capital",
    "alternateName": "Nexus Capital",
    "description": "Your trusted partner for home development and resale apartments in the Red Sea region since 2012",
    "url": siteUrl,
    "logo": `${siteUrl}/ruya-icon.png`,
    "image": `${siteUrl}/og-image.jpg`,
    "telephone": "+20-102-518-6677",
    "email": "info@nexuscapital.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Al-Kawther, Hurghada",
      "addressLocality": "Hurghada",
      "addressRegion": "Red Sea",
      "postalCode": "",
      "addressCountry": "Egypt",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "27.2574",
      "longitude": "33.8129",
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"],
        "opens": "09:00",
        "closes": "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "10:00",
        "closes": "16:00",
      },
    ],
    "sameAs": [
      "https://web.facebook.com/profile.php?id=61557983228398",
      "https://www.instagram.com/nexuscapital/",
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+20-102-518-6677",
        "contactType": "Customer Service",
        "email": "info@nexuscapital.com",
        "availableLanguage": ["English", "Arabic"],
        "areaServed": "EG",
      },
      {
        "@type": "ContactPoint",
        "telephone": "+20-109-705-1914",
        "contactType": "Sales",
        "contactOption": "TollFree",
        "availableLanguage": ["English", "Arabic"],
      },
    ],
    "priceRange": "$$",
    "foundingDate": "2012",
    "areaServed": [
      {
        "@type": "City",
        "name": "Hurghada",
      },
      {
        "@type": "City",
        "name": "El Gouna",
      },
      {
        "@type": "City",
        "name": "Sahl Hasheesh",
      },
      {
        "@type": "City",
        "name": "Makadi Bay",
      },
    ],
  };
};

/**
 * Generate offer/aggregate offer for property listings
 * 
 * @param {Array} properties - Array of property objects
 * @returns {Object} - AggregateOffer structured data
 */
export const generateAggregateOfferSchema = (properties) => {
  if (!properties || properties.length === 0) return null;

  const prices = properties
    .map(p => parseFloat(p.price))
    .filter(p => !isNaN(p) && p > 0);

  if (prices.length === 0) return null;

  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);

  return {
    "@type": "AggregateOffer",
    "offerCount": properties.length,
    "lowPrice": lowestPrice.toString(),
    "highPrice": highestPrice.toString(),
    "priceCurrency": "USD",
  };
};

/**
 * Generate optimized Open Graph image URL
 * Adds query parameters for image optimization
 * 
 * @param {string} imageUrl - Original image URL
 * @returns {string} - Optimized image URL
 */
export const optimizeOgImageUrl = (imageUrl) => {
  if (!imageUrl) return "https://nexuscapitalredsea.com/og-image.jpg";
  
  // If it's already our default, return as is
  if (imageUrl.includes("og-image.jpg")) return imageUrl;
  
  // For external images or our own, ensure it's optimized for social media
  // Social media prefers 1200x630 for og:image
  return imageUrl;
};

/**
 * Generate video object schema (if you add property videos)
 * 
 * @param {Object} video - Video object with url, title, description, thumbnail
 * @returns {Object} - JSON-LD structured data
 */
export const generateVideoObjectSchema = (video) => {
  if (!video || !video.url) return null;

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.title || "Property Video Tour",
    "description": video.description || "Virtual tour of the property",
    "thumbnailUrl": video.thumbnail || "https://nexuscapitalredsea.com/og-image.jpg",
    "contentUrl": video.url,
    "uploadDate": video.uploaded_at || new Date().toISOString(),
    "duration": video.duration || "PT1M", // ISO 8601 duration format
  };
};

/**
 * Generate rich search results for contact page
 * 
 * @returns {Object} - JSON-LD structured data
 */
export const generateContactPageSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "url": "https://nexuscapitalredsea.com/contact",
    "name": "Contact Nexus Capital",
    "description": "Get in touch with Nexus Capital for property inquiries, consultations, and support.",
  };
};

/**
 * Clean URL for canonical tags
 * Removes query parameters that don't affect content
 * 
 * @param {string} url - Original URL
 * @returns {string} - Clean canonical URL
 */
export const getCanonicalUrl = (url) => {
  if (!url) return "https://nexuscapitalredsea.com";
  
  const siteUrl = "https://nexuscapitalredsea.com";
  
  // Remove common tracking parameters
  const trackingParams = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'fbclid', 'gclid', 'msclkid', '_ga', 'ref', 'source'
  ];
  
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `${siteUrl}${url}`);
    
    // Remove tracking params
    trackingParams.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    
    // If no search params left, return clean URL without ?
    const cleanUrl = urlObj.toString().split('?')[0].split('#')[0];
    
    return cleanUrl;
  } catch {
    // If URL parsing fails, return as is
    return url.startsWith('http') ? url : `${siteUrl}${url}`;
  }
};

/**
 * Check if current page should be indexed
 * Returns robots meta directive
 * 
 * @param {string} pathname - Current page path
 * @param {Object} searchParams - URL search parameters
 * @returns {string} - robots meta content
 */
export const getRobotsDirective = (pathname, searchParams = {}) => {
  // Don't index search result pages
  if (searchParams.search || searchParams.q) {
    return "noindex, follow";
  }
  
  // Don't index filtered pages with multiple parameters (duplicate content)
  const paramCount = Object.keys(searchParams).length;
  if (paramCount > 2) {
    return "noindex, follow";
  }
  
  // Don't index pagination beyond page 1
  if (searchParams.page && parseInt(searchParams.page) > 1) {
    return "noindex, follow";
  }
  
  // Don't index auth/admin pages
  if (pathname.includes('/dashboard') || pathname.includes('/login') || pathname.includes('/register')) {
    return "noindex, nofollow";
  }
  
  // Index everything else
  return "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
};
