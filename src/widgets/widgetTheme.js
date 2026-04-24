import { getAppThemeTokens, resolveThemeMode } from '../theme/themeTokens';

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

export function isWidgetTransparent(mode, transparent = false) {
  return mode === 'transparent' || transparent === true || transparent === 'true';
}

export function resolveWidgetTheme(mode, appTheme = 'light') {
  return resolveThemeMode(normalizeWidgetMode(mode), appTheme);
}

export function getOppositeWidgetMode(theme = 'light') {
  return theme === 'dark' ? 'light' : 'dark';
}

export function getWidgetThemeVars(mode, { appTheme = 'light', transparent = false } = {}) {
  const resolvedMode = resolveWidgetTheme(mode, appTheme);
  const palette = getAppThemeTokens(resolvedMode);
  const isDark = resolvedMode === 'dark';
  const background = transparent
    ? 'transparent'
    : isDark
      ? 'color-mix(in srgb, var(--widget-base-surface) 78%, #000000 22%)'
      : 'color-mix(in srgb, var(--widget-base-surface) 93%, var(--widget-primary) 7%)';
  const surface = isDark
    ? 'color-mix(in srgb, var(--widget-base-surface) 94%, var(--widget-primary) 6%)'
    : 'var(--widget-base-surface)';
  const surfaceElevated = isDark
    ? 'color-mix(in srgb, var(--widget-base-surface) 90%, var(--widget-primary) 10%)'
    : 'color-mix(in srgb, var(--widget-base-surface) 98%, var(--widget-primary) 2%)';
  const innerCard = isDark
    ? 'color-mix(in srgb, var(--widget-base-surface) 84%, var(--widget-primary) 16%)'
    : 'color-mix(in srgb, var(--widget-base-surface) 94%, var(--widget-primary) 6%)';

  return {
    '--widget-primary': palette.primary,
    '--widget-base-surface': palette.surface,
    '--widget-background': background,
    '--widget-surface': surface,
    '--widget-surface-elevated': surfaceElevated,
    '--widget-inner-card': innerCard,
    '--widget-inner-card-top': isDark
      ? 'color-mix(in srgb, var(--widget-inner-card) 92%, var(--widget-primary) 8%)'
      : 'color-mix(in srgb, var(--widget-inner-card) 98%, var(--widget-base-surface) 2%)',
    '--widget-inner-card-bottom': isDark
      ? 'color-mix(in srgb, var(--widget-inner-card) 86%, var(--widget-primary) 14%)'
      : 'color-mix(in srgb, var(--widget-inner-card) 90%, var(--widget-primary) 10%)',
    '--widget-text': palette.text,
    '--widget-accent-text': isDark ? '#222222' : '#FFFFFF',
    '--widget-muted': isDark ? 'rgba(255, 255, 255, 0.72)' : 'rgba(25, 25, 25, 0.64)',
    '--widget-subtle': isDark ? 'rgba(255, 255, 255, 0.88)' : 'rgba(25, 25, 25, 0.82)',
    '--widget-border': isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(34, 34, 34, 0.1)',
    '--widget-border-strong': isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(34, 34, 34, 0.16)',
    '--widget-track': isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(34, 34, 34, 0.13)',
    '--widget-on-primary': isDark ? '#222222' : '#FFFFFF',
    '--widget-shadow': isDark
      ? '0 18px 36px rgba(0, 0, 0, 0.34), 0 4px 12px rgba(0, 0, 0, 0.18)'
      : '0 18px 36px rgba(34, 34, 34, 0.09), 0 4px 12px rgba(34, 34, 34, 0.05)',
    '--widget-inner-shadow': isDark
      ? '0 10px 24px rgba(0, 0, 0, 0.24), 0 2px 6px rgba(0, 0, 0, 0.12)'
      : '0 10px 24px rgba(34, 34, 34, 0.07), 0 2px 6px rgba(34, 34, 34, 0.04)',
  };
}

export function getWidgetTokens() {
  return widgetTokenClasses;
}
