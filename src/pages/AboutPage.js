import { motion } from "framer-motion";
import {
    AppWindow,
    ArrowRight,
    BookOpen,
    Globe2,
    LayoutDashboard,
    Link2,
    MoonStar,
    Palette,
    Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const useCases = [
    {
        icon: BookOpen,
        title: "Notion dashboards",
        description: "Embed widgets directly into your Notion pages",
    },
    {
        icon: Globe2,
        title: "Websites",
        description: "Enhance your site with custom widgets",
    },
    {
        icon: AppWindow,
        title: "Custom apps",
        description: "Integrate widgets into your own projects",
    },
    {
        icon: LayoutDashboard,
        title: "Dashboards & tools",
        description: "Perfect for productivity setups and internal tools",
    },
];

const steps = [
    "Choose a widget",
    "Customize it",
    "Copy the embed link",
    "Paste it anywhere",
];

const philosophy = [
    {
        icon: Palette,
        title: "Clean and minimal design",
    },
    {
        icon: Sparkles,
        title: "Consistent theme system",
    },
    {
        icon: MoonStar,
        title: "Light / dark / custom background support",
    },
    {
        icon: Link2,
        title: "Embed-ready workflow",
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-full">
            <section className="relative overflow-hidden">
                <div className="aurora-surface absolute inset-0 -z-10" />
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.55,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="rounded-[2.25rem] border p-8 sm:p-10 lg:p-12"
                        style={{
                            borderColor: "var(--app-border)",
                            background: "var(--app-overlay)",
                            boxShadow: "var(--app-shadow)",
                        }}>
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                            <div
                                className="flex w-fit shrink-0 items-center justify-center rounded-[2rem] border p-6 sm:p-7"
                                style={{
                                    borderColor: "var(--app-border)",
                                    background: "var(--app-panel)",
                                    boxShadow: "var(--app-shadow)",
                                }}>
                                <img
                                    src="/logo.png"
                                    alt="Widget Studio logo"
                                    className="h-28 w-28 object-contain sm:h-32 sm:w-32"
                                />
                            </div>

                            <div className="max-w-4xl">
                                <span
                                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
                                    style={{
                                        borderColor: "var(--app-border)",
                                        background: "var(--app-panel)",
                                        color: "var(--app-muted)",
                                    }}>
                                    <Link2 size={16} />
                                    About Widget Studio
                                </span>
                                <h1 className="app-text-main mt-7 max-w-4xl text-5xl font-semibold leading-[1.04] sm:text-6xl">
                                    About Widget Studio
                                </h1>
                                <p className="app-text-muted mt-6 max-w-3xl text-lg leading-8">
                                    Build and embed beautiful widgets anywhere —
                                    from Notion to your own apps.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.5 }}
                        className="glass-panel rounded-[2rem] p-8">
                        <p className="app-text-muted text-sm font-semibold uppercase">
                            What is Widget Studio
                        </p>
                        <p className="app-text-main mt-4 text-2xl font-semibold leading-tight">
                            A modern widget platform built for clean embeds and
                            fast customization.
                        </p>
                        <p className="app-text-muted mt-5 max-w-3xl text-base leading-8">
                            Widget Studio is a modern widget platform designed
                            to help you create clean, customizable, and
                            embeddable widgets. Whether you&apos;re building a
                            Notion dashboard, a personal website, or a custom
                            interface, Widget Studio gives you flexible tools to
                            enhance your experience.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.5, delay: 0.08 }}
                        className="rounded-[2rem] border p-8"
                        style={{
                            borderColor: "var(--app-border)",
                            background: "var(--app-primary)",
                            color: "var(--app-surface)",
                            boxShadow: "var(--app-shadow)",
                        }}>
                        <p
                            className="text-sm font-semibold uppercase"
                            style={{
                                color: "color-mix(in srgb, var(--app-surface) 76%, transparent)",
                            }}>
                            Platform note
                        </p>
                        <p className="mt-4 text-2xl font-semibold leading-tight">
                            Embed-ready by default
                        </p>
                        <p
                            className="mt-5 text-sm leading-7"
                            style={{
                                color: "color-mix(in srgb, var(--app-surface) 82%, transparent)",
                            }}>
                            Any platform that supports iframe embeds can use
                            Widget Studio widgets.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <p className="app-text-muted text-sm font-semibold uppercase">
                        Use it anywhere
                    </p>
                    <h2 className="app-text-main mt-2 text-3xl font-semibold">
                        One widget system, many surfaces
                    </h2>
                    <p className="app-text-muted mt-4 max-w-3xl text-base leading-7">
                        Widget Studio widgets are built for the places where
                        embeds actually matter: pages, products, dashboards, and
                        internal tools.
                    </p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {useCases.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ delay: index * 0.07, duration: 0.45 }}
                            className="rounded-[2rem] border p-6"
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
                                <item.icon size={20} />
                            </span>
                            <h3 className="app-text-main mt-5 text-lg font-semibold">
                                {item.title}
                            </h3>
                            <p className="app-text-muted mt-3 text-sm leading-6">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
                <p className="app-text-muted mt-6 text-sm leading-7">
                    Any platform that supports iframe embeds can use Widget
                    Studio widgets.
                </p>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.5 }}
                        className="glass-panel rounded-[2rem] p-8">
                        <p className="app-text-muted text-sm font-semibold uppercase">
                            How it works
                        </p>
                        <div className="mt-6 space-y-4">
                            {steps.map((step, index) => (
                                <div
                                    key={step}
                                    className="flex items-center gap-4 rounded-[1.5rem] border px-5 py-4"
                                    style={{
                                        borderColor: "var(--app-border)",
                                        background: "var(--app-panel)",
                                    }}>
                                    <span
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                                        style={{
                                            background: "var(--app-primary)",
                                            color: "var(--app-surface)",
                                        }}>
                                        {index + 1}
                                    </span>
                                    <p className="app-text-main text-base font-semibold">
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.5, delay: 0.08 }}
                        className="glass-panel rounded-[2rem] p-8">
                        <p className="app-text-muted text-sm font-semibold uppercase">
                            Design philosophy
                        </p>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {philosophy.map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-[1.5rem] border p-5"
                                    style={{
                                        borderColor: "var(--app-border)",
                                        background: "var(--app-panel)",
                                    }}>
                                    <span
                                        className="flex h-11 w-11 items-center justify-center rounded-2xl"
                                        style={{
                                            background:
                                                "var(--app-panel-strong)",
                                            color: "var(--app-primary)",
                                        }}>
                                        <item.icon size={19} />
                                    </span>
                                    <p className="app-text-main mt-4 text-sm font-semibold leading-6">
                                        {item.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5 }}
                    className="rounded-[2rem] border p-8 sm:p-10"
                    style={{
                        borderColor: "var(--app-border)",
                        background: "var(--app-primary)",
                        color: "var(--app-surface)",
                        boxShadow: "var(--app-shadow)",
                    }}>
                    <p
                        className="text-sm font-semibold uppercase"
                        style={{
                            color: "color-mix(in srgb, var(--app-surface) 76%, transparent)",
                        }}>
                        Ready to build
                    </p>
                    <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-3xl font-semibold">
                                Start building your widgets
                            </h2>
                            <p
                                className="mt-3 max-w-2xl text-sm leading-7"
                                style={{
                                    color: "color-mix(in srgb, var(--app-surface) 82%, transparent)",
                                }}>
                                Choose a widget, customize it, and export an
                                embed that works anywhere iframe embeds are
                                supported.
                            </p>
                        </div>
                        <Link
                            to="/widgets"
                            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                            style={{
                                background: "var(--app-surface)",
                                color: "var(--app-primary)",
                            }}>
                            Start building your widgets
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
