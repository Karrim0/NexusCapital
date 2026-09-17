/**
 * SEO Helper Utilities for Nexus Capital
 * Generates professional structured data and meta content
 */

/**
 * Generate RealEstateListing structured data (Schema.org)
 * This is THE critical schema for ranking real estate listings
 * 
 * @param {Object} property - Property data from API
 * @returns {Object} - JSON-LD structured data
 */
export const generateRealEstateListingSchema = (property) => {
  if (!property) return null;

  const siteUrl = "https://nexuscapitalredsea.com";
  const propertyUrl = `${siteUrl}/properties/${property.id}`;
  
  // Main image URL
  const mainImage = property.images?.[0] || property.image || `${siteUrl}/og-image.jpg`;
  
  // All images (gallery)
  const allImages = property.images && property.images.length > 0 
    ? property.images 
    : property.image 
      ? [property.image] 
      : [];

  // Address parsing
  const addressParts = property.location ? property.location.split(',').map(s => s.trim()) : [];
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title || "Property for Sale/Rent",
    "description": property.description || `Luxury property in ${property.location || 'Red Sea Region'}`,
    "url": propertyUrl,
    "image": allImages.length > 0 ? allImages : mainImage,
    
    // Address details
    "address": {
      "@type": "PostalAddress",
      "streetAddress": addressParts[0] || property.location || "",
      "addressLocality": addressParts[1] || property.location || "Hurghada",
      "addressRegion": "Red Sea",
      "addressCountry": "Egypt",
    },
    
    // Geolocation (if available)
    ...(property.latitude && property.longitude ? {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": property.latitude.toString(),
        "longitude": property.longitude.toString(),
      }
    } : {
      // Default to Hurghada coordinates if not available
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "27.2574",
        "longitude": "33.8129",
      }
    }),
    
    // Offer details (Sale or Rent)
    "offers": {
      "@type": "Offer",
      "price": property.price ? property.price.toString() : "0",
      "priceCurrency": property.currency || "USD",
      "availability": property.status === "available" || property.is_active 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "url": propertyUrl,
      "validFrom": property.created_at || new Date().toISOString(),
      ...(property.deal_type === 'rent' ? {
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": property.price ? property.price.toString() : "0",
          "priceCurrency": property.currency || "USD",
          "unitText": "monthly",
        }
      } : {}),
    },
    
    // Property details
    "numberOfRooms": property.bedrooms || 0,
    "numberOfBathroomsTotal": property.bathrooms || 0,
    "floorSize": property.area ? {
      "@type": "QuantitativeValue",
      "value": property.area,
      "unitCode": "MTK", // Square meters
      "unitText": "m²",
    } : undefined,
    
    // Additional amenities
    ...(property.features && property.features.length > 0 ? {
      "amenityFeature": property.features.map(feature => ({
        "@type": "LocationFeatureSpecification",
        "name": feature,
      })),
    } : {}),
    
    // Property type
    ...(property.property_type ? {
      "additionalType": property.property_type,
    } : {}),
    
    // Listing agent/organization
    "provider": {
      "@type": "RealEstateAgent",
      "name": "Nexus Capital",
      "url": siteUrl,
      "telephone": "+20-102-518-6677",
      "email": "info@nexuscapital.com",
      "logo": `${siteUrl}/ruya-icon.png`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Al-Kawther, Hurghada",
        "addressLocality": "Hurghada",
        "addressRegion": "Red Sea",
        "addressCountry": "Egypt",
      },
    },
  };

  // Remove undefined fields
  return JSON.parse(JSON.stringify(schema));
};

/**
 * Generate smart alt text for images
 * Creates descriptive alt text for accessibility and SEO
 * 
 * @param {Object} property - Property data
 * @returns {string} - Generated alt text
 */
export const generateImageAltText = (property) => {
  if (!property) return "Luxury Property - Nexus Capital";
  
  const parts = [];
  
  // Property type
  if (property.property_type) {
    parts.push(property.property_type);
  }
  
  // Deal type
  if (property.deal_type === 'sale') {
    parts.push("for sale");
  } else if (property.deal_type === 'rent') {
    parts.push("for rent");
  }
  
  // Location
  if (property.location) {
    parts.push(`in ${property.location}`);
  }
  
  // Price
  if (property.price) {
    const currency = property.currency || "USD";
    parts.push(`- ${property.price} ${currency}`);
  }
  
  // Bedrooms
  if (property.bedrooms) {
    parts.push(`${property.bedrooms} bedrooms`);
  }
  
  return parts.join(" ") || property.title || "Luxury Property - Nexus Capital";
};

/**
 * Generate BreadcrumbList structured data
 * Helps Google understand site hierarchy
 * 
 * @param {Array} breadcrumbs - Array of {name, url} objects
 * @returns {Object} - JSON-LD structured data
 */
export const generateBreadcrumbSchema = (breadcrumbs) => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  const siteUrl = "https://nexuscapitalredsea.com";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${siteUrl}${item.url}`,
    })),
  };
};

/**
 * Clean and sanitize meta descriptions
 * Ensures optimal length and removes HTML
 * 
 * @param {string} text - Raw text
 * @param {number} maxLength - Maximum length (default 160)
 * @returns {string} - Clean description
 */
export const sanitizeMetaDescription = (text, maxLength = 160) => {
  if (!text) return "";
  
  // Remove HTML tags
  let clean = text.replace(/<[^>]*>/g, '');
  
  // Remove extra whitespace
  clean = clean.replace(/\s+/g, ' ').trim();
  
  // Truncate if needed
  if (clean.length > maxLength) {
    clean = clean.substring(0, maxLength - 3) + '...';
  }
  
  return clean;
};

/**
 * Generate dynamic keywords from property data
 * 
 * @param {Object} property - Property data
 * @returns {string} - Comma-separated keywords
 */
export const generatePropertyKeywords = (property) => {
  if (!property) return "Nexus Capital, Hurghada properties, luxury real estate";
  
  const keywords = [
    "Nexus Capital",
    property.title,
    property.location,
    property.property_type,
    `property for ${property.deal_type === 'sale' ? 'sale' : 'rent'}`,
    "Hurghada real estate",
    "Red Sea properties",
    "luxury properties Egypt",
  ];
  
  // Add location-specific keywords
  if (property.location) {
    keywords.push(`${property.location} properties`);
    keywords.push(`real estate in ${property.location}`);
  }
  
  // Add property type keywords
  if (property.property_type) {
    keywords.push(`${property.property_type} for ${property.deal_type === 'sale' ? 'sale' : 'rent'}`);
  }
  
  // Remove nulls and duplicates
  return [...new Set(keywords.filter(Boolean))].join(", ");
};
