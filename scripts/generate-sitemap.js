/* eslint-env node */
/* global process */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Dynamic Sitemap Generator for Nexus Capital
 * Generates sitemap.xml with all active properties
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = "https://nexuscapitalredsea.com/api";
const SITE_URL = "https://nexuscapitalredsea.com";

async function fetchProperties() {
  try {
    console.log("🔄 Fetching properties from API...");

    // Use dynamic import for node-fetch (ESM)
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${API_BASE}/properties?scope=public`);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    // Laravel API returns: { properties: [...] }
    const properties = data.properties || data.data || [];

    // Ensure properties is an array
    if (!Array.isArray(properties)) {
      console.warn("⚠️ Properties is not an array, using empty array");
      return [];
    }

    console.log(`✅ Found ${properties.length} properties`);

    return properties;
  } catch (error) {
    console.warn("⚠️ Failed to fetch properties:", error.message);
    console.warn("Continuing with static pages only...");
    return [];
  }
}

function formatDate(date) {
  if (!date) return new Date().toISOString().split("T")[0];
  try {
    return new Date(date).toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

function generateSitemap(properties) {
  const today = new Date().toISOString().split("T")[0];

  // Ensure properties is an array
  const propertyList = Array.isArray(properties) ? properties : [];

  // Static pages configuration
  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "daily", lastmod: today },
    { url: "/about", priority: "0.8", changefreq: "monthly", lastmod: today },
    { url: "/contact", priority: "0.8", changefreq: "monthly", lastmod: today },
    {
      url: "/properties",
      priority: "0.9",
      changefreq: "daily",
      lastmod: today,
    },
    { url: "/buy", priority: "0.9", changefreq: "daily", lastmod: today },
    { url: "/rent", priority: "0.9", changefreq: "daily", lastmod: today },
    {
      url: "/lands-buildings",
      priority: "0.8",
      changefreq: "weekly",
      lastmod: today,
    },
    { url: "/blog", priority: "0.7", changefreq: "weekly", lastmod: today },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Add static pages
  staticPages.forEach((page) => {
    xml += `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${page.url}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${SITE_URL}/ar${page.url}" />
  </url>`;
  });

  // Add property pages
  propertyList.forEach((property) => {
    const propertyUrl = `/properties/${property.id}`;
    const lastmod = formatDate(property.updated_at || property.created_at);

    xml += `
  <url>
    <loc>${SITE_URL}${propertyUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${propertyUrl}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${SITE_URL}/ar${propertyUrl}" />`;

    // Add property images to sitemap (helps with Google Images SEO)
    if (property.images && property.images.length > 0) {
      property.images.slice(0, 5).forEach((imageUrl) => {
        // Google recommends max 5 images per page
        xml += `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${escapeXml(
        property.title || "Property Image"
      )}</image:title>
      <image:caption>${escapeXml(
        property.description || property.title || ""
      )}</image:caption>
    </image:image>`;
      });
    } else if (property.image) {
      xml += `
    <image:image>
      <image:loc>${property.image}</image:loc>
      <image:title>${escapeXml(
        property.title || "Property Image"
      )}</image:title>
      <image:caption>${escapeXml(
        property.description || property.title || ""
      )}</image:caption>
    </image:image>`;
    }

    xml += `
  </url>`;
  });

  xml += `
</urlset>`;

  return xml;
}

function escapeXml(unsafe) {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .substring(0, 200); // Limit length for sitemap
}

async function generateSitemapFile() {
  try {
    const properties = await fetchProperties();
    const propertyCount = Array.isArray(properties) ? properties.length : 0;
    const sitemapXml = generateSitemap(properties);

    const outputPath = path.resolve(__dirname, "../public/sitemap.xml");
    fs.writeFileSync(outputPath, sitemapXml, "utf8");

    console.log(`\n✅ Sitemap generated successfully!`);
    console.log(`   - ${propertyCount} property pages`);
    console.log(`   - 8 static pages`);
    console.log(`   - Total: ${propertyCount + 8} URLs`);
    console.log(`\n📝 Saved to: ${outputPath}\n`);
  } catch (error) {
    console.error("❌ Failed to generate sitemap:", error);
    process.exit(1);
  }
}

generateSitemapFile();
