$ErrorActionPreference = "Stop"

$envFile = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "Missing .env file. Run: Copy-Item .env.example .env" -ForegroundColor Red
    exit 1
}
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([A-Z0-9_]+)\s*=\s*(.*)$') {
        [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), "Process")
    }
}
$token = [Environment]::GetEnvironmentVariable("SHOPIFY_CLI_THEME_TOKEN", "Process")
if (-not $token -or $token -match 'REPLACE') {
    Write-Host "SHOPIFY_CLI_THEME_TOKEN is not set. Paste your Theme Access token into .env" -ForegroundColor Red
    exit 1
}
if ($token -notmatch '^(shpat_|shptka_)') {
    Write-Host "SHOPIFY_CLI_THEME_TOKEN in .env doesn't look like a theme token (expected a shpat_ or shptka_ prefix)." -ForegroundColor Red
    exit 1
}

Write-Host "Pushing local theme to LIVE theme on $( [Environment]::GetEnvironmentVariable('SHOPIFY_FLAG_STORE', 'Process') )" -ForegroundColor Cyan
shopify theme push --live --allow-live @args
