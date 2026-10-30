// Skate 3 × G+3 Streamlined Console Menu, USB Controller Support & Loader:
// - Full HTML5 Gamepad API support in the menus AND in-game bridge for any USB controller
// - Defaults to Low Graphics (Chromebook 60 FPS fast mode) with single-button toggle to High (HD)
// - Clean, simple 3-button console menu + 52 More Parks browser + custom loading screen

const statusEl = document.getElementById('status');
const barEl = document.getElementById('progress');
const overlay = document.getElementById('overlay');
const loadThumb = document.getElementById('loadthumb');
const loadTitle = document.getElementById('loadtitle');
const loadGfxTag = document.getElementById('load-gfx-tag');
const loadTipEl = document.getElementById('load-tip');
const lobby = document.getElementById('lobby');
const mapGrid = document.getElementById('map-grid');
const fpsBadge = document.getElementById('fpsbadge');
const controlsBtn = document.getElementById('controlsbtn');
const parksBtn = document.getElementById('parksbtn');
const bgCanvas = document.getElementById('bg-canvas');
const padStatusPill = document.getElementById('pad-status-pill');
const padStatusText = document.getElementById('pad-status-text');

// ==================== AUTHENTIC SKATE 3 MENU SFX SYSTEM ====================
const SFX_FILES = {
  hover: 'sfx/pop.wav',
  select: 'sfx/catch.wav',
  tab: 'sfx/flip.wav',
  launch: 'sfx/chime.wav',
};
const sfxCache = {};
function playSfx(kind, volume = 0.42, rate = 1.0) {
  const src = SFX_FILES[kind];
  if (!src) return;
  try {
    let base = sfxCache[src];
    if (!base) {
      base = new Audio(src);
      base.preload = 'auto';
      sfxCache[src] = base;
    }
    const clone = base.cloneNode();
    clone.volume = Math.min(1, Math.max(0, volume));
    clone.playbackRate = rate;
    clone.play().catch(() => {});
  } catch {}
}

// ==================== PRO TRICK TIPS FOR CUSTOM LOADING SCREEN ====================
const TRICK_TIPS = [
  'PRO TIP: Hold Down on the Right Stick (or Down Arrow) to crouch, then flick Up for a higher Ollie.',
  'PRO TIP: Press LB + D-Pad Down (or Q + Down) to place a Session Marker, and LB + Up to teleport back!',
  'PRO TIP: Hold LT or RT in mid-air (or Z / C on keyboard) to grab your board over big gaps.',
  'PRO TIP: Press F9 at any time in-game to spawn the Freestyle MX Dirt Bike!',
  'PRO TIP: Flick Right Stick diagonally Down-Left then Up-Right for 360 Flips (Tre Flips).',
];

// ==================== FEATURED 10 SKATE PARKS METADATA ====================
const PARK_INFO = {
  StartPark: {
    title: 'Start Park',
    tag: 'Indoor Park',
    sub: 'Halfpipes, funboxes, rails & smooth flow lines',
    desc: 'Classic indoor training skatepark featuring halfpipes, central funboxes, hubba ledges, and fast lines. Runs at 60 FPS on Chromebooks.',
    lowSize: 754335,
    hdSize: 4521595,
    order: 1,
    archetype: 'halfpipe_arena',
    sky: 'night',
  },
  MegaPark: {
    title: 'Mega Park',
    tag: 'Mega Ramp',
    sub: 'Towering roll-in, massive gap & giant quarterpipe',
    desc: 'Drop in from the towering sky roll-in, launch across the canyon gap, and air out on the colossal quarterpipe and deep bowl.',
    lowSize: 943877,
    hdSize: 6463623,
    order: 2,
    archetype: 'mega_compound',
    sky: 'sunny',
  },
  BlackBoxPark: {
    title: 'Black Box Park',
    tag: 'Street Plaza',
    sub: 'Technical ledges, stairs, banks & indoor street course',
    desc: 'Tight indoor street plaza packed with stair sets, handrails, euro gaps, manual pads, and banked walls.',
    lowSize: 1133886,
    hdSize: 9022052,
    order: 3,
    archetype: 'street_plaza',
    sky: 'twilight',
  },
  IndustrialSkatePark: {
    title: 'Industrial Park',
    tag: 'Warehouse',
    sub: 'Quarterpipes, spine transfers & industrial bowls',
    desc: 'Sprawling industrial warehouse course with transition bowls, spine transfers, long flatbars, and elevated catwalks.',
    lowSize: 1507904,
    hdSize: 8718303,
    order: 4,
    archetype: 'triple_bowl',
    sky: 'sunset',
  },
  DownTownSkatePark: {
    title: 'Downtown Park',
    tag: 'City Plaza',
    sub: 'Urban street plazas, multi-tier ledges & rails',
    desc: 'Multi-level urban concrete plaza featuring cascading stair sets, curved ledges, plaza banks, and wide open street lines.',
    lowSize: 3352682,
    hdSize: 21085366,
    order: 5,
    archetype: 'stair_gauntlet',
    sky: 'sunny',
  },
  MaloofMoneyCup: {
    title: 'Maloof Money Cup',
    tag: 'Contest Arena',
    sub: 'Pro competition street & vert stadium course',
    desc: 'Championship stadium skate course built for high-scoring competition lines, pro-sized stair rails, and hubbas.',
    lowSize: 3284583,
    hdSize: 23878940,
    order: 6,
    archetype: 'street_plaza',
    sky: 'sunny',
  },
  SkateSchool: {
    title: 'Skate School',
    tag: 'Open Campus',
    sub: 'Coach Frank’s training grounds, bowls & outdoor ramps',
    desc: 'Large outdoor training campus with wide driveways, banked walls, ledges, and full-sized bowls.',
    lowSize: 9128326,
    hdSize: 31762373,
    order: 7,
    archetype: 'triple_bowl',
    sky: 'sunny',
  },
  KenneyPark: {
    title: 'Kenney Park',
    tag: 'Community Mod',
    sub: 'Downloaded SkateMods street plaza, bricks & rails',
    desc: 'Downloaded community .skate park featuring brick banks, marble ledges, funboxes, and crisp street lines.',
    lowSize: 50292,
    hdSize: 50292,
    order: 8,
    archetype: 'street_plaza',
    sky: 'sunny',
  },
  dmjumpline: {
    title: 'Dirt Jump Line',
    tag: 'Dirt Jumps',
    sub: 'Rhythm dirt doubles, berms & big air hits',
    desc: 'Flowing downhill dirt jump trail with high-speed rollers, rhythm doubles, and banked berms. Press F9 in-game for the MX Dirt Bike!',
    lowSize: 11922009,
    hdSize: 11922009,
    order: 9,
    archetype: 'downhill_run',
    sky: 'sunset',
  },
  __test: {
    title: 'Test World',
    tag: 'Sandbox',
    sub: 'Minimalist flatland & procedural obstacle sandbox',
    desc: 'Instant-load sandbox environment with procedural ramps, rails, and flatground for trick practice.',
    lowSize: 0,
    hdSize: 0,
    order: 10,
    archetype: 'halfpipe_arena',
    sky: 'night',
  },
};

