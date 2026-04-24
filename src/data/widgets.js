import {
    AudioLines,
    BadgeCheck,
    Clock,
    Focus,
    Gauge,
    Link2,
    Quote,
    StickyNote,
    Timer,
    Wrench,
} from "lucide-react";

export const DEFAULT_AUDIO_URL = "/default-audio.mp3";
export const DEFAULT_PRICE_LABEL = "Free · 0$";
export const SITE_URL = "https://widget.bilalabdulhadi.com";

export const categories = ["Audio", "Clock", "Productivity", "Utility"];
export const marketplaceCategories = [...categories];

export const modeOptions = [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
];

export const accentOptions = [
    { id: "sky", label: "Sky", color: "#0ea5e9" },
    { id: "violet", label: "Violet", color: "#8b5cf6" },
    { id: "emerald", label: "Emerald", color: "#10b981" },
    { id: "rose", label: "Rose", color: "#f43f5e" },
    { id: "amber", label: "Amber", color: "#f59e0b" },
    { id: "neutral", label: "Neutral", color: "#52525b" },
];

const commonModes = ["light", "dark"];

const widgetTypeConfigs = {
    audio: {
        type: "audio",
        name: "Audio",
        category: "Audio",
        group: "Audio Player",
        icon: AudioLines,
        supportsModes: commonModes,
        defaults: {
            style: "minimal",
            mode: "light",
            transparent: "false",
            title: "Quiet Mode",
            artist: "Widget Studio",
            url: "",
            showTime: "true",
            showVolume: "true",
            showLoop: "true",
            showEqualizer: "true",
            accent: "sky",
        },
    },
    clock: {
        type: "clock",
        name: "Clock",
        category: "Clock",
        group: "Time",
        icon: Clock,
        supportsModes: commonModes,
        defaults: {
            style: "digital",
            mode: "light",
            transparent: "false",
            label: "Keep going",
            hour12: "false",
            seconds: "true",
            showUnitLabels: "false",
            accent: "violet",
        },
    },
    pomodoro: {
        type: "pomodoro",
        name: "Pomodoro Timer",
        category: "Productivity",
        group: "Timer",
        icon: Timer,
        supportsModes: commonModes,
        defaults: {
            mode: "light",
            transparent: "false",
            title: "Deep Focus Session",
            minutes: "25",
            breakMinutes: "5",
            focusLabel: "Focus",
            breakLabel: "Break",
            accent: "rose",
        },
    },
    countdown: {
        type: "countdown",
        name: "Event Board",
        category: "Productivity",
        group: "Timer",
        icon: Timer,
        supportsModes: commonModes,
        defaults: {
            mode: "light",
            transparent: "false",
            title: "Upcoming Milestone",
            target: "2026-12-31T23:59",
            units: "months,weeks,days,hours,minutes",
            accent: "amber",
        },
    },
    progress: {
        type: "progress",
        name: "Progress Tracker",
        category: "Productivity",
        group: "Tracker",
        icon: Gauge,
        supportsModes: commonModes,
        defaults: {
            mode: "light",
            transparent: "false",
            title: "Project Progress",
            value: "68",
            accent: "emerald",
        },
    },
    "day-progress": {
        type: "day-progress",
        name: "Day Tracker",
        category: "Productivity",
        group: "Tracker",
        icon: Gauge,
        supportsModes: commonModes,
        defaults: {
            mode: "light",
            transparent: "false",
            title: "Weekly Rhythm",
            days: "7",
            dayLabel: "Day",
            accent: "sky",
        },
    },
    "habit-tracker": {
        type: "habit-tracker",
        name: "Habit Board",
        category: "Productivity",
        group: "Tracker",
        icon: BadgeCheck,
        supportsModes: commonModes,
        defaults: {
            mode: "light",
            transparent: "false",
            title: "Daily Habits",
            habitCount: "4",
            habit1: "Read",
            habit2: "Move",
            habit3: "Plan",
            habit4: "Sleep",
            accent: "emerald",
        },
    },
    "focus-card": {
        type: "focus-card",
        name: "Focus Board",
        category: "Productivity",
        group: "Planner",
        icon: Focus,
        supportsModes: commonModes,
        defaults: {
            mode: "light",
            transparent: "false",
            title: "Ship the next milestone",
            subtitle:
                "Keep the most important task visible and finish it first.",
            label: "Today's Focus",
            accent: "violet",
        },
    },
    quote: {
        type: "quote",
        name: "Quote Board",
        category: "Utility",
        group: "Text",
        icon: Quote,
        supportsModes: commonModes,
        defaults: {
            mode: "light",
            transparent: "false",
            quote: "Clarity turns effort into momentum.",
            author: "— Widget Studio",
            accent: "neutral",
        },
    },
    greeting: {
        type: "greeting",
        name: "Greeting Card",
        category: "Utility",
        group: "Text",
        icon: Quote,
        supportsModes: commonModes,
        defaults: {
            mode: "light",
            transparent: "false",
            greeting: "Good day",
            name: "Emma",
            message: "Ready to build something clean today?",
            accent: "sky",
        },
    },
    "quick-links": {
        type: "quick-links",
        name: "Quick Links",
        category: "Utility",
        group: "Links",
        icon: Link2,
        supportsModes: commonModes,
        defaults: {
            mode: "light",
            transparent: "false",
            title: "Quick Links",
            linkCount: "2",
            link1Label: "Portfolio",
            link1Url: `${SITE_URL}/widgets/quick-links`,
            link2Label: "Workspace",
            link2Url: `${SITE_URL}/widgets/quick-links`,
            accent: "sky",
        },
    },
    notes: {
        type: "notes",
        name: "Note Board",
        category: "Utility",
        group: "Notes",
        icon: StickyNote,
        supportsModes: commonModes,
        defaults: {
            mode: "light",
            transparent: "false",
            title: "Pinned Note",
            body: "Keep your next step visible.",
            accent: "amber",
        },
    },
    counter: {
        type: "counter",
        name: "Streak Counter",
        category: "Productivity",
        group: "Counter",
        icon: Wrench,
        supportsModes: commonModes,
        defaults: {
            mode: "light",
            transparent: "false",
            title: "Consistency Streak",
            count: "12",
            suffix: "days",
            accent: "emerald",
        },
    },
};

