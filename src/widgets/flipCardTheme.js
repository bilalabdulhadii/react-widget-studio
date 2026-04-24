export function getFlipCardVars(scale = 1) {
    return {
        "--pattern-flip-font-size": `clamp(${(2.05 * scale).toFixed(2)}rem, ${(5.9 * scale).toFixed(2)}vw, ${(4.1 * scale).toFixed(2)}rem)`,
        "--pattern-flip-gap": `${(0.34 * scale).toFixed(2)}rem`,
        "--pattern-flip-divider-gap": `${(0.48 * scale).toFixed(2)}rem`,
    };
}

export function getFlipClockLabels(showSeconds) {
    return showSeconds ? ["Hours", "Minutes", "Seconds"] : ["Hours", "Minutes"];
}

export function getEventFlipScale(unitCount) {
    if (unitCount >= 6) return 0.62;
    if (unitCount >= 5) return 0.7;
    if (unitCount >= 4) return 0.8;
    return 0.9;
}
