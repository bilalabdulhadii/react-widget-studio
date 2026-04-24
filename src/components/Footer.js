import { Globe2 } from "lucide-react";

function SocialIcon({ label, href, children }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border transition hover:-translate-y-0.5"
            style={{
                borderColor: "var(--app-border)",
                background: "var(--app-panel)",
                color: "var(--app-muted)",
            }}
            aria-label={label}
            title={label}>
            {children}
        </a>
    );
}

function BrandMark({ type }) {
    if (type === "github") {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.66.35-1.12.64-1.37-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.35 9.35 0 0 1 12 6.94c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.78-4.57 5.04.36.32.68.95.68 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.59.69.49A10.08 10.08 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
            </svg>
        );
    }

    if (type === "linkedin") {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true">
                <path d="M6.94 8.94H3.75v10.31h3.19V8.94ZM5.35 7.53a1.85 1.85 0 1 0 0-3.7 1.85 1.85 0 0 0 0 3.7Zm14.9 6.05c0-3.11-1.66-4.56-3.88-4.56a3.35 3.35 0 0 0-3.03 1.67h-.04V8.94h-3.06v10.31h3.19v-5.1c0-1.34.25-2.64 1.91-2.64 1.64 0 1.66 1.53 1.66 2.72v5.02h3.2v-5.67Z" />
            </svg>
        );
    }

    if (type === "instagram") {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
                aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="5" />
                <circle cx="12" cy="12" r="3.3" />
                <path d="M17.5 6.7h.01" />
            </svg>
        );
    }

    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden="true">
            <path d="M14.25 8.75V6.9c0-.87.58-1.08.99-1.08h2.52V2.16L14.29 2.15c-3.85 0-4.72 2.88-4.72 4.72v1.88H7v3.78h2.57v9.32h4.68v-9.32h3.13l.42-3.78h-3.55Z" />
        </svg>
    );
}

export default function Footer() {
    return (
        <footer
            className="border-t py-8 text-sm backdrop-blur-xl"
            style={{
                borderColor: "var(--app-border)",
                background: "var(--app-overlay)",
                color: "var(--app-muted)",
            }}>
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center sm:px-6 lg:px-8">
                <p>
                    Widget Studio © 2026 — Built by{" "}
                    <a
                        href="https://bilalabdulhadi.com"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium transition"
                        style={{ color: "var(--app-primary)" }}>
                        Bilal Abdulhadi
                    </a>
                </p>
                <div className="flex items-center justify-center gap-3">
                    <SocialIcon
                        label="Website"
                        href="https://bilalabdulhadi.com">
                        <Globe2 size={18} />
                    </SocialIcon>
                    <SocialIcon
                        label="GitHub"
                        href="https://github.com/bilalabdulhadii">
                        <BrandMark type="github" />
                    </SocialIcon>
                    <SocialIcon
                        label="LinkedIn"
                        href="https://www.linkedin.com/in/bilalabdulhadii">
                        <BrandMark type="linkedin" />
                    </SocialIcon>
                    <SocialIcon
                        label="Instagram"
                        href="https://www.instagram.com/bilalabdulhadii">
                        <BrandMark type="instagram" />
                    </SocialIcon>
                    <SocialIcon
                        label="Facebook"
                        href="https://www.facebook.com/bilalabdulhadii">
                        <BrandMark type="facebook" />
                    </SocialIcon>
                </div>
            </div>
        </footer>
    );
}
