# 🎬 Animation Reference Guide

## Animation Timing Reference

### Quick Reference Table

| Element | Animation Type | Duration | Easing | Delay |
|---------|---------------|----------|--------|-------|
| Page Load | Fade + Slide | 0.6s | Ease Out | 0s |
| Category Buttons | Spring | ~0.4s | Spring (400/17) | 0.05s stagger |
| Active Indicator | Layout | ~0.3s | Spring (380/30) | 0s |
| Search Input | Scale + Shadow | 0.3s | Ease | 0s |
| Results Counter | Number + Spring | 0.5s | Spring (300/20) | 0.5s |
| Card Entrance | Fade + Slide + Scale | 0.5s | Cubic Bezier | 0.08s stagger |
| Card Hover | Lift + Zoom | 0.3-0.6s | Ease Out | 0s |
| Card Exit | Fade + Scale | 0.3s | Linear | 0s |
| Badge Entrance | Slide | 0.5s | Ease | 0.2s + index |
| Rating Star | Rotate | 2s | Ease | 3s repeat |
| Arrow Button | Fade + Slide | 0.3s | Ease | 0s |
| Empty State | Scale + Fade | 0.4s | Spring (260/20) | 0.1s |

## Detailed Animation Specs

### 1. Page Load Animation

```typescript
pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
}

transition: { duration: 0.6, ease: "easeOut" }
```

**Effect**: Page slides in from right with fade

---

### 2. Category Button Animations

#### Inactive State
```typescript
{
  scale: 1,
  backgroundColor: "rgba(255, 255, 255, 0.8)"
}
```

#### Active State
```typescript
{
  scale: 1.05,
  backgroundColor: "rgb(37, 99, 235)",
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 17
  }
}
```

#### Hover State
```typescript
{
  scale: 1.08,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 17
  }
}
```

#### Tap State
```typescript
{
  scale: 0.95
}
```

**Effect**: Buttons scale and change color with spring physics

---

### 3. Active Category Indicator

```typescript
<motion.div layoutId="activeCategory">
  transition: {
    type: "spring",
    stiffness: 380,
    damping: 30
  }
</motion.div>
```

**Effect**: Blue background slides smoothly between active buttons

---

### 4. Search Input Animation

#### Focus Effect
```typescript
animate: {
  scale: isFocused ? 1.02 : 1,
  boxShadow: isFocused
    ? "0 20px 60px rgba(37, 99, 235, 0.15)"
    : "0 10px 30px rgba(0, 0, 0, 0.08)"
}

transition: { duration: 0.3 }
```

#### Search Icon
```typescript
animate: {
  scale: isFocused ? 1.1 : 1,
  color: isFocused ? "rgb(37, 99, 235)" : "rgb(156, 163, 175)"
}
```

**Effect**: Input scales up and gains blue shadow on focus

---

### 5. Results Counter Animation

```typescript
// Number animation (custom)
const increment = Math.ceil(end / (duration / 16)); // 60fps
// Counts from 0 to target over 500ms

// Container animation
initial: { scale: 1.2, opacity: 0 }
animate: { scale: 1, opacity: 1 }
transition: { 
  type: "spring",
  stiffness: 300,
  damping: 20
}
```

**Effect**: Counter animates from 0 with spring bounce

---

### 6. Destination Card Animations

#### Entrance
```typescript
itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] // Custom cubic bezier
    }
  }
}

containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
}
```

#### Hover
```typescript
whileHover: { 
  y: -10,
  transition: { duration: 0.3 }
}
```

#### Image Zoom
```typescript
<motion.img
  whileHover: { scale: 1.1 }
  transition: { duration: 0.6, ease: "easeOut" }
/>
```

#### Exit
```typescript
exit: {
  opacity: 0,
  scale: 0.9,
  y: -20,
  transition: { duration: 0.3 }
}
```

**Effect**: Cards fade in from below with stagger, lift on hover

---

### 7. Badge Animations

```typescript
initial: { x: -20, opacity: 0 }
animate: { x: 0, opacity: 1 }
transition: { delay: i * 0.1 + 0.2 }
whileHover: { scale: 1.05 }
```

**Effect**: Badges slide in from left with sequential delay

---

### 8. Rating Badge Animation

```typescript
// Container
initial: { x: 20, opacity: 0 }
animate: { x: 0, opacity: 1 }
transition: { delay: i * 0.1 + 0.2 }
whileHover: { scale: 1.1 }

// Star icon
animate: { rotate: [0, 15, -15, 0] }
transition: { 
  duration: 2,
  repeat: Infinity,
  repeatDelay: 3
}
```

**Effect**: Badge slides in from right, star wiggles periodically

---

### 9. Arrow Button Animation

```typescript
initial: { opacity: 0, y: 20 }
whileHover: { 
  opacity: 1, 
  y: 0,
  backgroundColor: "rgb(37, 99, 235)",
  color: "white"
}
transition: { duration: 0.3 }

// Arrow icon
whileHover: { x: 3, y: -3 }
transition: { duration: 0.2 }
```

**Effect**: Button fades in on card hover, arrow moves diagonally

---

### 10. Filter Count Badge

```typescript
filterCountVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25
    }
  },
  exit: { 
    scale: 0, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
}
```

**Effect**: Badge pops in with spring, shrinks out

---

### 11. Active Filter Chip