function status(text, error = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle('error', error);
}
globalThis.skateFatal = (message) => {
  lobby.classList.add('hidden');
  overlay.style.display = 'flex';
  status(message, true);
};

// ==================== LIVE 60 FPS 3D BACKGROUND SKATEPARK RENDERER ====================
let activeBgMesh = null;
let activeBgSky = 'sunny';

const SKY_GRADIENTS = {
  sunny:    ['#0b2b68', '#1e69be', '#6cb4f5'],
  tropical: ['#073775', '#1588d8', '#7be3f8'],
  sunset:   ['#181038', '#8a2b43', '#f28544'],
  twilight: ['#090d24', '#2e1f54', '#6b4984'],
  overcast: ['#1d2633', '#435266', '#7b8b9e'],
  night:    ['#040711', '#0b1730', '#162f59'],
};

function buildFallback3DMesh(archetype = 'street_plaza') {
  const tris = [];
  const addQuad = (a, b, c, d, m) => {
    tris.push([...a, ...b, ...c, m]);
    tris.push([...a, ...c, ...d, m]);
  };
  const addBox = (x0, y0, z0, x1, y1, z1, m, tm = m) => {
    addQuad([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], tm);
    addQuad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], m);
    addQuad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], m);
    addQuad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], m);
    addQuad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], m);
  };
  const G = 32;
  for (let gx = -G; gx < G; gx += 16) {
    for (let gz = -G; gz < G; gz += 16) {
      addQuad([gx, 0, gz + 16], [gx + 16, 0, gz + 16], [gx + 16, 0, gz], [gx, 0, gz], 0);
    }
  }
  if (archetype === 'mega_compound') {
    addBox(-8, 0, -34, 8, 11, -24, 4, 1);
    addQuad([-8, 11, -24], [8, 11, -24], [8, 0, -4], [-8, 0, -4], 1);
    addQuad([-8, 0, 2], [8, 0, 2], [8, 3.5, 10], [-8, 3.5, 10], 1);
    addBox(-9, 0, 16, 9, 4, 26, 2, 1);
    addBox(-16, 0, 32, 16, 7.5, 38, 3, 1);
  } else if (archetype === 'triple_bowl') {
    for (let s = 0; s < 12; s++) {
      const a0 = (s / 12) * Math.PI * 2;
      const a1 = ((s + 1) * Math.PI * 2) / 12;
      const r0 = 5, r1 = 12;
      addQuad(
        [Math.cos(a0) * r0, -2.5, Math.sin(a0) * r0 - 10],
        [Math.cos(a1) * r0, -2.5, Math.sin(a1) * r0 - 10],
        [Math.cos(a1) * r1, 0.2, Math.sin(a1) * r1 - 10],
        [Math.cos(a0) * r1, 0.2, Math.sin(a0) * r1 - 10],
        1
      );
      addQuad(
        [Math.cos(a0) * r0, -2.8, Math.sin(a0) * r0 + 10],
        [Math.cos(a1) * r0, -2.8, Math.sin(a1) * r0 + 10],
        [Math.cos(a1) * r1, 0.2, Math.sin(a1) * r1 + 10],
        [Math.cos(a0) * r1, 0.2, Math.sin(a0) * r1 + 10],
        2
      );
    }
    addBox(-24, 0, -18, -18, 3.2, 18, 1, 2);
    addBox(18, 0, -18, 24, 3.2, 18, 1, 2);
  } else {
    addBox(-6, 0, -5, 6, 1.4, 5, 2, 1);
    addQuad([-6, 0, -12], [6, 0, -12], [6, 1.4, -5], [-6, 1.4, -5], 1);
    addQuad([-6, 1.4, 5], [6, 1.4, 5], [6, 0, 12], [-6, 0, 12], 1);
    addBox(-16, 0, -12, -11, 0.9, 12, 2, 2);
    addBox(11, 0, -12, 16, 0.9, 12, 2, 2);
    addBox(-22, 0, 22, 22, 3.6, 28, 4, 1);
    addBox(-22, 0, -28, 22, 3.6, -22, 4, 1);
    addBox(-0.2, 1.4, -12, 0.2, 1.9, 12, 3, 3);
  }
  return {
    palette: ['#8d949e', '#c89658', '#d4d0c8', '#00f0ff', '#a84c3a', '#468a42'],
    tris,
  };
}

function shadeHex(hex, factor) {
  const v = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, Math.round(((v >> 16) & 255) * factor)));
  const g = Math.min(255, Math.max(0, Math.round(((v >> 8) & 255) * factor)));
  const b = Math.min(255, Math.max(0, Math.round((v & 255) * factor)));
  return `rgb(${r},${g},${b})`;
}

