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

Development mode uses `extension/manifest.json` (which points to `content-dev.js`).

**In Chrome/Firefox:**

- Go to `chrome://extensions` (or `about:debugging` in Firefox)
- Enable **Developer mode**
- Click **Load unpacked**
- Select the `extension/` folder
- **Important**: Reload the extension after mode changes.

To switch active manifest manually (run the same swap when needed):

```bash
# In extension/ folder
# Swap manifest.json <-> manifest.json.prod
ren manifest.json manifest.json.tmp
ren manifest.json.prod manifest.json
ren manifest.json.tmp manifest.json.prod
```

#### 3. Start Designing

Edit files in `frontend/src/` and watch changes appear **instantly** in your browser! 🎨

### How It Works

| Mode            | Manifest             | Script           | Loads From              | Rebuild Needed?              |
| --------------- | -------------------- | ---------------- | ----------------------- | ---------------------------- |
| **Development** | `manifest.json`      | `content-dev.js` | `http://localhost:5173` | ❌ No - Hot reload           |
| **Production**  | `manifest.json.prod` | `content.js`     | `extension/dist/*`      | ✅ Yes - Run `npm run build` |

### File Structure

```
extension/
├── manifest.json          ← Active manifest (dev by default)
├── manifest.json.prod     ← Production manifest template
├── content.js             ← Production script (loads extension/dist)
├── content-dev.js         ← Development script (loads from localhost:5173)
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

### Current UI Behavior

- The **Real Time Detection** toggle controls whether feed badges render.
- Badge appearance and disappearance both use a 300ms delay.

**Dev server not connecting?**

- Check that `npm run dev` is running in the root folder
- Ensure Vite is listening on `http://localhost:5173`
- Check browser console for CORS errors
- Make sure active `manifest.json` points to `content-dev.js`

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
