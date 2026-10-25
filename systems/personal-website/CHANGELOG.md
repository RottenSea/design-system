# Changelog

All notable changes to this system will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Color palette and semantic color tokens for the light theme: primary fill, text, surface, border, accent and status.
- Build fails when a text color drops below WCAG AA contrast on any light surface or on the primary fill.
- Font family tokens `--font-serif`, `--font-sans`, `--font-mono` and `--font-math`, and regular, medium and bold weights.
- `fonts.css`, which loads Manrope, Noto Sans SC, Noto Serif SC and Noto Sans Math from Google Fonts and Maple Mono NL NF CN 400, 400 italic, 500 and 700 from RottenSea/webfonts.
- Twelve typography styles: display xl to sm, title lg to sm, body md and sm, caption, uppercase caption and code. Sizes are in rem.
