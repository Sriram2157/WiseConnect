# WiseConnect Design Guidelines

## Design Approach
**Accessibility-First System Design** - Using principles from Material Design and WCAG AAA standards, optimized for senior users with reduced vision, limited tech experience, and potential dexterity challenges.

## Core Design Principles
1. **Clarity Over Cleverness** - Every element must be immediately understandable
2. **Generous Spacing** - Never crowd elements; breathing room reduces cognitive load
3. **Consistent Patterns** - Same interactions work the same way throughout
4. **Forgiving Interface** - Clear confirmation dialogs, easy undo options

---

## Typography System

**Font Family**: System fonts (Apple System, Segoe UI) - familiar and highly legible

**Scale** (all sizes minimum):
- Hero/Page Titles: 36px, bold (line-height: 1.2)
- Section Headers: 28px, semibold (line-height: 1.3)
- Body Text: 20px, regular (line-height: 1.6)
- Button Text: 22px, medium (line-height: 1.4)
- Small Labels: 18px, regular (line-height: 1.5)

**Never below 18px** - Include text size toggle (+2px, +4px options)

---

## Layout & Spacing System

**Tailwind Units**: Use 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Section padding: py-12 md:py-20
- Component gaps: gap-8 to gap-12
- Card padding: p-8 to p-12
- Button padding: px-8 py-4 (minimum)

**Container widths**: max-w-4xl for content (avoid overly wide text blocks)

**Touch Targets**: Minimum 60px height for all interactive elements, 80px preferred

---

## Component Library

### Navigation
- **Top bar** with max 4 items: Home | Lessons | Community | Profile
- Each nav item: Icon (32px) + Label, stacked vertically on mobile, horizontal on desktop
- Active state: Bold text + subtle underline
- Fixed position on mobile for easy access

### Buttons
**Primary CTA**: 
- Rounded corners (rounded-xl)
- Height: 64px minimum
- Width: Full-width on mobile, min-w-64 on desktop
- Icon + Text (icon: 28px)

**Secondary/Back buttons**: Same height, outlined style

**Button states**: Focus rings must be 4px thick, high contrast

### Cards
- Rounded-2xl corners
- Shadow: Subtle (shadow-md), lifted on hover (shadow-lg)
- Padding: p-10 to p-12
- Border: 2px when needed for contrast

### Progress Indicators
- Progress bar: Height 16px, rounded-full
- Use clear percentage text alongside bar (24px bold)
- Celebratory checkmarks (40px) for completed items

### Forms & Inputs
- Input height: 64px
- Labels above inputs (not floating)
- Clear error messages in 20px text
- Helper text: 18px below fields

### Quiz/Multiple Choice
- Each option: Full-width card, minimum 80px height
- Radio buttons: 32px, clear visual selection state
- Spacing between options: gap-6

### Community Posts
- Post cards: Generous padding (p-10)
- Category badges: Large (px-6 py-3, text-lg)
- "Ask Question" button: Always visible, prominent

### Lesson Content
- Step-by-step layout: One concept per screen
- Images/screenshots: Large, bordered (border-4)
- "Next" button: Bottom-right, always visible
- Voice playback button: Top-right corner, 56px circle

---

## Accessibility Features

**High Contrast Mode**: Toggle in profile
- WCAG AAA contrast ratios minimum
- Dark text on light backgrounds preferred

**Voice Instructions**: 
- Speaker icon (32px) on every lesson screen
- Auto-play option in settings
- Pause/replay controls (60px buttons)

**Visual Cues**:
- Icons always paired with text
- Use color + icon + text (never color alone)
- Clear focus indicators (4px outlines)

---

## Page Structures

### Onboarding Quiz
- One question per screen
- Large question text (28px)
- 3-4 answer options max
- Progress dots at top (20px each)

### Dashboard/Home
- Welcome message (32px)
- Current lesson card (prominent, 1/2 screen height)
- Quick stats (3 large number cards)
- "Continue Learning" CTA (full-width, 72px)

### Lesson Pages
- Lesson title (36px, sticky header)
- Content area: Max-width prose, generous line-height
- Navigation: Previous/Next always visible (bottom bar)
- Progress: Top of screen, always visible

### Community
- Category filter chips at top (56px height each)
- Post list: One post per card, full-width
- Floating "Ask Question" button (bottom-right)

---

## Images

**Hero Image**: None - This is a utility app, not marketing. Focus on immediate functionality.

**Lesson Screenshots**: 
- Use bordered, large screenshots to demonstrate steps
- Max-width: 600px, centered
- Border: 4px solid for clarity
- Shadow: shadow-xl for depth

**Avatars/Icons**: 
- Profile pictures: 64px minimum
- Feature icons: 48-56px
- Navigation icons: 32px

---

## Animation Guidelines
**Minimal and Purposeful**:
- Page transitions: Simple fade (200ms)
- Button feedback: Scale on press (duration-150)
- Progress updates: Smooth bar fill (duration-500)
- **No autoplay carousels, parallax, or complex animations**

---

## Mobile-First Strategy
- Stack all multi-column layouts to single column
- Bottom navigation bar (72px height)
- Full-width CTAs
- Minimum 24px margins on all sides