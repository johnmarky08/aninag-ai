@echo off
REM Quick toggle between dev and production manifests

if "%1"=="dev" (
    echo Switching to DEV MODE...
    if exist manifest.json ren manifest.json manifest.prod.json
    if exist manifest-dev.json ren manifest-dev.json manifest.json
    if exist content.js ren content.js content.prod.js
    if exist content-dev.js ren content-dev.js content.js
    echo ✓ switched to DEV mode. Reload extension in browser.
) else if "%1"=="prod" (
    echo Switching to PRODUCTION MODE...
    if exist manifest.json ren manifest.json manifest-dev.json
    if exist manifest.prod.json ren manifest.prod.json manifest.json
    if exist content.js ren content.js content-dev.js
    if exist content.prod.js ren content.prod.js content.js
    echo ✓ Switched to PRODUCTION mode. Run 'npm run build' first.
) else if "%1"=="status" (
    if exist manifest-dev.json (
        echo Status: PRODUCTION mode (manifest.json is active^)
    ) else (
        echo Status: DEVELOPMENT mode (manifest-dev.json is active^)
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
