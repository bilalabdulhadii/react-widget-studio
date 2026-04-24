const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const widgetsFile = path.join(rootDir, "src", "data", "widgets.js");

function normalizeSiteUrl(url) {
    return (url || "").trim().replace(/\/+$/, "");
}

function getSiteUrl() {
    const source = fs.readFileSync(widgetsFile, "utf8");
    const match = source.match(/export const SITE_URL = ["']([^"']+)["']/);
    return normalizeSiteUrl(match ? match[1] : "");
}

function getWidgetSlugs() {
    const source = fs.readFileSync(widgetsFile, "utf8");
    const matches = [...source.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(
        (match) => match[1],
    );
    return [...new Set(matches)].sort();
}

function buildSitemapXml(siteUrl, routes) {
    const today = new Date().toISOString().split("T")[0];
    const urls = routes
        .map((route) => {
            const location = `${siteUrl}${route === "/" ? "" : route}`;
            return [
                "  <url>",
                `    <loc>${location}</loc>`,
                `    <lastmod>${today}</lastmod>`,
                "  </url>",
            ].join("\n");
        })
        .join("\n");

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        urls,
        "</urlset>",
        "",
    ].join("\n");
}

function buildRobotsTxt(siteUrl) {
    const lines = ["User-agent: *", "Allow: /"];
    if (siteUrl) {
        lines.push(`Sitemap: ${siteUrl}/sitemap.xml`);
    }
    lines.push("");
    return lines.join("\n");
}

const siteUrl = getSiteUrl();
const effectiveSiteUrl = siteUrl || "https://example.com";
const widgetSlugs = getWidgetSlugs();
const routes = [
    "/",
    "/about",
    "/widgets",
    ...widgetSlugs.map((slug) => `/widgets/${slug}`),
];

if (!siteUrl) {
    console.warn(
        "[generate-seo] Missing SITE_URL in src/data/widgets.js. Generated sitemap.xml with https://example.com as a placeholder.",
    );
}

fs.writeFileSync(
    path.join(publicDir, "sitemap.xml"),
    buildSitemapXml(effectiveSiteUrl, routes),
);

fs.writeFileSync(path.join(publicDir, "robots.txt"), buildRobotsTxt(siteUrl));