const rawWidgets = [
    {
        id: "audio-bar",
        slug: "audio-bar",
        title: "Audio Bar",
        oldTitle: "Simple Audio Bar",
        aliases: ["Simple Audio Bar"],
        category: "Audio",
        description: "Minimal horizontal player inspired by clean embed bars.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: false,
        keywords: [
            "audio",
            "bar",
            "player",
            "simple",
            "minimal",
            "notion",
            "embed",
        ],
        previewConfig: {
            kind: "audio-bar",
            aspectRatio: "16 / 10",
            width: 420,
            height: 220,
            padding: 8,
            scale: 1,
        },
        renderConfig: { type: "audio", style: "bar" },
    },
    {
        id: "mono-player",
        slug: "mono-player",
        title: "Mono Player",
        oldTitle: "Minimal Player",
        aliases: ["Minimal Player"],
        category: "Audio",
        description: "Clean monochrome player with optional audio visualizer.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: true,
        keywords: ["audio", "mono", "minimal", "player", "visualizer"],
        previewConfig: {
            kind: "audio-minimal",
            aspectRatio: "16 / 10",
            width: 420,
            height: 248,
            padding: 8,
            scale: 1,
        },
        renderConfig: { type: "audio", style: "minimal" },
    },
    {
        id: "focus-player",
        slug: "focus-player",
        title: "Focus Player",
        oldTitle: "Focus Player",
        aliases: [],
        category: "Audio",
        description: "Large play action with distraction-free metadata.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: false,
        keywords: ["audio", "focus", "player"],
        previewConfig: {
            kind: "audio-focus",
            aspectRatio: "16 / 10",
            width: 420,
            height: 248,
            padding: 8,
            scale: 1.02,
        },
        renderConfig: { type: "audio", style: "focus" },
    },
    {
        id: "studio-player",
        slug: "studio-player",
        title: "Studio Player",
        oldTitle: "Card Player",
        aliases: ["Card Player"],
        category: "Audio",
        description:
            "Rich player with optional audio visualizer and compact metadata.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: false,
        keywords: ["audio", "studio", "card", "player", "visualizer"],
        previewConfig: {
            kind: "audio-card",
            aspectRatio: "16 / 10",
            width: 420,
            height: 248,
            padding: 8,
            scale: 1,
        },
        renderConfig: { type: "audio", style: "card" },
    },
    {
        id: "digital-clock",
        slug: "digital-clock",
        title: "Digital Clock",
        oldTitle: "Digital Clock",
        aliases: [],
        category: "Clock",
        description: "Readable digital clock for dashboards.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: true,
        keywords: ["clock", "digital", "time"],
        previewConfig: {
            kind: "clock-digital",
            aspectRatio: "16 / 10",
            width: 420,
            height: 248,
            padding: 8,
            scale: 1,
        },
        renderConfig: { type: "clock", style: "digital" },
    },
    {
        id: "flip-clock",
        slug: "flip-clock",
        title: "Flip Clock",
        oldTitle: "Flip Clock",
        aliases: [],
        category: "Clock",
        description: "Segmented flip-inspired time blocks.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: true,
        keywords: ["clock", "flip", "time"],
        previewConfig: {
            kind: "clock-flip",
            aspectRatio: "16 / 10",
            width: 430,
            height: 244,
            padding: 8,
            scale: 1,
        },
        renderConfig: { type: "clock", style: "flip" },
    },
    {
        id: "ring-clock",
        slug: "ring-clock",
        title: "Ring Clock",
        oldTitle: "Circular Clock",
        aliases: ["Circular Clock"],
        category: "Clock",
        description: "Clock face with animated progress rings.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: false,
        keywords: ["clock", "ring", "circular", "progress"],
        previewConfig: {
            kind: "clock-circular",
            aspectRatio: "16 / 10",
            width: 420,
            height: 248,
            padding: 8,
            scale: 0.98,
        },
        renderConfig: { type: "clock", style: "circular" },
    },
    {
        id: "split-clock",
        slug: "split-clock",
        title: "Split Clock",
        oldTitle: "Split Clock",
        aliases: [],
        category: "Clock",
        description: "Hours, minutes, and seconds in separate cells.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: false,
        keywords: ["clock", "split", "time"],
        previewConfig: {
            kind: "clock-split",
            aspectRatio: "16 / 10",
            width: 420,
            height: 248,
            padding: 8,
            scale: 1,
        },
        renderConfig: { type: "clock", style: "split" },
    },
    {
        id: "analog-clock",
        slug: "analog-clock",
        title: "Analog Clock",
        oldTitle: "Analog Clock",
        aliases: [],
        category: "Clock",
        description: "Classic clock face with digital support.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: false,
        keywords: ["clock", "analog", "time"],
        previewConfig: {
            kind: "clock-analog",
            aspectRatio: "16 / 10",
            width: 420,
            height: 248,
            padding: 8,
            scale: 1,
        },
        renderConfig: { type: "clock", style: "analog" },
    },
    {
        id: "pomodoro-timer",
        slug: "pomodoro-timer",
        title: "Pomodoro Timer",
        oldTitle: "Pomodoro",
        aliases: ["Pomodoro"],
        category: "Productivity",
        description: "A polished focus timer for work sessions.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: true,
        keywords: ["pomodoro", "timer", "focus", "productivity"],
        previewConfig: {
            kind: "pomodoro",
            aspectRatio: "16 / 10",
            width: 420,
            height: 248,
            padding: 8,
            scale: 1,
        },
        renderConfig: { type: "pomodoro" },
    },
    {
        id: "event-board",
        slug: "event-board",
        title: "Event Board",
        oldTitle: "Event Widget",
        aliases: ["Event Widget", "Countdown"],
        category: "Productivity",
        description:
            "Track launches, deadlines, and milestones in a split event board.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: true,
        keywords: ["event", "countdown", "deadline", "launch", "board"],
        previewConfig: {
            kind: "countdown",
            aspectRatio: "16 / 10",
            width: 420,
            height: 248,
            padding: 8,
            scale: 1,
        },
        renderConfig: { type: "countdown" },
    },
    {
        id: "progress-tracker",
        slug: "progress-tracker",
        title: "Progress Tracker",
        oldTitle: "Progress Bar",
        aliases: ["Progress Bar"],
        category: "Productivity",
        description: "Track any project, course, or personal target.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: true,
        keywords: ["progress", "tracker", "bar", "project"],
        previewConfig: {
            kind: "progress",
            aspectRatio: "16 / 10",
            width: 420,
            height: 248,
            padding: 8,
            scale: 1,
        },
        renderConfig: { type: "progress" },
    },
    {
        id: "day-tracker",
        slug: "day-tracker",
        title: "Day Tracker",
        oldTitle: "Day Progress",
        aliases: ["Day Progress"],
        category: "Productivity",
        description: "A live view of how much of today has passed.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: false,
        keywords: ["day", "tracker", "progress", "time"],
        previewConfig: {
            kind: "day-progress",
            aspectRatio: "16 / 10",
            width: 420,
            height: 248,
            padding: 8,
            scale: 1,
        },
        renderConfig: { type: "day-progress" },
    },
    {
        id: "habit-board",
        slug: "habit-board",
        title: "Habit Board",
        oldTitle: "Habit Tracker",
        aliases: ["Habit Tracker"],
        category: "Productivity",
        description: "Display streaks and weekly habit completion.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: false,
        keywords: ["habit", "tracker", "board", "streak"],
        previewConfig: {
            kind: "habit-tracker",
            aspectRatio: "16 / 10",
            width: 420,
            height: 248,
            padding: 8,
            scale: 1.02,
        },
        renderConfig: { type: "habit-tracker" },
    },
    {
        id: "focus-board",
        slug: "focus-board",
        title: "Focus Board",
        oldTitle: "Focus Card",
        aliases: ["Focus Card"],
        category: "Productivity",
        description: "Keep one priority visible inside a workspace.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: true,
        keywords: ["focus", "board", "card", "priority"],
        previewConfig: {
            kind: "focus-card",
            aspectRatio: "16 / 10",
            width: 420,
            height: 248,
            padding: 8,
            scale: 1,
        },
        renderConfig: { type: "focus-card" },
    },
    {
        id: "quote-board",
        slug: "quote-board",
        title: "Quote Board",
        oldTitle: "Quote Widget",
        aliases: ["Quote Widget"],
        category: "Utility",
        description: "Custom quote block for dashboards and journals.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: false,
        keywords: ["quote", "board", "text"],
        previewConfig: {
            kind: "quote",
            aspectRatio: "16 / 10",
            width: 420,
            height: 248,
            padding: 8,
            scale: 1,
        },
        renderConfig: { type: "quote" },
    },
    {
        id: "greeting-card",
        slug: "greeting-card",
        title: "Greeting Card",
        oldTitle: "Greeting Widget",
        aliases: ["Greeting Widget"],
        category: "Utility",
        description: "Personal greeting that changes with the day.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: true,
        keywords: ["greeting", "card", "welcome"],
        previewConfig: {
            kind: "greeting",
            aspectRatio: "16 / 10",
            width: 420,
            height: 248,
            padding: 8,
            scale: 1,
        },
        renderConfig: { type: "greeting" },
    },
    {
        id: "quick-links",
        slug: "quick-links",
        title: "Quick Links",
        oldTitle: "Quick Links",
        aliases: [],
        category: "Utility",
        description: "Small link hub for resources and tools.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: true,
        keywords: ["quick", "links", "resources"],
        previewConfig: {
            kind: "quick-links",
            aspectRatio: "16 / 10",
            width: 420,
            height: 248,
            padding: 8,
            scale: 1.02,
        },
        renderConfig: { type: "quick-links" },
    },
    {
        id: "note-board",
        slug: "note-board",
        title: "Note Board",
        oldTitle: "Notes",
        aliases: ["Notes"],
        category: "Utility",
        description: "Simple note card with customizable copy.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: false,
        keywords: ["note", "notes", "board", "text"],
        previewConfig: {
            kind: "notes",
            aspectRatio: "16 / 10",
            width: 420,
            height: 248,
            padding: 8,
            scale: 1,
        },
        renderConfig: { type: "notes" },
    },
    {
        id: "streak-counter",
        slug: "streak-counter",
        title: "Streak Counter",
        oldTitle: "Counter",
        aliases: ["Counter"],
        category: "Productivity",
        description: "Display streaks, totals, and visible numbers.",
        priceLabel: DEFAULT_PRICE_LABEL,
        featured: false,
        keywords: ["streak", "counter", "count", "number"],
        previewConfig: {
            kind: "counter",
            aspectRatio: "16 / 10",
            width: 420,
            height: 248,
            padding: 8,
            scale: 1,
        },
        renderConfig: { type: "counter" },
    },
];

