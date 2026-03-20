# 🚀 Development Mode Guide

## Real-Time Svelte Development for ANINAG-AI Extension

This setup enables **instant hot-reload** of your Svelte frontend without needing to build every time.

### Quick Start

#### 1. Start the Dev Servers

From the root directory, run:

```bash
npm run dev
```

This starts:

- **Backend** (TypeScript): http://localhost:3000
- **Frontend** (Vite/Svelte): http://localhost:5173

#### 2. Load the Development Extension

Instead of using `manifest.json`, load `manifest-dev.json` in your browser:

**In Chrome/Firefox:**

- Go to `chrome://extensions` (or `about:debugging` in Firefox)
- Enable **Developer mode**
- Click **Load unpacked**
- Select the `extension/` folder
- **Important**: Go to extension details and replace `manifest.json` with `manifest-dev.json`
  - Edit extension: Click the extension folder path
  - Rename `manifest.json` → `manifest.json.bak`
  - Rename `manifest-dev.json` → `manifest.json`

Or keep both files and toggle:

```bash
# In extension/ folder
# Switch to dev
ren manifest.json manifest.json.prod
ren manifest-dev.json manifest.json

# Switch back to production
ren manifest.json manifest-dev.json
ren manifest.json.prod manifest.json
```

#### 3. Start Designing

Edit files in `frontend/src/` and watch changes appear **instantly** in your browser! 🎨

### How It Works

| Mode            | File             | Loads From                 | Rebuild Needed?              |
| --------------- | ---------------- | -------------------------- | ---------------------------- |
| **Development** | `content-dev.js` | `http://localhost:5173`    | ❌ No - Hot reload           |
| **Production**  | `content.js`     | `chrome://extension/dist/` | ✅ Yes - Run `npm run build` |

### File Structure

```
extension/
├── manifest.json          ← Production manifest
├── manifest-dev.json      ← Development manifest (loads from localhost)
├── content.js             ← Production script
├── content-dev.js         ← Development script (loads from dev server)
frontend/
├── vite.config.js         ← Configured for dev server + extension output
├── src/
│   ├── App.svelte         ← Your main component
│   ├── main.js
│   └── ...
```

### Build for Production

When ready to deploy:

```bash
npm run build --prefix frontend
```

This generates optimized files in `extension/dist/` ready for distribution.

### Troubleshooting

**Dev server not connecting?**

- Check that `npm run dev` is running in the root folder
- Ensure Vite is listening on `http://localhost:5173`
- Check browser console for CORS errors
- Make sure you're using `manifest-dev.json`, not `manifest.json`

**Changes not showing up?**

- Try a hard refresh (`Ctrl+Shift+R` or `Cmd+Shift+R`)
- Check the browser console for errors
- Make sure the extension is pointed to the dev manifest
- Try Refreshing the Extension in your browser

**Want faster iterations?**

- Use browser DevTools (`F12`) to inspect your Svelte components
- Svelte's HMR (Hot Module Replacement) provides live feedback
- Edit CSS in Tailwind - changes appear instantly with the dev server

---

**Pro tip**: Keep the browser DevTools open while designing to catch errors immediately! 🐛
