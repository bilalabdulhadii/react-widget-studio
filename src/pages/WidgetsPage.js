import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import WidgetCard from "../components/WidgetCard";
import { categories, createEditorPath, widgetCards } from "../data/widgets";

function SkeletonGrid() {
    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
                <div
                    key={index}
                    className="rounded-3xl border p-4"
                    style={{
                        borderColor: "var(--app-border)",
                        background: "var(--app-overlay)",
                    }}>
                    <div className="skeleton h-40" />
                    <div className="mt-5 h-4 w-2/3 skeleton" />
                    <div className="mt-3 h-3 w-full skeleton" />
                    <div className="mt-2 h-3 w-4/5 skeleton" />
                </div>
            ))}
        </div>
    );
}

function FilterChip({ active, children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`chip ${active ? "chip-active" : ""}`}>
            {children}
        </button>
    );
}

export default function WidgetsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(true);

    const selectedCategory = searchParams.get("category") || "";
    useEffect(() => {
        const timer = window.setTimeout(() => setLoading(false), 240);
        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        const nextParams = new URLSearchParams(searchParams);

        if (search.trim()) {
            nextParams.set("q", search.trim());
        } else {
            nextParams.delete("q");
        }

        setSearchParams(nextParams, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const filteredWidgets = useMemo(() => {
        const query = search.trim().toLowerCase();

        return widgetCards.filter((widget) => {
            const matchesQuery =
                !query ||
                [
                    widget.title,
                    widget.oldTitle,
                    widget.description,
                    widget.category,
                    widget.group,
                    ...(widget.aliases || []),
                    ...(widget.keywords || []),
                ]
                    .filter(Boolean)
                    .some((value) => value.toLowerCase().includes(query));
            const matchesCategory =
                !selectedCategory || selectedCategory === widget.category;
            return matchesQuery && matchesCategory;
        });
    }, [search, selectedCategory]);

    const suggestions = useMemo(() => {
        if (!search.trim()) {
            return [];
        }

        const query = search.trim().toLowerCase();

        return widgetCards
            .filter((widget) =>
                [
                    widget.title,
                    widget.oldTitle,
                    ...(widget.aliases || []),
                    ...(widget.keywords || []),
                ]
                    .filter(Boolean)
                    .some((value) => value.toLowerCase().includes(query)),
            )
            .slice(0, 5);
    }, [search]);

    const toggleFilter = (value) => {
        const nextParams = new URLSearchParams(searchParams);
        if (selectedCategory === value) {
            nextParams.delete("category");
        } else {
            nextParams.set("category", value);
        }
        setSearchParams(nextParams);
    };

    const clearFilters = () => {
        const nextParams = new URLSearchParams();

        if (search.trim()) {
            nextParams.set("q", search.trim());
        }

        setSearchParams(nextParams);
    };

    const hasFilters = Boolean(selectedCategory);

    return (
        <div className="mx-auto min-h-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <span
                        className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
                        style={{
                            borderColor: "var(--app-border)",
                            background: "var(--app-panel)",
                            color: "var(--app-muted)",
                            boxShadow: "var(--app-shadow)",
                        }}>
                        <SlidersHorizontal size={16} />
                        Widget marketplace
                    </span>
                    <h1 className="app-text-main mt-5 text-4xl font-semibold sm:text-5xl">
                        Explore Widgets
                    </h1>
                    <p className="app-text-muted mt-4 max-w-2xl text-base leading-7">
                        Search and browse widgets you can use in Notion, docs,
                        dashboards, and websites.
                    </p>
                </div>
                <div className="app-text-muted text-sm font-medium">
                    {filteredWidgets.length} widgets
                </div>
            </div>

            <div className="glass-panel mb-8 rounded-[2rem] p-4 sm:p-5">
                <div className="relative">
                    <Search
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                        style={{ color: "var(--app-muted)" }}
                        size={19}
                    />
                    <input
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Search audio, clocks, progress, notes..."
                        className="control-input pl-12"
                    />
                    {search && (
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full transition"
                            style={{ color: "var(--app-muted)" }}
                            onClick={() => setSearch("")}
                            aria-label="Clear search">
                            <X size={16} />
                        </button>
                    )}
                    {showSuggestions && suggestions.length > 0 && (
                        <div
                            className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border"
                            style={{
                                borderColor: "var(--app-border)",
                                background: "var(--app-surface)",
                                boxShadow: "var(--app-shadow)",
                            }}>
                            {suggestions.map((widget) => (
                                <Link
                                    key={widget.id}
                                    to={createEditorPath(widget)}
                                    className="flex items-center justify-between gap-4 px-4 py-3 text-sm transition hover:bg-[color:var(--app-panel)]"
                                    onClick={() => setShowSuggestions(false)}>
                                    <span className="app-text-main font-medium">
                                        {widget.title}
                                    </span>
                                    <span className="app-text-muted">
                                        {widget.category}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-5 space-y-4">
                    <div>
                        <p className="app-text-muted mb-3 text-xs font-semibold uppercase">
                            Category
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <FilterChip
                                    key={category}
                                    active={selectedCategory === category}
                                    onClick={() => toggleFilter(category)}>
                                    {category}
                                </FilterChip>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-end">
                        {hasFilters ? (
                            <button
                                type="button"
                                className="app-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition"
                                onClick={clearFilters}>
                                Clear filters
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>

            {loading ? (
                <SkeletonGrid />
            ) : filteredWidgets.length ? (
                <motion.div
                    layout
                    className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredWidgets.map((widget, index) => (
                        <WidgetCard
                            key={widget.id}
                            widget={widget}
                            index={index}
                        />
                    ))}
                </motion.div>
            ) : (
                <div
                    className="rounded-[2rem] border p-10 text-center"
                    style={{
                        borderColor: "var(--app-border)",
                        background: "var(--app-overlay)",
                        boxShadow: "var(--app-shadow)",
                    }}>
                    <p className="app-text-main text-lg font-semibold">
                        No widgets found
                    </p>
                    <p className="app-text-muted mt-2 text-sm">
                        Adjust the search or filters and try again.
                    </p>
                </div>
            )}
        </div>
    );
}