function startBackground3DLoop() {
  if (!bgCanvas) return;
  const ctx = bgCanvas.getContext('2d');
  let t0 = performance.now();

  const renderFrame = (now) => {
    if (!lobby.classList.contains('hidden')) {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const W = Math.floor(bgCanvas.clientWidth * dpr);
      const H = Math.floor(bgCanvas.clientHeight * dpr);
      if (bgCanvas.width !== W || bgCanvas.height !== H) {
        bgCanvas.width = W;
        bgCanvas.height = H;
      }

      const skyCols = SKY_GRADIENTS[activeBgSky] || SKY_GRADIENTS.sunny;
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, skyCols[0]);
      grad.addColorStop(0.52, skyCols[1]);
      grad.addColorStop(1, skyCols[2]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      const mesh = activeBgMesh || buildFallback3DMesh('street_plaza');
      const elapsed = (now - t0) * 0.00028;
      const radius = 38.0;
      const camX = Math.cos(elapsed) * radius;
      const camZ = Math.sin(elapsed) * radius;
      const camY = 13.5 + Math.sin(elapsed * 1.7) * 2.2;
      const tgtX = 0, tgtY = 1.2, tgtZ = 0;

      let fx = tgtX - camX, fy = tgtY - camY, fz = tgtZ - camZ;
      const fl = Math.hypot(fx, fy, fz) || 1;
      fx /= fl; fy /= fl; fz /= fl;
      let rx = -fz, ry = 0, rz = fx;
      const rl = Math.hypot(rx, ry, rz) || 1;
      rx /= rl; ry /= rl; rz /= rl;
      const ux = ry * fz - rz * fy;
      const uy = rz * fx - rx * fz;
      const uz = rx * fy - ry * fx;

      const fovScale = H * 0.85;
      const cxScreen = W * 0.50;
      const cyScreen = H * 0.50;

      const projected = [];
      const tris = mesh.tris;
      const pal = mesh.palette;

      for (let i = 0; i < tris.length; i++) {
        const t = tris[i];
        const x0 = t[0] - camX, y0 = t[1] - camY, z0 = t[2] - camZ;
        const x1 = t[3] - camX, y1 = t[4] - camY, z1 = t[5] - camZ;
        const x2 = t[6] - camX, y2 = t[7] - camY, z2 = t[8] - camZ;

        const cz0 = x0 * fx + y0 * fy + z0 * fz;
        const cz1 = x1 * fx + y1 * fy + z1 * fz;
        const cz2 = x2 * fx + y2 * fy + z2 * fz;
        if (cz0 < 1.2 || cz1 < 1.2 || cz2 < 1.2) continue;

        const sx0 = cxScreen + ((x0 * rx + y0 * ry + z0 * rz) / cz0) * fovScale;
        const sy0 = cyScreen - ((x0 * ux + y0 * uy + z0 * uz) / cz0) * fovScale;
        const sx1 = cxScreen + ((x1 * rx + y1 * ry + z1 * rz) / cz1) * fovScale;
        const sy1 = cyScreen - ((x1 * ux + y1 * uy + z1 * uz) / cz1) * fovScale;
        const sx2 = cxScreen + ((x2 * rx + y2 * ry + z2 * rz) / cz2) * fovScale;
        const sy2 = cyScreen - ((x2 * ux + y2 * uy + z2 * uz) / cz2) * fovScale;

        const ux1 = t[3] - t[0], uy1 = t[4] - t[1], uz1 = t[5] - t[2];
        const vx1 = t[6] - t[0], vy1 = t[7] - t[1], vz1 = t[8] - t[2];
        let nx = uy1 * vz1 - uz1 * vy1;
        let ny = uz1 * vx1 - ux1 * vz1;
        let nz = ux1 * vy1 - uy1 * vx1;
        const nl = Math.hypot(nx, ny, nz) || 1;
        nx /= nl; ny /= nl; nz /= nl;

        const sunDot = Math.abs(nx * 0.45 + ny * 0.8 + nz * -0.35);
        const shade = 0.58 + 0.48 * sunDot;
        const hex = pal[t[9]] || pal[0] || '#8892a0';

        projected.push({
          depth: (cz0 + cz1 + cz2) * 0.333,
          sx0, sy0, sx1, sy1, sx2, sy2,
          fill: shadeHex(hex, shade),
        });
      }

      projected.sort((a, b) => b.depth - a.depth);

      ctx.lineWidth = 0.65;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.14)';
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        ctx.beginPath();
        ctx.moveTo(p.sx0, p.sy0);
        ctx.lineTo(p.sx1, p.sy1);
        ctx.lineTo(p.sx2, p.sy2);
        ctx.closePath();
        ctx.fillStyle = p.fill;
        ctx.fill();
        ctx.stroke();
      }
    }
    requestAnimationFrame(renderFrame);
  };
  requestAnimationFrame(renderFrame);
}
startBackground3DLoop();

// Track every AudioContext and resume on first gesture
const audioContexts = [];
for (const name of ['AudioContext', 'webkitAudioContext']) {
  const Base = globalThis[name];
  if (!Base) continue;
  globalThis[name] = new Proxy(Base, {
    construct(target, args) {
      const ctx = Reflect.construct(target, args);
      audioContexts.push(ctx);
      return ctx;
    },
  });
}
const unlockAudio = () => {
  for (const ctx of audioContexts) {
    if (ctx.state !== 'running') ctx.resume().catch(() => {});
  }
};
for (const event of ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown']) {
  addEventListener(event, unlockAudio, { capture: true, passive: true });
}

