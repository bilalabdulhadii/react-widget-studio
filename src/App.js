import { useEffect } from "react";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useLocation,
    useParams,
} from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import {
    createWidgetPath,
    getWidgetByLegacyRoute,
    getWidgetBySlug,
} from "./data/widgets";
import { ThemeProvider } from "./hooks/useThemeMode";
import EditorPage from "./pages/EditorPage";
import EmbedPage from "./pages/EmbedPage";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import WidgetsPage from "./pages/WidgetsPage";
import { buildAbsoluteUrl } from "./utils/siteUrl";

function LegacyEditorRedirect() {
    const { type = "", style = "" } = useParams();
    const widget = getWidgetByLegacyRoute(type, style);

    return (
        <Navigate to={widget ? createWidgetPath(widget) : "/widgets"} replace />
    );
}

function LegacyProductRedirect() {
    const { type = "", style = "" } = useParams();
    const widget = getWidgetByLegacyRoute(type, style);

    if (!widget) {
        return <Navigate to="/" replace />;
    }

    return <Navigate to={createWidgetPath(widget)} replace />;
}

function RouteEffects() {
    const location = useLocation();

    const updateMeta = (selector, content, attribute = "content") => {
        const element = document.querySelector(selector);
        if (element && content) {
            element.setAttribute(attribute, content);
        }
    };

    const updateLink = (rel, href) => {
        let element = document.querySelector(`link[rel="${rel}"]`);
        if (!element) {
            element = document.createElement("link");
            element.setAttribute("rel", rel);
            document.head.appendChild(element);
        }
        element.setAttribute("href", href);
    };

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [location.pathname]);

    useEffect(() => {
        const segments = location.pathname.split("/").filter(Boolean);
        let title = "Widget Studio";
        let description =
            "Widget Studio helps you build embeddable widgets for Notion, websites, dashboards, custom apps, and any platform that supports iframe embeds.";
        let robots =
            "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
        let canonicalPath = location.pathname;
        const widget =
            segments[0] === "widgets" && segments[1]
                ? getWidgetBySlug(segments[1])
                : null;
        const embedWidget =
            segments[0] === "embed" && segments[1]
                ? getWidgetBySlug(segments[1])
                : null;

        if (location.pathname === "/") {
            title = "Widget Studio — Build Beautiful Widgets Anywhere";
            description =
                "Create beautiful, customizable widgets and embed them anywhere — in Notion, websites, dashboards, and your own apps.";
        } else if (location.pathname === "/about") {
            title = "About Widget Studio";
            description =
                "Learn what Widget Studio is, where widgets can be used, and how to create embed-ready widgets for Notion, websites, dashboards, and custom apps.";
        } else if (location.pathname === "/widgets") {
            title = "Widgets — Widget Studio";
            description =
                "Browse audio, clock, productivity, and utility widgets you can use in Notion, websites, dashboards, and custom apps.";
        } else if (widget) {
            title = `${widget.title} — Widget Studio`;
            description = `${widget.description} Customize ${widget.title} and export it as an embed for Notion, websites, dashboards, and custom apps.`;
        } else if (embedWidget) {
            title = `${embedWidget.title} Embed — Widget Studio`;
            description = `Live embed output for the ${embedWidget.title} widget from Widget Studio.`;
            robots = "noindex,nofollow,noarchive";
            canonicalPath = createWidgetPath(embedWidget);
        }

        const canonicalUrl = buildAbsoluteUrl(canonicalPath);

        document.title = title;
        updateMeta('meta[name="description"]', description);
        updateMeta('meta[property="og:title"]', title);
        updateMeta('meta[property="og:description"]', description);
        updateMeta('meta[property="og:url"]', canonicalUrl);
        updateMeta('meta[name="twitter:title"]', title);
        updateMeta('meta[name="twitter:description"]', description);
        updateMeta('meta[name="robots"]', robots);
        updateLink("canonical", canonicalUrl);
    }, [location.pathname]);

    return null;
}

function AppRoutes() {
    const location = useLocation();
    const isEmbed = location.pathname.startsWith("/embed/");

    if (isEmbed) {
        return (
            <>
                <RouteEffects />
                <Routes>
                    <Route path="/embed/:slug" element={<EmbedPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <RouteEffects />
            <Header />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/widgets" element={<WidgetsPage />} />
                    <Route path="/widgets/:slug" element={<EditorPage />} />
                    <Route
                        path="/editor/:type"
                        element={<LegacyEditorRedirect />}
                    />
                    <Route
                        path="/editor/:type/:style"
                        element={<LegacyEditorRedirect />}
                    />
                    <Route path="/embed/:slug" element={<EmbedPage />} />
                    <Route
                        path="/:type/:style"
                        element={<LegacyProductRedirect />}
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}>
                <AppRoutes />
            </BrowserRouter>
        </ThemeProvider>
    );
}