```typescript
initial: { opacity: 0, y: -10 }
animate: { opacity: 1, y: 0 }
exit: { opacity: 0, y: -10 }
transition: { delay: 0.2 }

// Close button
whileHover: { scale: 1.2, rotate: 90 }
whileTap: { scale: 0.9 }
```

**Effect**: Chip slides down, X button rotates on hover

---

### 12. Empty State Animation

```typescript
// Container
initial: { opacity: 0, scale: 0.9 }
animate: { opacity: 1, scale: 1 }
exit: { opacity: 0, scale: 0.9 }
transition: { duration: 0.4 }

// Compass icon
initial: { scale: 0 }
animate: { scale: 1 }
transition: { 
  type: "spring",
  stiffness: 260,
  damping: 20,
  delay: 0.1
}

// Text elements
initial: { opacity: 0, y: 10 }
animate: { opacity: 1, y: 0 }
transition: { delay: 0.2, 0.3, 0.4 } // Sequential
```

**Effect**: Empty state scales in with staggered text

---

## Spring Physics Reference

### Understanding Spring Values

**Stiffness** (higher = snappier)
- 260: Gentle, slow
- 300: Moderate
- 380: Quick
- 400: Snappy
- 500: Very snappy

**Damping** (higher = less bounce)
- 15: Very bouncy
- 17: Bouncy
- 20: Moderate bounce
- 25: Slight bounce
- 30: Minimal bounce

### Common Combinations

| Use Case | Stiffness | Damping | Feel |
|----------|-----------|---------|------|
| Smooth entrance | 260 | 20 | Gentle, flowing |
| Number counter | 300 | 20 | Balanced |
| Layout shift | 380 | 30 | Quick, stable |
| Button press | 400 | 17 | Snappy, playful |
| Badge pop | 500 | 25 | Energetic |

---

## Easing Functions Reference

### Cubic Bezier
```typescript
ease: [0.25, 0.46, 0.45, 0.94]
```
Custom easing for smooth, natural motion

### Built-in Easings
- `"linear"` - Constant speed
- `"easeIn"` - Slow start
- `"easeOut"` - Slow end
- `"easeInOut"` - Slow start and end

---

## Performance Tips

### GPU Acceleration
✅ Use these properties (GPU-accelerated):
- `transform` (translate, scale, rotate)
- `opacity`

❌ Avoid these (CPU-intensive):
- `width`, `height`
- `top`, `left`
- `margin`, `padding`

### Optimization Checklist
- [ ] Use `will-change` sparingly
- [ ] Keep animations under 0.5s
- [ ] Limit simultaneous animations
- [ ] Use `layout` for repositioning
- [ ] Debounce rapid state changes
- [ ] Test on low-end devices

---

## Animation States Diagram

```
Card Lifecycle:
┌─────────────┐
│   Hidden    │ (opacity: 0, y: 30, scale: 0.9)
└──────┬──────┘
       │ 0.5s + stagger
       ▼
┌─────────────┐
│   Visible   │ (opacity: 1, y: 0, scale: 1)
└──────┬──────┘
       │ hover
       ▼
┌─────────────┐
│   Hovered   │ (y: -10, image scale: 1.1)
└──────┬──────┘
       │ filter change
       ▼
┌─────────────┐
│    Exit     │ (opacity: 0, scale: 0.9, y: -20)
└─────────────┘

Category Button Lifecycle:
┌─────────────┐
│  Inactive   │ (scale: 1, bg: white)
└──────┬──────┘
       │ click
       ▼
┌─────────────┐
│   Active    │ (scale: 1.05, bg: blue)
└──────┬──────┘
       │ hover
       ▼
┌─────────────┐
│  Hovered    │ (scale: 1.08)
└──────┬──────┘
       │ tap
       ▼
┌─────────────┐
│   Tapped    │ (scale: 0.95)
└─────────────┘
```

---

## Custom Animation Examples

### Pulse Effect
```typescript
animate: {
  scale: [1, 1.05, 1],
  opacity: [1, 0.8, 1]
}
transition: {
  duration: 2,
  repeat: Infinity,
  ease: "easeInOut"
}
```

### Wiggle Effect
```typescript
animate: {
  rotate: [0, 5, -5, 0]
}
transition: {
  duration: 0.5,
  repeat: 3
}
```

### Slide In From Side
```typescript
initial: { x: -100, opacity: 0 }
animate: { x: 0, opacity: 1 }
transition: { 
  type: "spring",
  stiffness: 300,
  damping: 20
}
```

### Bounce In
```typescript
initial: { scale: 0 }
animate: { scale: 1 }
transition: {
  type: "spring",
  stiffness: 500,
  damping: 15
}
```

---

## Testing Animations

### Chrome DevTools
1. Open DevTools (F12)
2. Go to "More tools" → "Animations"
3. Trigger animation
4. Inspect timing and easing

### Performance Monitor
1. Open DevTools
2. Go to "Performance"
3. Record interaction
4. Check FPS (should be 60)

### Slow Motion
```typescript
// Add to MotionConfig
<MotionConfig transition={{ duration: 2 }}>
  {/* Your components */}
</MotionConfig>
```

---

## Accessibility

### Reduced Motion
```typescript
const prefersReducedMotion = useReducedMotion();

<motion.div
  animate={prefersReducedMotion ? {} : { scale: 1.1 }}
/>
```

### Focus Visible
```css
.button:focus-visible {
  outline: 2px solid blue;
  outline-offset: 2px;
}
```

---

**Last Updated**: December 19, 2025  
**Version**: 1.0.0



