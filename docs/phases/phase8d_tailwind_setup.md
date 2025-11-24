# Phase 8d: Tailwind CSS Setup

**Estimated Time:** 30-45 minutes

## Overview

Initialize Tailwind CSS configuration and create globals.css file with Tailwind directives and custom styles migrated from index.html.

## Prerequisites

✅ Phase 8c complete: Tailwind CSS installed as dependency
✅ tailwindcss, postcss, autoprefixer installed
✅ Clean git working directory

## Goals

1. Initialize Tailwind CSS and PostCSS configuration files
2. Create src/app/globals.css with Tailwind directives
3. Migrate custom styles from index.html to globals.css
4. Configure Tailwind for Next.js file structure
5. Set up dark mode and theme extensions

## Phase Steps

### Step 1: Initialize Tailwind CSS

Generate Tailwind and PostCSS configuration files:

```bash
# Initialize Tailwind CSS (creates tailwind.config.js and postcss.config.js)
npx tailwindcss init -p

# Verify files created
ls -la tailwind.config.js postcss.config.js
```

**Expected output:** Two new configuration files created

### Step 2: Configure Tailwind for Next.js

Update `tailwind.config.js` with Next.js content paths and settings from index.html:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./App.tsx",
    "./index.tsx",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
```

**Configuration explained:**
- `content`: Tells Tailwind where to look for class names (includes src/, app/, and root files)
- `darkMode: "class"`: Enables dark mode via .dark class (migrated from index.html)
- `theme.extend.fontFamily`: Extends with Inter font (migrated from index.html)

### Step 3: Verify PostCSS Configuration

Check that `postcss.config.js` was created correctly:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**No changes needed** - this default configuration is correct for Next.js.

### Step 4: Create src/app Directory

Create the app directory structure:

```bash
# Create app directory under src
mkdir -p src/app

# Verify directory structure
ls -la src/
```

### Step 5: Create globals.css

Create `src/app/globals.css` with Tailwind directives and custom styles:

```bash
# Create the file
touch src/app/globals.css
```

Add the following content to `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Google Fonts */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

/* Body styles */
body {
  font-family: "Inter", sans-serif;
  background-color: #f8fafc; /* slate-50 */
}

/* Dark mode body background */
html.dark body {
  background-color: #020617; /* slate-950 */
}

/* Custom scrollbar styles */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1; /* slate-300 */
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; /* slate-400 */
}

/* Dark mode scrollbar */
html.dark ::-webkit-scrollbar-thumb {
  background: #475569; /* slate-600 */
}

html.dark ::-webkit-scrollbar-thumb:hover {
  background: #64748b; /* slate-500 */
}
```

**Styles migrated from index.html:**
- Google Fonts import for Inter
- Body background colors (light and dark mode)
- Custom scrollbar styling
- Dark mode scrollbar colors

### Step 6: Verification Checklist

Verify Tailwind CSS setup is complete:

- [ ] tailwind.config.js exists and configured
- [ ] postcss.config.js exists
- [ ] src/app directory created
- [ ] src/app/globals.css exists with Tailwind directives
- [ ] globals.css includes custom styles from index.html
- [ ] Tailwind config has correct content paths
- [ ] darkMode set to "class"
- [ ] Inter font family configured

## Testing

### Verification Tests

1. **Configuration Files Exist:**
   ```bash
   ls -la tailwind.config.js postcss.config.js src/app/globals.css
   # Expected: All three files exist
   ```

2. **Tailwind Config Valid:**
   ```bash
   node -e "require('./tailwind.config.js')" && echo "✅ Valid"
   # Expected: ✅ Valid
   ```

3. **PostCSS Config Valid:**
   ```bash
   node -e "require('./postcss.config.js')" && echo "✅ Valid"
   # Expected: ✅ Valid
   ```

4. **globals.css Has Tailwind Directives:**
   ```bash
   head -3 src/app/globals.css
   # Expected: Shows @tailwind directives
   ```

5. **Content Paths Configured:**
   ```bash
   grep '"./src/' tailwind.config.js
   # Expected: Shows content path configuration
   ```

### Success Criteria

✅ tailwind.config.js created with Next.js content paths
✅ postcss.config.js created with correct plugins
✅ src/app directory exists
✅ src/app/globals.css exists with all required styles
✅ Custom styles migrated from index.html
✅ darkMode configured as "class"
✅ Inter font configured in theme

## Common Issues

### Issue: Tailwind init fails

**Symptom:** `npx tailwindcss init -p` produces errors

**Solutions:**
- Verify Tailwind installed: `npm list tailwindcss`
- Reinstall: `npm install -D tailwindcss@latest postcss@latest autoprefixer@latest`
- Clear cache: `npm cache clean --force`
- Try without -p: `npx tailwindcss init` then create postcss.config.js manually

### Issue: Module require error

**Symptom:** Node can't parse config files

**Solutions:**
- Check for syntax errors in JavaScript
- Ensure proper module.exports syntax
- Verify file is saved properly
- Use CommonJS syntax (module.exports) not ESM (export default)

### Issue: Content paths not working

**Symptom:** Tailwind not detecting classes

**Solution:** This won't be apparent until Phase 8f when Next.js runs. Content paths are correct for Next.js 16 App Router structure.

### Issue: globals.css not found

**Symptom:** File creation failed

**Solutions:**
- Create directory first: `mkdir -p src/app`
- Create file: `touch src/app/globals.css`
- Check permissions: `ls -la src/app/`

## Style Migration Checklist

Migrated from index.html to globals.css:

- [x] @tailwind directives (base, components, utilities)
- [x] Google Fonts import for Inter
- [x] body font-family
- [x] body background-color (light mode)
- [x] html.dark body background-color (dark mode)
- [x] Custom scrollbar width and height
- [x] Custom scrollbar track (transparent)
- [x] Custom scrollbar thumb colors
- [x] Custom scrollbar thumb hover colors
- [x] Dark mode scrollbar thumb colors
- [x] Dark mode scrollbar thumb hover colors

**Removed from index.html** (will be done in Phase 8e):
- Tailwind CDN script tag
- Inline Tailwind config
- Inline style block

## Configuration Files Content

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./App.tsx",
    "./index.tsx",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
```

