# Changelog

All notable changes to this system will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Color palette and semantic color tokens for the light theme: primary fill, text, surface, border, accent and status.
- `pnpm check` fails when text or the error color drops below WCAG AA contrast on any surface in either theme, and when text on the primary fill does.
- A dark theme that follows `prefers-color-scheme`. Setting `data-theme="light"` or `data-theme="dark"` on an element forces that theme for the element and everything inside it. The dark theme changes the semantic colors and shadows and sets `color-scheme: dark`, so native controls match the page.
- Font family tokens `--font-serif`, `--font-sans`, `--font-mono` and `--font-math`, and regular, medium and bold weights.
- `fonts.css`, which loads Manrope, Noto Sans SC, Noto Serif SC and Noto Sans Math from Google Fonts and Maple Mono NL NF CN 400, 400 italic, 500 and 700 from RottenSea/webfonts.
- Spacing tokens on a 4px grid, `--space-1` (4px) to `--space-24` (96px), in rem.
- Corner radius tokens `--radius-xs` to `--radius-xl` and `--radius-full`, in px.
- Shadow tokens `--shadow-hover` and `--shadow-float`, and border tokens `--border-hairline` and `--border-hairline-soft`.
- Motion tokens: durations `--duration-fast`, `--duration-base` and `--duration-slow`, easings `--easing-enter`, `--easing-exit` and `--easing-move`, and transitions `--transition-tint`, `--transition-surface` and `--transition-fade`.
- Twelve typography styles: display xl to sm, title lg to sm, body md and sm, caption, uppercase caption and code. Sizes are in rem.