function buildWidgetDefaults(widget) {
    const typeConfig = widgetTypeConfigs[widget.renderConfig.type];
    const defaults = {
        ...typeConfig.defaults,
        ...(widget.renderConfig.style
            ? { style: widget.renderConfig.style }
            : {}),
    };

    if (
        widget.renderConfig.type === "audio" &&
        widget.renderConfig.style === "bar"
    ) {
        defaults.title = "";
        defaults.artist = "";
    }

    return defaults;
}

export const widgets = rawWidgets.map((widget) => {
    const typeConfig = widgetTypeConfigs[widget.renderConfig.type];
    const defaults = buildWidgetDefaults(widget);

    return {
        ...widget,
        type: widget.renderConfig.type,
        group: typeConfig.group,
        icon: typeConfig.icon,
        supportsModes: typeConfig.supportsModes,
        defaults,
    };
});

export const widgetCards = widgets;

export const audioStyles = widgets
    .filter((widget) => widget.type === "audio")
    .map((widget) => ({
        id: widget.renderConfig.style,
        slug: widget.slug,
        name: widget.title,
        description: widget.description,
    }));

export const clockStyles = widgets
    .filter((widget) => widget.type === "clock")
    .map((widget) => ({
        id: widget.renderConfig.style,
        slug: widget.slug,
        name: widget.title,
        description: widget.description,
    }));

