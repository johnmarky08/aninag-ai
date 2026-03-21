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
$manifestProdPath = "manifest.json.prod"

function Get-IsDevMode {
    if (-not (Test-Path $manifestPath)) {
        return $false
    }

    try {
        $manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
        return $manifest.name -like "*[DEV]*"
    } catch {
        return $false
    }
}

switch ($Mode) {
    'dev' {
        Write-Host "Switching to DEV MODE..." -ForegroundColor Green

                $devManifest = @'
{
    "manifest_version": 3,
    "name": "ANINAG AI [DEV]",
    "version": "1.0",
    "description": "Floating Svelte panel (Development Mode)",
    "permissions": ["scripting"],
    "content_scripts": [
        {
            "matches": ["<all_urls>"],
            "js": ["content-dev.js"]
        }
    ],
    "web_accessible_resources": [
        {
            "resources": ["dist/assets/*", "dist/index.html"],
            "matches": ["<all_urls>"]
        }
    ]
}
'@
                Set-Content -Path $manifestPath -Value $devManifest -NoNewline
        
        Write-Host "✓ Switched to DEV mode." -ForegroundColor Green
        Write-Host "  • Reload extension in your browser" -ForegroundColor Gray
        Write-Host "  • Make sure 'npm run dev' is running" -ForegroundColor Gray
    }
    
    'prod' {
        Write-Host "Switching to PRODUCTION MODE..." -ForegroundColor Yellow

        if (-not (Test-Path $manifestProdPath)) {
            Write-Host "✗ Missing manifest.json.prod. Cannot switch to production." -ForegroundColor Red
            exit 1
        }

        Copy-Item $manifestProdPath $manifestPath -Force
        
        Write-Host "✓ Switched to PRODUCTION mode." -ForegroundColor Green
        Write-Host "  • Run 'npm run build' to rebuild the extension" -ForegroundColor Gray
    }
    
    'status' {
        if (Get-IsDevMode) {
            Write-Host "Status: DEVELOPMENT mode" -ForegroundColor Cyan
        } else {
            Write-Host "Status: PRODUCTION mode" -ForegroundColor Cyan
        }
    }
}
