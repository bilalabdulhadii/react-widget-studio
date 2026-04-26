import { motion } from "framer-motion";
import {
    BadgeCheck,
    Check,
    ExternalLink,
    Link2,
    Minus,
    Pause,
    Play,
    Plus,
    Quote,
    Repeat,
    RotateCcw,
    Sparkles,
    StickyNote,
    Volume2,
    VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    DEFAULT_AUDIO_URL,
    audioStyles,
    clockStyles,
    getAccent,
} from "../data/widgets";
import { useThemeMode } from "../hooks/useThemeMode";
import { clampNumber, toBoolean } from "../utils/query";
import FlipClockWidget from "./FlipClockWidget";
import {
    getWidgetThemeVars,
    getWidgetTokens,
    normalizeWidgetMode,
} from "./widgetTheme";

const unitDefs = [
    { id: "years", label: "Years", ms: 365 * 24 * 60 * 60 * 1000 },
    { id: "months", label: "Months", ms: 30 * 24 * 60 * 60 * 1000 },
    { id: "weeks", label: "Weeks", ms: 7 * 24 * 60 * 60 * 1000 },
    { id: "days", label: "Days", ms: 24 * 60 * 60 * 1000 },
    { id: "hours", label: "Hours", ms: 60 * 60 * 1000 },
    { id: "minutes", label: "Minutes", ms: 60 * 1000 },
    { id: "seconds", label: "Seconds", ms: 1000 },
];

const CARD_VISUALIZER_BARS = 56;
const INLINE_VISUALIZER_BARS = 20;

function cleanText(value) {
    return value === undefined || value === null ? "" : String(value);
}

function hasText(value) {
    return cleanText(value).trim().length > 0;
}