const featuredSlugs = [
    "mono-player",
    "flip-clock",
    "progress-tracker",
    "focus-board",
    "event-board",
    "quick-links",
];

export const featuredWidgets = featuredSlugs
    .map((slug) => widgets.find((widget) => widget.slug === slug))
    .filter(Boolean);

export const groupOptions = Array.from(
    new Set(widgets.map((widget) => widget.group)),
);

export function getWidgetType(type) {
    return widgetTypeConfigs[type] || null;
}

export function getWidgetBySlug(slug = "") {
    return widgets.find((widget) => widget.slug === slug) || null;
}

export function getWidgetByTypeAndStyle(type, style = "") {
    if (type === "audio" || type === "clock") {
        const resolvedStyle = style || widgetTypeConfigs[type]?.defaults?.style;
        return (
            widgets.find(
                (widget) =>
                    widget.type === type &&
                    widget.renderConfig.style === resolvedStyle,
            ) ||
            widgets.find((widget) => widget.type === type) ||
            null
        );
    }

    return widgets.find((widget) => widget.type === type) || null;
}

export function getWidgetCardMeta(type, style = "") {
    return getWidgetByTypeAndStyle(type, style);
}

export function getWidgetByLegacyRoute(type = "", style = "") {
    return getWidgetByTypeAndStyle(type, style);
}

