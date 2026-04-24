import { motion } from "framer-motion";
import {
    Check,
    Code2,
    Copy,
    ExternalLink,
    Link2,
    Minus,
    Plus,
    SlidersHorizontal,
    X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import WidgetHeader from "../components/WidgetHeader";
import {
    accentOptions,
    createEmbedPath,
    getWidgetBySlug,
    getWidgetType,
    modeOptions,
    widgetUsesAccent,
} from "../data/widgets";
import { useThemeMode } from "../hooks/useThemeMode";
import {
    buildAbsoluteEmbedLink,
    toBoolean,
    toEmbedSearchParams,
} from "../utils/query";
import WidgetRenderer, { unitDefs } from "../widgets/WidgetRenderer";
import {
    getOppositeWidgetMode,
    sanitizeWidgetBackgroundColor,
} from "../widgets/widgetTheme";

function Field({ label, helper, children }) {
    return (
        <label className="block">
            <span className="app-text-main mb-2 block text-sm font-semibold">
                {label}
            </span>
            {children}
            {helper ? (
                <span className="app-text-muted mt-2 block text-xs leading-5">
                    {helper}
                </span>
            ) : null}
        </label>
    );
}

function TextInput({ value, onChange, placeholder, type = "text" }) {
    return (
        <input
            type={type}
            value={value || ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="control-input"
        />
    );
}

function TextArea({ value, onChange, placeholder, rows = 4 }) {
    return (
        <textarea
            value={value || ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="control-input resize-none"
        />
    );
}

function ColorInput({ value, onChange }) {
    const normalizedValue =
        sanitizeWidgetBackgroundColor(value) || "#F7F7F5";

    return (
        <div
            className="flex items-center gap-3 rounded-2xl border px-3 py-2"
            style={{
                borderColor: "var(--app-border)",
                background: "var(--app-panel-soft)",
            }}>
            <input
                type="color"
                value={normalizedValue}
                onChange={(event) => onChange(event.target.value)}
                className="h-9 w-11 cursor-pointer rounded-xl border-0 bg-transparent p-0"
            />
            <input
                type="text"
                value={value || normalizedValue}
                onChange={(event) => onChange(event.target.value)}
                placeholder="#F7F7F5"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                style={{ color: "var(--app-primary)" }}
            />
        </div>
    );
}

function Toggle({ checked, onChange, label }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className="flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition"
            style={{
                borderColor: "var(--app-border)",
                background: "var(--app-panel-soft)",
                color: "var(--app-primary)",
            }}>
            <span>{label}</span>
            <span
                className="flex h-6 w-11 items-center rounded-full p-1 transition"
                style={{
                    background: checked
                        ? "var(--app-primary)"
                        : "var(--app-panel-strong)",
                }}>
                <span
                    className={`h-4 w-4 rounded-full transition ${checked ? "translate-x-5" : ""}`}
                    style={{
                        background: checked
                            ? "var(--app-surface)"
                            : "var(--app-primary)",
                    }}
                />
            </span>
        </button>
    );
}

function SegmentedControl({ label, options, value, onChange }) {
    return (
        <div>
            <p className="app-text-main mb-2 text-sm font-semibold">{label}</p>
            <div
                className="grid gap-2"
                style={{
                    gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
                }}>
                {options.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => onChange(option.id)}
                        className="rounded-2xl border px-3 py-2 text-sm font-semibold transition"
                        style={
                            value === option.id
                                ? {
                                      borderColor: "var(--app-primary)",
                                      background: "var(--app-primary)",
                                      color: "var(--app-surface)",
                                  }
                                : {
                                      borderColor: "var(--app-border)",
                                      background: "var(--app-panel-soft)",
                                      color: "var(--app-muted)",
                                  }
                        }>
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

function AccentPicker({ value, onChange }) {
    return (
        <div>
            <p className="app-text-main mb-2 text-sm font-semibold">Accent</p>
            <div className="grid grid-cols-6 gap-2">
                {accentOptions.map((accent) => (
                    <button
                        key={accent.id}
                        type="button"
                        onClick={() => onChange(accent.id)}
                        className="flex h-10 items-center justify-center rounded-2xl border transition"
                        style={{
                            borderColor:
                                value === accent.id
                                    ? "var(--app-primary)"
                                    : "var(--app-border)",
                        }}
                        title={accent.label}
                        aria-label={`${accent.label} accent`}>
                        <span
                            className="h-5 w-5 rounded-full"
                            style={{ background: accent.color }}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

function AudioFields({ params, update }) {
    const isBarStyle = params.style === "bar";
    const supportsVisualizer = ["minimal", "card"].includes(params.style);

    return (
        <>
            {!isBarStyle ? (
                <>
                    <Field label="Title">
                        <TextInput
                            value={params.title}
                            onChange={(value) => update("title", value)}
                        />
                    </Field>
                    <Field label="Artist">
                        <TextInput
                            value={params.artist}
                            onChange={(value) => update("artist", value)}
                        />
                    </Field>
                </>
            ) : null}
            <Field
                label="Audio URL"
                helper="Upload your audio to Catbox and paste the link here">
                <TextInput
                    value={params.url}
                    onChange={(value) => update("url", value)}
                    placeholder="https://example.com/audio.mp3"
                />
            </Field>
            <div className="grid gap-3">
                <Toggle
                    checked={toBoolean(params.showTime, true)}
                    onChange={(value) => update("showTime", String(value))}
                    label="Show time"
                />
                <Toggle
                    checked={toBoolean(params.showVolume, true)}
                    onChange={(value) => update("showVolume", String(value))}
                    label="Show volume"
                />
                <Toggle
                    checked={toBoolean(params.showLoop, false)}
                    onChange={(value) => update("showLoop", String(value))}
                    label="Show loop"
                />
                {supportsVisualizer ? (
                    <Toggle
                        checked={toBoolean(params.showEqualizer, true)}
                        onChange={(value) =>
                            update("showEqualizer", String(value))
                        }
                        label="Show visualizer"
                    />
                ) : null}
            </div>
        </>
    );
}

function ClockFields({ params, update }) {
    return (
        <>
            <Field label="Label">
                <TextInput
                    value={params.label}
                    onChange={(value) => update("label", value)}
                />
            </Field>
            <div className="grid gap-3">
                <Toggle
                    checked={toBoolean(params.hour12, false)}
                    onChange={(value) => update("hour12", String(value))}
                    label="12-hour time"
                />
                <Toggle
                    checked={toBoolean(params.seconds, true)}
                    onChange={(value) => update("seconds", String(value))}
                    label="Show seconds"
                />
                {params.style === "flip" ? (
                    <Toggle
                        checked={toBoolean(params.showUnitLabels, false)}
                        onChange={(value) =>
                            update("showUnitLabels", String(value))
                        }
                        label="Show unit labels"
                    />
                ) : null}
            </div>
        </>
    );
}

function ProductivityFields({ type, params, update }) {
    if (type === "pomodoro") {
        return (
            <>
                <Field label="Title">
                    <TextInput
                        value={params.title}
                        onChange={(value) => update("title", value)}
                    />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Focus label">
                        <TextInput
                            value={params.focusLabel}
                            onChange={(value) => update("focusLabel", value)}
                        />
                    </Field>
                    <Field label="Break label">
                        <TextInput
                            value={params.breakLabel}
                            onChange={(value) => update("breakLabel", value)}
                        />
                    </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Focus minutes">
                        <TextInput
                            type="number"
                            value={params.minutes}
                            onChange={(value) => update("minutes", value)}
                        />
                    </Field>
                    <Field label="Break minutes">
                        <TextInput
                            type="number"
                            value={params.breakMinutes}
                            onChange={(value) => update("breakMinutes", value)}
                        />
                    </Field>
                </div>
            </>
        );
    }

    if (type === "countdown") {
        const selectedUnits = (params.units || "").split(",").filter(Boolean);
        const toggleUnit = (unit) => {
            const nextUnits = selectedUnits.includes(unit)
                ? selectedUnits.filter((item) => item !== unit)
                : [...selectedUnits, unit];
            const orderedUnits = unitDefs
                .map((item) => item.id)
                .filter((item) => nextUnits.includes(item));
            update("units", orderedUnits.join(","));
        };

        return (
            <>
                <Field label="Title">
                    <TextInput
                        value={params.title}
                        onChange={(value) => update("title", value)}
                    />
                </Field>
                <Field label="Target date">
                    <TextInput
                        type="datetime-local"
                        value={params.target}
                        onChange={(value) => update("target", value)}
                    />
                </Field>
                <div>
                    <p className="app-text-main mb-2 text-sm font-semibold">
                        Visible units
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {unitDefs.map((unit) => (
                            <Toggle
                                key={unit.id}
                                checked={selectedUnits.includes(unit.id)}
                                onChange={() => toggleUnit(unit.id)}
                                label={unit.label}
                            />
                        ))}
                    </div>
                </div>
            </>
        );
    }

    if (type === "progress") {
        return (
            <>
                <Field label="Title">
                    <TextInput
                        value={params.title}
                        onChange={(value) => update("title", value)}
                    />
                </Field>
            </>
        );
    }

    if (type === "day-progress") {
        return (
            <>
                <Field label="Title">
                    <TextInput
                        value={params.title}
                        onChange={(value) => update("title", value)}
                    />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Days">
                        <TextInput
                            type="number"
                            value={params.days}
                            onChange={(value) => update("days", value)}
                        />
                    </Field>
                    <Field label="Day label">
                        <TextInput
                            value={params.dayLabel}
                            onChange={(value) => update("dayLabel", value)}
                        />
                    </Field>
                </div>
            </>
        );
    }

    if (type === "habit-tracker") {
        const habitCount = Math.max(
            2,
            Math.min(10, Number(params.habitCount) || 4),
        );

        return (
            <>
                <Field label="Title">
                    <TextInput
                        value={params.title}
                        onChange={(value) => update("title", value)}
                    />
                </Field>
                <div className="flex items-center justify-between gap-3">
                    <p className="app-text-main text-sm font-semibold">
                        Habits
                    </p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                update(
                                    "habitCount",
                                    String(Math.max(2, habitCount - 1)),
                                )
                            }
                            className="icon-button h-9 w-9"
                            aria-label="Remove habit">
                            <Minus size={15} />
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                update(
                                    "habitCount",
                                    String(Math.min(10, habitCount + 1)),
                                )
                            }
                            className="icon-button h-9 w-9"
                            aria-label="Add habit">
                            <Plus size={15} />
                        </button>
                    </div>
                </div>
                <div
                    className={`space-y-3 ${habitCount > 4 ? "max-h-[420px] overflow-y-auto pr-1" : ""}`}>
                    {Array.from({ length: habitCount }).map((_, index) => (
                        <Field key={index} label={`Habit ${index + 1}`}>
                            <TextInput
                                value={params[`habit${index + 1}`]}
                                onChange={(value) =>
                                    update(`habit${index + 1}`, value)
                                }
                            />
                        </Field>
                    ))}
                </div>
            </>
        );
    }

    if (type === "focus-card") {
        return (
            <>
                <Field label="Label">
                    <TextInput
                        value={params.label}
                        onChange={(value) => update("label", value)}
                    />
                </Field>
                <Field label="Title">
                    <TextInput
                        value={params.title}
                        onChange={(value) => update("title", value)}
                    />
                </Field>
                <Field label="Subtitle">
                    <TextArea
                        rows={3}
                        value={params.subtitle}
                        onChange={(value) => update("subtitle", value)}
                    />
                </Field>
            </>
        );
    }

    return (
        <Field label="Title">
            <TextInput
                value={params.title}
                onChange={(value) => update("title", value)}
            />
        </Field>
    );
}

function InfoFields({ type, params, update }) {
    if (type === "quote") {
        return (
            <>
                <Field label="Quote">
                    <TextArea
                        value={params.quote}
                        onChange={(value) => update("quote", value)}
                    />
                </Field>
                <Field label="Author">
                    <TextInput
                        value={params.author}
                        onChange={(value) => update("author", value)}
                    />
                </Field>
            </>
        );
    }

    if (type === "greeting") {
        return (
            <>
                <Field label="Greeting">
                    <TextInput
                        value={params.greeting}
                        onChange={(value) => update("greeting", value)}
                    />
                </Field>
                <Field label="Name">
                    <TextInput
                        value={params.name}
                        onChange={(value) => update("name", value)}
                    />
                </Field>
                <Field label="Message">
                    <TextInput
                        value={params.message}
                        onChange={(value) => update("message", value)}
                    />
                </Field>
            </>
        );
    }

    return (
        <Field label="Title">
            <TextInput
                value={params.title}
                onChange={(value) => update("title", value)}
            />
        </Field>
    );
}

function UtilityFields({ type, params, update }) {
    if (type === "quick-links") {
        const linkCount = Math.max(
            2,
            Math.min(10, Number(params.linkCount) || 2),
        );

        return (
            <>
                <Field label="Title">
                    <TextInput
                        value={params.title}
                        onChange={(value) => update("title", value)}
                    />
                </Field>
                <div className="flex items-center justify-between gap-3">
                    <p className="app-text-main text-sm font-semibold">Links</p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                update(
                                    "linkCount",
                                    String(Math.max(2, linkCount - 1)),
                                )
                            }
                            className="icon-button h-9 w-9"
                            aria-label="Remove link">
                            <Minus size={15} />
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                update(
                                    "linkCount",
                                    String(Math.min(10, linkCount + 1)),
                                )
                            }
                            className="icon-button h-9 w-9"
                            aria-label="Add link">
                            <Plus size={15} />
                        </button>
                    </div>
                </div>
                <div
                    className={`space-y-3 ${linkCount > 4 ? "max-h-[520px] overflow-y-auto pr-1" : ""}`}>
                    {Array.from({ length: linkCount }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border p-3"
                            style={{
                                borderColor: "var(--app-border)",
                                background: "var(--app-panel-soft)",
                            }}>
                            <p className="app-text-muted mb-2 text-xs font-semibold uppercase">
                                Link {index + 1}
                            </p>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <label className="block">
                                    <span className="app-text-main mb-1 block text-xs font-semibold">
                                        Label
                                    </span>
                                    <TextInput
                                        value={params[`link${index + 1}Label`]}
                                        onChange={(value) =>
                                            update(
                                                `link${index + 1}Label`,
                                                value,
                                            )
                                        }
                                    />
                                </label>
                                <label className="block">
                                    <span className="app-text-main mb-1 block text-xs font-semibold">
                                        URL
                                    </span>
                                    <TextInput
                                        value={params[`link${index + 1}Url`]}
                                        onChange={(value) =>
                                            update(`link${index + 1}Url`, value)
                                        }
                                    />
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    }

    if (type === "notes") {
        return (
            <>
                <Field label="Title">
                    <TextInput
                        value={params.title}
                        onChange={(value) => update("title", value)}
                    />
                </Field>
                <Field label="Body">
                    <TextArea
                        value={params.body}
                        onChange={(value) => update("body", value)}
                    />
                </Field>
            </>
        );
    }

    if (type === "counter") {
        return (
            <>
                <Field label="Title">
                    <TextInput
                        value={params.title}
                        onChange={(value) => update("title", value)}
                    />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Count">
                        <TextInput
                            type="number"
                            value={params.count}
                            onChange={(value) =>
                                update(
                                    "count",
                                    value === ""
                                        ? "0"
                                        : String(
                                              Math.max(0, Number(value) || 0),
                                          ),
                                )
                            }
                        />
                    </Field>
                    <Field label="Suffix">
                        <TextInput
                            value={params.suffix}
                            onChange={(value) => update("suffix", value)}
                        />
                    </Field>
                </div>
            </>
        );
    }

    return (
        <>
            <Field label="Title">
                <TextInput
                    value={params.title}
                    onChange={(value) => update("title", value)}
                />
            </Field>
            <Field label="Value">
                <TextInput
                    value={params.value}
                    onChange={(value) => update("value", value)}
                />
            </Field>
        </>
    );
}

function WidgetSpecificFields({ type, category, params, update }) {
    if (type === "audio")
        return <AudioFields params={params} update={update} />;
    if (type === "clock")
        return <ClockFields params={params} update={update} />;
    if (type === "quote" || type === "greeting")
        return <InfoFields type={type} params={params} update={update} />;
    if (category === "Productivity")
        return (
            <ProductivityFields type={type} params={params} update={update} />
        );
    if (category === "Utility")
        return <UtilityFields type={type} params={params} update={update} />;
    return null;
}

function buildEditorDefaults(widget, defaultMode) {
    if (!widget) {
        return {};
    }

    return {
        ...widget.defaults,
        mode: defaultMode,
    };
}

export default function EditorPage() {
    const { slug } = useParams();
    const [toast, setToast] = useState("");
    const [copiedField, setCopiedField] = useState("");
    const { appliedTheme } = useThemeMode();
    const widget = getWidgetBySlug(slug);
    const config = getWidgetType(widget?.type);
    const defaultWidgetMode = getOppositeWidgetMode(appliedTheme);
    const routeKey = slug || "";
    const initializedRouteRef = useRef("");
    const [params, setParams] = useState(() =>
        buildEditorDefaults(widget, defaultWidgetMode),
    );

    useEffect(() => {
        if (!widget) {
            return;
        }

        if (initializedRouteRef.current !== routeKey) {
            setParams(
                buildEditorDefaults(
                    widget,
                    getOppositeWidgetMode(appliedTheme),
                ),
            );
            initializedRouteRef.current = routeKey;
        }
    }, [appliedTheme, routeKey, widget]);

    const showAccentPicker = useMemo(
        () =>
            widget
                ? widgetUsesAccent(
                      widget.type,
                      widget.renderConfig.style || widget.defaults.style,
                  )
                : false,
        [widget],
    );
    const displayedMode = params.mode === "dark" ? "dark" : "light";
    const embedParams = useMemo(() => toEmbedSearchParams(params), [params]);
    const embedLink = useMemo(
        () => buildAbsoluteEmbedLink(widget, embedParams),
        [embedParams, widget],
    );
    const htmlSnippet = useMemo(
        () =>
            `<iframe src="${embedLink}" title="${widget?.title || "Widget Studio widget"}" style="width:100%;height:360px;border:0;border-radius:24px;overflow:hidden;" loading="lazy"></iframe>`,
        [embedLink, widget?.title],
    );

    if (!widget || !config) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-24 text-center">
                <h1 className="app-text-main text-3xl font-semibold">
                    Widget not found
                </h1>
                <p className="app-text-muted mt-3">
                    Choose a widget from the marketplace.
                </p>
                <Link
                    to="/widgets"
                    className="app-button-primary mt-8 inline-flex rounded-full px-5 py-3 text-sm font-semibold">
                    Browse widgets
                </Link>
            </div>
        );
    }

    const update = (key, value) => {
        setParams((current) => {
            const nextParams = { ...current };

            if (value === undefined || value === null) delete nextParams[key];
            else nextParams[key] = value;

            return nextParams;
        });
    };

    const copyToClipboard = async (value, message) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopiedField(message.includes("HTML") ? "html" : "embed");
            setToast(message);
            window.setTimeout(() => {
                setToast("");
                setCopiedField("");
            }, 2000);
        } catch {
            setToast("Copy failed");
            window.setTimeout(() => setToast(""), 2000);
        }
    };

    return (
        <div className="mx-auto min-h-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <WidgetHeader
                category={widget.category}
                icon={widget.icon || config.icon || SlidersHorizontal}
                title={widget.title}
                description={widget.description}
                priceLabel={widget.priceLabel}
                action={
                    <Link
                        to="/widgets"
                        className="app-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition">
                        All widgets
                    </Link>
                }
            />

            <div className="grid gap-6 lg:grid-cols-[390px_1fr] lg:items-stretch">
                <aside className="lg:min-h-0">
                    <div className="glass-panel rounded-[2rem] p-5 lg:flex lg:h-full lg:min-h-[560px] lg:flex-col">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <h2 className="app-text-main text-lg font-semibold">
                                Settings
                            </h2>
                        </div>
                        <div className="space-y-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
                            <SegmentedControl
                                label="Appearance"
                                options={modeOptions}
                                value={displayedMode}
                                onChange={(value) => update("mode", value)}
                            />
                            <Toggle
                                checked={toBoolean(
                                    params.customBackground,
                                    false,
                                )}
                                onChange={(value) =>
                                    update("customBackground", String(value))
                                }
                                label="Custom background"
                            />
                            {toBoolean(params.customBackground, false) ? (
                                <Field label="Background color">
                                    <ColorInput
                                        value={params.backgroundColor}
                                        onChange={(value) =>
                                            update("backgroundColor", value)
                                        }
                                    />
                                </Field>
                            ) : null}
                            {showAccentPicker ? (
                                <AccentPicker
                                    value={params.accent || "sky"}
                                    onChange={(value) =>
                                        update("accent", value)
                                    }
                                />
                            ) : null}
                            <WidgetSpecificFields
                                key={widget.slug}
                                type={widget.type}
                                category={widget.category}
                                params={params}
                                update={update}
                            />
                        </div>
                    </div>
                </aside>

                <section
                    className="min-h-[560px] rounded-[2rem] border p-4 backdrop-blur-xl sm:p-6 lg:flex lg:h-full lg:flex-col"
                    style={{
                        borderColor: "var(--app-border)",
                        background: "var(--app-overlay)",
                        boxShadow: "var(--app-shadow)",
                    }}>
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                            <p className="app-text-main text-sm font-semibold">
                                Live preview
                            </p>
                            <p className="app-text-muted mt-1 text-xs">
                                Preview uses the same render path as the embed
                                output.
                            </p>
                        </div>
                        <Link
                            to={createEmbedPath(widget, embedParams)}
                            target="_blank"
                            className="app-button-secondary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition">
                            <ExternalLink size={16} />
                            Open embed
                        </Link>
                    </div>
                    <div className="preview-stage min-h-[470px] rounded-[1.6rem] p-3 transition-colors">
                        <motion.div
                            key={`${widget.slug}-${embedParams.toString()}`}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.22 }}
                            className="h-full w-full">
                            <WidgetRenderer
                                type={widget.type}
                                params={params}
                                fill
                            />
                        </motion.div>
                    </div>
                    <div
                        className="mt-5 border-t pt-5"
                        style={{ borderColor: "var(--app-border)" }}>
                        <div className="mb-3">
                            <p className="app-text-main text-sm font-semibold">
                                Export
                            </p>
                            <p className="app-text-muted mt-1 text-xs">
                                Copy the embed link or iframe directly from this
                                panel.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div
                                className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-2xl border px-3"
                                style={{
                                    borderColor: "var(--app-border)",
                                    background: "var(--app-panel-soft)",
                                }}>
                                <Link2
                                    size={16}
                                    className="shrink-0"
                                    style={{ color: "var(--app-muted)" }}
                                />
                                <input
                                    value={embedLink}
                                    readOnly
                                    title={embedLink}
                                    onFocus={(event) => event.target.select()}
                                    className="h-full min-w-0 w-full overflow-hidden text-ellipsis whitespace-nowrap bg-transparent text-xs outline-none"
                                    style={{ color: "var(--app-primary)" }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    copyToClipboard(
                                        embedLink,
                                        "Embed link copied",
                                    )
                                }
                                className="app-button-primary inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition"
                                aria-label="Copy embed link"
                                title="Copy embed link">
                                {copiedField === "embed" ? (
                                    <Check size={18} />
                                ) : (
                                    <Copy size={18} />
                                )}
                            </button>
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                            <div
                                className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-2xl border px-3"
                                style={{
                                    borderColor: "var(--app-border)",
                                    background: "var(--app-panel-soft)",
                                }}>
                                <Code2
                                    size={16}
                                    className="shrink-0"
                                    style={{ color: "var(--app-muted)" }}
                                />
                                <input
                                    value={htmlSnippet}
                                    readOnly
                                    title={htmlSnippet}
                                    onFocus={(event) => event.target.select()}
                                    className="h-full min-w-0 w-full overflow-hidden text-ellipsis whitespace-nowrap bg-transparent text-xs outline-none"
                                    style={{ color: "var(--app-primary)" }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    copyToClipboard(htmlSnippet, "HTML copied")
                                }
                                className="app-button-primary inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition"
                                aria-label="Copy HTML iframe"
                                title="Copy HTML iframe">
                                {copiedField === "html" ? (
                                    <Check size={18} />
                                ) : (
                                    <Copy size={18} />
                                )}
                            </button>
                        </div>
                    </div>
                </section>
            </div>
            {toast ? (
                <div
                    className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold"
                    style={{
                        borderColor: "var(--app-border)",
                        background: "var(--app-overlay)",
                        color: "var(--app-primary)",
                        boxShadow: "var(--app-shadow)",
                    }}>
                    {toast === "Copy failed" ? (
                        <X size={16} />
                    ) : (
                        <Check size={16} />
                    )}
                    {toast}
                </div>
            ) : null}
        </div>
    );
}
