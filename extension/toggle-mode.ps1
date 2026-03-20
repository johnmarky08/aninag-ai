param(
    [Parameter(Position=0)]
    [ValidateSet('dev', 'prod', 'status')]
    [string]$Mode
)

function Show-Usage {
    Write-Host ""
    Write-Host "Usage: .\toggle-mode.ps1 -Mode [dev|prod|status]" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\toggle-mode.ps1 -Mode dev      # Switch to development mode"
    Write-Host "  .\toggle-mode.ps1 -Mode prod     # Switch to production mode"
    Write-Host "  .\toggle-mode.ps1 -Mode status   # Show current mode"
    Write-Host ""
}

if (-not $Mode) {
    Show-Usage
    exit 1
}

$manifestPath = "manifest.json"
$manifestDevPath = "manifest-dev.json"
$contentPath = "content.js"
$contentDevPath = "content-dev.js"

switch ($Mode) {
    'dev' {
        Write-Host "Switching to DEV MODE..." -ForegroundColor Green
        
        if (Test-Path $manifestPath) {
            Rename-Item $manifestPath "manifest.prod.json" -Force
        }
        if (Test-Path $manifestDevPath) {
            Rename-Item $manifestDevPath $manifestPath -Force
        }
        
        if (Test-Path $contentPath) {
            Rename-Item $contentPath "content.prod.js" -Force
        }
        if (Test-Path $contentDevPath) {
            Rename-Item $contentDevPath $contentPath -Force
        }
        
        Write-Host "✓ Switched to DEV mode." -ForegroundColor Green
        Write-Host "  • Reload extension in your browser" -ForegroundColor Gray
        Write-Host "  • Make sure 'npm run dev' is running" -ForegroundColor Gray
    }
    
    'prod' {
        Write-Host "Switching to PRODUCTION MODE..." -ForegroundColor Yellow
        
        if (Test-Path $manifestPath) {
            Rename-Item $manifestPath "manifest-dev.json" -Force
        }
        if (Test-Path "manifest.prod.json") {
            Rename-Item "manifest.prod.json" $manifestPath -Force
        }
        
        if (Test-Path $contentPath) {
            Rename-Item $contentPath "content-dev.js" -Force
        }
        if (Test-Path "content.prod.js") {
            Rename-Item "content.prod.js" $contentPath -Force
        }
        
        Write-Host "✓ Switched to PRODUCTION mode." -ForegroundColor Green
        Write-Host "  • Run 'npm run build' to rebuild the extension" -ForegroundColor Gray
    }
    
    'status' {
        if (Test-Path $manifestDevPath) {
            Write-Host "Status: PRODUCTION mode (manifest.json is active)" -ForegroundColor Cyan
        } else {
            Write-Host "Status: DEVELOPMENT mode (manifest-dev.json was active)" -ForegroundColor Cyan
        }
    }
}
