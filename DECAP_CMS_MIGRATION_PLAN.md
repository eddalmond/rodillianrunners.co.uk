# Decap CMS with Git Gateway Migration Plan

## Goal
Replace Sveltia CMS with Decap CMS + Git Gateway + Netlify Identity to provide **username/password authentication** for non-technical committee members, eliminating the need for GitHub PAT tokens.

---

## What Changes

### Before (Sveltia CMS)
- ❌ Users need GitHub account
- ❌ Users create Personal Access Token (technical)
- ❌ Token management is confusing
- ✅ Direct GitHub API access
- ✅ Lightweight (300KB)

### After (Decap CMS + Git Gateway)
- ✅ Simple email/password login
- ✅ No GitHub knowledge needed
- ✅ You invite users via email
- ✅ WordPress-style login experience
- ✅ Same config file format
- ⚠️ Slightly larger bundle (~1-2MB)
- ⚠️ Requires Netlify account (free tier)

---

## Cost Analysis

| Service | Current | After Migration | Savings |
|---------|---------|-----------------|---------|
| WordPress hosting | £11/month | £0 | **£11/month** |
| Railway (Hugo site) | £0 | £0 | - |
| Netlify (Identity only) | - | £0 (free tier) | - |
| **Total monthly** | **£11** | **£0** | **£132/year saved** |

---

## Implementation Steps

### Phase 1: Set Up Netlify (15 minutes)

1. **Create Netlify account** (if you don't have one)
   - Go to https://app.netlify.com/signup
   - Sign up with GitHub (reuses your existing account)

2. **Import your GitHub repo**
   - Add new site → Import existing project
   - Connect to GitHub → Select `eddalmond/rodillianrunners.co.uk`
   - **IMPORTANT**: We're NOT using Netlify for hosting
   - Set build command to `echo "skip"` (prevents builds)
   - This connection is ONLY for Git Gateway

3. **Enable Netlify Identity**
   - Site settings → Identity → Enable Identity
   - Registration: Set to "Invite only"
   - External providers: Enable email/password (default)
   - Optional: Enable Google OAuth for easier login

4. **Enable Git Gateway**
   - Identity settings → Services → Git Gateway
   - Click "Enable Git Gateway"
   - This gives Netlify permission to commit to your repo on behalf of users

5. **Get your Netlify site URL**
   - Note down your site URL: `https://[site-name].netlify.app`
   - We'll use this in the CMS config

---

### Phase 2: Update CMS Files (10 minutes)

**Files to modify:**
1. `/static/admin/index.html` - Switch from Sveltia to Decap script
2. `/static/admin/config.yml` - Update backend config

**Changes needed:**

#### A) Update `static/admin/index.html`

Replace the Sveltia script with Decap + Netlify Identity Widget:

```html
<!-- OLD: Remove this -->
<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>

<!-- NEW: Add these two scripts -->
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
<script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
```

Add identity redirect handling after the scripts:

```html
<script>
  // Netlify Identity redirect handling
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
</script>
```

#### B) Update `static/admin/config.yml`

Change the backend section from:

```yaml
# OLD
backend:
  name: github
  repo: eddalmond/rodillianrunners.co.uk
  branch: main
```

To:

```yaml
# NEW
backend:
  name: git-gateway
  branch: main
```

That's it! The rest of the config stays exactly the same.

---

### Phase 3: Add Netlify Identity to Your Site (5 minutes)

Add the Identity widget script to your Hugo site so users can log in from the main site (optional but recommended):

Create `themes/rodillian/layouts/partials/netlify-identity.html`:

```html
<!-- Netlify Identity Widget -->
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
</script>
```

Then include it in `themes/rodillian/layouts/_default/baseof.html` before `</body>`:

```html
  {{ partial "netlify-identity.html" . }}
</body>
```

---

### Phase 4: Customize Login Page (10 minutes) - Optional

Make the login look like WordPress admin:

Create `static/admin/custom.css`:

```css
/* WordPress-style login page */
[data-netlify-identity-menu] {
  background: #f0f0f1;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
}

[data-netlify-identity-signup],
[data-netlify-identity-login] {
  background: #f0f0f1;
}

.modalContent {
  border-radius: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,.13);
}

.btn {
  background: #2271b1;
  border-color: #2271b1;
  color: #fff;
  border-radius: 3px;
  padding: 0 12px;
  font-size: 13px;
  line-height: 2.15384615;
  min-height: 30px;
}

.btn:hover {
  background: #135e96;
  border-color: #135e96;
}

.formGroup input {
  border: 1px solid #8c8f94;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 13px;
}

.formGroup input:focus {
  border-color: #2271b1;
  box-shadow: 0 0 0 1px #2271b1;
  outline: 2px solid transparent;
}
```

Reference it in `static/admin/index.html`:

```html
<link rel="stylesheet" href="/admin/custom.css" />
```

---

### Phase 5: Deploy & Test (10 minutes)

1. **Commit and push changes**
   ```bash
   git add static/admin/
   git commit -m "feat(cms): switch from Sveltia to Decap with Git Gateway auth"
   git push origin main
   ```

2. **Wait for Railway deployment** (~60 seconds)

3. **Test the new login flow**
   - Go to `https://rodillianrunners.co.uk/admin/`
   - You should see "Login with Netlify Identity"
   - Click it - Netlify Identity modal appears
   - Sign up with your email (first user auto-approves)

4. **Invite committee members**
   - Netlify dashboard → Identity → Invite users
   - Enter their email addresses
   - They receive invite email with "Accept invitation" link
   - They create password, then can access `/admin/`

---

## User Experience Comparison

### Before (Sveltia + GitHub PAT)

```
1. User visits /admin/
2. "Sign in with Token" button
3. User must:
   - Have GitHub account
   - Go to GitHub settings
   - Generate fine-grained PAT
   - Configure correct permissions
   - Copy token
   - Paste into login
4. Edit content, publish ✅
```

**Complexity**: HIGH ❌

---

### After (Decap + Git Gateway)

```
1. User visits /admin/
2. "Log in" button
3. User enters email + password
4. Edit content, publish ✅
```

**Complexity**: LOW ✅ (identical to WordPress)

---

## Rollback Plan

If something goes wrong, we can revert instantly:

```bash
# Revert to Sveltia
git revert HEAD
git push origin main
```

Railway redeploys in ~60 seconds, back to working state.

---

## FAQ

**Q: Do users still need GitHub accounts?**  
A: No! That's the whole point. You invite them via email, they create a password, done.

**Q: Will this work with Railway hosting?**  
A: Yes! Netlify is ONLY used for authentication. Your site stays on Railway.

**Q: What if Netlify goes down?**  
A: Users can't log into the CMS, but the live site stays up (it's on Railway). You can still edit via Git directly.

