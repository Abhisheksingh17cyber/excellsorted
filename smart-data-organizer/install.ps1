# Quick Installation Script for Smart Data Organizer

Write-Host "🚀 Setting up Smart Data Organizer..." -ForegroundColor Green

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install root dependencies
Write-Host "`n📦 Installing root dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install root dependencies" -ForegroundColor Red
    exit 1
}

# Install backend dependencies
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ../frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

# Create environment file
Write-Host "`n⚙️ Setting up environment configuration..." -ForegroundColor Yellow
Set-Location ../backend
if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env file from template" -ForegroundColor Green
    Write-Host "⚠️ Please review and update the .env file if needed" -ForegroundColor Yellow
}
else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Create necessary directories
Write-Host "`n📁 Creating necessary directories..." -ForegroundColor Yellow
$directories = @("uploads", "output", "logs")
foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Created $dir directory" -ForegroundColor Green
    }
}

# Go back to root
Set-Location ..

Write-Host "`n🎉 Installation completed successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Review the backend/.env file for configuration" -ForegroundColor White
Write-Host "2. Start the development servers:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host "3. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "`nFor detailed setup instructions, see SETUP.md" -ForegroundColor Yellow

# Ask if user wants to start the servers
$response = Read-Host "`nWould you like to start the development servers now? (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "`n🚀 Starting development servers..." -ForegroundColor Green
    npm run dev
}
