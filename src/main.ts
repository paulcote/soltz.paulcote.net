import { GeoJSONSource, ImageSource, Map as MapLibreMap, Marker, NavigationControl, setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import 'maplibre-gl/dist/maplibre-gl.css';
import './style.css';
import { DOMAIN, RAMP_CSS, drawGradient, noonLine } from './gradient';
import { CORNERS } from './proj';
import { Raster, buildRaster, lookup } from './zones';
import { dstMarks, seasonMarks } from './astro';
import { CITIES, REGIONS } from './cities';
import { Day, fmtClock, solarInfo } from './solar';
import { Mode, Rules, ZONES } from './tz';
import { applyStatic, lang, locale, setLang, t, tOr } from './i18n';

setWorkerUrl(workerUrl);

const TILE_ORIGIN = 'https://voltnav.app/api/tiles';
const STYLE_URL = `${TILE_ORIGIN}/styles/voltnav-light/style.json`;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Day) => `${d.y}-${pad(d.m + 1)}-${pad(d.d)}`;
const parse = (s: string): Day => {
  const [y, m, d] = s.split('-').map(Number);
  return { y, m: m - 1, d };
};
const today = (): Day => {
  const n = new Date();
  return { y: n.getFullYear(), m: n.getMonth(), d: n.getDate() };
};

// ---- state (mirrored in the URL hash) ----
const MODES: Mode[] = ['current', 'dst', 'std'];
const state: { day: Day; mode: Mode; recent: boolean } = { day: today(), mode: 'current', recent: true };
const rules = (mode = state.mode): Rules => ({ mode, recent: state.recent });
const h = new URLSearchParams(location.hash.slice(1));
if (/^\d{4}-\d{2}-\d{2}$/.test(h.get('date') ?? '')) state.day = parse(h.get('date')!);
if (MODES.includes(h.get('mode') as Mode)) state.mode = h.get('mode') as Mode;
if (h.get('recent') === '0') state.recent = false;

let raster: Raster | null = null;
const canvas = document.createElement('canvas');

const map = new MapLibreMap({
  container: 'map',
  style: STYLE_URL,
  bounds: [-141.5, 41.5, -52, 74],
  fitBoundsOptions: { padding: 10 },
  cooperativeGestures: true,
  attributionControl: { compact: true },
  // voltnav.app sends no CORS headers; in dev, route tile requests through the Vite proxy.
  transformRequest: (url) =>
    import.meta.env.DEV && url.startsWith(TILE_ORIGIN) ? { url: url.replace(TILE_ORIGIN, `${location.origin}/tiles`) } : { url },
});
map.addControl(new NavigationControl({ showCompass: false }), 'top-right');

const modeLabel = (m: Mode) => (m === 'current' && state.recent ? t('modeSub.current') : t(`modeLower.${m}`));
const daysInYear = (y: number) => (Date.UTC(y + 1, 0, 1) - Date.UTC(y, 0, 1)) / 86400000;
const dayIndex = (d: Day) => (Date.UTC(d.y, d.m, d.d) - Date.UTC(d.y, 0, 1)) / 86400000;
const dayFromIndex = (y: number, i: number): Day => {
  const dt = new Date(Date.UTC(y, 0, 1 + i));
  return { y, m: dt.getUTCMonth(), d: dt.getUTCDate() };
};
const dateLabel = (d: Day) =>
  new Date(Date.UTC(d.y, d.m, d.d)).toLocaleDateString(locale(), { day: 'numeric', month: 'long', timeZone: 'UTC' });

const cityName = (n: string) => tOr(`city.${n}`, n);