// Live FPS counter
const session = { frames: 0, fps: 0 };
(() => {
  let last = performance.now(), count = 0;
  const tick = () => { session.frames++; count++; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  setInterval(() => {
    const now = performance.now();
    session.fps = Math.round(count * 1000 / (now - last));
    last = now; count = 0;
    if (fpsBadge) {
      fpsBadge.textContent = `${session.fps} FPS`;
      fpsBadge.style.color = session.fps >= 45 ? '#3fb950' : session.fps >= 25 ? '#d29922' : '#f85149';
    }
  }, 1000);
})();

// Fullscreen & Controls help modal
const fullscreenButton = document.getElementById('fullscreen');
const hint = document.getElementById('hint');
const showHint = (html) => {
  hint.innerHTML = html;
  hint.style.display = 'block';
  hint.onclick = () => {
    playSfx('select', 0.35);
    hint.style.display = 'none';
    if (lobby.classList.contains('hidden')) document.getElementById('bevy').focus();
  };
};
const toggleControlsGuide = () => {
  playSfx('tab', 0.45);
  if (hint.style.display === 'block') {
    hint.style.display = 'none';
    if (lobby.classList.contains('hidden')) document.getElementById('bevy').focus();
    return;
  }
  showHint(
    '<b style="color:#00f0ff;font-size:15px">USB CONTROLLER &amp; KEYBOARD CONTROLS</b><br><br>'
    + '<b>USB Controller (Xbox / PlayStation / Generic USB Pad):</b><br>'
    + '&bull; <b>Left Stick / D-Pad:</b> Steer, Lean &amp; Navigate Menus<br>'
    + '&bull; <b>Right Stick:</b> Flick-It Tricks (Down then Up = Ollie, Diagonals = Kickflips / Tre Flips)<br>'
    + '&bull; <b>A / Cross:</b> Push / Select &nbsp;&middot;&nbsp; <b>X / Square:</b> Push Mongo / Toggle Graphics<br>'
    + '&bull; <b>Y / Triangle:</b> Get On/Off Board (More Parks in Menu) &nbsp;&middot;&nbsp; <b>LT / RT:</b> Grabs<br>'
    + '&bull; <b>LB + D-Pad Down:</b> Place Marker &nbsp;&middot;&nbsp; <b>LB + D-Pad Up:</b> Teleport to Marker<br><br>'
    + '<b>Keyboard:</b> <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Steer &middot; <kbd>&uarr;</kbd><kbd>&larr;</kbd><kbd>&darr;</kbd><kbd>&rarr;</kbd> Flick-It Tricks &middot; <kbd>Space</kbd> Push &middot; <kbd>F</kbd> Board &middot; <kbd>F9</kbd> MX Bike<br><br>'
    + '<small style="color:#8b9bb4">Press B on controller or click anywhere to close.</small>'
  );
};
if (controlsBtn) controlsBtn.onclick = toggleControlsGuide;
const promptControls = document.getElementById('prompt-controls');
if (promptControls) promptControls.onclick = toggleControlsGuide;

if (navigator.standalone || matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches) {
  fullscreenButton.style.display = 'none';
}
fullscreenButton.onclick = async () => {
  const root = document.documentElement;
  const request = root.requestFullscreen ?? root.webkitRequestFullscreen;
  if (!request) return;
  try {
    if (document.fullscreenElement ?? document.webkitFullscreenElement) {
      await (document.exitFullscreen ?? document.webkitExitFullscreen).call(document);
    } else {
      await request.call(root, { navigationUI: 'hide' });
    }
  } catch {}
  document.getElementById('bevy').focus();
};

if (parksBtn) {
  parksBtn.onclick = () => {
    const url = new URL(location.href);
    url.searchParams.delete('play');
    url.searchParams.delete('autostart');
    location.href = url.toString();
  };
}

function safeName(text, taken) {
  let name = String(text ?? '').normalize('NFKD').replace(/[^A-Za-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 48) || 'CommunityMap';
  while (taken.has(name)) name += '_community';
  return name;
}

const CACHE = 'skate3-pack-v2';
async function openCache() {
  try { return await caches.open(CACHE); } catch { return null; }
}

async function cachedParts(cache, key, parts, total, onBytes) {
  if (cache && key) {
    try {
      const hit = await cache.match(key);
      if (hit) {
        const bytes = new Uint8Array(await hit.arrayBuffer());
        if (bytes.length === total) { onBytes(total); return bytes; }
      }
    } catch {}
  }
  const bytes = await fetchParts(parts, total, onBytes);
  if (cache && key) {
    cache.put(key, new Response(bytes, { headers: { 'Content-Type': 'application/octet-stream' } })).catch(() => {});
  }
  return bytes;
}

async function pruneCache(cache, keep) {
  if (!cache) return;
  try {
    for (const request of await cache.keys()) {
      if (!keep.has(new URL(request.url).pathname.split('/').pop())) await cache.delete(request);
    }
  } catch {}
}

async function fetchParts(parts, total, onBytes) {
  const out = new Uint8Array(total);
  let at = 0;
  for (const part of parts) {
    const response = await fetch(part);
    if (!response.ok) throw new Error(`${part}: HTTP ${response.status}`);
    const reader = response.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (at + value.length > total) throw new Error(`${part}: larger than pack.json says`);
      out.set(value, at);
      at += value.length;
      onBytes(value.length);
    }
  }
  if (at !== total) throw new Error(`Downloaded ${at} of ${total} bytes; pack.json is stale`);
  return out;
}

async function fetchMap(map, cache, onBytes, onTotal) {
  const key = `cache/${map.key}`;
  if (cache) {
    try {
      const hit = await cache.match(key);
      if (hit) {
        const bytes = new Uint8Array(await hit.arrayBuffer());
        if (!map.size || bytes.length === map.size) { onTotal(bytes.length); onBytes(bytes.length); return bytes; }
      }
    } catch {}
  }
  const response = await fetch(map.url);
  if (!response.ok) throw new Error(`Could not download ${map.label}: HTTP ${response.status}`);
  const declared = map.size || Number(response.headers.get('Content-Length')) || 0;
  onTotal(declared);
  const chunks = [];
  let got = 0;
  const reader = response.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    got += value.length;
    onBytes(value.length);
  }
  const bytes = new Uint8Array(got);
  let at = 0;
  for (const chunk of chunks) { bytes.set(chunk, at); at += chunk.length; }
  if (!declared) onTotal(got);
  if (cache) cache.put(key, new Response(bytes, { headers: { 'Content-Type': 'application/octet-stream' } })).catch(() => {});
  return bytes;
}

function getEffectiveMapSpec(mapObj, gfxMode) {
  if (!mapObj) return null;
  if (gfxMode === 'high' && mapObj.hd) {
    return {
      name: mapObj.name,
      size: mapObj.hd.size,
      parts: mapObj.hd.parts,
      hash: mapObj.hd.hash,
      preview: mapObj.preview || `previews/${mapObj.name}.png`,
    };
  }
  return {
    name: mapObj.name,
    size: mapObj.size,
    parts: mapObj.parts,
    hash: mapObj.hash,
    preview: mapObj.preview || `previews/${mapObj.name}.png`,
  };
}

function getEffectiveCoreSpec(pack, gfxMode) {
  if (gfxMode === 'high' && pack.core_hd) return pack.core_hd;
  return pack.core;
}

