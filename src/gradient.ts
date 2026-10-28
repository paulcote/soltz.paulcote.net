import { H, W, latOf, lonOf, xOf } from './proj';
import { Day, solarNoonUtc } from './solar';
import { Rules, ZONES, utcOffsetMin } from './tz';
import type { Raster } from './zones';

export const DOMAIN = { min: -30, max: 160 }; // minutes, fixed so modes/dates are comparable

const STOPS: [number, [number, number, number]][] = [
  [0, [26, 107, 47]],
  [0.25, [141, 191, 59]],
  [0.45, [255, 232, 58]],
  [0.72, [245, 154, 35]],
  [1, [224, 48, 30]],
];

export const RAMP_CSS = `linear-gradient(to right, ${STOPS.map(
  ([t, c]) => `rgb(${c.join(',')}) ${t * 100}%`,
).join(', ')})`;

export function rampColor(minutes: number): [number, number, number] {
  const t = Math.min(1, Math.max(0, (minutes - DOMAIN.min) / (DOMAIN.max - DOMAIN.min)));
  for (let i = 1; i < STOPS.length; i++) {
    if (t <= STOPS[i][0]) {
      const [t0, c0] = STOPS[i - 1];
      const [t1, c1] = STOPS[i];
      const f = (t - t0) / (t1 - t0);
      return [0, 1, 2].map((k) => Math.round(c0[k] + (c1[k] - c0[k]) * f)) as [number, number, number];
    }
  }
  return STOPS[STOPS.length - 1][1];
}

const BORDER: [number, number, number] = [150, 70, 0];

export function drawGradient(canvas: HTMLCanvasElement, day: Day, rules: Rules, raster: Raster): void {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Solar noon depends on longitude (weakly on latitude): compute per column, then the clock
  // time of that instant per zone (index 1..ZONES.length).
  const clock = ZONES.map(() => new Float32Array(W));
  for (let x = 0; x < W; x++) {
    const noon = solarNoonUtc(day, 55, lonOf(x));
    ZONES.forEach((z, k) => {
      const off = utcOffsetMin(rules, noon, z.id);
      clock[k][x] = ((((noon / 60000 + off) % 1440) + 1440) % 1440) - 720;
    });
  }

  const { zone } = raster;
  const img = ctx.createImageData(W, H);
  const out = img.data;
  const lut = new Map<number, [number, number, number]>();
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const p = y * W + x;
      const z = zone[p];
      if (!z) continue;
      const edge =
        (x < W - 1 && zone[p + 1] && zone[p + 1] !== z) || (y < H - 1 && zone[p + W] && zone[p + W] !== z);
      let c: [number, number, number];
      if (edge) c = BORDER;
      else {
        const key = Math.round(clock[z - 1][x] * 4);
        c = lut.get(key) ?? (lut.set(key, rampColor(key / 4)), lut.get(key)!);
      }
      out[p * 4] = c[0];
      out[p * 4 + 1] = c[1];
      out[p * 4 + 2] = c[2];
      out[p * 4 + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

/**
 * Where solar noon falls exactly on 12:00 of the clock: within each zone that is a single meridian
 * (found by bisection), drawn only where the zone has land.
 */
export function noonLine(day: Day, rules: Rules, raster: Raster) {
  const features: { type: 'Feature'; properties: object; geometry: { type: 'LineString'; coordinates: number[][] } }[] = [];
  ZONES.forEach((z, k) => {
    const f = (lon: number) => {
      const noon = solarNoonUtc(day, 55, lon);
      return ((((noon / 60000 + utcOffsetMin(rules, noon, z.id)) % 1440) + 1440) % 1440) - 720;
    };
    // Clock time of solar noon decreases eastwards: f > 0 in the west, < 0 in the east.
    let lo = -150;
    let hi = -40;
    if (f(lo) <= 0 || f(hi) >= 0) return;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      if (f(mid) > 0) lo = mid;
      else hi = mid;
    }
    const lon = (lo + hi) / 2;
    const x = Math.min(W - 1, Math.max(0, Math.floor(xOf(lon))));
    let start = -1;
    for (let y = 0; y <= H; y++) {
      const inside = y < H && raster.zone[y * W + x] === k + 1;
      if (inside && start < 0) start = y;
      if (!inside && start >= 0) {
        if (y - start > 2) features.push({ type: 'Feature', properties: { zone: z.id }, geometry: { type: 'LineString', coordinates: [[lon, latOf(start)], [lon, latOf(y - 1)]] } });
        start = -1;
      }
    }
  });
  return { type: 'FeatureCollection' as const, features };
}