### postcss.config.js
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### src/app/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

body {
  font-family: "Inter", sans-serif;
  background-color: #f8fafc;
}

html.dark body {
  background-color: #020617;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

html.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}

html.dark ::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
```

## Git Commit

Once all verification tests pass, commit your changes:

```bash
# Stage changes
git add tailwind.config.js postcss.config.js src/app/globals.css

# Commit with clear message
git commit -m "Phase 8d: Set up Tailwind CSS with PostCSS

- Initialize Tailwind CSS and PostCSS configurations
- Create tailwind.config.js with Next.js content paths
- Configure darkMode as 'class' (migrated from index.html)
- Configure Inter font family in theme
- Create src/app/globals.css with Tailwind directives
- Migrate custom styles from index.html to globals.css
- Import Google Fonts for Inter
- Set up custom scrollbar styling (light and dark modes)
- All styles ready for Next.js App Router

Next: Phase 8e - Create root layout from index.html"

# Verify commit
git log -1 --stat
```

## Rollback Plan

If you need to undo this phase:

```bash
# Remove created files
rm tailwind.config.js postcss.config.js
rm -rf src/app

# Revert commit
git reset --hard HEAD~1
```

## Next Steps

After completing Phase 8d:

1. **Review:** Verify all configuration files created
2. **Proceed:** Move to Phase 8e (Root Layout Creation)
3. **Note:** Tailwind won't work until globals.css is imported in layout

**Phase 8e Preview:** Create app/layout.tsx and migrate index.html structure.

## Key Takeaways

### What We Accomplished

- ✅ Tailwind CSS properly configured for Next.js
- ✅ PostCSS set up with Tailwind and Autoprefixer
- ✅ Custom styles migrated from CDN-based to file-based
- ✅ Dark mode configuration preserved
- ✅ Custom scrollbar styling maintained

### Why This Approach

- **File-based config**: Better version control, team collaboration
- **PostCSS pipeline**: Enables future CSS optimizations
- **Content paths**: Tailwind scans correct directories for purging
- **globals.css**: Central location for app-wide styles

### Important Notes

- Tailwind CDN will be removed from index.html in Phase 8e
- globals.css must be imported in layout.tsx (Phase 8e)
- Content paths include both src/ and app/ directories
- Dark mode via class enables JavaScript control

## Phase Completion Checklist

Before proceeding to Phase 8e, verify:

- [ ] tailwind.config.js exists with correct configuration
- [ ] postcss.config.js exists
- [ ] src/app directory created
- [ ] src/app/globals.css exists
- [ ] globals.css has Tailwind directives
- [ ] globals.css has custom styles from index.html
- [ ] Configuration files are valid JavaScript
- [ ] Git commit created

## References

- [Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Next.js Styling](https://nextjs.org/docs/app/building-your-application/styling)
- [PostCSS Documentation](https://postcss.org/)

---

**Status:** Phase 8d Complete ✅
**Next Phase:** Phase 8e - Root Layout Creation
**Estimated Time for Next Phase:** 45-60 minutes
