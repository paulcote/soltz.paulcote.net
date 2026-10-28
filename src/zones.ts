import { H, W, latOf, lonOf, xOf, yOf } from './proj';
import { zoneIdAt, zoneIndex } from './tz';

type Ring = number[][];
interface Feature {
  properties: { name: string };
  geometry: { type: 'MultiPolygon'; coordinates: Ring[][] };
}

export interface Raster {
  names: string[]; // province names; prov values are index + 1
  prov: Uint8Array; // W*H, 0 = outside Canada
  zone: Uint8Array; // W*H, index into ZONES + 1
}

/** Rasterise the provinces once, then derive a zone for every pixel. */
export function buildRaster(features: Feature[]): Raster {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const names = features.map((f) => f.properties.name);

  features.forEach((f, i) => {
    ctx.fillStyle = `rgb(${(i + 1) * 16},0,0)`; // spaced values survive edge antialiasing
    ctx.beginPath();
    for (const poly of f.geometry.coordinates)
      for (const ring of poly) {
        ring.forEach(([lon, lat], k) => (k ? ctx.lineTo(xOf(lon), yOf(lat)) : ctx.moveTo(xOf(lon), yOf(lat))));
        ctx.closePath();
      }
    ctx.fill('evenodd');
  });

  const px = ctx.getImageData(0, 0, W, H).data;
  const prov = new Uint8Array(W * H);
  const zone = new Uint8Array(W * H);
  const lons = Float64Array.from({ length: W }, (_, x) => lonOf(x));
  for (let y = 0; y < H; y++) {
    const lat = latOf(y);
    for (let x = 0; x < W; x++) {
      const p = y * W + x;
      if (px[p * 4 + 3] < 128) continue;
      const id = Math.round(px[p * 4] / 16);
      if (id < 1 || id > names.length) continue;
      prov[p] = id;
      zone[p] = zoneIndex(zoneIdAt(names[id - 1], lons[x], lat));
    }
  }
  return { names, prov, zone };
}

export function lookup(r: Raster, lon: number, lat: number): { province: string; zone: number } | null {
  const x = Math.floor(xOf(lon));
  const y = Math.floor(yOf(lat));
  if (x < 0 || y < 0 || x >= W || y >= H) return null;
  const p = y * W + x;
  return r.prov[p] ? { province: r.names[r.prov[p] - 1], zone: r.zone[p] } : null;
}