function renderCities() {
  const head = `<thead><tr><th rowspan="2">${t('city')}</th>${MODES.map(
    (m) => {
      const tip = m === 'current' && state.recent ? ` title="${t('currentTip')}" class="tip` + (m === state.mode ? ' on' : '') + '"' : ` class="${m === state.mode ? 'on' : ''}"`;
      return `<th colspan="3"${tip}>${t(`mode.${m}`)}</th>`;
    },
  ).join('')}</tr><tr>${MODES.map(
    (m) => [t('rise'), t('noon'), t('set')].map((x) => `<th class="sub ${m === state.mode ? 'on' : ''}">${x}</th>`).join(''),
  ).join('')}</tr></thead>`;
  const row = (c: (typeof CITIES)[number]) => {
    const cells = MODES.map((m) => {
      const s = solarInfo(state.day, c.lat, c.lon, rules(m), c.zone);
      const cls = m === state.mode ? 'on' : '';
      return `<td class="${cls}">${fmtClock(s.sunrise, s.offsetMin)}</td><td class="${cls}"><b>${fmtClock(s.solarNoon, s.offsetMin)}</b></td><td class="${cls}">${fmtClock(s.sunset, s.offsetMin)}</td>`;
    }).join('');
    return `<tr><th scope="row">${cityName(c.name)}</th>${cells}</tr>`;
  };
  // Regions west to east; cities within a region west to east.
  const rows = REGIONS.map((r) => {
    const list = CITIES.filter((c) => c.region === r).sort((a, b) => a.lon - b.lon);
    return `<tr class="region"><th colspan="10">${t(`region.${r}`)}</th></tr>${list.map(row).join('')}`;
  }).join('');
  $('cities-table').innerHTML = head + `<tbody>${rows}</tbody>`;
}

function render() {
  if (raster) drawGradient(canvas, state.day, rules(), raster);
  const src = map.getSource('noon') as ImageSource | undefined;
  src?.updateImage({ url: canvas.toDataURL(), coordinates: CORNERS });
  if (raster) (map.getSource('noon0') as GeoJSONSource | undefined)?.setData(noonLine(state.day, rules(), raster));
  const label = dateLabel(state.day);
  $('subtitle').textContent = `${t('subtitle')} — ${label} — ${modeLabel(state.mode)}`;
  $('date-label').textContent = label;
  ($('day') as HTMLInputElement).value = String(dayIndex(state.day));
  document.querySelectorAll<HTMLElement>('#modes button').forEach((b) =>
    b.classList.toggle('on', b.dataset.mode === state.mode),
  );
  renderCities();
  marks.classList.toggle('dst-off', state.mode !== 'current');
  ($('recent') as HTMLInputElement).checked = state.recent;
  $('recent-wrap').classList.toggle('inactive', state.mode !== 'current');
  history.replaceState(null, '', `#date=${iso(state.day)}&mode=${state.mode}${state.recent ? '' : '&recent=0'}`);
}

const labels: [HTMLElement, number][] = [];
const cityLabels: [HTMLElement, string][] = [];
const syncLabels = () => labels.forEach(([el, z]) => el.classList.toggle('nolabel', map.getZoom() < z));
map.on('zoom', syncLabels);

map.once('style.load', async () => {
  const gj = await (await fetch(`${import.meta.env.BASE_URL}data/canada.geojson`)).json();
  raster = buildRaster(gj.features);
  drawGradient(canvas, state.day, rules(), raster);

  // Insert the gradient under the first label layer so names stay readable.
  const firstSymbol = map.getStyle().layers.find((l) => l.type === 'symbol')?.id;
  map.addSource('noon', { type: 'image', url: canvas.toDataURL(), coordinates: CORNERS });
  map.addLayer({ id: 'noon', type: 'raster', source: 'noon', paint: { 'raster-opacity': 0.8, 'raster-fade-duration': 0 } }, firstSymbol);
  map.addSource('noon0', { type: 'geojson', data: noonLine(state.day, rules(), raster) });
  map.addLayer({ id: 'noon0-casing', type: 'line', source: 'noon0', paint: { 'line-color': '#fff', 'line-width': 5, 'line-opacity': 0.9 } }, firstSymbol);
  map.addLayer({ id: 'noon0-line', type: 'line', source: 'noon0', paint: { 'line-color': '#111', 'line-width': 2.2 } }, firstSymbol);
  map.addSource('prov', { type: 'geojson', data: gj });
  map.addLayer({ id: 'prov-border', type: 'line', source: 'prov', paint: { 'line-color': '#111', 'line-width': 0.9 } }, firstSymbol);
  for (const c of CITIES) {
    const el = document.createElement('div');
    el.className = 'city';
    el.innerHTML = `<i></i><span>${cityName(c.name)}</span>`;
    cityLabels.push([el.querySelector('span')!, c.name]);
    new Marker({ element: el, anchor: 'left' }).setLngLat([c.lon, c.lat]).addTo(map);
    labels.push([el, c.labelZoom]);
  }
  syncLabels();
  render();
});

