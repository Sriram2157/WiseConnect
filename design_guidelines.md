# WiseConnect Design Guidelines - Apple-Inspired Premium Edition

## Design Philosophy
**Premium, Accessible, Delightful** - A carefully crafted interface inspired by Apple's design principles: clean, minimal, focused on clarity with smooth, sophisticated interactions suitable for older adults.

### Core Principles
1. **Simplicity Over Complexity** - Every element serves a purpose; nothing is frivolous
2. **Generous Space** - Breathing room reduces cognitive load and makes interaction comfortable
3. **Smooth Motion** - All animations are subtle, elegant, and purposeful
4. **Consistent Interaction** - Familiar patterns throughout build confidence
5. **Forgiving Design** - Clear confirmations, easy undo, recovery-focused

---

## Visual Language

### Color Palette
**Light Mode**: Clean whites, soft grays, calming blues, warm accents
- Background: Near-white (#FAFBFC)
- Cards: Pure white with subtle shadows
- Accents: Soft blue (primary), warm orange (secondary)
- Text: Deep charcoal for readability

**Dark Mode**: Sophisticated dark grays, elevated cards, softer contrasts
- Background: Very dark gray (#0F1419)
- Cards: Slightly elevated (#141A24)
- Accents: Brighter blue and orange for visibility
- Text: Off-white for comfortable reading

### Glassmorphism Effects
- **Glass panels**: Translucent white/white backgrounds with soft blur
- Used for: Navigation bar, floating cards, overlays
- Blend modes: Subtle layer effect over content
- Never harsh: Always maintain readability and accessibility

### Shadow System (Layered Depth)
```
--shadow-2xs: Subtle (0 1px 2px)
--shadow-xs: Light (0 1px 3px)
--shadow-sm: Mild elevation
--shadow: Standard card shadow
--shadow-md: Content containers
--shadow-lg: Floating panels/modals
--shadow-xl: Maximum elevation (modals, popovers)
```

**Philosophy**: Shadows are minimal, natural, and suggest gentle elevation—never harsh or overdone.

---

## Typography

**Font Family**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI)
- Familiar to users, highly optimized for accessibility
- Excellent rendering on all devices

**Type Scale** (All minimum sizes):
- Hero Titles: 36px, bold (line-height: 1.2)
- Section Headers: 28px, semibold (line-height: 1.3)
- Body/Callout: 20px, regular (line-height: 1.6)
- Button Labels: 22px, medium
- Small Text: 18px (never below)

**Text Size Controls**: User can adjust +2px or +4px globally

---

## Layout & Spacing

**Spacing Scale**: 4, 6, 8, 12, 16, 20, 24 (consistent rhythm)
- Sections: py-12 to py-20 (mobile to desktop)
- Components: gap-6 to gap-12
- Cards: p-8 to p-12
- Buttons: px-8 py-4 (minimum)

**Touch Targets**: 60px minimum (80px preferred)
- All interactive elements sized generously
- Finger-friendly, forgiving for older hands

**Border Radius**: 
- Subtle rounding: rounded-md (6px) for most elements
- Cards/containers: rounded-xl to rounded-2xl (12-24px)
- Buttons: rounded-xl (12px) for natural appearance
- Icons: rounded-full where circular

---

## Component Specifications

### Navigation Bar
**Design**: Glassmorphic, floating effect
- Top bar: Clean, minimal, 80px minimum height
- Bottom bar (mobile): Frosted glass with 96px height
- Icons: 32px, paired with text labels
- Active state: Bold + soft background
- Transition: Smooth 300ms fade/slide

**Animations**:
- Icons scale gently on hover (1.05x)
- Label color fades in smoothly
- Active indicator slides into view

### Cards & Content Containers
**Design**: Clean white/elevated with subtle shadows
- Border radius: rounded-xl (12px)
- Shadows: shadow-md baseline, shadow-lg on hover
- Padding: p-8 to p-12 (spacious)
- Border: Minimal, only if needed for clarity

**Hover Interaction**:
- Lift slightly: translate-y-1
- Shadow increase: shadow-md → shadow-lg
- All transitions: 300ms ease-out
- Animation class: `card-hover`

### Buttons
**Design Philosophy**: Large, touchable, inviting

**Primary Button**:
- Min height: 60px (64px preferred)
- Icon + Text layout (icon: 28px)
- Border radius: rounded-xl
- Background: Solid primary color with subtle gradient
- Tap animation: 150ms scale-95 + fade ripple

**Secondary Button**:
- Outlined style with transparent background
- Border: 2px solid
- Same height as primary
- Hover: Soft background elevation

**States**:
- Default: Smooth shadow, ready to tap
- Hover: Slight lift, glow effect
- Active/Pressed: Scale down 5%, instant feedback
- Focus: 4px ring with offset

**All button animations**: Smooth 150-300ms transitions

### Progress Indicators
**Progress Bar**:
- Height: 16px
- Border radius: rounded-full
- Background: Light muted color
- Fill: Animated gradient (primary color)
- Animation: 500ms ease-out on value change

**Checkmarks**:
- 40px icons
- Celebratory bounce animation on completion
- Glow effect with subtle pulse

**Progress Steps**:
- Dot indicators with smooth connecting lines
- Current step: Highlighted with animation
- Completed steps: Checkmark with scale-in animation

### Forms & Inputs
**Input Fields**:
- Height: 60px (comfortable for large text)
- Padding: Generous (px-6 py-4)
- Border: Subtle, 1px
- Label: Above input (not floating)
- Focus: Smooth color transition + ring

**Validation**:
- Error state: Destructive color with smooth shake animation
- Success: Green checkmark with fade-in-up animation
- Helper text: 18px, muted color below field

### Quiz Interface
**Question Display**:
- Text: 28px, bold, centered
- Options: Full-width cards, 80px minimum height
- Radio buttons: 32px, clear selection state
- Spacing: gap-6 between options

**Animations**:
- Question appears: fade-in-up (600ms)
- Options stagger: Each option delays 80ms
- Selection: Scale-in ripple effect

### Community Posts
**Post Cards**:
- Layout: Generous padding (p-10-12)
- Avatar: 48px circle with shadow
- Content: Clear hierarchy (author, message, metadata)
- Category badge: Large (px-6 py-3, text-lg)
- Timestamps: Subtle, muted text

**Interactions**:
- Cards fade-in-up on initial load
- Staggered entrance (80ms per card)
- Hover: Lift and shadow increase (card-hover)
- Reply button: Always visible, prominent

### Lesson Content
**Step Layout**:
- One concept per screen
- Centered content (max-w-2xl)
- Images/screenshots: Large (bordered, shadow-md)
- Text: Generous line height (1.8)

**Navigation**:
- "Next" button: Bottom-right, always visible
- "Back" button: Top-left
- Progress indicator: Top center with smooth fill

**Speak Button**:
- 56px circle
- Top-right corner
- Glass effect when active
- Icon changes: speaker → speaker-off

---

## Animation System

### Motion Principles
- **Duration**: 150-600ms depending on type
- **Easing**: cubic-bezier(0.34, 1.56, 0.64, 1) for spring-like feel
- **Timing**: Staggered for lists/groups (80ms per item)
- **Never jarring**: All animations feel natural and gentle

### Core Animations

**Fade In** (500ms ease-out)
- Elements appearing for first time
- Use on page load

**Fade In Up** (600ms spring)
- Content entering with subtle lift
- Use for modal opens, card reveals

**Slide In Right** (500ms ease-out)
- Navigation transitions
- Page slides in from right edge

**Scale In** (400ms spring)
- Components revealing
- Badges, icons, small elements

**Bounce Subtle** (2s infinite)
- Floating action buttons
- Call-to-action indicators

**Card Hover** (300ms)
- Lift: translate-y-1
- Shadow: md → lg
- Use `card-hover` class

**Button Tap** (150ms)
- Instant: scale-95
- Feedback that button is registered
- Use `btn-tap` class

**Progress Fill** (500ms ease-out)
- Progress bar updates
- Smooth value transitions

### Staggered Animations
For lists and grids:
- Each item delays 80ms from previous
- Creates wave effect
- Reduces visual chaos
- Use `animate-stagger-enter` with custom delays

---

## Accessibility Features

### High Contrast Mode
- Toggle in Profile settings
- WCAG AAA compliance
- Black text on white (light mode)
- White text on black (dark mode)

### Text Size Control
- Three preset sizes: Medium (18px), Large (20px), Extra-Large (22px)
- Scales entire interface proportionally
- Persisted to localStorage
- Affects all text (buttons, labels, body)

### Text-to-Speech
- Speak button on every lesson screen
- 56px circular button, always accessible
- Per-instance utterance management
- Stops previous speech on new activation
- Speaker icon changes to speaker-off when active

### Visual Cues
- Icons always paired with text labels
- Color never sole indicator (plus icon/text)
- Clear focus rings (4px)
- Understandable error messages

### Keyboard Navigation
- Full keyboard support
- Logical tab order
- Visible focus indicators
- Skip links where appropriate

---

## Page Layouts

### Home/Dashboard
- Welcome message (32px, friendly tone)
- Quick stats: Current lesson progress
- Featured lesson card: 50% of viewport height
- Community highlights: Upcoming posts
- All with animations on load

### Quiz Flow
- Progress dots at top (smart position)
- Question centered and prominent
- Options as large cards
- "Next" button floats at bottom
- Smooth transitions between questions

### Lessons Page
- Grid/list of lesson cards
- Each card: 200x280px minimum
- Icon, title, difficulty badge
- Hover: Lift and glow
- Click: Transition to lesson view

### Community Page
- Post feed with staggered animations
- "Ask Question" button: Always accessible (bottom-right)
- New posts fade-in-up on load
- Category filters with smooth state changes

### Profile/Settings
- Clean grouped sections
- Large toggle switches (60px)
- Text size slider with live preview
- High contrast toggle
- Theme switcher

---

## Performance & Polish

### Smooth Scrolling
- Hardware acceleration on cards
- Inertia scrolling on mobile
- No jank, 60fps animations

### Interaction Feedback
- Every tap/click has visual response
- Loading states with spinner animation
- Success confirmations with checkmark glow
- Error states with bounce animation

### Micro-interactions
- Button ripple on press (subtle)
- Input focus glow
- Badge shimmer on new items
- Smooth state transitions

---

## Implementation Notes

### CSS Classes
- Use Tailwind utilities + custom animation classes
- `glass` and `glass-subtle` for glassmorphism
- `card-hover` for automatic lift + shadow
- `btn-tap` for button press feedback
- `animate-stagger-enter` for list items

### No Overuse of Effects
- Never more than 2-3 animations per screen
- Avoid competing animations
- Keep focus on content
- Always purposeful, never decorative

### Accessibility First
- All animations have `prefers-reduced-motion` respect
- Color contrast always WCAG AAA
- Touch targets never compromise
- Keyboard users experience full functionality

---

## Final Design Goal

Create an interface that feels:
- **Premium**: Polished, high-quality, attention to detail
- **Accessible**: Comfortable for older adults, forgiving, clear
- **Smooth**: Delightful interactions, gentle animations
- **Modern**: Current design trends (Apple-inspired)
- **Simple**: Clarity wins over complexity
- **Trustworthy**: Professional, consistent, reliable
