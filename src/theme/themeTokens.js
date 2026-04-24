export const appThemeTokens = {
    light: {
        primary: "#222222",
        surface: "#FFFFFF",
        text: "#191919",
    },
    dark: {
        primary: "#FFFFFF",
        surface: "#222222",
        text: "#FFFFFF",
    },
};

export function resolveThemeMode(mode, fallback = "light") {
    if (mode === "light" || mode === "dark") {
        return mode;
    }

    return fallback;
}

export function getAppThemeTokens(mode, fallback = "light") {
    return appThemeTokens[resolveThemeMode(mode, fallback)];
}

export function getAppThemeVars(mode, fallback = "light") {
    const resolvedMode = resolveThemeMode(mode, fallback);
    const palette = getAppThemeTokens(resolvedMode, fallback);
    const isDark = resolvedMode === "dark";

    return {
        "--app-primary": palette.primary,
        "--app-surface": palette.surface,
        "--app-text": palette.text,
        "--app-muted": isDark
            ? "rgba(255, 255, 255, 0.72)"
            : "rgba(25, 25, 25, 0.68)",
        "--app-subtle": isDark
            ? "rgba(255, 255, 255, 0.88)"
            : "rgba(25, 25, 25, 0.84)",
        "--app-border": isDark
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(34, 34, 34, 0.12)",
        "--app-border-strong": isDark
            ? "rgba(255, 255, 255, 0.2)"
            : "rgba(34, 34, 34, 0.18)",
        "--app-panel": isDark
            ? "color-mix(in srgb, var(--app-surface) 92%, var(--app-primary) 8%)"
            : "color-mix(in srgb, var(--app-surface) 96%, var(--app-primary) 4%)",
        "--app-panel-strong": isDark
            ? "color-mix(in srgb, var(--app-surface) 88%, var(--app-primary) 12%)"
            : "color-mix(in srgb, var(--app-surface) 93%, var(--app-primary) 7%)",
        "--app-panel-soft": isDark
            ? "color-mix(in srgb, var(--app-surface) 95%, var(--app-primary) 5%)"
            : "color-mix(in srgb, var(--app-surface) 98%, var(--app-primary) 2%)",
        "--app-body": isDark
            ? "color-mix(in srgb, var(--app-surface) 96%, var(--app-primary) 4%)"
            : "#FAFAF8",
        "--app-body-accent": isDark
            ? "color-mix(in srgb, var(--app-primary) 7%, transparent)"
            : "color-mix(in srgb, var(--app-primary) 3%, transparent)",
        "--app-overlay": isDark
            ? "rgba(34, 34, 34, 0.82)"
            : "rgba(255, 255, 255, 0.92)",
        "--app-inverse": isDark ? "#222222" : "#FFFFFF",
        "--app-shadow": isDark
            ? "0 16px 36px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.1)"
            : "0 16px 36px rgba(34, 34, 34, 0.08), 0 2px 8px rgba(34, 34, 34, 0.05)",
        "--app-selection": isDark
            ? "rgba(255, 255, 255, 0.18)"
            : "rgba(34, 34, 34, 0.14)",
    };
}
