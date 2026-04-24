import { SITE_URL } from "../data/widgets";

function normalizeSiteUrl(url) {
    return (url || "").trim().replace(/\/+$/, "");
}

export function getConfiguredSiteUrl() {
    return normalizeSiteUrl(SITE_URL || "");
}

export function getSiteUrl() {
    const configured = getConfiguredSiteUrl();

    if (configured) {
        return configured;
    }

    if (typeof window !== "undefined" && window.location?.origin) {
        return normalizeSiteUrl(window.location.origin);
    }

    return "https://example.com";
}

export function buildAbsoluteUrl(pathname = "/") {
    const base = getSiteUrl();
    const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
    return `${base}${normalizedPath === "/" ? "" : normalizedPath}`;
}
