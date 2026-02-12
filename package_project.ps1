$ErrorActionPreference = "Stop"

$ProjectName = "payroll-analyzer-dist"
$SourcePath = Get-Location
$TempPath = Join-Path $env:TEMP $ProjectName
$ZipPath = Join-Path $SourcePath "$ProjectName.zip"

Write-Host "📦 Packaging '$ProjectName' for distribution..."

# 1. Clean up temp folder if it exists
if (Test-Path $TempPath) {
    Remove-Item $TempPath -Recurse -Force
}
New-Item -ItemType Directory -Path $TempPath | Out-Null

# 2. Files/Folders to EXCLUDE (Don't include heavy/generated stuff)
$Excludes = @(
    "node_modules",
    ".next",
    ".vercel",
    ".git",
    "out",
    "build",
    "*.log",
    "*.zip",
    "package-lock.json" # Users should regenerate this with npm install
)

Write-Host "📂 Copying source files (excluding heavy folders)..."

# Use Robocopy for robust exclusion (much faster/cleaner than Copy-Item for complex excludes)
# /MIR = Mirror directory tree
# /XD = Exclude Directories
# /XF = Exclude Files
$RobocopyArgs = @(
    $SourcePath,
    $TempPath,
    "/MIR",
    "/XD", "node_modules", ".next", ".vercel", ".git", "out", "build",
    "/XF", "*.log", "*.zip", ".DS_Store"
)

# Run Robocopy (ignore exit codes < 8 which are success codes in robocopy)
$p = Start-Process -FilePath "robocopy" -ArgumentList $RobocopyArgs -NoNewWindow -PassThru -Wait
if ($p.ExitCode -ge 8) {
    Write-Error "Robocopy failed with code $($p.ExitCode)"
}

# 3. Zip the clean folder
if (Test-Path $ZipPath) {
    Remove-Item $ZipPath -Force
}

Write-Host "🗜️ Zipping files to '$ZipPath'..."
Compress-Archive -Path "$TempPath\*" -DestinationPath $ZipPath

# 4. Clean up temp folder
Remove-Item $TempPath -Recurse -Force

Write-Host "✅ DONE! Your distribution zip is ready at:" -ForegroundColor Green
Write-Host "   $ZipPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "👉 You can now upload this file to GitHub, share via email, or unzip on another PC."
