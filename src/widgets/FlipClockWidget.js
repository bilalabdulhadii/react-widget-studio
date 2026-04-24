import {
    clock as createClock,
    flipClock as createFlipClock,
    theme as createTheme,
} from "flipclock";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { getFlipCardVars, getFlipClockLabels } from "./flipCardTheme";
import "./flipclock.css";

function getClockFormat({ hour12, showSeconds }) {
    const hours = hour12 ? "hh" : "HH";
    return showSeconds ? `[${hours}]:[mm]:[ss]` : `[${hours}]:[mm]`;
}

const FlipClockWidget = memo(function FlipClockWidget({
    mode,
    showSeconds,
    hour12,
    showUnitLabels = false,
    scale = 1,
}) {
    const hostRef = useRef(null);
    const instanceRef = useRef(null);
    const [period, setPeriod] = useState(() =>
        new Date().getHours() >= 12 ? "PM" : "AM",
    );
    const format = useMemo(
        () => getClockFormat({ hour12, showSeconds }),
        [hour12, showSeconds],
    );
    const labels = useMemo(
        () => (showUnitLabels ? getFlipClockLabels(showSeconds) : []),
        [showSeconds, showUnitLabels],
    );
    const rootStyle = useMemo(() => getFlipCardVars(scale), [scale]);

    useEffect(() => {
        if (!hour12) {
            return undefined;
        }

        const syncPeriod = () =>
            setPeriod(new Date().getHours() >= 12 ? "PM" : "AM");
        syncPeriod();
        const timer = window.setInterval(syncPeriod, 1000);
        return () => window.clearInterval(timer);
    }, [hour12]);

    useEffect(() => {
        const host = hostRef.current;

        if (!host) {
            return undefined;
        }

        host.innerHTML = "";
        const instance = createFlipClock({
            autoStart: true,
            parent: host,
            timer: 1000,
            face: createClock({ format }),
            theme: createTheme({ dividers: ":" }),
        });

        instanceRef.current = instance;

        return () => {
            instance.stop();
            instance.unmount();
            instanceRef.current = null;
            host.innerHTML = "";
        };
    }, [format]);

    return (
        <div
            className={`pattern-flip-clock ${showUnitLabels ? "pattern-flip-clock--with-labels" : ""}`}
            style={rootStyle}
            data-mode={mode}>
            <div className="pattern-flip-clock__layout">
                <div ref={hostRef} className="pattern-flip-clock__host" />
                {hour12 ? (
                    <div className="pattern-flip-period-group">
                        <div
                            className="pattern-flip-period"
                            aria-label={`Clock period ${period}`}>
                            <span className="pattern-flip-period__value">
                                {period}
                            </span>
                        </div>
                    </div>
                ) : null}
                {labels.length ? (
                    <div
                        className="pattern-flip-clock__labels"
                        style={{
                            gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))`,
                        }}>
                        {labels.map((label) => (
                            <span
                                key={label}
                                className="pattern-flip-clock__label">
                                {label}
                            </span>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
});

export default FlipClockWidget;
