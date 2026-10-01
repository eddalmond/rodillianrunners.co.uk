# Content & Styling Alignment Status

**Date**: 2026-10-01  
**Goal**: Achieve parity with WordPress site (www.rodillianrunners.co.uk) in both styling and content

---

## ✅ COMPLETED - Content Alignment

### 1. Homepage (`content/_index.md`) ✅
**Status**: Complete rewrite to match WordPress

**Changes Made**:
- ❌ Removed: Hero section with background image
- ❌ Removed: 4-column info cards grid
- ❌ Removed: Ethos split section with photo
- ✅ Added: Simple paragraph flow matching WordPress
- ✅ Added: Google Maps embed (centered, 80% width)
- ✅ Matched: Exact WordPress wording and link structure

**WordPress Structure**: Simple paragraphs → Map → Welcome text → Club ethos → Free trial offer  
**Static Site Structure**: Now matches exactly

---

### 2. Distance League (`content/club-activities/distance-league.md`) ✅
**Status**: Content updated to match WordPress exactly

**Changes Made**:
- ✅ Updated: Full text to match WordPress detailed version
- ✅ Added: Information about insurance, admin details, committee rights
- ✅ Matched: WordPress tone (slightly more formal/official)

**Before**: Shorter, friendlier version  
**After**: Matches WordPress comprehensive explanation

---

### 3. Club Records (`content/club-records.md`) ✅
**Status**: Minor wording adjustment

**Changes Made**:
- ✅ Changed: "contact us" link → "contact Jon Vaile" (matches WordPress)

---

### 4. Photos (`content/photos.md`) ✅
**Status**: Simplified to match WordPress

**Changes Made**:
- ✅ Removed: Extra introductory text
- ✅ Simplified: To just "Follow on Instagram" link (matches WordPress minimalist approach)

---

## ✅ ALREADY MATCHING

### 5. Why Rodillian Runners ✅
**Status**: Perfect match - no changes needed

### 6. Contact Us ✅
**Status**: Perfect match - no changes needed  
Form fields, wording, and structure all identical

### 7. Championship ✅
**Status**: Perfect match - no changes needed  
Past winners, rules reference, description all match

### 8. Membership ✅
**Status**: Near perfect match - minimal differences acceptable  
Pricing, affiliation info, document links all correct

---

## ⚠️ PAGES NEEDING REVIEW

### 9. Club Activities (`content/club-activities/_index.md`)
**Status**: Structure differs from WordPress

**Current Static Site**:
- Has activity cards (Distance League, Championship)
- Has live calendar widget

**WordPress Site**:
- Shows upcoming events calendar directly
- May not have the card layout

**Action Needed**: Verify if card layout is acceptable or needs removal

---

### 10. Documents Page (`content/documents/_index.md`)
**Status**: WordPress returned 404 - may not exist

**Current Static Site**: Has organized document listing
**WordPress**: Page may not exist (404 error)

**Action Needed**: Verify if this page should exist or be removed

---

### 11. Championship Race Calendar
**Status**: Technical implementation (calendar widget)

**Current Static Site**: Has calendar widget showing championship races only
**WordPress**: Unknown structure

**Action Needed**: Verify calendar display matches WordPress

---

## 🎨 STYLING STATUS

### Colors ✅ PERFECT MATCH
Both sites use **identical color scheme**:
- Background: `#000000` (black) ✅
- Text: `#fafbfc` (white) ✅
- Links: `#e43028` (red) ✅
- Hover: `#5ec40f` (green) ✅
- Footer bottom: `#c91d20` (red copyright bar) ✅

**No color changes needed!**

---

### Typography
**WordPress** (from global.css):
- Body: 16px, line-height 1.65
- H1: 40px, bold, line-height 1.5
- H2: 35px, bold, line-height 1.5
- H3: 30px, bold, line-height 1.5

**Static Site**:
- Body: 17px, line-height 1.6
- H1: clamp(2rem, 4.5vw, 3rem)
- H2: clamp(1.5rem, 3vw, 2.25rem)
- H3: 1.25rem

**Action Needed**: Match exact font sizes and remove clamp() responsive sizing

---

### Layout Components Still Present (May Need Removal)

1. **Hero section CSS** (lines 265-306 in site.css)
   - Not used on new homepage
   - Can be removed or kept for future use

2. **Info cards grid CSS** (lines 346-406 in site.css)
   - Not used on new homepage
   - Still used on Club Activities page
   - Decision: Keep or remove?

3. **Ethos split section CSS** (lines 408-433 in site.css)
   - Not used on new homepage
   - Can be removed

4. **Activity cards** (lines 486-537 in site.css)
   - Used on Club Activities page
   - Verify if WordPress has similar cards

---

## 📋 NEXT STEPS

### Priority 1: Typography Fine-Tuning
- [ ] Update body font-size: 17px → 16px
- [ ] Update line-height: 1.6 → 1.65
- [ ] Replace h1 clamp() with fixed 40px
- [ ] Replace h2 clamp() with fixed 35px
- [ ] Replace h3 with fixed 30px
- [ ] Match h4, h5, h6 sizes (25px, 20px, 16px)

### Priority 2: Verify/Adjust Remaining Pages
- [ ] Check Club Activities page structure against WordPress
- [ ] Verify Documents page exists in WordPress (got 404)
- [ ] Confirm calendar widget display matches WordPress

### Priority 3: CSS Cleanup (Optional)
- [ ] Remove unused hero section styles
- [ ] Remove unused ethos split styles
- [ ] Decide on info-cards/activity-cards (keep or remove)

### Priority 4: Final Polish
- [ ] Header sticky behavior (WordPress has it)
- [ ] Navigation hover states
- [ ] Mobile responsive breakpoints
- [ ] Footer structure verification

---

## 🎯 MAJOR WIN

**The hardest work is done!** 

✅ Homepage completely restructured  
✅ Content aligned across major pages  
✅ Colors already perfect  
✅ Dark theme confirmed as correct

**Remaining work**: Typography tweaks and layout verification (estimated 1-2 hours)

---

## 🚀 READY FOR MIGRATION?

**Almost!** After typography fixes and final verification, you'll have:
- ✅ Content matching WordPress exactly
- ✅ Styling matching WordPress exactly
- ✅ Ready to switch hosting
- ✅ Can present modernization vision to committee

The static site will be functionally identical to WordPress, making the switch invisible to users.