// ---- tooltip ----
const tip = $('tooltip');
map.on('mousemove', (e) => {
  const { lng, lat } = e.lngLat;
  const hit = raster && lookup(raster, lng, lat);
  if (!hit) {
    tip.hidden = true;
    return;
  }
  const zone = ZONES[hit.zone - 1];
  const s = solarInfo(state.day, lat, lng, rules(), zone.id);
  const dayLen = s.sunrise && s.sunset ? (s.sunset - s.sunrise) / 60000 : null;
  const sign = s.noonOffsetMin >= 0 ? '+' : '−';
  tip.innerHTML = `
    <div class="coords">${lat.toFixed(2)}°N, ${Math.abs(lng).toFixed(2)}°${t('west')} · ${t(`zone.${zone.id}`)}</div>
    <table>
      <tr><td>${t('rise')}</td><td>${fmtClock(s.sunrise, s.offsetMin)}</td></tr>
      <tr><td>${t('noon')}</td><td><b>${fmtClock(s.solarNoon, s.offsetMin)}</b></td></tr>
      <tr><td>${t('set')}</td><td>${fmtClock(s.sunset, s.offsetMin)}</td></tr>
      <tr><td>${t('dayLen')}</td><td>${dayLen === null ? '—' : `${Math.floor(dayLen / 60)} ${t('hourUnit')} ${pad(Math.round(dayLen % 60))}`}</td></tr>
      <tr><td>${t('gap')}</td><td>${sign}${Math.abs(Math.round(s.noonOffsetMin))} min</td></tr>
    </table>
    <div class="coords">UTC${s.offsetMin >= 0 ? '+' : '−'}${Math.abs(s.offsetMin / 60)}</div>`;
  tip.hidden = false;
  const r = map.getContainer().getBoundingClientRect();
  const w = tip.offsetWidth;
  const hgt = tip.offsetHeight;
  const x = e.point.x + 16 + w > r.width ? e.point.x - 16 - w : e.point.x + 16;
  const y = e.point.y + 16 + hgt > r.height ? e.point.y - 16 - hgt : e.point.y + 16;
  tip.style.transform = `translate(${x}px, ${y}px)`;
});
map.on('mouseout', () => (tip.hidden = true));

// ---- controls ----
const slider = $('day') as HTMLInputElement;
slider.max = String(daysInYear(state.day.y) - 1);
slider.addEventListener('input', () => {
  state.day = dayFromIndex(state.day.y, Number(slider.value));
  render();
});
$('today').addEventListener('click', () => {
  const t = today();
  state.day = t.y === state.day.y ? t : { ...t, y: state.day.y };
  render();
});
($('recent') as HTMLInputElement).addEventListener('change', (e) => {
  state.recent = (e.target as HTMLInputElement).checked;
  render();
});
document.querySelectorAll<HTMLElement>('#modes button').forEach((b) =>
  b.addEventListener('click', () => {
    state.mode = b.dataset.mode as Mode;
    render();
  }),
);
const buildMonths = () =>
  ($('months').innerHTML = Array.from({ length: 12 }, (_, m) => {
    const left = (dayIndex({ y: state.day.y, m, d: 1 }) / (daysInYear(state.day.y) - 1)) * 100;
    const name = new Date(Date.UTC(2000, m, 1)).toLocaleDateString(locale(), { month: 'short', timeZone: 'UTC' });
    return `<span style="left:${left}%">${name}</span>`;
  }).join(''));

const marks = $('marks');
const markEl = (kind: 'season' | 'dst', m: { label: string; day: Day }) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `mark ${kind}`;
  b.style.left = `${(dayIndex(m.day) / (daysInYear(m.day.y) - 1)) * 100}%`;
  b.title = `${t(m.label)} — ${dateLabel(m.day)}`;
  b.setAttribute('aria-label', b.title);
  b.addEventListener('click', () => {
    state.day = m.day;
    render();
  });
  marks.appendChild(b);
};
const buildMarks = () => {
  marks.replaceChildren();
  seasonMarks(state.day.y).forEach((m) => markEl('season', m));
  dstMarks(state.day.y).forEach((m) => markEl('dst', m));
};

// ---- legend ----
$('bar').style.background = RAMP_CSS;
const ticks = [DOMAIN.min, 0, 30, 60, 90, 120, 150];
$('ticks').innerHTML = ticks
  .map((t) => `<span style="left:${((t - DOMAIN.min) / (DOMAIN.max - DOMAIN.min)) * 100}%">${t > 0 ? '+' : t < 0 ? '−' : ''}${Math.abs(t)}</span>`)
  .join('');

// ---- language ----
const applyLang = () => {
  applyStatic();
  buildMonths();
  buildMarks();
  cityLabels.forEach(([el, n]) => (el.textContent = cityName(n)));
  render();
};
$('lang').addEventListener('click', () => {
  setLang(lang === 'en' ? 'fr' : 'en');
  applyLang();
});
applyLang();
