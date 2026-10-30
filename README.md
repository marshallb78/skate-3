# Skate 3 × G+3 — v3 Browser Edition (Ultimate Release)

A standalone, high-performance browser port of **Skate 3** with custom **G+3 branding**, photorealistic skatepark previews, 52 extra browsable skateparks, USB controller support, and instant Low Graphics Chromebook optimization.

---

## What's in v3?

1. **Full USB Controller Support:**
   - Plug & Play with any USB or Bluetooth gamepad (Xbox, PlayStation DualShock/DualSense, Nintendo Switch Pro, or generic DirectInput USB controllers).
   - In-menu navigation: D-Pad & Left Stick scroll parks, `A` / `Start` drops in, `Y` opens More Parks, `X` toggles graphics quality, `B` backs out / opens controls, and `LB` / `RB` flips categories.
   - In-game controls: Left stick steering, Right stick Flick-It trick system, triggers for grabs, and bumpers for spins.
   - Live **USB CONTROLLER READY** status indicator in the top-right header that detects and displays your gamepad name.

2. **Default Low Graphics (Chromebook 60 FPS):**
   - Automatically loads into **Low Graphics** (`0.65x` render scale, `SKATE_LITE = true` halved GPU texture memory, MSAA disabled) so the game runs at 60 FPS on Chromebooks, school laptops, and integrated graphics.
   - One-click toggle (`X` button or click **GRAPHICS: LOW**) to switch to **High Graphics (HD)** (`1.0x` native rendering, full uncompressed textures, 4x MSAA).

3. **Clean & Streamlined Console Menu:**
   - Just 3 clear blade buttons:
     - **PLAY NOW (`A`)** — Instantly drop into the selected park.
     - **MORE PARKS (52) (`Y`)** — Browse 52 additional skateparks across Mega Ramps, Street, Pools & Bowls, Flow Parks, and Competition Arenas.
     - **GRAPHICS: LOW (`X`)** — Instant quality toggle.
   - Clean in-game HUD bar with FPS counter, Quick Menu return, Controls reference, and Fullscreen.

4. **G+3 × Skate 3 Custom Intro & Loading Screen:**
   - Authentic skate video loading sequence with spinning tape cassette, dynamic trick tips, audio sound effects (board pop, rail grind, wheel roll, landing chime), and animated 3D park background preview.

5. **GitHub Pages Ready (No Git LFS Required):**
   - All files are strictly under GitHub's 100 MB commit limit (`core_hd.pack` is 94.7 MB, `core.pack` is 62.6 MB, `skate3rust_bg.wasm` is 50.7 MB, and all maps are under 32 MB).

---

## How to Host on GitHub Pages (Free)

Hosting this site on GitHub Pages gives you a free URL (e.g. `https://your-username.github.io/skate3/`) with HTTPS enabled.

Because `core.pack` (62 MB) and `core_hd.pack` (94 MB) are larger than GitHub's 25 MB browser drag-and-drop limit, you must upload them using **Git** or **GitHub Desktop** (both support up to 100 MB per file).

### Method A: Using Git in Terminal / PowerShell (Recommended)

1. Open PowerShell or Terminal and change directory to this `release_v3` folder:
   ```bash
   cd release_v3
   ```
2. Initialize git and commit the files:
   ```bash
   git init
   git branch -M main
   git add .
   git commit -m "Deploy Skate 3 x G+3 v3 Browser Release"
   ```
3. Go to [github.com/new](https://github.com/new) and create a **Public** repository (for example, named `skate3`).
   *(Leave "Add a README file" unchecked)*.
4. Link your repository and push:
   ```bash
   git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```
5. Enable GitHub Pages:
   - On GitHub, go to your repository's **Settings** tab.
   - In the left sidebar, click **Pages**.
   - Under **Build and deployment → Branch**, choose **`main`** and **`/ (root)`**, then click **Save**.
   - Wait 1–2 minutes, and your game will be live at:
     ```
     https://<YOUR-GITHUB-USERNAME>.github.io/<YOUR-REPO-NAME>/
     ```

---

### Method B: Using GitHub Desktop

1. Download and open [GitHub Desktop](https://desktop.github.com/).
2. Click **File → Add Local Repository...** (or press `Ctrl+O`).
3. Choose the path to `release_v3` (`W:\G+3\Skate\skate3-cleanroom-main\skate3-cleanroom-main\release_v3`).
4. GitHub Desktop will offer to create a repository. Click **Create Repository**.
5. Click **Publish repository** to push it to your GitHub account as a Public repo.
6. Open the repository on GitHub, go to **Settings → Pages**, select **`main`** branch, and click **Save**.

---

## Local Play (Offline)

You can also run and play the v3 release locally at any time without uploading to the internet:
1. Double-click `play_v3.bat` in the repository root.
2. The game will automatically launch in your default web browser (Chrome, Edge, Brave) at `http://localhost:8080/index.html`.