async function main() {
  const params = new URLSearchParams(location.search);
  let selectedMapName = params.get('map') ?? 'StartPark';
  if (!PARK_INFO[selectedMapName]) selectedMapName = 'StartPark';
  let selectedExtraPark = null;

  // Always default to Low Graphics (0.65x Chromebook fast preset) unless ?gfx=high is in URL
  let gfxMode = params.get('gfx') === 'high' ? 'high' : 'low';
  let resScale = gfxMode === 'high' ? 1.0 : 0.65;
  window.SKATE_GFX_MODE = gfxMode;
  window.SKATE_RES_SCALE = resScale;

  const gfxToggleBlade = document.getElementById('gfx-toggle-blade');
  const gfxBladeTitle = document.getElementById('gfx-blade-title');
  const gfxBladeSub = document.getElementById('gfx-blade-sub');
  const promptGfxVal = document.getElementById('prompt-gfx-val');
  const heroImg = document.getElementById('hero-img');
  const heroTitle = document.getElementById('hero-title');
  const heroDesc = document.getElementById('hero-desc');
  const heroTagBadge = document.getElementById('hero-tag-badge');
  const heroModePill = document.getElementById('hero-mode-pill');
  const bladeLaunchSub = document.getElementById('blade-launch-sub');
  const launchBtn = document.getElementById('launch-btn');
  const mapBar = document.getElementById('mapbar');

  const moreParksModal = document.getElementById('more-parks-modal');
  const openVaultBlade = document.getElementById('open-vault-blade');
  const browseAllInlineBtn = document.getElementById('browse-all-inline-btn');
  const closeVaultBtn = document.getElementById('close-vault-btn');
  const vaultSearch = document.getElementById('vault-search');
  const vaultCats = document.getElementById('vault-cats');
  const vaultGrid = document.getElementById('vault-grid');

  for (const el of document.querySelectorAll('.game-blade, .prompt-item')) {
    el.addEventListener('pointerenter', () => playSfx('hover', 0.22, 1.08));
  }

  const initialParks = Object.entries(PARK_INFO)
    .map(([name, info]) => ({
      name,
      preview: `previews/${name}.png`,
      raw: null,
      info,
    }))
    .sort((a, b) => (a.info.order ?? 50) - (b.info.order ?? 50));

  const cardElements = new Map();
  let extraParksCatalog = [];

  function syncHeroAndCards() {
    document.body.classList.toggle('low-gfx', gfxMode === 'low');
    if (gfxBladeTitle) {
      gfxBladeTitle.textContent = gfxMode === 'high' ? 'Graphics: High (HD)' : 'Graphics: Low';
    }
    if (gfxBladeSub) {
      gfxBladeSub.textContent = gfxMode === 'high'
        ? 'Full-Res HD Textures + 4x MSAA'
        : 'Default · Fast Chromebook 60 FPS';
    }
    if (promptGfxVal) {
      promptGfxVal.textContent = gfxMode === 'high' ? 'HIGH (HD)' : 'LOW';
    }

    for (const park of initialParks) {
      const cardObj = cardElements.get(park.name);
      if (!cardObj) continue;
      const isSel = !selectedExtraPark && park.name === selectedMapName;
      cardObj.el.classList.toggle('selected', isSel);
    }

    if (selectedExtraPark) {
      heroImg.src = selectedExtraPark.preview;
      heroTitle.textContent = selectedExtraPark.title;
      heroDesc.textContent = `${selectedExtraPark.subtitle} — Playable .skate park from More Parks.`;
      if (heroTagBadge) heroTagBadge.textContent = selectedExtraPark.category;
      if (bladeLaunchSub) bladeLaunchSub.textContent = `Drop In: ${selectedExtraPark.title}`;
      activeBgMesh = selectedExtraPark.mesh3d || buildFallback3DMesh('street_plaza');
      activeBgSky = selectedExtraPark.sky || 'sunny';
    } else {
      const activePark = initialParks.find((p) => p.name === selectedMapName) || initialParks[0];
      heroImg.src = activePark.preview;
      heroTitle.textContent = activePark.info.title;
      heroDesc.textContent = activePark.info.desc;
      if (heroTagBadge) heroTagBadge.textContent = activePark.info.tag;
      if (bladeLaunchSub) bladeLaunchSub.textContent = `Drop In: ${activePark.info.title}`;
      activeBgMesh = buildFallback3DMesh(activePark.info.archetype);
      activeBgSky = activePark.info.sky || 'sunny';
    }

    heroModePill.textContent = gfxMode === 'high' ? 'HIGH GRAPHICS (HD)' : 'LOW GRAPHICS';
    heroModePill.classList.toggle('hd', gfxMode === 'high');
  }

  function toggleGfxMode() {
    playSfx('select', 0.48);
    gfxMode = gfxMode === 'low' ? 'high' : 'low';
    resScale = gfxMode === 'high' ? 1.0 : 0.65;
    window.SKATE_GFX_MODE = gfxMode;
    window.SKATE_RES_SCALE = resScale;
    syncHeroAndCards();
  }

  if (gfxToggleBlade) gfxToggleBlade.onclick = toggleGfxMode;
  const promptGfx = document.getElementById('prompt-gfx');
  if (promptGfx) promptGfx.onclick = toggleGfxMode;

  // Render Featured 10 Parks Grid
  mapGrid.replaceChildren();
  for (const park of initialParks) {
    const card = document.createElement('div');
    card.className = 'map-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');

    const thumbWrap = document.createElement('div');
    thumbWrap.className = 'thumb';
    const img = document.createElement('img');
    img.src = park.preview;
    img.alt = park.info.title;
    img.loading = 'lazy';

    const tagEl = document.createElement('span');
    tagEl.className = 'tag-badge';
    tagEl.textContent = park.info.tag;

    thumbWrap.append(img, tagEl);

    const body = document.createElement('div');
    body.className = 'card-info';
    const titleEl = document.createElement('div');
    titleEl.className = 'card-title';
    titleEl.textContent = park.info.title;
    const subEl = document.createElement('div');
    subEl.className = 'card-sub';
    subEl.textContent = park.info.sub;
    body.append(titleEl, subEl);

    card.append(thumbWrap, body);

    card.addEventListener('pointerenter', () => playSfx('hover', 0.18, 1.15));
    card.onclick = () => {
      playSfx('select', 0.45);
      selectedExtraPark = null;
      selectedMapName = park.name;
      syncHeroAndCards();
    };
    card.ondblclick = () => {
      selectedExtraPark = null;
      selectedMapName = park.name;
      syncHeroAndCards();
      startSession();
    };
    cardElements.set(park.name, { el: card });
    mapGrid.append(card);
  }

  syncHeroAndCards();

  // ==================== "MORE PARKS (52 PARKS)" MODAL LOGIC ====================
  let activeVaultCat = 'All';
  let activeVaultQuery = '';
  let vaultFilteredList = [];
  let vaultSelectedIndex = 0;

  function openMoreParksModal() {
    playSfx('tab', 0.5);
    moreParksModal.classList.add('open');
    moreParksModal.setAttribute('aria-hidden', 'false');
    renderVaultParks();
  }

  function closeMoreParksModal() {
    playSfx('tab', 0.42);
    moreParksModal.classList.remove('open');
    moreParksModal.setAttribute('aria-hidden', 'true');
  }

  if (openVaultBlade) openVaultBlade.onclick = openMoreParksModal;
  if (browseAllInlineBtn) browseAllInlineBtn.onclick = openMoreParksModal;
  const promptMore = document.getElementById('prompt-more');
  if (promptMore) promptMore.onclick = openMoreParksModal;
  if (closeVaultBtn) closeVaultBtn.onclick = closeMoreParksModal;

  function renderVaultCategories() {
    if (!vaultCats) return;
    const cats = ['All', ...new Set(extraParksCatalog.map((p) => p.category))];
    vaultCats.replaceChildren();
    for (const c of cats) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'vault-cat-btn' + (c === activeVaultCat ? ' active' : '');
      const count = c === 'All' ? extraParksCatalog.length : extraParksCatalog.filter((p) => p.category === c).length;
      btn.textContent = `${c} (${count})`;
      btn.onclick = () => {
        playSfx('tab', 0.4);
        activeVaultCat = c;
        vaultSelectedIndex = 0;
        renderVaultCategories();
        renderVaultParks();
      };
      vaultCats.append(btn);
    }
  }

  function renderVaultParks() {
    if (!vaultGrid) return;
    vaultGrid.replaceChildren();
    const q = activeVaultQuery.trim().toLowerCase();
    vaultFilteredList = extraParksCatalog.filter((p) => {
      if (activeVaultCat !== 'All' && p.category !== activeVaultCat) return false;
      if (q && !(`${p.title} ${p.subtitle} ${p.category}`).toLowerCase().includes(q)) return false;
      return true;
    });
    if (vaultSelectedIndex >= vaultFilteredList.length) vaultSelectedIndex = 0;

    vaultFilteredList.forEach((p, idx) => {
      const isHighlighted = (selectedExtraPark && selectedExtraPark.id === p.id) || idx === vaultSelectedIndex;
      const card = document.createElement('div');
      card.className = 'map-card' + (isHighlighted ? ' selected' : '');
      card.tabIndex = 0;

      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      const img = document.createElement('img');
      img.src = p.preview;
      img.alt = p.title;
      img.loading = 'lazy';

      const tag = document.createElement('span');
      tag.className = 'tag-badge';
      tag.textContent = p.category;

      thumb.append(img, tag);

      const info = document.createElement('div');
      info.className = 'card-info';
      const title = document.createElement('div');
      title.className = 'card-title';
      title.textContent = p.title;
      const sub = document.createElement('div');
      sub.className = 'card-sub';
      sub.textContent = p.subtitle;
      info.append(title, sub);

      card.append(thumb, info);
      card.addEventListener('pointerenter', () => playSfx('hover', 0.16, 1.15));
      card.onclick = () => {
        playSfx('select', 0.5);
        selectedExtraPark = p;
        syncHeroAndCards();
        closeMoreParksModal();
      };
      card.ondblclick = () => {
        selectedExtraPark = p;
        syncHeroAndCards();
        closeMoreParksModal();
        startSession();
      };
      vaultGrid.append(card);
    });
  }

  if (vaultSearch) {
    vaultSearch.oninput = () => {
      activeVaultQuery = vaultSearch.value;
      vaultSelectedIndex = 0;
      renderVaultParks();
    };
  }

  // ==================== FULL USB CONTROLLER SUPPORT (MENU + IN-GAME BRIDGE) ====================
  // Maps any USB controller (Xbox, PlayStation, Switch, or generic DirectInput USB pad)
  // to both:
  // 1) Interactive Console Menu navigation (A = Play, Y = More Parks, X = Graphics, B = Controls/Back, D-Pad/Left Stick = Select Park)
  // 2) `window.skateTouch = [buttons, lt, rt, lx, ly, rx, ry]` in-game so even non-standard USB controllers work seamlessly!
  const usbState = [0, 0, 0, 0, 0, 0, 0];
  let usbActive = false;
  let prevButtons = [];
  let lastNavTime = 0;

  function updatePadStatusBanner(gp) {
    if (!padStatusPill || !padStatusText) return;
    if (gp) {
      padStatusPill.classList.add('connected');
      const shortName = gp.id.replace(/\s*\([^)]*\)/g, '').slice(0, 28).trim() || 'USB Controller';
      padStatusText.textContent = `CONTROLLER CONNECTED: ${shortName}`;
    } else {
      padStatusPill.classList.remove('connected');
      padStatusText.textContent = 'USB CONTROLLER READY';
    }
  }

  addEventListener('gamepadconnected', (e) => {
    playSfx('select', 0.5);
    updatePadStatusBanner(e.gamepad);
  });
  addEventListener('gamepaddisconnected', () => {
    const pads = navigator.getGamepads ? [...navigator.getGamepads()].filter(Boolean) : [];
    updatePadStatusBanner(pads[0] || null);
  });

  function stepFeaturedPark(delta) {
    playSfx('hover', 0.35, 1.05);
    selectedExtraPark = null;
    const idx = Math.max(0, initialParks.findIndex((p) => p.name === selectedMapName));
    const nextIdx = (idx + delta + initialParks.length) % initialParks.length;
    selectedMapName = initialParks[nextIdx].name;
    syncHeroAndCards();
    const cardObj = cardElements.get(selectedMapName);
    if (cardObj && cardObj.el) {
      cardObj.el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  function stepVaultPark(delta) {
    if (!vaultFilteredList.length) return;
    playSfx('hover', 0.35, 1.05);
    vaultSelectedIndex = (vaultSelectedIndex + delta + vaultFilteredList.length) % vaultFilteredList.length;
    renderVaultParks();
    const cards = vaultGrid.querySelectorAll('.map-card');
    if (cards[vaultSelectedIndex]) {
      cards[vaultSelectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  function pollUsbGamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let gp = null;
    for (let i = 0; i < pads.length; i++) {
      if (pads[i] && pads[i].connected) { gp = pads[i]; break; }
    }
    if (gp) {
      updatePadStatusBanner(gp);
      const b = gp.buttons.map((btn) => (typeof btn === 'object' ? btn.pressed : btn > 0.5));
      const val = (idx) => (gp.buttons[idx] ? (typeof gp.buttons[idx] === 'object' ? gp.buttons[idx].value : gp.buttons[idx]) : 0);
      const ax = (idx) => {
        const v = gp.axes[idx] || 0;
        return Math.abs(v) > 0.14 ? v : 0;
      };

      const justPressed = (idx) => Boolean(b[idx] && !prevButtons[idx]);
      const now = performance.now();

      const lx = ax(0);
      const ly = ax(1);
      // Support both standard mapping (axes 2,3) and generic USB gamepads (axes 2,5 or 3,4)
      const rx = ax(2);
      const ry = Math.abs(ax(3)) > 0.01 ? ax(3) : ax(5);

      if (!lobby.classList.contains('hidden')) {
        // ---- MENU CONTROLLER NAVIGATION ----
        const up = b[12] || ly < -0.55;
        const down = b[13] || ly > 0.55;
        const left = b[14] || lx < -0.55;
        const right = b[15] || lx > 0.55;

        if (now - lastNavTime > 190) {
          if (moreParksModal.classList.contains('open')) {
            if (right) { stepVaultPark(1); lastNavTime = now; }
            else if (left) { stepVaultPark(-1); lastNavTime = now; }
            else if (down) { stepVaultPark(5); lastNavTime = now; }
            else if (up) { stepVaultPark(-5); lastNavTime = now; }
          } else {
            if (right) { stepFeaturedPark(1); lastNavTime = now; }
            else if (left) { stepFeaturedPark(-1); lastNavTime = now; }
            else if (down) { stepFeaturedPark(2); lastNavTime = now; }
            else if (up) { stepFeaturedPark(-2); lastNavTime = now; }
          }
        }

        // LB (4) / RB (5) switches categories inside More Parks modal
        if (moreParksModal.classList.contains('open') && (justPressed(4) || justPressed(5))) {
          const cats = ['All', ...new Set(extraParksCatalog.map((p) => p.category))];
          const cur = Math.max(0, cats.indexOf(activeVaultCat));
          activeVaultCat = cats[(cur + (justPressed(5) ? 1 : -1) + cats.length) % cats.length];
          vaultSelectedIndex = 0;
          playSfx('tab', 0.45);
          renderVaultCategories();
          renderVaultParks();
        }

        // Face buttons: A (0), B (1), X (2), Y (3), Start (9)
        if (justPressed(0) || justPressed(9)) {
          if (hint.style.display === 'block') {
            hint.style.display = 'none';
          } else if (moreParksModal.classList.contains('open')) {
            const chosen = vaultFilteredList[vaultSelectedIndex];
            if (chosen) {
              playSfx('select', 0.5);
              selectedExtraPark = chosen;
              syncHeroAndCards();
              closeMoreParksModal();
            }
          } else {
            startSession();
          }
        } else if (justPressed(1)) {
          if (hint.style.display === 'block') {
            playSfx('select', 0.35);
            hint.style.display = 'none';
          } else if (moreParksModal.classList.contains('open')) {
            closeMoreParksModal();
          } else {
            toggleControlsGuide();
          }
        } else if (justPressed(2)) {
          toggleGfxMode();
        } else if (justPressed(3)) {
          if (moreParksModal.classList.contains('open')) closeMoreParksModal();
          else openMoreParksModal();
        }
      } else {
        // ---- IN-GAME USB CONTROLLER BRIDGE ----
        // Bridges any USB gamepad (especially non-standard USB pads) into window.skateTouch
        // using XInput bitflags so the engine responds to every stick & button!
        if (gp.mapping !== 'standard' || !document.body.classList.contains('touch')) {
          let mask = 0;
          if (b[12]) mask |= 0x0001; // D-Pad Up
          if (b[13]) mask |= 0x0002; // D-Pad Down
          if (b[14]) mask |= 0x0004; // D-Pad Left
          if (b[15]) mask |= 0x0008; // D-Pad Right
          if (b[9])  mask |= 0x0010; // Start
          if (b[8])  mask |= 0x0020; // Back / Select
          if (b[10]) mask |= 0x0040; // L3
          if (b[11]) mask |= 0x0080; // R3
          if (b[4])  mask |= 0x0100; // LB
          if (b[5])  mask |= 0x0200; // RB
          if (b[0])  mask |= 0x1000; // A / Cross
          if (b[1])  mask |= 0x2000; // B / Circle
          if (b[2])  mask |= 0x4000; // X / Square
          if (b[3])  mask |= 0x8000; // Y / Triangle

          const lt = Math.max(val(6), b[6] ? 1 : 0);
          const rt = Math.max(val(7), b[7] ? 1 : 0);

          const hasInput = mask !== 0 || lt > 0.05 || rt > 0.05 || Math.hypot(lx, ly, rx, ry) > 0.05;
          if (hasInput || usbActive) {
            usbState[0] = mask;
            usbState[1] = lt;
            usbState[2] = rt;
            usbState[3] = lx;
            usbState[4] = -ly; // Engine uses +Y = up
            usbState[5] = rx;
            usbState[6] = -ry; // Engine uses +Y = up
            window.skateTouch = usbState;
            usbActive = hasInput;
          }
        }
      }
      prevButtons = b;
    }
    requestAnimationFrame(pollUsbGamepad);
  }
  requestAnimationFrame(pollUsbGamepad);

  // Load pack.json and extra_parks.json in parallel
  const [pack, extraData] = await Promise.all([
    fetch('pack.json', { cache: 'no-cache' }).then((r) => r.json()),
    fetch('extra_parks.json', { cache: 'no-cache' }).then((r) => r.json()).catch(() => ({ parks: [] })),
  ]);

  extraParksCatalog = extraData.parks || [];
  renderVaultCategories();

  for (const m of pack.maps) {
    const found = initialParks.find((p) => p.name === m.name);
    if (found) found.raw = m;
  }

  if (params.get('extra')) {
    const ep = extraParksCatalog.find((p) => p.id === params.get('extra'));
    if (ep) selectedExtraPark = ep;
  }
  syncHeroAndCards();

  const cache = await openCache();
  const builtIn = new Set(['__test', ...pack.maps.map((m) => m.name)]);

  // Keyboard shortcuts inside Lobby
  addEventListener('keydown', (e) => {
    if (lobby.classList.contains('hidden')) return;
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT')) return;
    if (e.code === 'Escape' || e.code === 'KeyB') {
      if (hint.style.display === 'block') {
        hint.style.display = 'none';
      } else if (moreParksModal.classList.contains('open')) {
        e.preventDefault();
        closeMoreParksModal();
      } else if (e.code === 'KeyB') {
        e.preventDefault();
        toggleControlsGuide();
      }
    } else if (e.code === 'KeyY') {
      e.preventDefault();
      if (moreParksModal.classList.contains('open')) closeMoreParksModal();
      else openMoreParksModal();
    } else if (e.code === 'KeyX') {
      e.preventDefault();
      toggleGfxMode();
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      e.preventDefault();
      if (moreParksModal.classList.contains('open')) stepVaultPark(1);
      else stepFeaturedPark(1);
    } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      e.preventDefault();
      if (moreParksModal.classList.contains('open')) stepVaultPark(-1);
      else stepFeaturedPark(-1);
    } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      e.preventDefault();
      if (moreParksModal.classList.contains('open')) stepVaultPark(5);
      else stepFeaturedPark(2);
    } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      if (moreParksModal.classList.contains('open')) stepVaultPark(-5);
      else stepFeaturedPark(-2);
    } else if (e.code === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      if (moreParksModal.classList.contains('open')) {
        const chosen = vaultFilteredList[vaultSelectedIndex];
        if (chosen) {
          selectedExtraPark = chosen;
          syncHeroAndCards();
          closeMoreParksModal();
        }
      } else {
        startSession();
      }
    }
  });

  let sessionStarted = false;
  async function startSession() {
    if (sessionStarted) return;
    sessionStarted = true;
    playSfx('launch', 0.65);

    if (!navigator.gpu) {
      globalThis.skateFatal('This page needs a WebGPU browser: Chrome / ChromeOS / Edge 113+.');
      return;
    }
    if (!(await navigator.gpu.requestAdapter())) {
      globalThis.skateFatal('WebGPU is present but no GPU adapter is available.');
      return;
    }

    let external = null;
    if (selectedExtraPark) {
      external = {
        name: safeName(selectedExtraPark.id, builtIn),
        label: selectedExtraPark.title,
        key: `extra-${selectedExtraPark.id}`,
        size: selectedExtraPark.size,
        url: selectedExtraPark.path,
        preview: selectedExtraPark.preview,
      };
    }

    try {
      const url = new URL(location.href);
      for (const name of ['map', 'extra']) url.searchParams.delete(name);
      if (selectedExtraPark) url.searchParams.set('extra', selectedExtraPark.id);
      else url.searchParams.set('map', selectedMapName);
      url.searchParams.set('gfx', gfxMode);
      history.replaceState(null, '', url.toString());
    } catch {}

    const rawMap = external ? null : pack.maps.find((m) => m.name === selectedMapName) ?? null;
    const mapSpec = getEffectiveMapSpec(rawMap, gfxMode);
    const coreSpec = getEffectiveCoreSpec(pack, gfxMode);
    const parkMeta = PARK_INFO[selectedMapName] || { title: selectedMapName };

    if (loadThumb) {
      loadThumb.src = external && external.preview
        ? external.preview
        : mapSpec ? mapSpec.preview : 'previews/__test.png';
    }
    const modeTag = gfxMode === 'high' ? 'HIGH GRAPHICS (HD)' : 'LOW GRAPHICS';
    if (loadGfxTag) loadGfxTag.textContent = modeTag;
    if (loadTitle) {
      loadTitle.textContent = external ? external.label : parkMeta.title;
    }
    if (loadTipEl) {
      loadTipEl.textContent = TRICK_TIPS[Math.floor(Math.random() * TRICK_TIPS.length)];
    }

    moreParksModal.classList.remove('open');
    lobby.classList.add('hidden');
    if (mapBar) mapBar.classList.add('visible');
    overlay.style.display = 'flex';

    const engine = pack.engine;
    let total = coreSpec.size + (mapSpec ? mapSpec.size : 0) + (external ? external.size : 0) + (engine ? engine.size : 0);
    let done = 0;
    const shown = external ? external.label : mapSpec ? parkMeta.title : 'Test World';
    const tick = (n) => {
      done += n;
      barEl.style.width = `${Math.min(100, 100 * done / total).toFixed(1)}%`;
      status(`LOADING ${shown.toUpperCase()}... ${(done / 1e6).toFixed(1)} / ${(total / 1e6).toFixed(1)} MB`);
    };
    const key = (name, hash) => (hash ? `cache/${name}.${hash}` : null);
    const keep = new Set([
      engine && `engine.${engine.hash}`,
      `core.${pack.core.hash}`,
      pack.core_hd && `core_hd.${pack.core_hd.hash}`,
      ...pack.maps.map((m) => `map-${m.name}.${m.hash}`),
      ...pack.maps.map((m) => m.hd && `map_hd-${m.name}.${m.hd.hash}`),
      external && external.key,
    ].filter(Boolean));

    globalThis.SKATE_LITE = (gfxMode !== 'high');

    const coreCacheName = gfxMode === 'high' && pack.core_hd ? 'core_hd' : 'core';
    const mapCachePrefix = gfxMode === 'high' && rawMap && rawMap.hd ? 'map_hd' : 'map';

    let [core, mapBytes, wasmBytes] = await Promise.all([
      cachedParts(cache, key(coreCacheName, coreSpec.hash), coreSpec.parts, coreSpec.size, tick),
      mapSpec ? cachedParts(cache, key(`${mapCachePrefix}-${mapSpec.name}`, mapSpec.hash), mapSpec.parts, mapSpec.size, tick)
        : external ? fetchMap(external, cache, tick, (n) => { total += n - external.size; external.size = n; }) : Promise.resolve(null),
      engine ? cachedParts(cache, key('engine', engine.hash), ['skate3rust_bg.wasm'], engine.size, tick) : Promise.resolve(null),
    ]);
    pruneCache(cache, keep);

    globalThis.SKATE_PACK = core;
    globalThis.SKATE_MAP_LIST = pack.maps.map((m) => m.name);
    if (mapSpec || external) {
      globalThis.SKATE_MAP_NAME = (mapSpec ?? external).name;
      globalThis.SKATE_MAP_BYTES = mapBytes;
    }
    core = null;
    mapBytes = null;

    if (params.has('teleport')) globalThis.SKATE_TELEPORT = params.get('teleport') || 'none';
    const extra = params.get('args');
    if (extra) globalThis.SKATE_ARGS = JSON.parse(extra);

    status(`STARTING ENGINE (${modeTag})...`);
    const { default: init } = await import('./skate3rust.js');
    try {
      const running = init(wasmBytes ? { module_or_path: wasmBytes } : undefined);
      wasmBytes = null;
      await running;
    } catch (e) {
      if (!String(e).includes('Using exceptions for control flow')) {
        globalThis.skateFatal(`Engine failed: ${e}`);
        throw e;
      }
    }
    if (!statusEl.classList.contains('error')) {
      overlay.style.display = 'none';
      document.getElementById('bevy').focus();
    }
  }

  launchBtn.onclick = () => startSession();
  const promptDropin = document.getElementById('prompt-dropin');
  if (promptDropin) promptDropin.onclick = () => startSession();

  const shouldAutoStart = params.has('play') || params.has('autostart');
  if (shouldAutoStart) {
    startSession().catch((e) => globalThis.skateFatal(String(e && e.stack || e)));
  } else {
    overlay.style.display = 'none';
    lobby.classList.remove('hidden');
  }
}

main().catch((e) => globalThis.skateFatal(String(e && e.stack || e)));
