---
name: Obsidian Reserve
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d8c3ad'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#a08e79'
  outline-variant: '#534433'
  surface-tint: '#ffb959'
  primary: '#ffc374'
  on-primary: '#462a00'
  primary-container: '#f5a000'
  on-primary-container: '#613d00'
  inverse-primary: '#845400'
  secondary: '#ffba43'
  on-secondary: '#442c00'
  secondary-container: '#da9600'
  on-secondary-container: '#4f3400'
  tertiary: '#ffc277'
  on-tertiary: '#472a00'
  tertiary-container: '#eea238'
  on-tertiary-container: '#623c00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffddb6'
  primary-fixed-dim: '#ffb959'
  on-primary-fixed: '#2a1800'
  on-primary-fixed-variant: '#643f00'
  secondary-fixed: '#ffddaf'
  secondary-fixed-dim: '#ffba43'
  on-secondary-fixed: '#281800'
  on-secondary-fixed-variant: '#614000'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95e'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-xl:
    fontFamily: Manrope
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-xl-mobile:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  currency-display:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.03em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-numeric:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 2rem
  margin-mobile: 1rem
  margin-tablet: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4.5rem
---

## Brand & Style

This design system establishes an ultra-refined, institutional-grade digital auction environment tailored for high-value assets and premium automotive bidding. The visual tone balances industrial engineering precision with the discreet prestige of private wealth management.

### Personality & Emotional Tenor
- **Sovereign Trust & Security:** Every interaction exudes reliability, finality, and cryptographic certainty. The interface eliminates visual fluff to center user attention directly on valuation, bidding increments, and provenance.
- **Cinematic Precision:** Deep obsidian canvas tiers set a stage where high-resolution automotive imagery and technical specification cards command attention without competing background clutter.
- **Urgency Under Control:** Radiant amber indicators create disciplined, high-visibility urgency for real-time bid events, reserve statuses, and active lot clocks without resorting to frantic, low-end auction tropes.

### Design Movement
The aesthetic synthesizes **Technical Minimalism** with **Subtle Dark Glassmorphism**:
- Obsidian-layered foundation tiers (`#080808` to `#202020`) create depth without color pollution.
- Micron-thin boundary definitions (`rgba(255, 255, 255, 0.09)`) frame telemetry data and vehicular photography.
- Radiant amber luminescence (`#F5A000`) directs focal velocity to live pricing metrics, bid triggers, and auction status indicators.

## Colors

The palette leverages an obsidian tonal foundation punctuated by high-radiance amber and warm metallic accents. Color usage strictly governs information architecture: amber communicates active liquidity and critical temporal thresholds, white ensures legibility, and muted tones deliver contextual metadata.

### Palette Architecture
- **Primary Accent (`#F5A000`):** The primary action token. Reserved for primary bid triggers, active lot countdown timers, current winning bids, and focus state indicators.
- **Secondary Highlight (`#FFB52E`):** Ambient glow highlights, hover illumination states, and secondary status confirmations.
- **Tertiary Burnished Amber (`#B87500`):** Active structural borders, pressed action states, and historical telemetry data markers.
- **Neutral Core (`#080808`):** Deep canvas ground. Surface steps transition through `#101010` (Surface Base), `#151515` (Surface Raised), and `#202020` (Surface Overlay).
- **Text & Foreground Tokens:**
  - High Emphasis: `#FFFFFF` (Values, titles, lot names)
  - Medium Emphasis: `rgba(255, 255, 255, 0.72)` (Labels, vehicle specs, secondary tables)
  - Low Emphasis / Disabled: `rgba(255, 255, 255, 0.40)` (Mileage timestamps, VIN indices)
- **Delicate Glass Edges:** `rgba(255, 255, 255, 0.09)` provides crisp, structural delineation across all container panels.

## Typography

The typographic hierarchy establishes clear distinction between asset presentation, telemetry data, and transactional mechanics. 

### Font Selection & Pairing
- **Headlines & Financial Displays (Manrope):** Geometric, solid, and modern. Used for lot naming, make/model specs, and high-impact currency denominations (Mozambican Metical `MZN`). The strict geometric curvature reflects automotive precision and mechanical craftsmanship.
- **Interface & Operational Telemetry (Inter):** Systemic, neutral, and readable down to small scale. Used for lot condition reports, bid increment histories, VIN specifications, timer readouts, and functional inputs.

### Numerical Treatment
All tabular financial figures, countdown digits, and pricing ledgers require `font-variant-numeric: tabular-nums` to eliminate jitter during real-time Metical value recalculations and sub-second live auction counters.

## Layout & Spacing

The layout model organizes dense mechanical data alongside full-bleed automotive imagery through a disciplined 12-column structural grid.

