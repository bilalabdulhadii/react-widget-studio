import { motion } from "framer-motion";
import {
    AppWindow,
    ArrowRight,
    BookOpen,
    Globe2,
    Layers3,
    LayoutDashboard,
    Link2,
    Sparkles,
    Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import WidgetCard from "../components/WidgetCard";
import { featuredWidgets, marketplaceCategories } from "../data/widgets";
import { useThemeMode } from "../hooks/useThemeMode";
import WidgetRenderer from "../widgets/WidgetRenderer";
import { getOppositeWidgetMode } from "../widgets/widgetTheme";

const features = [
    {
        icon: Link2,
        title: "Universal embeds",
        description:
            "Copy a link or iframe snippet and place widgets wherever embeds are supported.",
    },
    {
        icon: Layers3,
        title: "Polished presets",
        description:
            "Start from audio, clocks, productivity blocks, notes, counters, and link hubs.",
    },
    {
        icon: Zap,
        title: "Instant preview",
        description:
            "Every control updates the preview and export options as soon as it changes.",
    },
];

const worksEverywhereItems = [
    {
        icon: BookOpen,
        title: "Notion",
        description: "Drop widgets into pages, dashboards, and workspace hubs.",
    },
    {
        icon: Globe2,
        title: "Websites",
        description:
            "Add embeddable widgets to landing pages and content sites.",
    },
    {
        icon: LayoutDashboard,
        title: "Dashboards",
        description:
            "Use widgets inside internal tools and productivity workspaces.",
    },
    {
        icon: AppWindow,
        title: "Custom tools",
        description:
            "Place widgets inside your own products wherever iframes are supported.",
    },
];

function FeaturedSlider() {
    const sliderItems = [...featuredWidgets, ...featuredWidgets];

    return (
        <div className="featured-slider-shell">
            <div className="featured-slider-track">
                {sliderItems.map((widget, index) => (
                    <div
                        key={`${widget.id}-${index}`}
                        className="w-[320px] shrink-0">
                        <WidgetCard widget={widget} index={0} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function HeroRail({ widgetMode }) {
    return (
        <div
            className="relative min-h-[560px] w-full overflow-hidden rounded-[2rem] border p-4 backdrop-blur-2xl"
            style={{
                borderColor: "var(--app-border)",
                background: "var(--app-overlay)",
                boxShadow: "var(--app-shadow)",
            }}>
            <motion.div
                className="absolute inset-x-6 top-8 h-px bg-gradient-to-r from-transparent to-transparent"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, transparent, color-mix(in srgb, var(--app-primary) 36%, transparent), transparent)",
                }}
                animate={{ x: [-80, 80, -80], opacity: [0.35, 0.85, 0.35] }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-8 left-6 right-6 h-px bg-gradient-to-r from-transparent to-transparent"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, transparent, color-mix(in srgb, var(--app-primary) 28%, transparent), transparent)",
                }}
                animate={{ x: [80, -80, 80], opacity: [0.25, 0.8, 0.25] }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <div className="relative z-10 grid h-full content-center gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 24, rotateX: 12 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    className="origin-bottom">
                    <WidgetRenderer
                        type="clock"
                        params={{
                            style: "flip",
                            mode: widgetMode,
                            label: "Current time",
                            seconds: "true",
                            accent: "violet",
                        }}
                        preview
                    />
                </motion.div>

                <div className="grid gap-4 sm:grid-cols-[0.92fr_1.08fr]">
                    <motion.div
                        initial={{ opacity: 0, x: -22 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            delay: 0.18,
                            duration: 0.7,
                            ease: [0.22, 1, 0.36, 1],
                        }}>
                        <WidgetRenderer
                            type="progress"
                            params={{
                                mode: widgetMode,
                                title: "Launch polish",
                                value: "78",
                                accent: "emerald",
                            }}
                            preview
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 22 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            delay: 0.28,
                            duration: 0.7,
                            ease: [0.22, 1, 0.36, 1],
                        }}>
                        <WidgetRenderer
                            type="audio"
                            params={{
                                style: "card",
                                mode: widgetMode,
                                title: "Ambient pulse",
                                artist: "",
                                showTime: "false",
                                showVolume: "true",
                                showEqualizer: "true",
                                accent: "sky",
                            }}
                            preview
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default function HomePage() {
    const { appliedTheme } = useThemeMode();
    const widgetMode = getOppositeWidgetMode(appliedTheme);

    return (
        <div className="min-h-full">
            <section className="relative overflow-hidden">
                <div className="aurora-surface absolute inset-0 -z-10" />
                <div className="mx-auto grid min-h-[calc(100vh-116px)] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.65,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="max-w-3xl">
                        <span
                            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur"
                            style={{
                                borderColor: "var(--app-border)",
                                background: "var(--app-panel)",
                                color: "var(--app-muted)",
                                boxShadow: "var(--app-shadow)",
                            }}>
                            <Sparkles size={16} />
                            Embed-ready • Customizable • Instant preview
                        </span>
                        <h1 className="app-text-main mt-7 max-w-4xl text-5xl font-semibold leading-[1.04] sm:text-6xl lg:text-7xl">
                            Build Beautiful Widgets Anywhere
                        </h1>
                        <p className="app-text-muted mt-6 max-w-2xl text-lg leading-8">
                            Create beautiful, customizable widgets and embed
                            them anywhere — in Notion, websites, or your own
                            apps.
                        </p>
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/widgets"
                                className="app-button-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5">
                                Explore Widgets
                                <ArrowRight size={17} />
                            </Link>
                            <Link
                                to="/widgets/mono-player"
                                className="app-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold backdrop-blur transition hover:-translate-y-0.5">
                                Start Creating
                                <Sparkles size={17} />
                            </Link>
                        </div>
                        <div className="mt-10 flex flex-wrap gap-3">
                            {["Audio", "Clock", "Productivity"].map(
                                (item, index) => (
                                    <motion.div
                                        key={item}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.16 + index * 0.08,
                                            duration: 0.45,
                                        }}
                                        className="rounded-2xl border px-4 py-3 text-sm font-semibold backdrop-blur"
                                        style={{
                                            borderColor: "var(--app-border)",
                                            background: "var(--app-panel)",
                                            color: "var(--app-primary)",
                                        }}>
                                        {item}
                                    </motion.div>
                                ),
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.75,
                            delay: 0.08,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="relative mx-auto w-full max-w-2xl">
                        <HeroRail widgetMode={widgetMode} />
                    </motion.div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="app-text-muted text-sm font-semibold uppercase">
                                Works Everywhere
                            </p>
                            <h2 className="app-text-main mt-2 text-3xl font-semibold">
                                Built for any embed surface
                            </h2>
                            <p className="app-text-muted mt-4 max-w-3xl text-base leading-7">
                                Widget Studio widgets are designed to work
                                anywhere you can embed content.
                            </p>
                        </div>
                        <p className="app-text-muted max-w-md text-sm leading-7">
                            Any platform that supports iframe embeds can use
                            Widget Studio widgets.
                        </p>
                    </div>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {worksEverywhereItems.map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{
                                    delay: index * 0.07,
                                    duration: 0.4,
                                }}
                                className="rounded-[1.75rem] border p-5"
                                style={{
                                    borderColor: "var(--app-border)",
                                    background: "var(--app-panel)",
                                    boxShadow: "var(--app-shadow)",
                                }}>
                                <span
                                    className="flex h-11 w-11 items-center justify-center rounded-2xl"
                                    style={{
                                        background: "var(--app-panel-strong)",
                                        color: "var(--app-primary)",
                                    }}>
                                    <item.icon size={18} />
                                </span>
                                <h3 className="app-text-main mt-4 text-base font-semibold">
                                    {item.title}
                                </h3>
                                <p className="app-text-muted mt-2 text-sm leading-6">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="app-text-muted text-sm font-semibold uppercase">
                            Featured Widgets
                        </p>
                        <h2 className="app-text-main mt-2 text-3xl font-semibold">
                            Start with a polished embed
                        </h2>
                    </div>
                    <Link
                        to="/widgets"
                        className="app-text-main inline-flex items-center gap-2 text-sm font-semibold">
                        View all
                        <ArrowRight size={16} />
                    </Link>
                </div>
                <FeaturedSlider />
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
                <div
                    className="rounded-[2rem] border p-8"
                    style={{
                        borderColor: "var(--app-border)",
                        background: "var(--app-primary)",
                        color: "var(--app-surface)",
                        boxShadow: "var(--app-shadow)",
                    }}>
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div
                                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                                style={{
                                    background:
                                        "color-mix(in srgb, var(--app-surface) 12%, transparent)",
                                }}>
                                <Globe2 size={16} />
                                Copy once, embed anywhere
                            </div>
                            <h2 className="mt-5 max-w-2xl text-3xl font-semibold">
                                Export as a public link or a ready-to-paste
                                iframe.
                            </h2>
                        </div>
                        <Link
                            to="/widgets"
                            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                            style={{
                                background: "var(--app-surface)",
                                color: "var(--app-primary)",
                            }}>
                            Open marketplace
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="app-text-muted text-sm font-semibold uppercase">
                                Categories
                            </p>
                            <h2 className="app-text-main mt-2 text-2xl font-semibold">
                                Browse by workflow
                            </h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {marketplaceCategories.map((category) => (
                                <Link
                                    key={category}
                                    to={`/widgets?category=${category}`}
                                    className="chip">
                                    {category}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid gap-5 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ delay: index * 0.08, duration: 0.45 }}
                            className="rounded-[2rem] border p-6 backdrop-blur-xl"
                            style={{
                                borderColor: "var(--app-border)",
                                background: "var(--app-overlay)",
                                boxShadow: "var(--app-shadow)",
                            }}>
                            <span
                                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                                style={{
                                    background: "var(--app-primary)",
                                    color: "var(--app-surface)",
                                }}>
                                <feature.icon size={20} />
                            </span>
                            <h3 className="app-text-main mt-5 text-lg font-semibold">
                                {feature.title}
                            </h3>
                            <p className="app-text-muted mt-3 text-sm leading-6">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
