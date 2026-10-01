# Static Site → WordPress Alignment Plan

**Goal**: Achieve complete parity with the WordPress site in both **styling** AND **content/wording** so you can switch hosting providers, then later propose modernization to the committee.

## Current State Analysis

### WordPress Site (www.rodillianrunners.co.uk)
- **Theme**: Light/white background with traditional layout
- **Header**: Simple horizontal navigation with logo
- **Homepage**: Single-column centered content with welcoming text
- **Typography**: Standard web fonts, traditional sizing
- **Colors**: Likely light backgrounds with standard link colors
- **Layout**: Centered content, traditional WordPress theme structure
- **Footer**: Standard footer with social links and useful links sidebar

### Static Site (Current Hugo Implementation)
- **Theme**: Dark/black background (#000000) with modern design
- **Header**: Sticky header with inline logo + navigation
- **Homepage**: Hero section with background image + at-a-glance cards + ethos split section
- **Typography**: Modern system fonts with clamp() responsive sizing
- **Colors**: Black bg, white text, red (#e43028) and green (#5ec40f) accents
- **Layout**: Modernized with hero, 4-column card grid, 2-column ethos section, 3-column footer
- **Footer**: Redesigned modern 3-column grid footer with red copyright bar

## Alignment Strategy

### Phase 1: Visual Inspection & Color Extraction
**Goal**: Get exact colors, fonts, and spacing from WordPress site

1. **Use browser DevTools on live WordPress site** to extract:
   - Exact background colors (header, body, footer)
   - Exact font families and sizes
   - Link colors (normal, hover, visited)
   - Button styling (if any)
   - Spacing/padding values
   - Border colors and styles

2. **Screenshot comparison** between WordPress and static site for:
   - Header layout differences
   - Navigation styling
   - Content area width and centering
   - Typography scale
   - Footer structure

### Phase 2: CSS Theme Conversion
**Goal**: Convert dark theme to match WordPress light theme

**Files to modify**: `themes/rodillian/assets/site.css`

Changes needed:
- **Color palette**: Replace black backgrounds with white/light gray
- **Text colors**: Change white text to dark gray/black
- **Accent colors**: Verify red/green match WordPress (may need adjustment)
- **Remove/simplify** modern design elements:
  - Hero section background effects
  - Card hover animations (or tone down)
  - Gradient backgrounds
  - Box shadows (or make subtle)

### Phase 3: Layout Simplification
**Goal**: Match WordPress single-column centered layout

**Files to modify**: 
- `themes/rodillian/layouts/home.html`
- `themes/rodillian/layouts/_default/baseof.html`

Changes needed:

#### Header (`baseof.html` lines 27-65)
- Remove sticky positioning (or verify WordPress has it)
- Simplify header styling to match WordPress
- Adjust logo size to match
- Check if search functionality exists in WordPress
- Match navigation styling (uppercase? spacing?)

#### Homepage (`home.html`)
**Current structure**:
```
- Hero section (lines 3-15)
- Info cards grid (lines 17-73)
- Ethos split section (lines 75-91)
```

**WordPress structure** (likely):
```
- Welcome heading
- Welcome text paragraphs
- Club information text
- Links to activities/membership
```

**Action**: Simplify or remove:
- Hero section → simple heading + text
- 4-card grid → integrate into body text or simplify
- Ethos split → single column text flow

#### Footer (`baseof.html` lines 77-134)
- **Current**: 3-column grid with red copyright bar
- **WordPress**: Likely simpler with sidebar "Useful Links"
- **Action**: Check if 3-column is acceptable or needs simplification

### Phase 4: Typography Matching

**Changes to**: `site.css` typography section (lines 64-94)

1. Replace `clamp()` responsive sizing with fixed sizes (if WordPress uses them)
2. Match exact font-size values for:
   - h1, h2, h3 headings
   - Body text (currently 17px)
   - Navigation text
3. Match line-height values
4. Match font-weight values
5. Verify font-family (system fonts vs WordPress theme fonts)

### Phase 5: Component Alignment

#### Navigation (lines 130-263 in site.css)
- Match dropdown styling
- Match active state styling  
- Match mobile breakpoint (currently 860px)
- Verify uppercase text-transform is WordPress pattern

#### Content Area
- Ensure max-width matches WordPress content width
- Match paragraph spacing
- Match heading margins
- Match link styling (underline, colors)

#### Forms (Contact page)
- Match input field styling
- Match button styling
- Verify form layout matches

#### Tables (Club Records)
- Simplify table styling if WordPress uses plainer tables
- Match border colors
- Match header styling

### Phase 6: Remove Modern Features (if needed)

Elements that may not exist in WordPress and could be removed:
- [ ] Hero background image mask/gradient
- [ ] Card hover transforms
- [ ] Box shadows throughout
- [ ] Animated sub-menu fade-in
- [ ] Border-radius (check if WordPress is more square)
- [ ] Backdrop effects

### Phase 7: Testing Checklist

- [ ] Homepage layout matches WordPress
- [ ] Header/navigation matches
- [ ] Footer matches
- [ ] Typography sizes match
- [ ] Colors match (backgrounds, text, links, accents)
- [ ] Content pages (Why Rodillian Runners, Contact, etc.) match
- [ ] Mobile responsive behavior matches
- [ ] Club Records table matches
- [ ] Calendar widget matches
- [ ] Photos page matches

## Implementation Priority

**Quick wins** (do these first for maximum visual alignment):
1. Background color: black → white
2. Text color: white → dark gray/black  
3. Remove hero background image effects
4. Simplify homepage to text-based layout
5. Match navigation styling

**Medium effort**:
6. Footer restructure (if needed)
7. Typography fine-tuning
8. Spacing adjustments
9. Component styling (tables, forms, cards)

**Lower priority**:
10. Animation removal/simplification
11. Border-radius adjustments
12. Minor polish details

## Content/Wording Alignment (See CONTENT_COMPARISON.md)

### Critical Content Issues Found:

1. **Homepage** - Major restructure needed
   - Current: Hero section + 4 info cards + ethos split layout
   - Target: Simple paragraph flow like WordPress
   - Wording: Similar message but different structure and opening line
   - **Action**: Rewrite `home.html` to match WordPress simple layout

2. **Distance League** - Minor differences
   - WordPress: More detailed explanation of insurance, admin details
   - Static: Shorter, friendlier version
   - **Action**: Match WordPress wording exactly

3. **Membership** ✅ - Nearly perfect match (minor tweaks only)

4. **Why Rodillian Runners** ✅ - Perfect match

5. **Contact** ✅ - Perfect match

6. **Club Activities** - Structure different
   - WordPress: Calendar-first with upcoming events
   - Static: Activity cards + calendar widget
   - **Action**: Verify which approach WordPress uses

## Implementation Plan

### Phase 1: Extract Exact WordPress Styling (1-2 hours)
Use browser DevTools on WordPress site to capture:
- [ ] Exact hex colors (background, text, links, borders)
- [ ] Font families (likely standard WordPress theme fonts)
- [ ] Font sizes for all elements
- [ ] Spacing/padding values
- [ ] Header layout and sizing
- [ ] Footer structure
- [ ] Button styling (if any exist)
- [ ] Navigation active states
- [ ] Mobile breakpoints

### Phase 2: Content Alignment (2-3 hours)
Work through each page systematically:
- [ ] Homepage - Complete rewrite to match WordPress
- [ ] Distance League - Update to WordPress wording
- [ ] Membership - Minor wording tweaks
- [ ] Verify all other pages match

### Phase 3: CSS Theme Conversion (3-4 hours)
Transform dark modern theme → light WordPress theme:
- [ ] Update CSS variables (`:root` section)
- [ ] Remove/simplify modern effects (gradients, shadows, transforms)
- [ ] Match typography exactly
- [ ] Simplify layout structures
- [ ] Match component styling (forms, tables, etc.)

### Phase 4: Layout Restructure (2-3 hours)
- [ ] Homepage layout simplification
- [ ] Header adjustments
- [ ] Footer verification/adjustment
- [ ] Navigation styling
- [ ] Mobile responsive checks

### Phase 5: Testing & Verification (1-2 hours)
- [ ] Side-by-side visual comparison
- [ ] Content audit page-by-page
- [ ] Mobile testing
- [ ] Cross-browser check
- [ ] Accessibility check

**Total estimated effort: 9-14 hours**

## Next Steps - Your Choice

I can help you with this alignment in several ways:

**Option A: Full Audit First** (Recommended)
1. I'll extract exact WordPress styling using browser inspection techniques
2. Create detailed styling specification document
3. Then implement changes systematically
4. **Pros**: Most accurate, less rework
5. **Cons**: Slower to see results

**Option B: Start Implementation Immediately**
1. Begin with content alignment (easier, clearer wins)
2. Convert dark → light theme with best guesses
3. Iterate based on your feedback
4. **Pros**: Faster visible progress
5. **Cons**: May need refinement after comparison

**Option C: Hybrid Approach**
1. Start with homepage content rewrite (clear requirement)
2. Extract WordPress colors while you review homepage
3. Apply styling changes iteratively
4. **Pros**: Balanced speed + accuracy
5. **Cons**: Context switching

**Option D: You Lead**
Tell me which specific area to tackle first, or if you want to do the WordPress style extraction yourself and share the values with me.

Which approach would you prefer?
