import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Generate Pre-render Routes for react-snap
 * Fetches all active properties and generates a list of URLs to pre-render
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = 'https://nexuscapitalredsea.com/api';

async function fetchPropertyIds() {
  try {
    console.log('🔄 Fetching properties from API...');
    
    // Use dynamic import for node-fetch (ESM)
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${API_BASE}/properties?scope=public`);
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    const properties = data.data || data || [];
    
    console.log(`✅ Found ${properties.length} properties`);
    
    return properties.map(p => `/properties/${p.id}`);
  } catch (error) {
    console.warn('⚠️ Failed to fetch properties:', error.message);
    console.warn('Continuing with static routes only...');
    return [];
  }
}

async function generateRoutes() {
  try {
    const propertyUrls = await fetchPropertyIds();
    
    // Static routes that should always be pre-rendered
    const staticRoutes = [
      '/',
      '/about',
      '/contact',
      '/properties',
      '/buy',
      '/rent',
      '/lands-buildings',
      '/blog',
    ];
    
    const allRoutes = [...staticRoutes, ...propertyUrls];
    
    // Update package.json with the routes
    const packagePath = path.resolve(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Ensure reactSnap config exists
    if (!packageJson.reactSnap) {
      packageJson.reactSnap = {
        source: "dist",
        minifyHtml: {
          collapseWhitespace: true,
          removeComments: true
        },
        puppeteerArgs: [
          "--no-sandbox",
          "--disable-setuid-sandbox"
        ],
        skipThirdPartyRequests: true,
        cacheAjaxRequests: false,
        http2PushManifest: false,
        crawl: false,
        inlineCss: true
      };
    }
    
    packageJson.reactSnap.include = allRoutes;
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    
    console.log(`\n✅ Generated ${allRoutes.length} routes for pre-rendering:`);
    console.log(`   - ${staticRoutes.length} static routes`);
    console.log(`   - ${propertyUrls.length} property routes`);
    console.log('\n📝 Routes saved to package.json > reactSnap.include\n');
  } catch (error) {
    console.error('❌ Failed to generate routes:', error);
    process.exit(1);
  }
}

generateRoutes();
