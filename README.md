# Aninag MVP (Misleading-claim indicator)

This workspace contains:

- `backend/`: Node.js + Express API (`POST /analyze`) with an LLM-backed analyzer.
- `extension/`: Chrome Extension (Manifest v3) that detects social posts, adds a small indicator button, and shows quick + full analytics.

## Backend (local dev)

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:3001`.

## Chrome extension (load unpacked)

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select the `extension/` folder
4. Open X / Facebook (or any site with article-like posts) and scroll.

## Configure backend URL

Edit `extension/background.js` and change:

- `BACKEND_URL` (default `http://localhost:3001/analyze`)

## Customization options

### Extension badge + tooltip

In `extension/content.js` (top of file):

- **Badge label**: `BADGE_TEXT`
- **Badge size**: `BADGE_SIZE_PX`
- **Badge colors**: `BADGE_BG`, `BADGE_FG`, `BADGE_BORDER`
- **Max text sent to backend**: `MAX_INPUT_CHARS`
- **Tooltip summary length**: `MAX_TOOLTIP_CHARS`
- **Client-side cache TTL**: `CACHE_TTL_MS`
- **Facebook DOM debug logs**: `DEBUG_FB_LOG`
- **Badge placement**: `BADGE_PLACEMENT` (`"start"` or `"end"`)

In `extension/background.js`:

- **Backend URL**: `BACKEND_URL`
- **Backend request timeout**: `REQUEST_TIMEOUT_MS`
- **Cross-tab cache TTL**: `CACHE_TTL_MS`

### Backend LLM provider

In `backend/.env`:

- **Hugging Face key**: `HF_API_KEY`
- **HF base URL**: `HF_BASE_URL` (default `https://router.huggingface.co/v1`)
- **HF model**: `HF_MODEL` (default `Qwen/Qwen2.5-7B-Instruct`)
- **Debug mode**: `LLM_DEBUG=1` (backend will include `debug.llm_error` in responses when it falls back)
