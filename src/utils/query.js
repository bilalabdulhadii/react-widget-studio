import { createEmbedPath, getWidgetBySlug } from "../data/widgets";
import { buildAbsoluteUrl } from "./siteUrl";
import { sanitizeWidgetBackgroundColor } from "../widgets/widgetTheme";

function getWidgetDefaults(slug, defaultOverrides = {}) {
    const widget = getWidgetBySlug(slug);

    return {
        ...(widget?.defaults || {}),
        ...defaultOverrides,
    };
}

export function paramsToObject(searchParams, slug, defaultOverrides = {}) {
    const params = {
        ...getWidgetDefaults(slug, defaultOverrides),
    };

    searchParams.forEach((value, key) => {
        if (key === "appearance") {
            params.mode = value;
        } else if (key === "mode") {
            return;
        } else if (key === "transparent" || key === "transparentBackground") {
            return;
        } else {
            params[key] = value;
        }
    });

    return params;
}

export function normalizeParams(searchParams, slug, defaultOverrides = {}) {
    const nextParams = new URLSearchParams(searchParams);
    let changed = false;

    if (!getWidgetBySlug(slug)) {
        return { params: nextParams, changed };
    }

    if (nextParams.has("mode")) {
        if (!nextParams.has("appearance")) {
            nextParams.set("appearance", nextParams.get("mode"));
        }
        nextParams.delete("mode");
        changed = true;
    }

    if (nextParams.has("transparent")) {
        nextParams.delete("transparent");
        changed = true;
    }

    if (nextParams.has("transparentBackground")) {
        nextParams.delete("transparentBackground");
        changed = true;
    }

    Object.entries(getWidgetDefaults(slug, defaultOverrides)).forEach(
        ([key, value]) => {
            if (
                key === "backgroundColor" &&
                nextParams.get("customBackground") !== "true"
            ) {
                nextParams.delete("backgroundColor");
                return;
            }

            const paramKey = key === "mode" ? "appearance" : key;
            if (!nextParams.has(paramKey)) {
                nextParams.set(paramKey, value);
                changed = true;
            }
        },
    );

    return { params: nextParams, changed };
}

export function toEmbedSearchParams(params) {
    const nextParams = new URLSearchParams();
    const customBackgroundEnabled = toBoolean(params?.customBackground, false);

    Object.entries(params || {}).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
            if (key === "title" || key === "artist") {
                nextParams.set(key, "");
            }
            return;
        }

        if (key === "backgroundColor") {
            if (!customBackgroundEnabled) {
                return;
            }

            const sanitizedValue = sanitizeWidgetBackgroundColor(value);

            if (!sanitizedValue) {
                return;
            }

            nextParams.set(key, sanitizedValue);
            return;
        }

        nextParams.set(key === "mode" ? "appearance" : key, value);
    });

    return nextParams;
}

export function buildAbsoluteEmbedLink(widgetOrSlug, searchParams) {
    const path = createEmbedPath(widgetOrSlug, searchParams);
    return buildAbsoluteUrl(path);
}

export function parseList(value) {
    if (!value) {
        return [];
    }

    return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

export function setListParam(searchParams, key, value, enabled) {
    const nextParams = new URLSearchParams(searchParams);
    const values = new Set(parseList(nextParams.get(key)));

    if (enabled) {
        values.add(value);
    } else {
        values.delete(value);
    }

    const nextValue = Array.from(values);

    if (nextValue.length) {
        nextParams.set(key, nextValue.join(","));
    } else {
        nextParams.delete(key);
    }

    return nextParams;
}

export function toBoolean(value, fallback = false) {
    if (value === undefined || value === null) {
        return fallback;
    }

    return value === true || value === "true";
}

export function clampNumber(value, min, max, fallback) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return fallback;
    }

    return Math.min(max, Math.max(min, number));
}
