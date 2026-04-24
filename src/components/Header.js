import { Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useThemeMode } from "../hooks/useThemeMode";

function GitHubMark(props) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            {...props}>
            <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.66.35-1.12.64-1.37-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.35 9.35 0 0 1 12 6.94c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.78-4.57 5.04.36.32.68.95.68 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.59.69.49A10.08 10.08 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
        </svg>
    );
}

const navItems = [
    { to: "/", label: "Home", exact: true },
    { to: "/widgets", label: "Widgets" },
    { to: "/about", label: "About" },
];

function NavPill({ mobile = false }) {
    const location = useLocation();

    return (
        <nav
            className={`items-center rounded-full border p-1 ${mobile ? "flex w-full gap-2" : "hidden gap-1 sm:flex"}`}
            style={{
                borderColor: "var(--app-border)",
                background: "var(--app-panel)",
                boxShadow: "var(--app-shadow)",
            }}>
            {navItems.map((item) => {
                const active = item.exact
                    ? location.pathname === item.to
                    : location.pathname.startsWith(item.to);

                return (
                    <Link
                        key={item.to}
                        to={item.to}
                        className="relative flex-1 rounded-full px-4 py-2 text-center text-sm font-medium transition-colors duration-200 hover:bg-[color:var(--app-panel-strong)]">
                        <span
                            className="absolute inset-0 rounded-full transition"
                            style={
                                active
                                    ? { background: "var(--app-primary)" }
                                    : { background: "transparent" }
                            }
                        />
                        <span
                            className="relative z-[1]"
                            style={{
                                color: active
                                    ? "var(--app-surface)"
                                    : "var(--app-muted)",
                            }}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}

export default function Header() {
    const { theme, cycleTheme } = useThemeMode();
    const ThemeIcon = theme === "light" ? Sun : Moon;
    const themeLabel = theme === "light" ? "Light theme" : "Dark theme";

    return (
        <header
            className="sticky top-0 z-40 border-b backdrop-blur-2xl"
            style={{
                borderColor: "var(--app-border)",
                background: "var(--app-overlay)",
            }}>
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-3">
                    <img
                        src="/logo.png"
                        alt="Widget Studio logo"
                        className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                    />
                    <span
                        className="text-base font-semibold"
                        style={{ color: "var(--app-primary)" }}>
                        Widget Studio
                    </span>
                </Link>

                <NavPill />

                <div className="flex items-center gap-2">
                    <a
                        href="https://github.com/bilalabdulhadii/react-widget-studio"
                        target="_blank"
                        rel="noreferrer"
                        className="icon-button"
                        aria-label="Open GitHub repository"
                        title="GitHub">
                        <GitHubMark className="h-5 w-5" />
                    </a>
                    <button
                        className="icon-button"
                        type="button"
                        onClick={cycleTheme}
                        aria-label={themeLabel}
                        title={themeLabel}>
                        <ThemeIcon size={18} />
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 pb-3 sm:hidden">
                <NavPill mobile />
            </div>
        </header>
    );
}
