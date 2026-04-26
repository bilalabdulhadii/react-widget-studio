import {
    BadgeCheck,
    Check,
    ExternalLink,
    Link2,
    Minus,
    Play,
    Plus,
    Quote,
    Repeat,
    Sparkles,
    StickyNote,
    Volume2,
} from "lucide-react";
import { getAccent } from "../data/widgets";
import { useThemeMode } from "../hooks/useThemeMode";
import {
    getOppositeWidgetMode,
    getWidgetThemeVars,
} from "../widgets/widgetTheme";
import WidgetPreviewFrame from "./WidgetPreviewFrame";

function cx(...parts) {
    return parts.filter(Boolean).join(" ");
}

function createVisualizerBars(count, minHeight, maxHeight, phase = 0) {
    return Array.from({ length: count }, (_, index) => {
        const wave = (Math.sin(index * 0.48 + phase) + 1) / 2;
        const detail = (Math.cos(index * 0.91 + phase * 0.8) + 1) / 2;
        const accent = (Math.sin(index * 0.18 + phase * 1.4) + 1) / 2;
        return Math.round(
            minHeight +
                (maxHeight - minHeight) *
                    (wave * 0.48 + detail * 0.28 + accent * 0.14),
        );
    });
}

function PreviewScene({ themeVars, accent, children, className = "" }) {
    return (
        <div
            className={cx(
                "flex h-full w-full items-center justify-center",
                className,
            )}
            style={{
                ...themeVars,
                "--widget-accent": accent.color,
                color: "var(--widget-text)",
            }}>
            {children}
        </div>
    );
}

function PreviewCard({ children, className = "", style }) {
    return (
        <div
            className={cx("w-full overflow-hidden", className)}
            style={{ ...style, borderRadius: "12px" }}>
            {children}
        </div>
    );
}

function PreviewInner({ children, className = "", style }) {
    return (
        <div
            className={cx("rounded-[1rem] border", className)}
            style={{
                background: "var(--widget-inner-card)",
                borderColor: "var(--widget-border)",
                boxShadow: "var(--widget-inner-shadow)",
                ...style,
            }}>
            {children}
        </div>
    );
}

function PreviewPill({ children, className = "", style }) {
    return (
        <div
            className={cx(
                "inline-flex items-center rounded-full border px-3 py-1.5",
                className,
            )}
            style={{
                background: "var(--widget-surface-elevated)",
                borderColor: "var(--widget-border)",
                color: "var(--widget-muted)",
                ...style,
            }}>
            {children}
        </div>
    );
}

function PreviewButton({
    icon: Icon,
    accent,
    className = "",
    variant = "accent",
}) {
    const toneStyle =
        variant === "control"
            ? {
                  background: "var(--widget-primary)",
                  color: "var(--widget-on-primary)",
                  boxShadow: "var(--widget-inner-shadow)",
              }
            : variant === "controlAlt"
              ? {
                    background: "var(--widget-inner-card)",
                    color: "var(--widget-text)",
                    border: "1px solid var(--widget-border)",
                    boxShadow: "var(--widget-inner-shadow)",
                }
              : {
                    background: accent.color,
                    color: "var(--widget-accent-text)",
                    boxShadow: "var(--widget-inner-shadow)",
                };

    return (
        <span
            className={cx(
                "inline-flex items-center justify-center rounded-full",
                className,
            )}
            style={toneStyle}>
            <Icon size={16} fill="currentColor" />
        </span>
    );
}

function PreviewProgress({ accent, value = 0.6, height = 8, className = "" }) {
    const clampedValue = Math.max(0, Math.min(1, value));

    return (
        <div
            className={cx("relative overflow-hidden rounded-full", className)}
            style={{
                height,
                background: "var(--widget-track)",
            }}>
            <span
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                    width: `${clampedValue * 100}%`,
                    background: accent.color,
                }}
            />
        </div>
    );
}