function csv(value) {
    return cleanText(value)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

function getWidgetAppearance(params) {
    const mode = normalizeWidgetMode(params.mode);
    return {
        mode,
        customBackground: toBoolean(params.customBackground, false),
        backgroundColor: cleanText(params.backgroundColor).trim(),
        tokens: getWidgetTokens(),
    };
}

function WidgetFrame({
    mode = "system",
    customBackground = false,
    backgroundColor = "",
    accentId,
    embed = false,
    preview = false,
    fill = false,
    children,
    className = "",
    cardClassName = "",
    cardShadow = "var(--widget-shadow)",
}) {
    const { appliedTheme } = useThemeMode();
    const normalizedMode = normalizeWidgetMode(mode);
    const tokens = getWidgetTokens();
    const accent = getAccent(accentId);
    const useEmbedLightBackground =
        normalizedMode === "light" &&
        !customBackground &&
        (embed || fill || preview);
    const effectiveCustomBackground = useEmbedLightBackground
        ? true
        : customBackground;
    const effectiveBackgroundColor = useEmbedLightBackground
        ? "#FFFFFF"
        : backgroundColor;
    const themeVars = getWidgetThemeVars(normalizedMode, {
        appTheme: appliedTheme,
        customBackground: effectiveCustomBackground,
        backgroundColor: effectiveBackgroundColor,
    });

    return (
        <div
            className={[
                "embed-widget-shell relative mx-auto flex h-full w-full flex-col justify-center overflow-hidden transition-all duration-500 p-[30px]",
                embed
                    ? "min-h-screen"
                    : fill
                      ? "min-h-[470px]"
                      : preview
                        ? "h-full min-h-[190px] rounded-[1.4rem]"
                        : "rounded-[2rem]",
                embed || fill
                    ? "max-w-3xl"
                    : preview
                      ? "max-w-none"
                      : "max-w-xl",
                "selection:bg-[Highlight] selection:text-[HighlightText]",
                tokens.outer,
                className,
            ].join(" ")}
            style={{
                ...themeVars,
                "--widget-accent": accent.color,
            }}>
            {fill ? (
                <div
                    className="pointer-events-none absolute inset-0 z-50 border-[3px] border-transparent"
                    style={{
                        background:
                            "conic-gradient(from 0deg, #f43f5e, #f97316, #eab308, #84cc16, #0ea5e9, #6366f1, #d946ef, #f43f5e) border-box",
                        WebkitMask:
                            "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                    }}
                />
            ) : null}
            <div
                className={[
                    "relative flex h-full w-full flex-col justify-center",
                    tokens.text,
                    cardClassName || "p-[20px]",
                ].join(" ")}>
                {children}
            </div>
        </div>
    );
}

function Muted({ mode, children, className = "" }) {
    const tokens = getWidgetTokens(mode);

    if (!hasText(children)) {
        return null;
    }

    return (
        <span className={[tokens.muted, className].join(" ")}>{children}</span>
    );
}

function formatDuration(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const rest = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");
    return `${minutes}:${rest}`;
}

function controlButtonClass(mode) {
    return `inline-flex items-center justify-center rounded-full transition hover:scale-105 ${getWidgetTokens(mode).control}`;
}

function createIdleVisualizerBars(count, minHeight, maxHeight) {
    return Array.from({ length: count }, (_, index) => {
        const wave = (Math.sin(index * 0.58) + 1) / 2;
        const lift = (Math.cos(index * 0.24) + 1) / 2;
        const detail = (Math.sin(index * 1.12) + 1) / 2;
        return Math.round(
            minHeight +
                (maxHeight - minHeight) *
                    (wave * 0.34 + lift * 0.22 + detail * 0.18),
        );
    });
}

function lerp(start, end, amount) {
    return start + (end - start) * amount;
}

function sampleVisualizerBars(dataArray, count, minHeight, maxHeight) {
    if (!dataArray?.length) {
        return createIdleVisualizerBars(count, minHeight, maxHeight);
    }

    const bins = Array.from(dataArray, (value) => value / 255);
    const usable = bins.slice(2, Math.max(8, Math.floor(bins.length * 0.96)));
    const globalRms = Math.sqrt(
        usable.reduce((sum, value) => sum + value * value, 0) / usable.length,
    );
    const bandCount = Math.max(14, Math.round(count / 2.4));

    const bandLevels = Array.from({ length: bandCount }, (_, bandIndex) => {
        const startRatio = Math.pow(bandIndex / bandCount, 1.42);
        const endRatio = Math.pow((bandIndex + 1) / bandCount, 1.42);
        const start = Math.floor(startRatio * usable.length);
        const end = Math.max(start + 1, Math.floor(endRatio * usable.length));
        const slice = usable.slice(start, end);
        const mean =
            slice.reduce((sum, value) => sum + value, 0) / slice.length;
        const peak = Math.max(...slice);
        const rms = Math.sqrt(
            slice.reduce((sum, value) => sum + value * value, 0) / slice.length,
        );
        const bandPosition = bandIndex / Math.max(1, bandCount - 1);
        const gain = 0.94 + Math.pow(bandPosition, 0.58) * 1.18;
        const presence = peak * 0.56 + rms * 0.28 + mean * 0.16;
        return Math.min(
            1,
            presence * gain + globalRms * (0.12 + bandPosition * 0.18),
        );
    });

    const smoothedBands = bandLevels.map((level, index, levels) => {
        const previous = levels[index - 1] ?? level;
        const next = levels[index + 1] ?? level;
        return level * 0.64 + previous * 0.18 + next * 0.18;
    });

    return Array.from({ length: count }, (_, index) => {
        const position =
            (index / Math.max(1, count - 1)) * (smoothedBands.length - 1);
        const leftIndex = Math.floor(position);
        const rightIndex = Math.min(smoothedBands.length - 1, leftIndex + 1);
        const bandLevel = lerp(
            smoothedBands[leftIndex],
            smoothedBands[rightIndex],
            position - leftIndex,
        );
        return Math.round(
            minHeight + (maxHeight - minHeight) * Math.pow(bandLevel, 0.74),
        );
    });
}

function smoothVisualizerBars(nextBars, previousBars) {
    if (!previousBars?.length) {
        return nextBars;
    }

    return nextBars.map((height, index) =>
        Math.round(previousBars[index] * 0.32 + height * 0.68),
    );
}

function AudioVisualizer({ accent, bars, compact = false, className = "" }) {
    const accentSoft = `color-mix(in srgb, ${accent.color} 86%, var(--widget-surface) 14%)`;
    const accentDeep = `color-mix(in srgb, ${accent.color} 93%, var(--widget-primary) 7%)`;

    return (
        <div
            className={[
                "grid w-full items-end",
                compact ? "h-11 gap-[1px]" : "h-7 gap-[1px]",
                className,
            ].join(" ")}
            style={{
                gridTemplateColumns: `repeat(${bars.length}, minmax(0, 1fr))`,
            }}
            aria-hidden="true">
            {bars.map((height, index) => (
                <span
                    key={`${height}-${index}`}
                    className={`block self-end justify-self-center rounded-full ${compact ? "min-h-[4px] w-[1.75px]" : "min-h-[3px] w-[1.25px]"}`}
                    style={{
                        background:
                            index % 4 === 0
                                ? accentSoft
                                : index % 2 === 0
                                  ? accent.color
                                  : accentDeep,
                        boxShadow: `0 0 0 1px color-mix(in srgb, ${accent.color} 18%, transparent)`,
                        height,
                        opacity: 0.96 - (index % 6) * 0.04,
                        transition: "height 120ms linear, opacity 160ms ease",
                    }}
                />
            ))}
        </div>
    );
}

function RangeInput({
    value,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    accent,
    label,
    className = "",
}) {
    const percent =
        ((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100;

    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-label={label}
            className={[
                "widget-range h-2 w-full cursor-pointer appearance-none rounded-full border-0 outline-none transition",
                className,
            ].join(" ")}
            style={{
                "--range-progress": `${percent}%`,
                "--widget-accent": accent.color,
            }}
        />
    );
}

function AudioWidget({ params, embed, preview, fill }) {
    const { mode, customBackground, backgroundColor, tokens } =
        getWidgetAppearance(params);
    const style = audioStyles.some((item) => item.id === params.style)
        ? params.style
        : "minimal";
    const accent = getAccent(params.accent);
    const audioRef = useRef(null);
    const volumeControlRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [volumeOpen, setVolumeOpen] = useState(false);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const frameRef = useRef(0);
    const frameTimeRef = useRef(0);
    const dataArrayRef = useRef(null);
    const [cardVisualizerBars, setCardVisualizerBars] = useState(() =>
        createIdleVisualizerBars(CARD_VISUALIZER_BARS, 5, 18),
    );
    const [inlineVisualizerBars, setInlineVisualizerBars] = useState(() =>
        createIdleVisualizerBars(INLINE_VISUALIZER_BARS, 4, 12),
    );

    const showTime = toBoolean(params.showTime, true);
    const showVolume = toBoolean(params.showVolume, true);
    const showVisualizer = toBoolean(params.showEqualizer, true);
    const showLoop =
        params.showLoop !== undefined
            ? toBoolean(params.showLoop, false)
            : toBoolean(params.loop, false);
    const source = hasText(params.url) ? params.url : DEFAULT_AUDIO_URL;
    const title = cleanText(params.title);
    const artist = cleanText(params.artist);
    const hasMeta = hasText(title) || hasText(artist);
    const progress = duration ? (currentTime / duration) * 100 : 0;
    const PlayIcon = playing ? Pause : Play;
    const VolumeIcon = muted || volume === 0 ? VolumeX : Volume2;
    const supportsVisualizer = style === "minimal" || style === "card";
    const visualizerEnabled = supportsVisualizer && showVisualizer;

    useEffect(() => {
        if (params.showLoop !== undefined) {
            setIsLooping(false);
            return;
        }

        setIsLooping(toBoolean(params.loop, false));
    }, [params.loop, params.showLoop]);

    useEffect(() => {
        if (!showVolume) {
            setVolumeOpen(false);
        }
    }, [showVolume]);

    const resetVisualizerBars = useCallback(() => {
        setCardVisualizerBars(
            createIdleVisualizerBars(CARD_VISUALIZER_BARS, 5, 18),
        );
        setInlineVisualizerBars(
            createIdleVisualizerBars(INLINE_VISUALIZER_BARS, 4, 12),
        );
    }, []);

    const stopVisualizerLoop = useCallback(() => {
        if (frameRef.current) {
            window.cancelAnimationFrame(frameRef.current);
            frameRef.current = 0;
        }
    }, []);

    const ensureAudioAnalyser = useCallback(async () => {
        if (preview || !visualizerEnabled || typeof window === "undefined") {
            return null;
        }

        const audio = audioRef.current;
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!audio || !AudioContextClass) {
            return null;
        }

        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new AudioContextClass();
            }

            if (!analyserRef.current) {
                analyserRef.current = audioContextRef.current.createAnalyser();
                analyserRef.current.fftSize = 1024;
                analyserRef.current.smoothingTimeConstant = 0.68;
                analyserRef.current.minDecibels = -88;
                analyserRef.current.maxDecibels = -20;
            }

            if (!sourceNodeRef.current) {
                sourceNodeRef.current =
                    audioContextRef.current.createMediaElementSource(audio);
                sourceNodeRef.current.connect(analyserRef.current);
                analyserRef.current.connect(
                    audioContextRef.current.destination,
                );
            }

            if (audioContextRef.current.state === "suspended") {
                await audioContextRef.current.resume();
            }

            if (
                !dataArrayRef.current ||
                dataArrayRef.current.length !==
                    analyserRef.current.frequencyBinCount
            ) {
                dataArrayRef.current = new Uint8Array(
                    analyserRef.current.frequencyBinCount,
                );
            }

            return analyserRef.current;
        } catch {
            return null;
        }
    }, [preview, visualizerEnabled]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return undefined;

        const syncTime = () => setCurrentTime(audio.currentTime || 0);
        const syncDuration = () => setDuration(audio.duration || 0);
        const syncEnd = () => setPlaying(false);

        audio.addEventListener("timeupdate", syncTime);
        audio.addEventListener("loadedmetadata", syncDuration);
        audio.addEventListener("durationchange", syncDuration);
        audio.addEventListener("ended", syncEnd);

        return () => {
            audio.removeEventListener("timeupdate", syncTime);
            audio.removeEventListener("loadedmetadata", syncDuration);
            audio.removeEventListener("durationchange", syncDuration);
            audio.removeEventListener("ended", syncEnd);
        };
    }, [source]);

    useEffect(() => {
        if (!visualizerEnabled || !playing) {
            stopVisualizerLoop();
            resetVisualizerBars();
            return undefined;
        }

        let cancelled = false;

        const tick = (time) => {
            if (cancelled || !analyserRef.current || !dataArrayRef.current) {
                return;
            }

            if (!frameTimeRef.current || time - frameTimeRef.current >= 34) {
                analyserRef.current.getByteFrequencyData(dataArrayRef.current);
                const nextCardBars = sampleVisualizerBars(
                    dataArrayRef.current,
                    CARD_VISUALIZER_BARS,
                    5,
                    34,
                );
                const nextInlineBars = sampleVisualizerBars(
                    dataArrayRef.current,
                    INLINE_VISUALIZER_BARS,
                    4,
                    16,
                );

                setCardVisualizerBars((previousBars) =>
                    smoothVisualizerBars(nextCardBars, previousBars),
                );
                setInlineVisualizerBars((previousBars) =>
                    smoothVisualizerBars(nextInlineBars, previousBars),
                );
                frameTimeRef.current = time;
            }

            frameRef.current = window.requestAnimationFrame(tick);
        };

        frameRef.current = window.requestAnimationFrame(tick);

        return () => {
            cancelled = true;
            stopVisualizerLoop();
        };
    }, [playing, resetVisualizerBars, stopVisualizerLoop, visualizerEnabled]);

    useEffect(
        () => () => {
            stopVisualizerLoop();
            if (sourceNodeRef.current) {
                sourceNodeRef.current.disconnect();
                sourceNodeRef.current = null;
            }
            if (analyserRef.current) {
                analyserRef.current.disconnect();
                analyserRef.current = null;
            }
            if (audioContextRef.current) {
                audioContextRef.current.close().catch(() => {});
                audioContextRef.current = null;
            }
        },
        [stopVisualizerLoop],
    );

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = muted ? 0 : volume;
            audioRef.current.loop = showLoop && isLooping;
        }
    }, [isLooping, muted, showLoop, volume]);

    useEffect(() => {
        if (!volumeOpen) {
            return undefined;
        }

        const handlePointerDown = (event) => {
            if (
                volumeControlRef.current &&
                !volumeControlRef.current.contains(event.target)
            ) {
                setVolumeOpen(false);
            }
        };

        window.addEventListener("pointerdown", handlePointerDown);
        return () =>
            window.removeEventListener("pointerdown", handlePointerDown);
    }, [volumeOpen]);

    const togglePlayback = async () => {
        if (preview) return;
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            try {
                await ensureAudioAnalyser();
                await audio.play();
                setPlaying(true);
            } catch {
                setPlaying(false);
            }
        } else {
            audio.pause();
            setPlaying(false);
        }
    };

    const seek = (value) => {
        if (preview) return;
        const nextTime = (Number(value) / 100) * duration;
        if (audioRef.current && Number.isFinite(nextTime)) {
            audioRef.current.currentTime = nextTime;
            setCurrentTime(nextTime);
        }
    };

    const toggleMute = () => {
        if (preview) return;
        setMuted((value) => !value);
    };

    const toggleVolumePanel = () => {
        if (preview || !showVolume) return;
        setVolumeOpen((value) => !value);
    };

    const toggleLoop = () => {
        if (preview || !showLoop) return;
        setIsLooping((value) => !value);
    };

    const loopButton = showLoop ? (
        <button
            type="button"
            onClick={toggleLoop}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition ${isLooping ? "" : tokens.controlAlt}`}
            style={
                isLooping
                    ? {
                          background: accent.color,
                          borderColor: accent.color,
                          color: tokens.onPrimary,
                      }
                    : undefined
            }
            aria-label={isLooping ? "Disable audio loop" : "Enable audio loop"}
            title={isLooping ? "Disable loop" : "Enable loop"}>
            <Repeat size={14} />
        </button>
    ) : null;

    const volumeButton = showVolume ? (
        <button
            type="button"
            onClick={toggleMute}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${tokens.controlAlt}`}
            aria-label={muted ? "Unmute audio" : "Mute audio"}
            title={muted ? "Unmute audio" : "Mute audio"}>
            <VolumeIcon size={14} />
        </button>
    ) : null;

    const volumeSlider = showVolume ? (
        <label className="flex items-center gap-2">
            <RangeInput
                value={muted ? 0 : volume}
                min="0"
                max="1"
                step="0.01"
                onChange={(value) => {
                    const next = Number(value);
                    setVolume(next);
                    setMuted(next === 0);
                }}
                accent={accent}
                mode={mode}
                label="Volume"
                className="w-24"
            />
        </label>
    ) : null;

    const playerControls = (
        <div className="space-y-3">
            <RangeInput
                value={Number.isFinite(progress) ? progress : 0}
                onChange={seek}
                accent={accent}
                mode={mode}
                label="Audio progress"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                {showTime ? (
                    <Muted mode={mode}>
                        {formatDuration(currentTime)} /{" "}
                        {formatDuration(duration)}
                    </Muted>
                ) : (
                    <span />
                )}
                <div className="flex items-center gap-3">
                    {loopButton}
                    {volumeButton}
                    {volumeSlider}
                </div>
            </div>
        </div>
    );

    const metaBlock = hasMeta ? (
        <div className="min-w-0">
            {hasText(title) ? (
                <p className={`truncate text-lg font-semibold ${tokens.text}`}>
                    {title}
                </p>
            ) : null}
            {hasText(artist) ? (
                <Muted mode={mode} className="mt-1 block truncate text-sm">
                    {artist}
                </Muted>
            ) : null}
        </div>
    ) : null;

    let content;

    if (style === "bar") {
        content = (
            <div className="w-full">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={togglePlayback}
                        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${tokens.controlAlt}`}
                        aria-label={playing ? "Pause audio" : "Play audio"}>
                        <PlayIcon size={18} fill="currentColor" />
                    </button>

                    {showTime ? (
                        <Muted
                            mode={mode}
                            className="shrink-0 text-[11px] font-medium tabular-nums sm:text-xs">
                            {formatDuration(currentTime)} /{" "}
                            {formatDuration(duration)}
                        </Muted>
                    ) : null}

                    <div className="min-w-0 flex-1">
                        <RangeInput
                            value={Number.isFinite(progress) ? progress : 0}
                            onChange={seek}
                            accent={accent}
                            mode={mode}
                            label="Audio progress"
                            className="w-full"
                        />
                    </div>

                    <div className="ml-auto flex shrink-0 items-center gap-2">
                        {loopButton}
                        {showVolume ? (
                            <div
                                ref={volumeControlRef}
                                className="flex items-center gap-2 overflow-hidden">
                                <button
                                    type="button"
                                    onClick={toggleVolumePanel}
                                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${tokens.controlAlt}`}
                                    aria-label={
                                        volumeOpen
                                            ? "Hide volume control"
                                            : "Show volume control"
                                    }
                                    title={
                                        volumeOpen
                                            ? "Hide volume control"
                                            : "Show volume control"
                                    }>
                                    <VolumeIcon size={14} />
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-200 ${volumeOpen ? "w-16 opacity-100 sm:w-20" : "w-0 opacity-0"}`}>
                                    <RangeInput
                                        value={muted ? 0 : volume}
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        onChange={(value) => {
                                            const next = Number(value);
                                            setVolume(next);
                                            setMuted(next === 0);
                                        }}
                                        accent={accent}
                                        mode={mode}
                                        label="Volume"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    } else if (style === "focus") {
        content = (
            <div className="flex w-full flex-col items-center justify-center text-center">
                <button
                    type="button"
                    onClick={togglePlayback}
                    className={`${controlButtonClass(mode)} h-24 w-24 shadow-glow`}>
                    <PlayIcon size={34} fill="currentColor" />
                </button>
                {hasMeta ? <div className="mt-6">{metaBlock}</div> : null}
                <div
                    className={
                        hasMeta
                            ? "mt-7 w-full max-w-lg"
                            : "mt-5 w-full max-w-lg"
                    }>
                    {playerControls}
                </div>
            </div>
        );
    } else if (style === "card") {
        content = (
            <div className="w-full">
                <div className="flex items-center gap-5">
                    <button
                        type="button"
                        onClick={togglePlayback}
                        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full shadow-soft ${tokens.control}`}>
                        <PlayIcon size={22} fill="currentColor" />
                    </button>
                    <div className="min-w-0 flex-1">{metaBlock}</div>
                </div>
                {visualizerEnabled ? (
                    <div className="mt-4">
                        <AudioVisualizer
                            accent={accent}
                            bars={cardVisualizerBars}
                            compact
                        />
                    </div>
                ) : null}
                <div className="mt-4">{playerControls}</div>
            </div>
        );
    } else {
        content = (
            <div className="w-full">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={togglePlayback}
                        className={`${controlButtonClass(mode)} h-14 w-14 shrink-0 shadow-sm`}>
                        <PlayIcon size={20} fill="currentColor" />
                    </button>
                    <div className="min-w-0 flex-1">{metaBlock}</div>
                    {visualizerEnabled ? (
                        <div className="w-28 shrink-0">
                            <AudioVisualizer
                                accent={accent}
                                bars={inlineVisualizerBars}
                                className="ml-auto"
                            />
                        </div>
                    ) : null}
                </div>
                <div className="mt-5">{playerControls}</div>
            </div>
        );
    }

    return (
        <WidgetFrame
            mode={mode}
            customBackground={customBackground}
            backgroundColor={backgroundColor}
            accentId={params.accent}
            embed={embed}
            preview={preview}
            fill={fill}
            cardClassName={style === "bar" ? "p-3 sm:p-3.5" : ""}
            cardShadow={
                style === "bar"
                    ? "var(--widget-inner-shadow)"
                    : "var(--widget-shadow)"
            }>
            <audio
                ref={audioRef}
                src={source}
                preload="metadata"
                loop={showLoop && isLooping}
                crossOrigin="anonymous"
            />
            {content}
        </WidgetFrame>
    );
}