### Spatial Rhythm
- **Rhythm Base:** A strict 4px/8px modular scale drives all spacing tokens.
- **Desktop (1200px+):** 12-column layout with `2rem` gutters and dynamic margins up to `1440px` max-content width. Real-time lot views deploy a 7:5 asymmetric split—7 columns for cinematic photo galleries and technical condition logs, 5 columns for the live bid stream and placement terminal.
- **Tablet (768px - 1199px):** 8-column layout with `1.5rem` gutters. Bid console pins to an upper-priority viewport block.
- **Mobile (< 768px):** 4-column layout with `1rem` margins and gutters. Real-time countdowns and bid triggers fix securely into a persistent bottom dock (`sticky-action-dock`).

## Elevation & Depth

Elevation does not rely on traditional diffuse drop shadows. It is constructed through **layered obsidian luminance**, **translucent boundary strokes**, and **delicate warm amber lighting**.

### Surface Layers
1. **Tier 0 (Canvas Base):** `#080808` — Foundations, background canvas, and unlit backdrops.
2. **Tier 1 (Surface Neutral):** `#101010` — Primary listing grid cards, search consoles, and historical log panels.
3. **Tier 2 (Surface Raised):** `#151515` — Active bidding card modules, spec tables, filter drawers.
4. **Tier 3 (Overlay / Terminal):** `#202020` — Live auction terminal modals, full-screen galleries, and checkout confirmation trays.

### Edge Definition & Atmosphere
- **Micro-Borders:** Panels deploy a crisp `1px solid rgba(255, 255, 255, 0.09)`. This produces a precise glass separation without muddy shadows.
- **Active State Glow:** Active, winning, or hot-lot elements gain a restrained, directional amber illumination: `box-shadow: 0 0 24px rgba(245, 160, 0, 0.12), inset 0 1px 0 rgba(255, 181, 46, 0.25)`.
- **Modals & Overlays:** Surface overlays use backdrop blur filters (`backdrop-filter: blur(16px); background: rgba(16, 16, 16, 0.85);`) to keep background lot context visible while commanding focal dominance.

## Shapes

The design system enforces a **Soft Structural** shape language (`roundedness: 1`). Corners remain taut and architectural, communicating automotive body lines and financial discipline rather than consumer app softness.

### Radius Implementations
- **Base Components (`rounded`, 0.25rem / 4px):** Checkboxes, status badges, secondary buttons, lot meta tags, and tabular data badges.
- **Container Elements (`rounded-lg`, 0.5rem / 8px):** Asset summary cards, input groups, live video feed containers, bid history panels.
- **Surface Modals (`rounded-xl`, 0.75rem / 12px):** Primary auction execution terminals, vehicle media preview carousels, full overlays.
- **Full Radius (`pill`, 9999px):** Live indicator dots, pulse badges, and verified lot seals.

## Components

### Buttons & Interactive Controls
- **Primary Bid Action:** High-saturation background `#F5A000` with high-contrast `#080808` text, weight 700. Border-radius 4px (`rounded`). On hover: shifts to `#FFB52E` with a subtle amber ambient shadow. Active state depresses slightly with `#B87500`.
- **Secondary / Reserve Triggers:** Ghost structure with `#151515` background, `1px solid rgba(255, 255, 255, 0.09)`, and pure white typography. Hover elevates the border to `rgba(245, 160, 0, 0.40)`.

### Badges & Countdown Indicators
- **Live Lot Badges:** Dark obsidian fill (`#151515`) with a 1px amber border (`#B87500`) and glowing dot indicator (`#F5A000` with a 4px pulse ring). Monospaced numerals for the timer (`02h : 14m : 55s`).
- **Reserve Status Badges:** `RESERVE MET` utilizes low-opacity amber (`rgba(245, 160, 0, 0.15)`) with `#FFB52E` lettering. `NO RESERVE` leverages a subtle silver-white glass badge (`rgba(255, 255, 255, 0.08)`).

### Auction Cards (Automotive Lots)
- Background `#101010` wrapped in `1px solid rgba(255, 255, 255, 0.09)`. Aspect ratio 16:10 image header with a subtle gradient vignette over the lower third.
- Bottom container presents year, make, model in `Manrope` (`headline-sm`), followed by current valuation in `MZN` (`currency-display`). Secondary metadata (mileage, transmission, location) sits in a horizontal row separated by hairline borders.

### Input Fields & Bid Steppers
- Background `#151515` with a baseline `1px solid rgba(255, 255, 255, 0.09)`. Text in white with `Inter` 16px.
- Focus state triggers a clean `1px solid #F5A000` and `box-shadow: 0 0 0 1px #F5A000`.
- Bid steppers feature tactile `+` and `-` increments anchored directly to minimum Metical thresholds (e.g., `+ 50,000 MZN`).

### Lists & Bid History Streams
- Alternating subtle rows (`transparent` vs `rgba(255, 255, 255, 0.02)`).
- Time of bid formatted in `body-sm` (`rgba(255, 255, 255, 0.40)`).
- Bidder anonymity handles (e.g., `Bidder #8492 (Maputo)`) in white medium weight.
- Current winning bid highlights with a left 2px vertical amber indicator bar.