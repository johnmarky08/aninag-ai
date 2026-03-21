@echo off
REM Quick toggle between dev and production manifests

if "%1"=="dev" (
    echo Switching to DEV MODE...
    > manifest.json (
        echo {
        echo   "manifest_version": 3,
        echo   "name": "ANINAG AI [DEV]",
        echo   "version": "1.0",
        echo   "description": "Floating Svelte panel (Development Mode)",
        echo   "permissions": ["scripting"],
        echo   "content_scripts": [
        echo     {
        echo       "matches": ["<all_urls>"],
        echo       "js": ["content-dev.js"]
        echo     }
        echo   ],
        echo   "web_accessible_resources": [
        echo     {
        echo       "resources": ["dist/assets/*", "dist/index.html"],
        echo       "matches": ["<all_urls>"]
        echo     }
        echo   ]
        echo }
    )
    echo ✓ switched to DEV mode. Reload extension in browser.
) else if "%1"=="prod" (
    echo Switching to PRODUCTION MODE...
    if not exist manifest.json.prod (
        echo ✗ Missing manifest.json.prod. Cannot switch to production.
        exit /b 1
    )
    copy /Y manifest.json.prod manifest.json >nul
    echo ✓ Switched to PRODUCTION mode. Run 'npm run build' first.
) else if "%1"=="status" (
    findstr /L /C:"[DEV]" manifest.json >nul
    if errorlevel 1 (
        echo Status: PRODUCTION mode
    ) else (
        echo Status: DEVELOPMENT mode
    )
) else (
    echo.
    echo Usage: toggle-mode.bat [dev^|prod^|status]
    echo.
    echo Examples:
    echo   toggle-mode.bat dev      - Switch to development mode
    echo   toggle-mode.bat prod     - Switch to production mode
    echo   toggle-mode.bat status   - Show current mode
    echo.
)