function getClockParts(now, hour12) {
    const formatter = new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12,
    });
    const parts = formatter.formatToParts(now);

    return {
        hour: parts.find((part) => part.type === "hour")?.value || "00",
        minute: parts.find((part) => part.type === "minute")?.value || "00",
        second: parts.find((part) => part.type === "second")?.value || "00",
        dayPeriod: parts.find((part) => part.type === "dayPeriod")?.value || "",
    };
}

function ClockWidget({ params, embed, preview, fill }) {
    const [now, setNow] = useState(new Date());
    const { mode, customBackground, backgroundColor, tokens } =
        getWidgetAppearance(params);
    const style = clockStyles.some((item) => item.id === params.style)
        ? params.style
        : "digital";
    const hour12 = toBoolean(params.hour12, false);
    const showSeconds = toBoolean(params.seconds, true);
    const showUnitLabels = toBoolean(params.showUnitLabels, true);
    const accent = getAccent(params.accent);
    const parts = getClockParts(now, hour12);
    const timeText = `${parts.hour}:${parts.minute}${showSeconds ? `:${parts.second}` : ""}${parts.dayPeriod ? ` ${parts.dayPeriod}` : ""}`;
    const label = cleanText(params.label);

    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(timer);
    }, []);

    let content;

    if (style === "flip") {
        content = (
            <div className="mx-auto flex w-full flex-col items-center text-center">
                <Muted mode={mode} className="text-sm font-medium">
                    {label}
                </Muted>
                <div
                    className={
                        hasText(label)
                            ? "mt-4 flex justify-center"
                            : "flex justify-center"
                    }>
                    <FlipClockWidget
                        mode={mode}
                        showSeconds={showSeconds}
                        hour12={hour12}
                        showUnitLabels={showUnitLabels}
                        scale={fill || embed ? 1 : 0.92}
                    />
                </div>
            </div>
        );
    } else if (style === "circular") {
        const second = now.getSeconds();
        const outerRadius = 42;
        const outerCircumference = 2 * Math.PI * outerRadius;
        const secondProgress = second / 60;
        content = (
            <div className="mx-auto flex w-full flex-col items-center justify-center gap-5 text-center sm:flex-row">
                <svg
                    className="h-28 w-28 -rotate-90"
                    viewBox="0 0 104 104"
                    aria-hidden="true">
                    <circle
                        cx="52"
                        cy="52"
                        r={outerRadius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className={tokens.muted}
                        opacity="0.18"
                    />
                    <circle
                        cx="52"
                        cy="52"
                        r={outerRadius}
                        fill="none"
                        stroke={accent.color}
                        strokeLinecap="round"
                        strokeWidth="8"
                        strokeDasharray={outerCircumference}
                        strokeDashoffset={
                            outerCircumference -
                            secondProgress * outerCircumference
                        }
                    />
                </svg>
                <div>
                    <Muted mode={mode} className="text-sm font-medium">
                        {label}
                    </Muted>
                    <p
                        className={`mt-2 font-mono text-4xl font-semibold ${tokens.text}`}>
                        {timeText}
                    </p>
                </div>
            </div>
        );
    } else if (style === "analog") {
        const hour = now.getHours() % 12;
        const minute = now.getMinutes();
        const second = now.getSeconds();
        const hourAngle = hour * 30 + minute * 0.5;
        const minuteAngle = minute * 6;
        const secondAngle = second * 6;
        content = (
            <div className="mx-auto flex w-full flex-col items-center justify-center gap-5 text-center sm:flex-row">
                <div
                    className={`relative h-32 w-32 rounded-full border ${tokens.border} ${tokens.raised}`}>
                    {Array.from({ length: 12 }).map((_, index) => (
                        <span
                            key={index}
                            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full"
                            style={{
                                background:
                                    index % 3 === 0
                                        ? accent.color
                                        : "currentColor",
                                transform: `translate(-50%, -50%) rotate(${index * 30}deg) translateY(-53px)`,
                            }}
                        />
                    ))}
                    <span
                        className="absolute left-1/2 top-1/2 h-11 w-1.5 origin-bottom rounded-full bg-current"
                        style={{
                            transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
                        }}
                    />
                    <span
                        className="absolute left-1/2 top-1/2 h-14 w-1 origin-bottom rounded-full"
                        style={{
                            background: accent.color,
                            transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
                        }}
                    />
                    {showSeconds ? (
                        <>
                            <span
                                className="absolute left-1/2 top-1/2 h-[58px] w-[2px] origin-bottom rounded-full"
                                style={{
                                    background: accent.color,
                                    transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
                                }}
                            />
                            <span
                                className="absolute left-1/2 top-1/2 h-4 w-[1px] origin-top rounded-full"
                                style={{
                                    background: accent.color,
                                    transform: `translate(-50%, 0) rotate(${secondAngle}deg)`,
                                }}
                            />
                        </>
                    ) : null}
                    <span
                        className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{ background: accent.color }}
                    />
                </div>
                <div>
                    <Muted mode={mode} className="text-sm font-medium">
                        {label}
                    </Muted>
                    <p
                        className={`mt-2 font-mono text-4xl font-semibold ${tokens.text}`}>
                        {timeText}
                    </p>
                </div>
            </div>
        );
    } else {
        const chunks = showSeconds
            ? [
                  ["Hours", parts.hour],
                  ["Minutes", parts.minute],
                  ["Seconds", parts.second],
              ]
            : [
                  ["Hours", parts.hour],
                  ["Minutes", parts.minute],
              ];
        const showPeriodCard = hour12 && hasText(parts.dayPeriod);
        content = (
            <div className="mx-auto flex w-full flex-col items-center text-center">
                <Muted mode={mode} className="text-sm font-medium">
                    {label}
                </Muted>
                <div
                    className={`${hasText(label) ? "mt-4" : ""} grid w-full gap-3`}
                    style={{
                        gridTemplateColumns: `repeat(${chunks.length + (showPeriodCard ? 1 : 0)}, minmax(0, 1fr))`,
                    }}>
                    {chunks.map(([unit, value]) => (
                        <div
                            key={unit}
                            className={`rounded-2xl border p-4 text-center ${tokens.softCard}`}>
                            <p
                                className={`font-mono text-4xl font-semibold ${tokens.text}`}>
                                {value}
                            </p>
                            {showUnitLabels ? (
                                <Muted
                                    mode={mode}
                                    className="mt-1 block text-xs">
                                    {unit}
                                </Muted>
                            ) : null}
                        </div>
                    ))}
                    {showPeriodCard ? (
                        <div
                            className={`rounded-2xl border p-4 text-center ${tokens.softCard}`}>
                            <p
                                className={`font-mono text-2xl font-semibold uppercase tracking-[0.2em] ${tokens.text}`}>
                                {parts.dayPeriod}
                            </p>
                            {showUnitLabels ? (
                                <Muted
                                    mode={mode}
                                    className="mt-2 block text-xs">
                                    Period
                                </Muted>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }

    return (
        <WidgetFrame
            mode={mode}
            customBackground={customBackground}
            backgroundColor={backgroundColor}
            accentId={params.accent}
            embed={embed}
            preview={preview}
            fill={fill}>
            {content}
        </WidgetFrame>
    );
}

function PomodoroWidget({ params, embed, preview, fill }) {
    const { mode, customBackground, backgroundColor, tokens } =
        getWidgetAppearance(params);
    const accent = getAccent(params.accent);
    const focusSeconds = clampNumber(params.minutes, 1, 180, 25) * 60;
    const breakSeconds = clampNumber(params.breakMinutes, 1, 60, 5) * 60;
    const [phase, setPhase] = useState("focus");
    const [remaining, setRemaining] = useState(focusSeconds);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        setPhase("focus");
        setRemaining(focusSeconds);
        setRunning(false);
    }, [focusSeconds]);

    useEffect(() => {
        if (!running || preview) return undefined;
        const timer = window.setInterval(() => {
            setRemaining((value) => {
                if (value > 1) return value - 1;
                setPhase((current) => {
                    const next = current === "focus" ? "break" : "focus";
                    setRemaining(
                        next === "focus" ? focusSeconds : breakSeconds,
                    );
                    return next;
                });
                return 0;
            });
        }, 1000);

        return () => window.clearInterval(timer);
    }, [breakSeconds, focusSeconds, preview, running]);

    const reset = () => {
        setRunning(false);
        setPhase("focus");
        setRemaining(focusSeconds);
    };

    const total = phase === "focus" ? focusSeconds : breakSeconds;
    const progress = total ? ((total - remaining) / total) * 100 : 0;
    const phaseLabel =
        phase === "focus"
            ? cleanText(params.focusLabel)
            : cleanText(params.breakLabel);

    return (
        <WidgetFrame
            mode={mode}
            customBackground={customBackground}
            backgroundColor={backgroundColor}
            accentId={params.accent}
            embed={embed}
            preview={preview}
            fill={fill}>
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <Muted mode={mode} className="text-sm font-medium">
                        {phaseLabel}
                    </Muted>
                    {hasText(params.title) ? (
                        <h3
                            className={`mt-2 text-2xl font-semibold ${tokens.text}`}>
                            {params.title}
                        </h3>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                        <span
                            className={`rounded-full border px-3 py-1 ${tokens.controlAlt}`}>
                            {cleanText(params.focusLabel) || "Focus"}{" "}
                            {Math.round(focusSeconds / 60)}m
                        </span>
                        <span
                            className={`rounded-full border px-3 py-1 ${tokens.controlAlt}`}>
                            {cleanText(params.breakLabel) || "Break"}{" "}
                            {Math.round(breakSeconds / 60)}m
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            !preview && setRunning((value) => !value)
                        }
                        className={`${controlButtonClass(mode)} h-11 w-11`}>
                        {running ? (
                            <Pause size={18} fill="currentColor" />
                        ) : (
                            <Play size={18} fill="currentColor" />
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (preview) return;
                            const nextPhase =
                                phase === "focus" ? "break" : "focus";
                            setRunning(false);
                            setPhase(nextPhase);
                            setRemaining(
                                nextPhase === "focus"
                                    ? focusSeconds
                                    : breakSeconds,
                            );
                        }}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold ${tokens.controlAlt}`}>
                        {phase === "focus"
                            ? cleanText(params.breakLabel) || "Break"
                            : cleanText(params.focusLabel) || "Focus"}
                    </button>
                    <button
                        type="button"
                        onClick={reset}
                        className={`h-11 w-11 rounded-full border ${tokens.controlAlt}`}>
                        <RotateCcw className="mx-auto" size={18} />
                    </button>
                </div>
            </div>
            <p
                className={`mt-8 font-mono text-6xl font-semibold ${tokens.text}`}>
                {formatDuration(remaining)}
            </p>
            <div
                className="mt-6 h-3 overflow-hidden rounded-full"
                style={{ background: tokens.track }}>
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: accent.color }}
                    animate={{ width: `${progress}%` }}
                />
            </div>
        </WidgetFrame>
    );
}

function getCountdownParts(ms, selectedUnits) {
    let remaining = Math.max(0, ms);
    return unitDefs
        .filter((unit) => selectedUnits.includes(unit.id))
        .map((unit) => {
            const value = Math.floor(remaining / unit.ms);
            remaining -= value * unit.ms;
            return { ...unit, value };
        });
}

function CountdownWidget({ params, embed, preview, fill }) {
    const [now, setNow] = useState(Date.now());
    const { mode, customBackground, backgroundColor, tokens } =
        getWidgetAppearance(params);
    const targetTime = new Date(params.target || "2026-12-31T23:59").getTime();
    const selectedUnits = useMemo(() => {
        const parsedUnits = csv(params.units);
        return parsedUnits.length ? parsedUnits : ["days", "hours", "minutes"];
    }, [params.units]);
    const parts = getCountdownParts(targetTime - now, selectedUnits);

    useEffect(() => {
        if (preview) return undefined;
        const timer = window.setInterval(
            () => setNow(Date.now()),
            selectedUnits.includes("seconds") ? 1000 : 30000,
        );
        return () => window.clearInterval(timer);
    }, [preview, selectedUnits]);

    return (
        <WidgetFrame
            mode={mode}
            customBackground={customBackground}
            backgroundColor={backgroundColor}
            accentId={params.accent}
            embed={embed}
            preview={preview}
            fill={fill}>
            <div className="mx-auto flex w-full flex-col items-center text-center">
                {hasText(params.title) ? (
                    <h3 className={`text-2xl font-semibold ${tokens.text}`}>
                        {params.title}
                    </h3>
                ) : null}
                <div
                    className={`${hasText(params.title) ? "mt-6" : ""} flex w-full flex-wrap justify-center gap-1.5 sm:gap-3`}>
                    {parts.map((part) => (
                        <div
                            key={part.id}
                            className={`w-[68px] sm:w-[80px] shrink-0 rounded-xl sm:rounded-2xl border p-[5px] text-center ${tokens.softCard}`}>
                            <p
                                className={`font-mono text-lg sm:text-2xl font-semibold ${tokens.text}`}>
                                {String(part.value).padStart(2, "0")}
                            </p>
                            <Muted
                                mode={mode}
                                className="mt-1 block text-[9px] sm:text-xs">
                                {part.label}
                            </Muted>
                        </div>
                    ))}
                </div>
            </div>
        </WidgetFrame>
    );
}

function ProgressWidget({ params, embed, preview, fill }) {
    const { mode, customBackground, backgroundColor, tokens } =
        getWidgetAppearance(params);
    const accent = getAccent(params.accent);
    const [value, setValue] = useState(clampNumber(params.value, 0, 100, 68));

    useEffect(() => {
        setValue(clampNumber(params.value, 0, 100, 68));
    }, [params.value]);

    return (
        <WidgetFrame
            mode={mode}
            customBackground={customBackground}
            backgroundColor={backgroundColor}
            accentId={params.accent}
            embed={embed}
            preview={preview}
            fill={fill}>
            <div className="flex items-end justify-between gap-4 text-center">
                {hasText(params.title) ? (
                    <h3 className={`text-2xl font-semibold ${tokens.text}`}>
                        {params.title}
                    </h3>
                ) : (
                    <span />
                )}
                <p className={`text-4xl font-semibold ${tokens.text}`}>
                    {value}%
                </p>
            </div>
            <div className="mt-7">
                <RangeInput
                    value={value}
                    onChange={(next) => !preview && setValue(Number(next))}
                    accent={accent}
                    mode={mode}
                    label="Progress"
                    className="h-4"
                />
            </div>
        </WidgetFrame>
    );
}

function DayProgressWidget({ params, embed, preview, fill }) {
    const { mode, customBackground, backgroundColor, tokens } =
        getWidgetAppearance(params);
    const accent = getAccent(params.accent);
    const total = clampNumber(params.days, 1, 60, 7);
    const [checked, setChecked] = useState(() => new Set());

    useEffect(() => {
        setChecked(new Set());
    }, [total]);

    const toggle = (index) => {
        if (preview) return;
        setChecked((current) => {
            const next = new Set(current);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    return (
        <WidgetFrame
            mode={mode}
            customBackground={customBackground}
            backgroundColor={backgroundColor}
            accentId={params.accent}
            embed={embed}
            preview={preview}
            fill={fill}>
            <div className="flex items-end justify-between gap-4">
                {hasText(params.title) ? (
                    <h3 className={`text-2xl font-semibold ${tokens.text}`}>
                        {params.title}
                    </h3>
                ) : (
                    <span />
                )}
                <Muted mode={mode} className="font-medium">
                    {checked.size}/{total}
                </Muted>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-7">
                {Array.from({ length: total }).map((_, index) => {
                    const active = checked.has(index);
                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => toggle(index)}
                            className={`flex aspect-square flex-col items-center justify-center rounded-2xl border text-sm font-semibold transition hover:-translate-y-0.5 ${active ? "" : tokens.controlAlt}`}
                            style={
                                active
                                    ? {
                                          background: accent.color,
                                          borderColor: accent.color,
                                          color: tokens.onPrimary,
                                      }
                                    : undefined
                            }>
                            {active ? (
                                <Check size={16} />
                            ) : hasText(params.dayLabel) ? (
                                <>
                                    <span className="text-[10px] font-medium leading-none">
                                        {params.dayLabel}
                                    </span>
                                    <span className="mt-1 leading-none">
                                        {index + 1}
                                    </span>
                                </>
                            ) : (
                                index + 1
                            )}
                        </button>
                    );
                })}
            </div>
        </WidgetFrame>
    );
}

function HabitTrackerWidget({ params, embed, preview, fill }) {
    const { mode, customBackground, backgroundColor, tokens } =
        getWidgetAppearance(params);
    const accent = getAccent(params.accent);
    const count = clampNumber(params.habitCount, 2, 10, 4);
    const habits = Array.from({ length: count })
        .map((_, index) => cleanText(params[`habit${index + 1}`]))
        .filter((habit) => hasText(habit));
    const columns = habits.length > 5 ? 2 : 1;
    const [checked, setChecked] = useState(() => new Set());

    useEffect(() => {
        setChecked(new Set());
    }, [count]);

    const toggle = (index) => {
        if (preview) return;
        setChecked((current) => {
            const next = new Set(current);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    return (
        <WidgetFrame
            mode={mode}
            customBackground={customBackground}
            backgroundColor={backgroundColor}
            accentId={params.accent}
            embed={embed}
            preview={preview}
            fill={fill}>
            {(hasText(params.title) || habits.length > 0) && (
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <BadgeCheck size={20} className={tokens.text} />
                        {hasText(params.title) ? (
                            <h3
                                className={`truncate text-xl font-semibold ${tokens.text}`}>
                                {params.title}
                            </h3>
                        ) : null}
                    </div>
                    <Muted mode={mode} className="shrink-0 text-sm font-medium">
                        {checked.size}/{habits.length}
                    </Muted>
                </div>
            )}
            <div
                className="mt-6 grid gap-2"
                style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                }}>
                {habits.map((habit, index) => {
                    const active = checked.has(index);
                    return (
                        <button
                            key={`${habit}-${index}`}
                            type="button"
                            onClick={() => toggle(index)}
                            className={`flex items-center gap-3 rounded-2xl border px-3 py-2 text-left text-sm font-medium transition hover:-translate-y-0.5 ${tokens.controlAlt}`}>
                            <span
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border"
                                style={
                                    active
                                        ? {
                                              background: accent.color,
                                              borderColor: accent.color,
                                              color: tokens.onPrimary,
                                          }
                                        : { borderColor: "currentColor" }
                                }>
                                {active ? <Check size={14} /> : null}
                            </span>
                            <span className={`min-w-0 truncate ${tokens.text}`}>
                                {habit}
                            </span>
                        </button>
                    );
                })}
            </div>
        </WidgetFrame>
    );
}

function FocusCardWidget({ params, embed, preview, fill }) {
    const { mode, customBackground, backgroundColor, tokens } =
        getWidgetAppearance(params);
    const accent = getAccent(params.accent);

    return (
        <WidgetFrame
            mode={mode}
            customBackground={customBackground}
            backgroundColor={backgroundColor}
            accentId={params.accent}
            embed={embed}
            preview={preview}
            fill={fill}>
            <div className="flex w-full items-start gap-4 text-left">
                <span
                    className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{
                        background: accent.color,
                        color: tokens.onPrimary,
                    }}>
                    <Sparkles size={18} />
                </span>
                <span className="min-w-0 flex-1">
                    <Muted mode={mode} className="text-sm font-medium">
                        {params.label}
                    </Muted>
                    {hasText(params.title) ? (
                        <span
                            className={`mt-3 block text-4xl font-semibold ${tokens.text}`}>
                            {params.title}
                        </span>
                    ) : null}
                    {hasText(params.subtitle) ? (
                        <span
                            className={`mt-4 block text-base leading-7 ${tokens.subtle}`}>
                            {params.subtitle}
                        </span>
                    ) : null}
                </span>
            </div>
        </WidgetFrame>
    );
}

function QuoteWidget({ params, embed, preview, fill }) {
    const { mode, customBackground, backgroundColor, tokens } =
        getWidgetAppearance(params);
    const accent = getAccent(params.accent);

    return (
        <WidgetFrame
            mode={mode}
            customBackground={customBackground}
            backgroundColor={backgroundColor}
            accentId={params.accent}
            embed={embed}
            preview={preview}
            fill={fill}>
            {hasText(params.quote) ? (
                <Quote size={28} style={{ color: accent.color }} />
            ) : null}
            {hasText(params.quote) ? (
                <blockquote
                    className={`mt-5 text-2xl font-semibold leading-tight ${tokens.text}`}>
                    {params.quote}
                </blockquote>
            ) : null}
            <Muted mode={mode} className="mt-5 block text-sm font-medium">
                {params.author}
            </Muted>
        </WidgetFrame>
    );
}

function GreetingWidget({ params, embed, preview, fill }) {
    const { mode, customBackground, backgroundColor, tokens } =
        getWidgetAppearance(params);
    const accent = getAccent(params.accent);

    return (
        <WidgetFrame
            mode={mode}
            customBackground={customBackground}
            backgroundColor={backgroundColor}
            accentId={params.accent}
            embed={embed}
            preview={preview}
            fill={fill}>
            {hasText(params.greeting) ? (
                <div className="flex items-center gap-2.5">
                    <Sparkles size={16} className={tokens.muted} />
                    <Muted mode={mode} className="text-sm font-medium">
                        {params.greeting}
                    </Muted>
                </div>
            ) : null}
            {hasText(params.name) ? (
                <h3
                    className={`${hasText(params.greeting) ? "mt-3" : ""} text-4xl font-semibold`}
                    style={{ color: accent.color }}>
                    {params.name}
                </h3>
            ) : null}
            {hasText(params.message) ? (
                <p className={`mt-4 text-base ${tokens.subtle}`}>
                    {params.message}
                </p>
            ) : null}
        </WidgetFrame>
    );
}

function getLinks(params) {
    const count = clampNumber(params.linkCount, 2, 10, 2);
    return Array.from({ length: count })
        .map((_, index) => ({
            label: cleanText(params[`link${index + 1}Label`]),
            url: cleanText(params[`link${index + 1}Url`]),
        }))
        .filter((link) => hasText(link.label) && hasText(link.url));
}

function QuickLinksWidget({ params, embed, preview, fill }) {
    const { mode, customBackground, backgroundColor, tokens } =
        getWidgetAppearance(params);
    const accent = getAccent(params.accent);
    const links = getLinks(params);
    const columns = links.length > 5 ? 2 : 1;

    return (
        <WidgetFrame
            mode={mode}
            customBackground={customBackground}
            backgroundColor={backgroundColor}
            accentId={params.accent}
            embed={embed}
            preview={preview}
            fill={fill}>
            {(hasText(params.title) || links.length > 0) && (
                <div className="flex items-center justify-start gap-3">
                    <Link2 size={20} style={{ color: accent.color }} />
                    {hasText(params.title) ? (
                        <h3 className={`text-xl font-semibold ${tokens.text}`}>
                            {params.title}
                        </h3>
                    ) : null}
                </div>
            )}
            <div
                className={`${hasText(params.title) ? "mt-5" : links.length ? "mt-0" : ""} grid gap-2 ${links.length > 5 ? "max-h-[228px] overflow-y-auto pr-1" : ""}`}
                style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                }}>
                {links.map((link) => {
                    const content = (
                        <>
                            <span className="truncate">{link.label}</span>
                            <ExternalLink size={15} className="shrink-0" />
                        </>
                    );

                    if (preview) {
                        return (
                            <div
                                key={`${link.label}-${link.url}`}
                                className={`flex items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-sm font-medium ${tokens.controlAlt}`}>
                                {content}
                            </div>
                        );
                    }

                    return (
                        <a
                            key={`${link.label}-${link.url}`}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-sm font-medium transition hover:-translate-y-0.5 ${tokens.controlAlt}`}>
                            {content}
                        </a>
                    );
                })}
            </div>
        </WidgetFrame>
    );
}

