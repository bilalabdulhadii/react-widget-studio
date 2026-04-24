import { motion } from "framer-motion";
import { Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { createEditorPath, getWidgetType } from "../data/widgets";
import PriceBadge from "./PriceBadge";
import WidgetPreview from "./WidgetPreview";

export default function WidgetCard({ widget, index = 0 }) {
    const config = getWidgetType(widget.type);
    const Icon = config?.icon || Palette;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
                duration: 0.45,
                delay: Math.min(index * 0.025, 0.18),
                ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -8, scale: 1.015 }}
            className="h-full">
            <Link
                to={createEditorPath(widget)}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border backdrop-blur-xl transition duration-300 hover:-translate-y-0.5"
                style={{
                    borderColor: "var(--app-border)",
                    background: "var(--app-overlay)",
                    boxShadow: "var(--app-shadow)",
                }}>
                <div
                    className="border-b p-2.5"
                    style={{ borderColor: "var(--app-border)" }}>
                    <WidgetPreview widget={widget} />
                </div>
                <div className="flex flex-1 flex-col p-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                        <span
                            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                            style={{
                                background: "var(--app-panel-strong)",
                                color: "var(--app-muted)",
                            }}>
                            <Icon size={14} />
                            {widget.category}
                        </span>
                        <PriceBadge compact label={widget.priceLabel} />
                    </div>
                    <h3 className="text-lg font-semibold app-text-main">
                        {widget.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-6 app-text-muted">
                        {widget.description}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}
