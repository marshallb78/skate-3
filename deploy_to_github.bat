@echo off
setlocal
cd /d "%~dp0"
echo ========================================================
echo   Skate 3 x G+3 v3 -- Push to GitHub Pages Helper
echo ========================================================
echo.
echo Make sure you have created a new EMPTY repository on GitHub first:
echo   - Go to: https://github.com/new
echo   - Repository name: skate3 (or any name you want)
echo   - Set to: Public
echo   - Leave "Add a README file" UNCHECKED
echo   - Click "Create repository"
echo.
set /p REPO_URL="Paste your GitHub Repository URL (e.g. https://github.com/YourUsername/skate3.git): "
if "%REPO_URL%"=="" (
    echo No URL provided. Aborted.
    pause
    exit /b
)
echo.
echo [1/4] Initializing Git repository...
git init
git branch -M main
echo.
echo [2/4] Staging all game files (this may take a few seconds)...
git add .
echo.
echo [3/4] Creating commit...
git commit -m "Deploy Skate 3 x G+3 v3 Browser Edition"
echo.
echo [4/4] Uploading to GitHub (%REPO_URL%)...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git push -u origin main
echo.
echo ========================================================
echo   UPLOAD COMPLETE!
echo.
echo   Final Step: Turn on GitHub Pages:
echo   1. Go to your repo on GitHub: %REPO_URL%
echo   2. Click "Settings" (top tab) -^> "Pages" (left sidebar)
echo   3. Under "Build and deployment", set:
echo      - Source: Deploy from a branch
echo      - Branch: main
echo      - Folder: / (root)
echo   4. Click "Save"
echo.
echo   Your game will be live in 1-2 minutes at:
echo   https://[your-username].github.io/[repo-name]/
echo ========================================================
pause