function NotesWidget({ params, embed, preview, fill }) {
    const { mode, customBackground, backgroundColor, tokens } =
        getWidgetAppearance(params);
    const accent = getAccent(params.accent);

    return (
        <WidgetFrame
            mode={mode}
            customBackground={customBackground}
            backgroundColor={backgroundColor}
            accentId={params.accent}
            embed={embed}
            preview={preview}
            fill={fill}>
            {hasText(params.title) ? (
                <div className="flex items-center gap-3">
                    <StickyNote size={20} style={{ color: accent.color }} />
                    <h3 className={`text-xl font-semibold ${tokens.text}`}>
                        {params.title}
                    </h3>
                </div>
            ) : null}
            {hasText(params.body) ? (
                <p
                    className={`${hasText(params.title) ? "mt-5" : ""} whitespace-pre-line text-base leading-7 ${tokens.subtle}`}>
                    {params.body}
                </p>
            ) : null}
        </WidgetFrame>
    );
}

function CounterWidget({ params, embed, preview, fill }) {
    const { mode, customBackground, backgroundColor, tokens } =
        getWidgetAppearance(params);
    const accent = getAccent(params.accent);
    const [count, setCount] = useState(clampNumber(params.count, 0, 99999, 12));

    useEffect(() => {
        setCount(clampNumber(params.count, 0, 99999, 12));
    }, [params.count]);

    return (
        <WidgetFrame
            mode={mode}
            customBackground={customBackground}
            backgroundColor={backgroundColor}
            accentId={params.accent}
            embed={embed}
            preview={preview}
            fill={fill}>
            <Muted mode={mode} className="text-sm font-medium">
                {params.title}
            </Muted>
            <div
                className={`${hasText(params.title) ? "mt-4" : ""} flex items-end justify-between gap-5`}>
                <div className="flex min-w-0 items-end gap-3">
                    <p
                        className="text-7xl font-semibold leading-none"
                        style={{ color: accent.color }}>
                        {count}
                    </p>
                    <Muted mode={mode} className="pb-2 text-sm font-medium">
                        {params.suffix}
                    </Muted>
                </div>
                <div className="mb-3 flex gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            !preview &&
                            setCount((value) => Math.max(0, value - 1))
                        }
                        className={`flex h-10 w-10 items-center justify-center rounded-full border ${tokens.controlAlt}`}>
                        <Minus size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            !preview && setCount((value) => value + 1)
                        }
                        className={`${controlButtonClass(mode)} h-10 w-10`}>
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        </WidgetFrame>
    );
}

const rendererMap = {
    audio: AudioWidget,
    clock: ClockWidget,
    pomodoro: PomodoroWidget,
    countdown: CountdownWidget,
    progress: ProgressWidget,
    "day-progress": DayProgressWidget,
    "habit-tracker": HabitTrackerWidget,
    "focus-card": FocusCardWidget,
    quote: QuoteWidget,
    greeting: GreetingWidget,
    "quick-links": QuickLinksWidget,
    notes: NotesWidget,
    counter: CounterWidget,
};

export function getStyleOptions(type) {
    if (type === "audio") return audioStyles;
    if (type === "clock") return clockStyles;
    return [];
}

export { unitDefs };

export default function WidgetRenderer({
    type,
    params,
    embed = false,
    preview = false,
    fill = false,
}) {
    const Renderer = rendererMap[type];
    const stableParams = useMemo(() => params || {}, [params]);

    if (!Renderer) {
        return null;
    }

    return (
        <Renderer
            params={stableParams}
            embed={embed}
            preview={preview}
            fill={fill}
        />
    );
}
