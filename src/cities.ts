/** Regions, west to east; the territories come last. */
export const REGIONS = ['Colombie-Britannique', 'Prairies', 'Ontario', 'Québec', 'Atlantique', 'Nord'] as const;
export type Region = (typeof REGIONS)[number];

export interface City {
  name: string;
  lat: number;
  lon: number;
  zone: string; // id from ZONES
  region: Region;
  /** Map zoom from which the label shows. */
  labelZoom: number;
}

export const CITIES: City[] = [
  { name: 'Montréal', lat: 45.5017, lon: -73.5673, region: 'Québec', zone: 'eastern', labelZoom: 0 },
  { name: 'Québec', lat: 46.8139, lon: -71.208, region: 'Québec', zone: 'eastern', labelZoom: 4.5 },
  { name: 'Saguenay', lat: 48.4284, lon: -71.0686, region: 'Québec', zone: 'eastern', labelZoom: 5 },
  { name: 'Rouyn-Noranda', lat: 48.2366, lon: -79.0231, region: 'Québec', zone: 'eastern', labelZoom: 5 },
  { name: 'Gaspé', lat: 48.8328, lon: -64.4819, region: 'Québec', zone: 'eastern', labelZoom: 4.5 },
  { name: 'Vancouver', lat: 49.2827, lon: -123.1207, region: 'Colombie-Britannique', zone: 'pacific', labelZoom: 0 },
  { name: 'Whitehorse', lat: 60.7212, lon: -135.0568, region: 'Nord', zone: 'yukon', labelZoom: 0 },
  { name: 'Yellowknife', lat: 62.454, lon: -114.3718, region: 'Nord', zone: 'nwt', labelZoom: 0 },
  { name: 'Calgary', lat: 51.0447, lon: -114.0719, region: 'Prairies', zone: 'alberta', labelZoom: 3.5 },
  { name: 'Edmonton', lat: 53.5461, lon: -113.4938, region: 'Prairies', zone: 'alberta', labelZoom: 3.5 },
  { name: 'Regina', lat: 50.4452, lon: -104.6189, region: 'Prairies', zone: 'cst', labelZoom: 3.5 },
  { name: 'Winnipeg', lat: 49.8951, lon: -97.1384, region: 'Prairies', zone: 'manitoba', labelZoom: 0 },
  { name: 'Toronto', lat: 43.6532, lon: -79.3832, region: 'Ontario', zone: 'eastern', labelZoom: 0 },
  { name: 'Ottawa', lat: 45.4215, lon: -75.6972, region: 'Ontario', zone: 'eastern', labelZoom: 4.5 },
  { name: 'Iqaluit', lat: 63.7467, lon: -68.517, region: 'Nord', zone: 'eastern', labelZoom: 0 },
  { name: 'Halifax', lat: 44.6488, lon: -63.5752, region: 'Atlantique', zone: 'atlantic', labelZoom: 3.5 },
  { name: "St. John's", lat: 47.5615, lon: -52.7126, region: 'Atlantique', zone: 'nst', labelZoom: 0 },
];