function PreviewVisualizer({ accent, bars, compact = false, className = "" }) {
    const accentSoft = `color-mix(in srgb, ${accent.color} 86%, var(--widget-surface) 14%)`;
    const accentDeep = `color-mix(in srgb, ${accent.color} 92%, var(--widget-primary) 8%)`;

    return (
        <div
            className={cx(
                "grid w-full items-end",
                compact ? "h-8 gap-[1px]" : "h-12 gap-[2px]",
                className,
            )}
            style={{
                gridTemplateColumns: `repeat(${bars.length}, minmax(0, 1fr))`,
            }}
            aria-hidden="true">
            {bars.map((height, index) => (
                <span
                    key={`${index}-${height}`}
                    className={cx(
                        "block self-end justify-self-center rounded-full",
                        compact ? "w-[2px]" : "w-[3px]",
                    )}
                    style={{
                        height,
                        minHeight: compact ? 4 : 6,
                        opacity: 0.92,
                        background:
                            index % 3 === 0
                                ? accentSoft
                                : index % 2 === 0
                                  ? accent.color
                                  : accentDeep,
                    }}
                />
            ))}
        </div>
    );
}

function FlipCell({ value, label, narrow = false }) {
    return (
        <div
            className={cx(
                "flex flex-col items-center gap-2",
                narrow ? "w-[50px]" : "w-[72px]",
            )}>
            <div
                className={cx(
                    "relative w-full overflow-hidden rounded-[1.1rem] border",
                    narrow ? "h-[58px]" : "h-[82px]",
                )}
                style={{
                    background: "var(--widget-inner-card)",
                    borderColor: "var(--widget-border)",
                    boxShadow: "var(--widget-inner-shadow)",
                }}>
                <div
                    className="absolute inset-x-0 top-0 h-1/2"
                    style={{ background: "var(--widget-inner-card-top)" }}
                />
                <div
                    className="absolute inset-x-0 bottom-0 h-1/2"
                    style={{ background: "var(--widget-inner-card-bottom)" }}
                />
                <div
                    className="absolute inset-x-0 top-1/2 h-px"
                    style={{
                        background: "var(--widget-border-strong)",
                        transform: "translateY(-0.5px)",
                    }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-center font-semibold tracking-[0.06em]">
                    <span
                        className={narrow ? "text-lg" : "text-[1.85rem]"}
                        style={{ color: "var(--widget-text)" }}>
                        {value}
                    </span>
                </div>
            </div>
            {label ? (
                <span
                    className="text-[10px] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "var(--widget-muted)" }}>
                    {label}
                </span>
            ) : null}
        </div>
    );
}

function ColonSeparator() {
    return (
        <div className="flex h-[82px] items-center justify-center px-1.5">
            <div className="flex flex-col gap-2.5">
                <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--widget-muted)" }}
                />
                <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--widget-muted)" }}
                />
            </div>
        </div>
    );
}

function AudioBarPreview({ themeVars, accent }) {
    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-6">
            <PreviewCard className="max-w-[360px] rounded-[1.15rem] px-4 py-3.5">
                <div className="flex items-center gap-3">
                    <PreviewButton
                        icon={Play}
                        accent={accent}
                        variant="controlAlt"
                        className="h-10 w-10 shrink-0"
                    />
                    <span
                        className="shrink-0 text-[11px] font-semibold tabular-nums"
                        style={{ color: "var(--widget-muted)" }}>
                        0:24 / 1:39
                    </span>
                    <PreviewProgress
                        accent={accent}
                        value={0.58}
                        height={6}
                        className="min-w-0 flex-1"
                    />
                    <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border"
                        style={{
                            background: "var(--widget-surface-elevated)",
                            borderColor: "var(--widget-border)",
                            color: "var(--widget-text)",
                        }}
                        aria-hidden="true">
                        <Volume2 size={14} />
                    </button>
                </div>
            </PreviewCard>
        </PreviewScene>
    );
}

function MinimalPlayerPreview({ themeVars, accent }) {
    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-5">
            <PreviewCard className="max-w-[360px] px-5 py-5">
                <div className="flex items-center gap-4">
                    <PreviewButton
                        icon={Play}
                        accent={accent}
                        variant="control"
                        className="h-12 w-12 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                        <div
                            className="truncate text-sm font-semibold"
                            style={{ color: "var(--widget-text)" }}>
                            Quiet Mode
                        </div>
                        <div
                            className="mt-1 text-xs"
                            style={{ color: "var(--widget-muted)" }}>
                            Widget Studio
                        </div>
                    </div>
                    <div className="w-20 shrink-0">
                        <PreviewVisualizer
                            accent={accent}
                            bars={createVisualizerBars(18, 4, 20, 1.6)}
                            compact
                        />
                    </div>
                </div>
                <div className="mt-4 space-y-3">
                    <PreviewProgress accent={accent} value={0.66} />
                    <div
                        className="flex items-center justify-between text-[11px] font-medium tabular-nums"
                        style={{ color: "var(--widget-muted)" }}>
                        <span>0:24 / 1:39</span>
                        <div className="flex items-center gap-2.5">
                            <Repeat size={13} />
                            <Volume2 size={13} />
                        </div>
                    </div>
                </div>
            </PreviewCard>
        </PreviewScene>
    );
}

