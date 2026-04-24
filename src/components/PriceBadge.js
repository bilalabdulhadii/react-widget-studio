function cx(...parts) {
    return parts.filter(Boolean).join(" ");
}

export default function PriceBadge({
    compact = false,
    className = "",
    label = "Free · 0$",
}) {
    const [primary = "Free", secondary = "0$"] = String(label)
        .split("·")
        .map((part) => part.trim())
        .filter(Boolean);

    return (
        <span
            className={cx(
                "inline-flex items-center gap-1.5 rounded-full border font-semibold whitespace-nowrap",
                compact
                    ? "px-2.5 py-1 text-[11px]"
                    : "px-3.5 py-1.5 text-xs sm:text-sm",
                className,
            )}
            style={{
                borderColor:
                    "color-mix(in srgb, #16a34a 32%, var(--app-border) 68%)",
                background:
                    "color-mix(in srgb, #16a34a 14%, var(--app-surface) 86%)",
                color: "color-mix(in srgb, #16a34a 82%, var(--app-primary) 18%)",
                boxShadow:
                    "inset 0 1px 0 color-mix(in srgb, #ffffff 24%, transparent)",
            }}>
            <span>{primary}</span>
            {secondary ? (
                <>
                    <span aria-hidden="true" className="opacity-50">
                        ·
                    </span>
                    <span className="opacity-75">{secondary}</span>
                </>
            ) : null}
        </span>
    );
}
