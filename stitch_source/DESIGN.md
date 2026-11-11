---
name: Oceanic Cartography
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#44474d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#75777e'
  outline-variant: '#c5c6cd'
  surface-tint: '#515f78'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#0d1c32'
  on-primary-container: '#76849f'
  inverse-primary: '#b9c7e4'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#2a1700'
  on-tertiary-container: '#b87500'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#b9c7e4'
  on-primary-fixed: '#0d1c32'
  on-primary-fixed-variant: '#39475f'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: 0em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  stat-metric:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies modern digital cartography: authoritative, intellectually engaging, and visually crystalline. Designed for curious learners, educators, data analysts, and global researchers, the interface evokes the quiet gravitas of an archival atlas coupled with the velocity and precision of contemporary aerospace telemetry. 

The aesthetic marries **Corporate / Modern Precision** with **Atmospheric Minimalism**. Interfaces prioritize vast negative space, high legibility for dense demographic and geopolitical metrics, and immaculate surface contrast. Visual noise is aggressively eliminated to let multi-layered maps, demographic charts, and cultural photography command attention. Key interactive states feel tactile yet effortless, utilizing delicate luminance shifts and subtle physical boundaries rather than heavy skeuomorphic effects.

## Colors

The color architecture is built around deep maritime depths offset by clean atmospheric whites and purposeful semantic highlights.

- **Primary (`#0A192F`):** Deep abyssal navy used for structural navigation frames, core interactive controls, high-contrast headings, and foundational data anchors.
- **Secondary (`#0284C7`):** Vivid ocean azure, symbolizing maritime channels, primary active interactive states, hyperlinks, map highlights, and selection boundaries.
- **Tertiary (`#F59E0B`):** Warm solar gold reserved for economic figures, currency metrics, sovereignty designations, flag accents, and featured discovery callouts.
- **Quaternary / Nature Accent (`#10B981`):** Fresh emerald green, utilized exclusively for ecological indicators, agricultural data, topographical metrics, and positive statistical variances.
- **Surfaces & Neutral Base:** Pure white (`#FFFFFF`) forms the primary elevated card surface, resting over cool crisp canvas tones (`#F8FAFC` and `#F1F5F9`). Deep slate typography (`#0F172A` to `#334155`) guarantees rigorous contrast compliance across all text tiers.

## Typography

The platform utilizes **Plus Jakarta Sans** across all hierarchies. Its geometric underpinnings provide crisp structure for geographic coordinates, statistical tables, and population indices, while its wide apertures retain legibility at small sizes.

- Use tabular numbers (`font-variant-numeric: tabular-nums`) across all analytical counters, geographic lat/long readouts, and financial metrics to prevent layout shifts during live data stream updates.
- Keep statistical metric labels (`stat-metric`) paired with clear, uppercase micro-labels (`label-md`) to ensure effortless scannability across dense dashboard panels.
- Display sizes utilize tightened negative tracking to produce cohesive visual units, whereas body and caption sizes introduce micro-spacing for scanning comfort.

## Layout & Spacing

The layout operates on a flexible 12-column grid on desktop screens, transitioning to an 8-column layout on tablets and a 4-column layout on mobile devices.

- **Breakpoints:**
  - Mobile: `< 640px` (4 columns, `margin-mobile: 1rem`, `gutter-mobile: 1rem`)
  - Tablet: `640px - 1024px` (8 columns, `margin: 1.5rem`, `gutter: 1.25rem`)
  - Desktop: `> 1024px` (12 columns, max content container width `1440px`, `margin: 2rem`, `gutter: 1.5rem`)

Data panels, sidebar drawers, and map controls adhere to consistent spacing multiples of `4px` (`0.25rem`). Map HUD overlays maintain a uniform `space-md` boundary from all viewport edges, folding into responsive bottom-sheet drawers on mobile viewports.

## Elevation & Depth

Visual hierarchy uses a refined hybrid of **low-contrast outlines** and **ambient marine shadows**, avoiding harsh skeuomorphism in favor of disciplined dimensional layering.