function FocusPlayerPreview({ themeVars, accent }) {
    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-5">
            <PreviewCard className="max-w-[360px] px-6 py-6">
                <div className="flex flex-col items-center text-center">
                    <PreviewButton
                        icon={Play}
                        accent={accent}
                        variant="control"
                        className="h-16 w-16"
                    />
                    <div
                        className="mt-4 text-base font-semibold"
                        style={{ color: "var(--widget-text)" }}>
                        Quiet Mode
                    </div>
                    <div
                        className="mt-1 text-xs"
                        style={{ color: "var(--widget-muted)" }}>
                        Widget Studio
                    </div>
                    <div className="mt-5 w-full space-y-3">
                        <PreviewProgress accent={accent} value={0.42} />
                        <div
                            className="flex items-center justify-between text-[11px] font-medium tabular-nums"
                            style={{ color: "var(--widget-muted)" }}>
                            <span>0:24 / 1:39</span>
                            <div className="flex items-center gap-2.5">
                                <Repeat size={13} />
                                <Volume2 size={13} />
                            </div>
                        </div>
                    </div>
                </div>
            </PreviewCard>
        </PreviewScene>
    );
}

function CardPlayerPreview({ themeVars, accent }) {
    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-5">
            <PreviewCard className="max-w-[368px] px-5 py-5">
                <div className="flex items-center gap-4">
                    <PreviewButton
                        icon={Play}
                        accent={accent}
                        variant="control"
                        className="h-14 w-14 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                        <div
                            className="truncate text-sm font-semibold"
                            style={{ color: "var(--widget-text)" }}>
                            Quiet Mode
                        </div>
                        <div
                            className="mt-1 text-xs"
                            style={{ color: "var(--widget-muted)" }}>
                            Widget Studio
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <PreviewVisualizer
                        accent={accent}
                        bars={createVisualizerBars(38, 5, 28, 2.3)}
                    />
                </div>
                <div className="mt-4 space-y-3">
                    <PreviewProgress accent={accent} value={0.61} />
                    <div
                        className="flex items-center justify-between text-[11px] font-medium tabular-nums"
                        style={{ color: "var(--widget-muted)" }}>
                        <span>0:24 / 1:39</span>
                        <div className="flex items-center gap-2.5">
                            <Repeat size={13} />
                            <Volume2 size={13} />
                        </div>
                    </div>
                </div>
            </PreviewCard>
        </PreviewScene>
    );
}

function FlipClockPreview({ themeVars, accent, widget }) {
    const showUnitLabels = widget?.defaults?.showUnitLabels !== "false";

    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-5">
            <PreviewCard className="max-w-[392px] px-4 py-4">
                <div
                    className="text-center text-xs font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "var(--widget-muted)" }}>
                    Keep going
                </div>
                <div className="mt-4 flex items-end justify-center">
                    <FlipCell
                        value="08"
                        label={showUnitLabels ? "Hours" : null}
                    />
                    <ColonSeparator />
                    <FlipCell
                        value="24"
                        label={showUnitLabels ? "Minutes" : null}
                    />
                    <ColonSeparator />
                    <FlipCell
                        value="45"
                        label={showUnitLabels ? "Seconds" : null}
                    />
                </div>
            </PreviewCard>
        </PreviewScene>
    );
}

