import { useEffect, useMemo, useRef, useState } from "react";

export default function WidgetPreviewFrame({
    aspectRatio = "16 / 9",
    padding = 10,
    width = 420,
    height = 240,
    scale = 1,
    maxWidth,
    maxHeight,
    sceneStyle,
    children,
}) {
    const stageRef = useRef(null);
    const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const element = stageRef.current;

        if (!element) {
            return undefined;
        }

        const measure = () => {
            const nextWidth = element.clientWidth || 0;
            const nextHeight = element.clientHeight || 0;

            setStageSize((current) =>
                current.width === nextWidth && current.height === nextHeight
                    ? current
                    : { width: nextWidth, height: nextHeight },
            );
        };

        measure();

        if (typeof ResizeObserver !== "undefined") {
            const observer = new ResizeObserver(measure);
            observer.observe(element);
            return () => observer.disconnect();
        }

        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    const frameWidth = maxWidth ? Math.min(width, maxWidth) : width;
    const frameHeight = maxHeight ? Math.min(height, maxHeight) : height;
    const availableWidth = Math.max(0, stageSize.width - padding * 2);
    const availableHeight = Math.max(0, stageSize.height - padding * 2);

    const fittedScale = useMemo(() => {
        if (!availableWidth || !availableHeight) {
            return Math.max(0.2, scale);
        }

        return Math.min(
            1,
            Math.min(
                availableWidth / frameWidth,
                availableHeight / frameHeight,
            ) * scale,
        );
    }, [availableHeight, availableWidth, frameHeight, frameWidth, scale]);

    return (
        <div
            ref={stageRef}
            className="relative w-full overflow-hidden rounded-[1.2rem] border"
            style={{
                aspectRatio,
                background: "var(--app-panel)",
                borderColor: "var(--app-border)",
            }}>
            <div
                className="pointer-events-none absolute rounded-[1.05rem] border"
                style={{
                    inset: `${padding}px`,
                    ...sceneStyle,
                }}
            />
            <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ padding: `${padding}px` }}>
                <div
                    className="pointer-events-none"
                    style={{
                        width: `${frameWidth * fittedScale}px`,
                        height: `${frameHeight * fittedScale}px`,
                    }}>
                    <div
                        className="origin-top-left"
                        style={{
                            width: `${frameWidth}px`,
                            height: `${frameHeight}px`,
                            transform: `scale(${fittedScale})`,
                            transformOrigin: "top left",
                        }}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
