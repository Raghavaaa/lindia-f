# LegalIndia.AI Design System

**Version:** 1.0  
**Last Updated:** October 15, 2025

---

## ✅ Step 1 Complete: Design System Foundation

This document outlines the complete design specification for LegalIndia.AI frontend.

---

## 📐 Grid & Layout

| Property | Value | Usage |
|----------|-------|-------|
| **Max Page Width** | 1440px | `max-w-[1440px] mx-auto` |
| **Section Spacing** | 64px vertical, 32px horizontal | `py-16 px-8` |
| **Sidebar Width** | 280px | `w-[280px]` |
| **Footer Height** | 60px (fixed bottom) | `h-[60px]` |

### Responsive Breakpoints
- **Mobile:** < 768px - Stack vertically, sidebar collapses
- **Tablet:** 768-1024px - Reduce gaps to 24px
- **Desktop:** 1024px+ - Full layout

---

## 🎨 Typography

**Font Family:** Inter (Google Font)

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| **Base** | 16px | 400 | `text-base` |
| **H1** | 32px | 600 | `text-[32px] font-semibold` |
| **H2** | 24px | 500 | `text-2xl font-medium` |
| **H3** | 20px | 500 | `text-xl font-medium` |

**Line Height:** 1.6 (base text)

---

## 🎨 Color Palette

```css
Background:      #FFFFFF
Primary Text:    #0A0A0A
Secondary Text:  #555555
Accent Blue:     #2E7CF6
Light Accent:    #E8F1FF
Border:          #C4C4C4
Shadow:          rgba(0, 0, 0, 0.05)
```

### Tailwind Classes
- Background: `bg-white`
- Primary Text: `text-[#0A0A0A]`
- Secondary Text: `text-[#555555]`
- Accent: `bg-[#2E7CF6]`
- Light Accent: `bg-[#E8F1FF]`
- Border: `border-[#C4C4C4]`

---

## 🔘 Buttons

### Primary Button
```tsx
className="h-12 px-6 bg-[#2E7CF6] text-white rounded-2xl text-sm font-medium shadow-sm"
```

### Secondary Button
```tsx
className="h-12 px-6 bg-white text-[#0A0A0A] border border-[#C4C4C4] rounded-2xl text-sm font-medium"
```

### Hover States
- Raise: `transform: translateY(-2px)`
- Shadow: `shadow-lg`
- Duration: `0.3s ease-in-out`

---

## 🃏 Cards & Modals

```tsx
className="p-8 rounded-2xl bg-white shadow-md space-y-5"
```

| Property | Value |
|----------|-------|
| **Padding** | 32px (p-8) |
| **Border Radius** | rounded-2xl (16px) |
| **Shadow** | shadow-md |
| **Element Spacing** | 20px (space-y-5) |

---

## 📤 Upload Section

```tsx
className="w-[400px] h-[220px] border-2 border-dashed border-[#C4C4C4] rounded-2xl"
```

| Property | Value |
|----------|-------|
| **Size** | 400px × 220px |
| **Border** | 2px dashed #C4C4C4 |
| **Hover** | Border color → #2E7CF6 |
| **Icon** | Centered, 48px × 48px |
| **Text** | 16px, #555555 |

---

## 📱 Responsiveness

### Mobile (< 768px)
- Stack columns vertically
- Sidebar → Top menu button
- Reduce spacing to 32px/16px
- Upload box: `max-w-full`

### Tablet (768-1024px)
- Reduce gaps to 24px
- Two-column layouts

### Desktop (1024px+)
- Full three-column layouts
- Sidebar visible
- Max width: 1440px

---

## 🏷️ Logo / Branding

| Property | Value |
|----------|-------|
| **Size** | 120px × 40px |
| **Position** | Top-left header |
| **Placeholder** | "LegalIndia.AI" text |

Upload location: `/frontend/public/logo.svg`

---

## 🎬 Motion & Animation

**Library:** Framer Motion

### Global Settings
```tsx
duration: 0.3s
ease: [0.4, 0, 0.2, 1] // easeInOut cubic-bezier
```

### Variants Available

#### Fade In
```tsx
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
```

#### Slide Up
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
```

#### Button Hover
```tsx
whileHover={{ y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
```

---

## 📦 Reusable Components

### Available Components

1. **`<Button />`** - Primary/Secondary buttons with hover animations
2. **`<Card />`** - Content cards with consistent spacing
3. **`<Container />`** - Max-width centered wrapper
4. **`<Section />`** - Vertical spacing wrapper
5. **`<UploadBox />`** - File upload component

### Import
```tsx
import { Button, Card, Container } from "@/components/ui";
```

---

## 📂 File Structure

```
/frontend/src/
├── app/
│   ├── page.tsx          ✅ Updated with design system
│   ├── layout.tsx        ✅ Updated
│   ├── globals.css       ✅ Design tokens added
│   ├── about/
│   ├── login/
│   ├── app/
│   └── settings/
├── components/
│   ├── ui/
│   │   ├── Button.tsx    ✅ Created
│   │   ├── Card.tsx      ✅ Created
│   │   ├── Container.tsx ✅ Created
│   │   ├── Section.tsx   ✅ Created
│   │   └── UploadBox.tsx ✅ Created
│   ├── header.tsx
│   └── footer.tsx
└── lib/
    ├── design-system.ts  ✅ Created (tokens + variants)
    ├── utils.ts
    └── config.ts
```

---

## ✅ Implementation Checklist

- [x] Install framer-motion
- [x] Create globals.css with design tokens
- [x] Create design-system.ts configuration
- [x] Build reusable UI components
- [x] Update homepage with design system
- [x] Fix all TypeScript/linting errors
- [ ] Apply design to remaining pages (Steps 2-12)

---

## 🚀 Usage Examples

### Using Design System Components

```tsx
import { Button, Card, Container } from "@/components/ui";

export default function MyPage() {
  return (
    <Container>
      <Card>
        <h2>Title</h2>
        <p>Content with automatic 20px spacing</p>
        <Button variant="primary">Click Me</Button>
      </Card>
    </Container>
  );
}
```

### Using Design Tokens

```tsx
import { designSystem } from "@/lib/design-system";

// Access tokens
const accentColor = designSystem.colors.accentBlue; // #2E7CF6
const maxWidth = designSystem.layout.maxWidth; // 1440px
```

### Using Motion Variants

```tsx
import { motion } from "framer-motion";
import { motionVariants } from "@/lib/design-system";

<motion.div
  initial={motionVariants.fadeIn.initial}
  animate={motionVariants.fadeIn.animate}
  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
>
  Content
</motion.div>
```

---

## 📋 Next Steps (Steps 2-12)

Ready to receive instructions for:
- Step 2: Specific page implementations
- Step 3: Component refinements
- Step 4-12: Additional features

**Design System Foundation Complete!** ✅

All spacing, colors, typography, and motion are now consistent across the project.