**Q: Can I remove Netlify later?**  
A: Yes, but you'd need to implement your own auth server (Option 2 from earlier - more complex).

**Q: How do I remove a user?**  
A: Netlify dashboard → Identity → Users → Delete user

**Q: Can users reset passwords?**  
A: Yes, built-in "Forgot password" flow via email.

---

## Security Considerations

### Before (Sveltia)
- ✅ Users have direct GitHub API access (auditable)
- ❌ PAT tokens have broad permissions (repo-wide)
- ❌ No centralized user management
- ❌ Can't revoke access without changing GitHub perms

### After (Git Gateway)
- ✅ Netlify acts as proxy (you control access)
- ✅ Centralized user management (invite/revoke instantly)
- ✅ Users never see GitHub
- ⚠️ Netlify has write access to your repo (via Git Gateway)
- ⚠️ Commits appear as "netlify-cms" author

**Mitigation**: Enable GitHub branch protection on `main` if you want review workflow.

---

## Estimated Timeline

| Phase | Time | Complexity |
|-------|------|------------|
| 1. Netlify setup | 15 min | Easy |
| 2. Update CMS files | 10 min | Easy |
| 3. Add Identity widget | 5 min | Easy |
| 4. Customize login (optional) | 10 min | Medium |
| 5. Deploy & test | 10 min | Easy |
| **Total** | **50 minutes** | **Easy** |

---

## Next Steps

**Ready to proceed?** I can implement this migration right now in this order:

1. Update `static/admin/index.html` (switch scripts)
2. Update `static/admin/config.yml` (change backend)
3. Add Netlify Identity partial to theme
4. Create optional custom CSS for WordPress-style login
5. Commit and push
6. Guide you through Netlify setup (you'll need to do this part in the dashboard)

**Want to see the changes first?** I can create a branch so you can review before deploying.

**Questions?** Let me know!