function CircularClockPreview({ themeVars, accent }) {
    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-5">
            <PreviewCard className="max-w-[368px] px-6 py-5">
                <div className="flex items-center justify-center gap-5">
                    <div className="relative h-[120px] w-[120px] shrink-0">
                        <svg
                            viewBox="0 0 120 120"
                            className="h-full w-full -rotate-90">
                            <circle
                                cx="60"
                                cy="60"
                                r="48"
                                stroke="var(--widget-track)"
                                strokeWidth="10"
                                fill="none"
                            />
                            <circle
                                cx="60"
                                cy="60"
                                r="48"
                                stroke={accent.color}
                                strokeWidth="10"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 48}`}
                                strokeDashoffset={`${2 * Math.PI * 48 * 0.31}`}
                            />
                        </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div
                            className="text-xs font-semibold uppercase tracking-[0.16em]"
                            style={{ color: "var(--widget-muted)" }}>
                            Keep going
                        </div>
                        <div
                            className="mt-2 text-[2rem] font-semibold tabular-nums tracking-[0.06em]"
                            style={{ color: "var(--widget-text)" }}>
                            08:24
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                            <PreviewPill className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                                45 seconds
                            </PreviewPill>
                        </div>
                    </div>
                </div>
            </PreviewCard>
        </PreviewScene>
    );
}

function DigitalClockPreview({ themeVars, accent, widget }) {
    const showUnitLabels = widget?.defaults?.showUnitLabels !== "false";

    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-5">
            <PreviewCard className="max-w-[388px] px-5 py-5">
                <div
                    className="text-center text-xs font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "var(--widget-muted)" }}>
                    Keep going
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                        ["08", "Hours"],
                        ["24", "Minutes"],
                        ["45", "Seconds"],
                    ].map(([value, label]) => (
                        <PreviewInner
                            key={label}
                            className="px-3 py-3 text-center">
                            <div
                                className="text-[1.5rem] font-semibold tabular-nums"
                                style={{ color: "var(--widget-text)" }}>
                                {value}
                            </div>
                            {showUnitLabels ? (
                                <div
                                    className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
                                    style={{ color: "var(--widget-muted)" }}>
                                    {label}
                                </div>
                            ) : null}
                        </PreviewInner>
                    ))}
                </div>
            </PreviewCard>
        </PreviewScene>
    );
}

function AnalogClockPreview({ themeVars, accent }) {
    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-5">
            <PreviewCard className="max-w-[360px] px-6 py-5">
                <div className="flex items-center justify-center gap-5">
                    <div
                        className="relative h-[128px] w-[128px] rounded-full border"
                        style={{
                            background: "var(--widget-surface-elevated)",
                            borderColor: "var(--widget-border)",
                            boxShadow: "var(--widget-inner-shadow)",
                        }}>
                        {Array.from({ length: 12 }).map((_, index) => (
                            <span
                                key={index}
                                className="absolute left-1/2 top-1/2 block h-[42px] w-px origin-bottom"
                                style={{
                                    background:
                                        index % 3 === 0
                                            ? "var(--widget-border-strong)"
                                            : "var(--widget-border)",
                                    transform: `translate(-50%, -100%) rotate(${index * 30}deg)`,
                                }}
                            />
                        ))}
                        <span
                            className="absolute left-1/2 top-1/2 block h-[32px] w-[3px] origin-bottom rounded-full"
                            style={{
                                background: "var(--widget-text)",
                                transform:
                                    "translate(-50%, -100%) rotate(20deg)",
                            }}
                        />
                        <span
                            className="absolute left-1/2 top-1/2 block h-[44px] w-[2px] origin-bottom rounded-full"
                            style={{
                                background: accent.color,
                                transform:
                                    "translate(-50%, -100%) rotate(150deg)",
                            }}
                        />
                        <span
                            className="absolute left-1/2 top-1/2 block h-[50px] w-px origin-bottom rounded-full"
                            style={{
                                background: "var(--widget-muted)",
                                transform:
                                    "translate(-50%, -100%) rotate(250deg)",
                            }}
                        />
                        <span
                            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                            style={{ background: accent.color }}
                        />
                    </div>
                    <div className="space-y-3">
                        <div
                            className="text-xs font-semibold uppercase tracking-[0.16em]"
                            style={{ color: "var(--widget-muted)" }}>
                            Keep going
                        </div>
                        <div
                            className="text-[2rem] font-semibold tabular-nums tracking-[0.06em]"
                            style={{ color: "var(--widget-text)" }}>
                            08:24
                        </div>
                        <PreviewPill className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                            45 seconds
                        </PreviewPill>
                    </div>
                </div>
            </PreviewCard>
        </PreviewScene>
    );
}

function PomodoroPreview({ themeVars, accent }) {
    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-5">
            <PreviewCard className="max-w-[360px] px-5 py-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div
                            className="text-xs font-semibold uppercase tracking-[0.16em]"
                            style={{ color: "var(--widget-muted)" }}>
                            Deep Focus Session
                        </div>
                        <div
                            className="mt-3 text-[2.25rem] font-semibold tabular-nums"
                            style={{ color: "var(--widget-text)" }}>
                            24:32
                        </div>
                    </div>
                    <PreviewPill className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                        Focus
                    </PreviewPill>
                </div>
                <div className="mt-4">
                    <PreviewProgress accent={accent} value={0.72} />
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <PreviewButton
                        icon={Play}
                        accent={accent}
                        className="h-10 w-10"
                    />
                    <PreviewInner className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em]">
                        Break 05 min
                    </PreviewInner>
                </div>
            </PreviewCard>
        </PreviewScene>
    );
}

function EventPreview({ themeVars, accent }) {
    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-5">
            <PreviewCard className="max-w-[390px] px-5 py-5">
                <div
                    className="text-center text-xs font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "var(--widget-muted)" }}>
                    Upcoming Milestone
                </div>
                <div className="mt-4 flex items-end justify-center gap-3">
                    {[
                        ["02", "Months"],
                        ["09", "Weeks"],
                        ["04", "Days"],
                        ["12", "Hours"],
                    ].map(([value, label]) => (
                        <PreviewInner
                            key={label}
                            className="flex h-[82px] w-[72px] flex-col items-center justify-center">
                            <div
                                className="font-mono text-[1.85rem] font-semibold tabular-nums"
                                style={{ color: "var(--widget-text)" }}>
                                {value}
                            </div>
                            <div
                                className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
                                style={{ color: "var(--widget-muted)" }}>
                                {label}
                            </div>
                        </PreviewInner>
                    ))}
                </div>
            </PreviewCard>
        </PreviewScene>
    );
}

function ProgressPreview({ themeVars, accent }) {
    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-5">
            <PreviewCard className="max-w-[360px] px-5 py-5">
                <div className="flex items-center justify-between gap-4">
                    <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--widget-text)" }}>
                        Project Progress
                    </span>
                    <span
                        className="text-sm font-semibold tabular-nums"
                        style={{ color: accent.color }}>
                        68%
                    </span>
                </div>
                <div className="mt-4">
                    <PreviewProgress accent={accent} value={0.68} height={10} />
                </div>
                <div
                    className="mt-4 flex items-center justify-between text-[11px] font-medium"
                    style={{ color: "var(--widget-muted)" }}>
                    <span>In progress</span>
                    <span>Complete</span>
                </div>
            </PreviewCard>
        </PreviewScene>
    );
}

function DayProgressPreview({ themeVars, accent }) {
    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-5">
            <PreviewCard className="max-w-[388px] px-5 py-5">
                <div className="flex items-center justify-between gap-4">
                    <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--widget-text)" }}>
                        Weekly Rhythm
                    </span>
                    <span
                        className="text-xs font-semibold uppercase tracking-[0.16em]"
                        style={{ color: "var(--widget-muted)" }}>
                        4 / 7
                    </span>
                </div>
                <div className="mt-4 grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }).map((_, index) => (
                        <PreviewInner
                            key={index}
                            className="px-1.5 py-2 text-center">
                            <div
                                className="text-[9px] font-semibold uppercase tracking-[0.12em]"
                                style={{ color: "var(--widget-muted)" }}>
                                Day
                            </div>
                            <div
                                className="mt-1 text-sm font-semibold tabular-nums"
                                style={{
                                    color:
                                        index < 4
                                            ? accent.color
                                            : "var(--widget-text)",
                                }}>
                                {index + 1}
                            </div>
                        </PreviewInner>
                    ))}
                </div>
            </PreviewCard>
        </PreviewScene>
    );
}

function HabitTrackerPreview({ themeVars, accent }) {
    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-5">
            <PreviewCard className="max-w-[388px] px-5 py-5">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <BadgeCheck
                            size={16}
                            style={{ color: "var(--widget-muted)" }}
                        />
                        <span
                            className="text-sm font-semibold"
                            style={{ color: "var(--widget-text)" }}>
                            Daily Habits
                        </span>
                    </div>
                    <span
                        className="text-xs font-semibold uppercase tracking-[0.16em]"
                        style={{ color: "var(--widget-muted)" }}>
                        3 / 4
                    </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                    {[
                        ["Read", true],
                        ["Move", true],
                        ["Plan", false],
                        ["Sleep", true],
                    ].map(([label, done]) => (
                        <PreviewInner
                            key={label}
                            className="flex items-center gap-2.5 px-3 py-2.5">
                            <span
                                className="inline-flex h-5 w-5 items-center justify-center rounded-full border"
                                style={{
                                    background: done
                                        ? accent.color
                                        : "var(--widget-surface-elevated)",
                                    borderColor: done
                                        ? accent.color
                                        : "var(--widget-border)",
                                    color: done
                                        ? "var(--widget-accent-text)"
                                        : "var(--widget-muted)",
                                }}>
                                <Check size={12} />
                            </span>
                            <span
                                className="truncate text-xs font-semibold"
                                style={{ color: "var(--widget-text)" }}>
                                {label}
                            </span>
                        </PreviewInner>
                    ))}
                </div>
            </PreviewCard>
        </PreviewScene>
    );
}

function FocusCardPreview({ themeVars, accent }) {
    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-5">
            <PreviewCard className="max-w-[360px] px-5 py-5">
                <div className="flex items-start gap-3">
                    <span
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl"
                        style={{
                            background: accent.color,
                            color: "var(--widget-accent-text)",
                        }}>
                        <Sparkles size={18} />
                    </span>
                    <div className="min-w-0">
                        <div
                            className="text-[11px] font-semibold uppercase tracking-[0.16em]"
                            style={{ color: "var(--widget-muted)" }}>
                            Today's Focus
                        </div>
                        <div
                            className="mt-2 text-lg font-semibold leading-6"
                            style={{ color: "var(--widget-text)" }}>
                            Ship the next milestone
                        </div>
                    </div>
                </div>
                <p
                    className="mt-4 text-sm leading-6"
                    style={{ color: "var(--widget-muted)" }}>
                    Keep the most important task visible and finish it first.
                </p>
            </PreviewCard>
        </PreviewScene>
    );
}

function QuotePreview({ themeVars, accent }) {
    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-5">
            <PreviewCard className="max-w-[360px] px-5 py-5">
                <Quote size={20} style={{ color: accent.color }} />
                <p
                    className="mt-4 text-sm leading-6"
                    style={{ color: "var(--widget-text)" }}>
                    Clarity turns effort into momentum.
                </p>
                <div
                    className="mt-4 text-xs font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "var(--widget-muted)" }}>
                    — Widget Studio
                </div>
            </PreviewCard>
        </PreviewScene>
    );
}

function GreetingPreview({ themeVars, accent }) {
    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-5">
            <PreviewCard className="max-w-[360px] px-5 py-5">
                <div
                    className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "var(--widget-muted)" }}>
                    <Sparkles size={14} />
                    Greeting Card
                </div>
                <div
                    className="mt-4 text-[1.6rem] font-semibold leading-8"
                    style={{ color: "var(--widget-text)" }}>
                    Good day, Emma
                </div>
                <p
                    className="mt-3 text-sm leading-6"
                    style={{ color: "var(--widget-muted)" }}>
                    Ready to build something clean today?
                </p>
            </PreviewCard>
        </PreviewScene>
    );
}

function QuickLinksPreview({ themeVars, accent }) {
    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-5">
            <PreviewCard className="max-w-[388px] px-5 py-5">
                <div className="flex items-center gap-2.5">
                    <Link2 size={15} style={{ color: accent.color }} />
                    <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--widget-text)" }}>
                        Quick Links
                    </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                    {["Portfolio", "Workspace", "Portfolio", "Workspace"].map(
                        (label, index) => (
                            <PreviewInner
                                key={`${label}-${index}`}
                                className="flex items-center justify-between gap-2 px-3 py-2.5">
                                <span
                                    className="truncate text-xs font-semibold"
                                    style={{ color: "var(--widget-text)" }}>
                                    {label}
                                </span>
                                <ExternalLink
                                    size={12}
                                    style={{ color: "var(--widget-muted)" }}
                                />
                            </PreviewInner>
                        ),
                    )}
                </div>
            </PreviewCard>
        </PreviewScene>
    );
}

function NotesPreview({ themeVars, accent }) {
    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-5">
            <PreviewCard className="max-w-[360px] px-5 py-5">
                <div className="flex items-center gap-2.5">
                    <StickyNote size={15} style={{ color: accent.color }} />
                    <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--widget-text)" }}>
                        Pinned Note
                    </span>
                </div>
                <div className="mt-4 space-y-2.5">
                    <div
                        className="h-2.5 w-full rounded-full"
                        style={{ background: "var(--widget-track)" }}
                    />
                    <div
                        className="h-2.5 w-[88%] rounded-full"
                        style={{ background: "var(--widget-track)" }}
                    />
                    <div
                        className="h-2.5 w-[72%] rounded-full"
                        style={{ background: "var(--widget-track)" }}
                    />
                </div>
            </PreviewCard>
        </PreviewScene>
    );
}

function CounterPreview({ themeVars, accent }) {
    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-5">
            <PreviewCard className="max-w-[360px] px-5 py-5">
                <div
                    className="text-[11px] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "var(--widget-muted)" }}>
                    Consistency Streak
                </div>
                <div className="mt-4 flex items-end justify-between gap-4">
                    <div className="flex items-end gap-2">
                        <span
                            className="text-[2.5rem] font-semibold tabular-nums leading-none"
                            style={{ color: "var(--widget-text)" }}>
                            12
                        </span>
                        <span
                            className="pb-1 text-sm font-semibold"
                            style={{ color: "var(--widget-muted)" }}>
                            days
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <PreviewInner className="inline-flex h-10 w-10 items-center justify-center rounded-full">
                            <Minus
                                size={16}
                                style={{ color: "var(--widget-text)" }}
                            />
                        </PreviewInner>
                        <span
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full"
                            style={{
                                background: accent.color,
                                color: "var(--widget-accent-text)",
                                boxShadow: "var(--widget-inner-shadow)",
                            }}>
                            <Plus size={16} />
                        </span>
                    </div>
                </div>
            </PreviewCard>
        </PreviewScene>
    );
}

function GenericPreview({ themeVars, accent, label }) {
    return (
        <PreviewScene
            themeVars={themeVars}
            accent={accent}
            className="px-5 py-5">
            <PreviewCard className="max-w-[360px] px-5 py-5">
                <div
                    className="text-sm font-semibold"
                    style={{ color: "var(--widget-text)" }}>
                    {label}
                </div>
            </PreviewCard>
        </PreviewScene>
    );
}

const previewComponents = {
    "audio-bar": AudioBarPreview,
    "audio-minimal": MinimalPlayerPreview,
    "audio-focus": FocusPlayerPreview,
    "audio-card": CardPlayerPreview,
    "clock-digital": DigitalClockPreview,
    "clock-flip": FlipClockPreview,
    "clock-circular": CircularClockPreview,
    "clock-analog": AnalogClockPreview,
    pomodoro: PomodoroPreview,
    countdown: EventPreview,
    progress: ProgressPreview,
    "day-progress": DayProgressPreview,
    "habit-tracker": HabitTrackerPreview,
    "focus-card": FocusCardPreview,
    quote: QuotePreview,
    greeting: GreetingPreview,
    "quick-links": QuickLinksPreview,
    notes: NotesPreview,
    counter: CounterPreview,
};

function getPreviewKind(widget) {
    return widget.previewConfig?.kind || widget.type;
}

function getPreviewConfig(widget) {
    const common = {
        aspectRatio: "16 / 10",
        padding: 5,
        width: 420,
        height: 248,
        scale: 1,
    };
    return { ...common, ...(widget.previewConfig || {}) };
}

export default function WidgetPreview({ widget }) {
    const { appliedTheme } = useThemeMode();
    const previewMode = getOppositeWidgetMode(appliedTheme);
    const accent = getAccent(widget.defaults?.accent);
    const useEmbedLightBackground = previewMode === "light";
    const themeVars = getWidgetThemeVars(previewMode, {
        appTheme: appliedTheme,
        customBackground: useEmbedLightBackground,
        backgroundColor: useEmbedLightBackground ? "#FFFFFF" : "#F7F7F5",
    });
    const config = getPreviewConfig(widget);
    const PreviewComponent =
        previewComponents[getPreviewKind(widget)] || GenericPreview;

    return (
        <WidgetPreviewFrame
            aspectRatio={config.aspectRatio}
            padding={config.padding}
            width={config.width}
            height={config.height}
            scale={config.scale}
            sceneStyle={{
                ...themeVars,
                background: "var(--widget-background)",
                borderColor: "var(--widget-border)",
                boxShadow: "var(--widget-inner-shadow)",
            }}>
            <PreviewComponent
                themeVars={themeVars}
                accent={accent}
                widget={widget}
                label={widget.title}
            />
        </WidgetPreviewFrame>
    );
}
