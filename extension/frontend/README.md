# ANINAG AI Frontend

A Svelte + Tailwind CSS UI that gets injected into webpages via the Chrome extension's content script.

## Development

### Setup

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Runs Vite dev server on `http://localhost:5173`.

### Build for Extension

```bash
npm run build
```

**Output**: Builds to `../dist/` with these files:

- `dist/assets/index.js` - Main Svelte app bundle
- `dist/assets/index.css` - Compiled Tailwind styles
- `dist/index.html` - HTML template

> The build output location is configured in `vite.config.js` to output at `../dist` (the extension folder).

### Preview Build

```bash
npm run preview
```

## Architecture

- **`src/main.js`** - Mounts the Svelte app to element with id `"aninag-ai-root"`
- **`src/App.svelte`** - Main draggable panel component
- **`src/app.css`** - Tailwind CSS imports and custom styles
- **Build config** - `vite.config.js` configures stable output filenames and output directory

## Key Files

- `vite.config.js` - Vite & Rollup configuration
  - Outputs to `../dist`
  - Stable filenames: `index.js`, `index.css` (no hash suffixes)
- `svelte.config.js` - Svelte compiler options
- `tailwind.config.cjs` - Tailwind CSS configuration
- `postcss.config.cjs` - PostCSS configuration (for Tailwind)

## Integration with Extension

The extension's `content.js` injects this built app by:

1. Creating a container div with id `"aninag-ai-root"`
2. Injecting the compiled CSS from `dist/assets/index.css`
3. Injecting the compiled JS from `dist/assets/index.js`

The `manifest.json` declares these files as web-accessible resources so they can be loaded on any webpage.

## Build Workflow

1. Edit components in `src/`
2. Run `npm run build`
3. Reload the extension in Chrome (`chrome://extensions` → reload)
4. Visit a webpage to see changes
