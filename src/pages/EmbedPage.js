import { useEffect, useMemo } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import {
    createEmbedPath,
    getWidgetByLegacyRoute,
    getWidgetBySlug,
} from "../data/widgets";
import { normalizeParams, paramsToObject } from "../utils/query";
import WidgetRenderer from "../widgets/WidgetRenderer";

export default function EmbedPage() {
    const { slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const widget = getWidgetBySlug(slug);
    const legacyWidget = widget
        ? null
        : getWidgetByLegacyRoute(slug, searchParams.get("style") || "");

    useEffect(() => {
        document.body.classList.add("embed-route");

        return () => document.body.classList.remove("embed-route");
    }, []);

    useEffect(() => {
        if (!widget) {
            return;
        }

        const normalized = normalizeParams(searchParams, widget.slug);

        if (normalized.changed) {
            setSearchParams(normalized.params, { replace: true });
        }
    }, [searchParams, setSearchParams, widget]);

    const params = useMemo(
        () => (widget ? paramsToObject(searchParams, widget.slug) : {}),
        [searchParams, widget],
    );

    if (!widget && legacyWidget) {
        return (
            <Navigate
                to={createEmbedPath(legacyWidget, searchParams)}
                replace
            />
        );
    }

    if (!widget) {
        return null;
    }

    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-transparent p-0">
            <WidgetRenderer type={widget.type} params={params} embed />
        </main>
    );
}
