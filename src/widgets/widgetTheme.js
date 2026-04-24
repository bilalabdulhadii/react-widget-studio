import { getAppThemeTokens, resolveThemeMode } from '../theme/themeTokens';

const DEFAULT_LIGHT_BACKGROUND = '#F7F7F5';
const DEFAULT_DARK_BACKGROUND = '#191919';
const DEFAULT_LIGHT_SURFACE = '#FFFFFF';
const DEFAULT_DARK_SURFACE = '#222222';
const DEFAULT_LIGHT_INNER = '#F1F1EF';
const DEFAULT_DARK_INNER = '#2A2A2A';

const widgetTokenClasses = {
  outer: 'bg-[color:var(--widget-background)]',
  card: 'border-[color:var(--widget-border)] bg-[color:var(--widget-surface)] text-[color:var(--widget-text)]',
  softCard: 'border-[color:var(--widget-border)] bg-[color:var(--widget-inner-card)] text-[color:var(--widget-text)] shadow-[var(--widget-inner-shadow)]',
  raised: 'bg-[color:var(--widget-surface-elevated)] shadow-[var(--widget-inner-shadow)]',
  text: 'text-[color:var(--widget-text)]',
  muted: 'text-[color:var(--widget-muted)]',
  subtle: 'text-[color:var(--widget-subtle)]',
  border: 'border-[color:var(--widget-border)]',
  control: 'bg-[color:var(--widget-primary)] text-[color:var(--widget-on-primary)]',
  controlAlt: 'border-[color:var(--widget-border)] bg-[color:var(--widget-inner-card)] text-[color:var(--widget-text)] shadow-[var(--widget-inner-shadow)]',
  track: 'var(--widget-track)',
  background: 'var(--widget-background)',
  surface: 'var(--widget-surface)',
  elevatedSurface: 'var(--widget-surface-elevated)',
  innerCard: 'var(--widget-inner-card)',
  primaryColor: 'var(--widget-primary)',
  textColor: 'var(--widget-text)',
  mutedColor: 'var(--widget-muted)',
  subtleColor: 'var(--widget-subtle)',
  borderColor: 'var(--widget-border)',
  borderStrong: 'var(--widget-border-strong)',
  onPrimary: 'var(--widget-on-primary)',
  shadow: 'var(--widget-shadow)',
  innerShadow: 'var(--widget-inner-shadow)',
};

export function normalizeWidgetMode(mode) {
  if (mode === 'light' || mode === 'dark' || mode === 'system') {
    return mode;
  }

  return 'system';
}

export function sanitizeWidgetBackgroundColor(value) {
  const normalizedValue = typeof value === 'string' ? value.trim() : '';

  if (/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(normalizedValue)) {
    return normalizedValue;
  }

  return '';
}

export function toWidgetBoolean(value, fallback = false) {
  if (value === undefined || value === null) {
    return fallback;
  }

  return value === true || value === 'true';
}

export function resolveWidgetTheme(mode, appTheme = 'light') {
  return resolveThemeMode(normalizeWidgetMode(mode), appTheme);
}

export function getOppositeWidgetMode(theme = 'light') {
  return theme === 'dark' ? 'light' : 'dark';
}

export function getWidgetPageBackground(mode, { appTheme = 'light', customBackground = false, backgroundColor = '' } = {}) {
  const resolvedMode = resolveWidgetTheme(mode, appTheme);
  const customColor = sanitizeWidgetBackgroundColor(backgroundColor);

  if (toWidgetBoolean(customBackground, false) && customColor) {
    return customColor;
  }

  return resolvedMode === 'dark' ? DEFAULT_DARK_BACKGROUND : DEFAULT_LIGHT_BACKGROUND;
}

export function getWidgetThemeVars(mode, { appTheme = 'light', customBackground = false, backgroundColor = '' } = {}) {
  const resolvedMode = resolveWidgetTheme(mode, appTheme);
  const palette = getAppThemeTokens(resolvedMode);
  const isDark = resolvedMode === 'dark';
  const background = getWidgetPageBackground(mode, {
    appTheme,
    customBackground,
    backgroundColor,
  });
  const surface = isDark ? DEFAULT_DARK_SURFACE : DEFAULT_LIGHT_SURFACE;
  const surfaceElevated = isDark ? '#262626' : '#FAFAF8';
  const innerCard = isDark ? DEFAULT_DARK_INNER : DEFAULT_LIGHT_INNER;

  return {
    '--widget-primary': palette.primary,
    '--widget-base-surface': surface,
    '--widget-page-background': background,
    '--widget-background': background,
    '--widget-surface': surface,
    '--widget-surface-elevated': surfaceElevated,
    '--widget-inner-card': innerCard,
    '--widget-inner-card-top': isDark
      ? '#303030'
      : '#F6F6F4',
    '--widget-inner-card-bottom': isDark
      ? '#242424'
      : '#ECECE8',
    '--widget-text': palette.text,
    '--widget-accent-text': isDark ? '#222222' : '#FFFFFF',
    '--widget-muted': isDark ? 'rgba(255, 255, 255, 0.7)' : '#787774',
    '--widget-subtle': isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(25, 25, 25, 0.84)',
    '--widget-border': isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
    '--widget-border-strong': isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.08)',
    '--widget-track': isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(34, 34, 34, 0.11)',
    '--widget-on-primary': isDark ? '#222222' : '#FFFFFF',
    '--widget-shadow': isDark
      ? '0 16px 32px rgba(0, 0, 0, 0.22), 0 2px 8px rgba(0, 0, 0, 0.12)'
      : '0 8px 20px rgba(0, 0, 0, 0.06)',
    '--widget-inner-shadow': isDark
      ? '0 10px 22px rgba(0, 0, 0, 0.18), 0 2px 6px rgba(0, 0, 0, 0.08)'
      : '0 4px 12px rgba(0, 0, 0, 0.04)',
  };
}

export function getWidgetTokens() {
  return widgetTokenClasses;
}
