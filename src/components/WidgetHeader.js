import PriceBadge from "./PriceBadge";

export default function WidgetHeader({
    category,
    title,
    description,
    priceLabel,
    icon: Icon,
    action = null,
}) {
    return (
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                    <span
                        className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
                        style={{
                            borderColor: "var(--app-border)",
                            background: "var(--app-panel)",
                            color: "var(--app-muted)",
                            boxShadow: "var(--app-shadow)",
                        }}>
                        {Icon ? <Icon size={16} /> : null}
                        {category}
                    </span>
                    <PriceBadge label={priceLabel} />
                </div>
                <h1 className="app-text-main mt-4 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                    {title}
                </h1>
                {description ? (
                    <p className="app-text-muted mt-3 max-w-2xl text-sm leading-6 sm:text-base sm:leading-7">
                        {description}
                    </p>
                ) : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
        </div>
    );
}
