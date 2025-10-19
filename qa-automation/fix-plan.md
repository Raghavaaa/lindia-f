# Frontend QA Elevation - Fix Plan

## Priority Order (by User Impact)

### 🔴 CRITICAL (Blocks Core Flow)
1. **Phone validation not working** - Client creation flow broken
2. **Results window not opening** - Research functionality unusable  
3. **File picker not opening** - Upload functionality broken

### 🟠 HIGH (Visual Regressions)
4. **Sidebar not collapsing on mobile** - Mobile UX broken

### 🟡 MEDIUM (Accessibility & Performance)
5. **Low contrast on submit button** - Accessibility violation
6. **CLS exceeds 0.1 threshold** - Performance issue

## Auto-Fix Strategy

### Phase 1: Critical Fixes (Auto-apply)
- Fix phone validation regex and UI feedback
- Debug research results modal rendering
- Fix file input click handlers and z-index issues

### Phase 2: High Priority (Auto-apply)
- Fix mobile sidebar responsive behavior

### Phase 3: Medium Priority (Auto-apply)
- Update button contrast ratios
- Optimize layout shift issues

## Expected Outcomes
- All core user flows functional
- Mobile responsive design working
- WCAG AA compliance achieved
- Performance metrics within thresholds
