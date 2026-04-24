import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAppThemeTokens, getAppThemeVars } from "../theme/themeTokens";

const ThemeContext = createContext(null);

const themeOrder = ["light", "dark"];

function getStoredTheme() {
    if (typeof window === "undefined") {
        return "light";
    }

    const storedTheme = window.localStorage.getItem("pattern-theme");
    return storedTheme === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getStoredTheme);

    useEffect(() => {
        const root = document.documentElement;
        const vars = getAppThemeVars(theme);

        root.classList.toggle("dark", theme === "dark");
        root.dataset.theme = theme;
        Object.entries(vars).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
        window.localStorage.setItem("pattern-theme", theme);
    }, [theme]);

    const value = useMemo(
        () => ({
            theme,
            appliedTheme: theme,
            tokens: getAppThemeTokens(theme),
            setTheme,
            cycleTheme: () => {
                setTheme(
                    (currentTheme) =>
                        themeOrder[
                            (themeOrder.indexOf(currentTheme) + 1) %
                                themeOrder.length
                        ],
                );
            },
        }),
        [theme],
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}

export function useThemeMode() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useThemeMode must be used inside ThemeProvider");
    }

    return context;
}
