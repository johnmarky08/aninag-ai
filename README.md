# ANINAG AI - Extension + Backend

This is a Chrome extension with a Svelte frontend UI and Node.js/Express backend for AI-powered analysis.

## Project Structure

- **`backend/`**: Node.js + Express API with LLM integration
  - `POST /analyze` endpoint for text analysis
  - TypeScript-based controllers, services, and utilities

- **`frontend/`**: Svelte + Tailwind UI
  - Builds to `extension/dist/`

- **`extension/`**: Chrome Extension (Manifest v3)
  - **`content.js`**: Injects the frontend into webpages
  - **`manifest.json`**: Extension configuration

## Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:3001`.

### Extension Frontend Setup

```bash
cd frontend
npm install
npm run build
```

This generates the dist folder at `extension/dist/` with compiled assets.

### Load Extension in Chrome

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** → select the `extension/` folder
4. Visit any webpage to see the ANINAG AI panel (bottom-right corner)

## Frontend Build

The frontend uses Vite to build a Svelte app that gets injected into webpages via `content.js`.

**Build output**: `extension/dist/` (configured in `frontend/vite.config.js`)

- `dist/assets/index.js` - Main app bundle
- `dist/assets/index.css` - Styles
- `dist/index.html` - HTML template

**Key configuration**:

- Vite outputs to `../extension/dist` (relative to `frontend/` folder)
- Filenames are stable (`index.js`, `index.css`) to avoid hardcoding hashes
- Web-accessible resources declared in `manifest.json`

## Development Workflow

1. **Edit frontend code**: `frontend/src/`
2. **Rebuild**: `npm run build` from `frontend/`
3. **Reload extension**: Chrome → `chrome://extensions` → reload button
4. **Test**: Visit a webpage to see changes

## Current UI Behavior

- The **Real Time Detection** toggle in the main popup controls whether feed badges are rendered.
- When toggled **off**, badges are hidden and stop appearing.
- When toggled **on/off**, badge visibility updates with a 300ms delay for both appearing and disappearing.

## Environment Variables

### Backend (`backend/.env`)

- `PORT` - Backend server port (default: `3001`)
- `HF_API_KEY` - Hugging Face API key
- `HF_BASE_URL` - Hugging Face API endpoint (default: `https://router.huggingface.co/v1`)
- `HF_ST_ML_MODEL_URL` - Sentence similarity model URL (default: `https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/sentence-similarity`)
- `HF_MODEL` - LLM model name (default: `Qwen/Qwen2.5-7B-Instruct`)
- `SERP_API_BASE_URL` - Serp API endpoint (default: `https://serpapi.com/search`)
- `SERP_API_KEY` - Serp API key for search results
- `CACHE_TTL_MS` - Cache time-to-live in milliseconds (default: `900000`)
- `DEBUG` - Enable LLM debug logs (`true` to enable)

## Extension Configuration

The extension is ready to use. All assets are web-accessible and will be injected via `content.js` into every webpage.
