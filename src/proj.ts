export const BBOX = { west: -141.1, east: -52.4, south: 41.6, north: 83.3 };

export const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
export const invMercY = (y: number) => (2 * Math.atan(Math.exp(y)) - Math.PI / 2) * (180 / Math.PI);

export const W = 1400;
export const yTop = mercY(BBOX.north);
export const yBot = mercY(BBOX.south);
export const H = Math.round((W * (yTop - yBot)) / (((BBOX.east - BBOX.west) * Math.PI) / 180));

export const xOf = (lon: number) => ((lon - BBOX.west) / (BBOX.east - BBOX.west)) * W;
export const yOf = (lat: number) => ((yTop - mercY(lat)) / (yTop - yBot)) * H;
export const lonOf = (x: number) => BBOX.west + ((x + 0.5) / W) * (BBOX.east - BBOX.west);
export const latOf = (y: number) => invMercY(yTop - ((y + 0.5) / H) * (yTop - yBot));

/** Corner coordinates for a MapLibre image source: TL, TR, BR, BL. */
export const CORNERS: [[number, number], [number, number], [number, number], [number, number]] = [
  [BBOX.west, BBOX.north],
  [BBOX.east, BBOX.north],
  [BBOX.east, BBOX.south],
  [BBOX.west, BBOX.south],
];