export function getAccent(accentId = "sky") {
    return (
        accentOptions.find((accent) => accent.id === accentId) ||
        accentOptions[0]
    );
}

export function widgetUsesAccent(type, style = "") {
    if (type === "clock") {
        return ["circular", "analog"].includes(
            style || widgetTypeConfigs.clock.defaults.style,
        );
    }

    return [
        "audio",
        "pomodoro",
        "progress",
        "day-progress",
        "habit-tracker",
        "focus-card",
        "quote",
        "greeting",
        "quick-links",
        "notes",
        "counter",
    ].includes(type);
}

function resolveWidgetReference(widgetOrSlug, fallbackStyle = "") {
    if (!widgetOrSlug) {
        return null;
    }

    if (typeof widgetOrSlug === "string") {
        return (
            getWidgetBySlug(widgetOrSlug) ||
            getWidgetByLegacyRoute(widgetOrSlug, fallbackStyle)
        );
    }

    if (widgetOrSlug.slug) {
        return getWidgetBySlug(widgetOrSlug.slug) || widgetOrSlug;
    }

    if (widgetOrSlug.type) {
        return getWidgetByTypeAndStyle(
            widgetOrSlug.type,
            widgetOrSlug.defaults?.style || fallbackStyle,
        );
    }

    return null;
}

export function createWidgetPath(widgetOrSlug) {
    const widget = resolveWidgetReference(widgetOrSlug);
    return widget ? `/widgets/${widget.slug}` : "/widgets";
}

export function createEditorPath(widgetOrSlug) {
    return createWidgetPath(widgetOrSlug);
}

export function createEmbedPath(widgetOrSlug, params, fallbackStyle = "") {
    const widget = resolveWidgetReference(widgetOrSlug, fallbackStyle);
    const search =
        params instanceof URLSearchParams
            ? params.toString()
            : new URLSearchParams(params).toString();

    return `/embed/${widget?.slug || widgetOrSlug}${search ? `?${search}` : ""}`;
}