- **Base Layer (Canvas):** Colored `#F8FAFC`, non-elevated, serving as the backdrop for content lists and viewports.
- **Surface Level 1 (Cards & Modules):** Pure white (`#FFFFFF`) with a 1px border rendered in `#E2E8F0`. Shadow: `0 1px 3px 0 rgba(10, 25, 47, 0.04), 0 1px 2px -1px rgba(10, 25, 47, 0.02)`.
- **Surface Level 2 (Floating Overlays, Popovers, HUD Panels):** Pure white (`#FFFFFF`) with a 1px border in `#CBD5E1`. Shadow: `0 10px 25px -5px rgba(10, 25, 47, 0.08), 0 8px 10px -6px rgba(10, 25, 47, 0.04)`.
- **Surface Level 3 (Modals & Command Palettes):** `#FFFFFF` with ambient tinting: `0 20px 35px -10px rgba(10, 25, 47, 0.16)`. Accompanied by a backdrop scrim colored `#0A192F` with 45% opacity and a `4px` Gaussian blur.

## Shapes

The geometric personality balances crisp analytical discipline with approachable modernity:

- Standard structural panels, data cards, map viewports, and modal sheets employ medium curvature (`rounded: 0.5rem / 8px`).
- Larger contextual container groupings, summary modules, and media wrappers scale up to `rounded-lg` (`1rem / 16px`).
- Category chips, geographic tags, state indicators, and floating map tool icons deliberately break the modular rhythm by using full pill geometry (`9999px`), immediately distinguishing interactive micro-elements from static structural containers.

## Components

### Buttons
- **Primary:** Background `#0A192F`, label `#FFFFFF`, border none. Hover: `#1E3A8A`. Height: 40px (desktop), 44px (touch). Padding: `0 space-lg`.
- **Secondary / Action:** Background `#0284C7`, label `#FFFFFF`. Hover: `#0369A1`.
- **Subtle / Outline:** Background `#FFFFFF`, 1px border `#CBD5E1`, text `#0F172A`. Hover: `#F1F5F9`.
- **Map Control Floating Icon:** 40x40px square, `rounded: 0.5rem`, `#FFFFFF` surface with Level 2 elevation.

### Badges & Chips
- **Pill Badges:** Fully circular ends (`rounded-full`), height 24px, padding `0 space-sm`.
- **Economic Highlights:** `#F59E0B` at 12% opacity fill, `#B45309` typography.
- **Resource / Environmental:** `#10B981` at 12% opacity fill, `#047857` typography.
- **Geopolitical / Oceanic:** `#0284C7` at 12% opacity fill, `#0369A1` typography.

### Data Cards
- Container constructed with Level 1 elevation, `#FFFFFF` background, and `1px` border `#E2E8F0`.
- Card Header: Features `title-md` paired with a categorical pill badge or country flag indicator.
- Metric Slot: Accommodates large `stat-metric` figures with an adjoining mini sparkline or percentage indicator.

### Input Fields & Search Bars
- Atlas Search Bar: Height 48px, background `#FFFFFF`, border `1px solid #CBD5E1`, inner shadow none. Focused state: Border `#0284C7`, halo ring `0 0 0 3px rgba(2, 132, 199, 0.15)`.
- Icon adornment placed on the leading edge (magnifying glass / coordinate reticle in `#64748B`).

### Interactive Tabs
- Segmented line or capsule tab bars.
- Capsule Style: `#F1F5F9` background container with `0.25rem` padding; active tab snaps with `#FFFFFF` background, Level 1 shadow, and `#0A192F` font weight `600`.

### Selection Controls
- **Checkboxes & Radios:** 18x18px box, border `1.5px solid #94A3B8`. When checked: `#0284C7` solid fill with white checkmark/dot.

### Dataviz Counters
- Composed of an uppercase tracking label (`label-md`), an active counter readout (`stat-metric`), and an inline contextual delta tag indicating growth, decline, or geographic density.