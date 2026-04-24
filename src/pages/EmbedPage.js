import { useEffect, useMemo } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import {
    createEmbedPath,
    getWidgetByLegacyRoute,
    getWidgetBySlug,
} from "../data/widgets";
import { normalizeParams, paramsToObject } from "../utils/query";
import WidgetRenderer from "../widgets/WidgetRenderer";
import {
    getWidgetPageBackground,
    resolveWidgetTheme,
    toWidgetBoolean,
} from "../widgets/widgetTheme";

export default function EmbedPage() {
    const { slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const widget = getWidgetBySlug(slug);
    const legacyWidget = widget
        ? null
        : getWidgetByLegacyRoute(slug, searchParams.get("style") || "");

    useEffect(() => {
        document.documentElement.classList.add("embed-route");
        document.body.classList.add("embed-route");
        const root = document.getElementById("root");
        root?.classList.add("embed-route");

        return () => {
            document.documentElement.classList.remove("embed-route");
            document.body.classList.remove("embed-route");
            root?.classList.remove("embed-route");
        };
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
    const embedAppearance = resolveWidgetTheme(params.mode, "light");
    const customBackgroundEnabled = toWidgetBoolean(
        params.customBackground,
        false,
    );
    const pageBackground =
        embedAppearance === "light" && !customBackgroundEnabled
            ? "#FFFFFF"
            : getWidgetPageBackground(params.mode, {
        customBackground: params.customBackground,
        backgroundColor: params.backgroundColor,
              });

    useEffect(() => {
        if (!widget) {
            return;
        }

        document.documentElement.classList.add(`embed-${embedAppearance}`);
        document.body.classList.add(`embed-${embedAppearance}`);
        const root = document.getElementById("root");
        root?.classList.add(`embed-${embedAppearance}`);

        if (customBackgroundEnabled) {
            document.documentElement.classList.add("embed-custom-background");
            document.body.classList.add("embed-custom-background");
            root?.classList.add("embed-custom-background");
        }

        [document.documentElement, document.body, root]
            .filter(Boolean)
            .forEach((node) => {
                node.style.background = pageBackground;
                node.style.backgroundColor = pageBackground;
                node.style.backgroundImage = "none";
            });

        return () => {
            document.documentElement.classList.remove(`embed-${embedAppearance}`);
            document.body.classList.remove(`embed-${embedAppearance}`);
            root?.classList.remove(`embed-${embedAppearance}`);
            document.documentElement.classList.remove("embed-custom-background");
            document.body.classList.remove("embed-custom-background");
            root?.classList.remove("embed-custom-background");
            [document.documentElement, document.body, root]
                .filter(Boolean)
                .forEach((node) => {
                    node.style.removeProperty("background");
                    node.style.removeProperty("background-color");
                    node.style.removeProperty("background-image");
                });
        };
    }, [customBackgroundEnabled, embedAppearance, pageBackground, widget]);

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
        <main
            className="embed-page-root flex min-h-screen w-full items-center justify-center p-0"
            style={{
                background: pageBackground,
                backgroundColor: pageBackground,
                backgroundImage: "none",
            }}>
            <WidgetRenderer type={widget.type} params={params} embed />
        </main>
    );
}
