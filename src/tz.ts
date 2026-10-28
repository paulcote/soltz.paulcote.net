export type Mode = 'current' | 'dst' | 'std';

/** What to compute: a scenario, plus whether recent permanent-DST adoptions apply to the current rules. */
export interface Rules {
  mode: Mode;
  recent: boolean;
}

export interface Zone {
  id: string;
  /** Standard-time UTC offset, minutes. */
  std: number;
  /** Observes DST today. Zones that don't keep their offset in every mode. */
  dst: boolean;
  /** Adopted permanent DST (std + 1 h all year) in 2026; applies to 'current' rules when `recent` is on. */
  permanentDst?: boolean;
}

export const ZONES: Zone[] = [
  { id: 'pacific', std: -480, dst: true, permanentDst: true },
  { id: 'yukon', std: -420, dst: false },
  { id: 'mtn-fixed', std: -420, dst: false },
  { id: 'alberta', std: -420, dst: true, permanentDst: true },
  { id: 'mountain', std: -420, dst: true },
  { id: 'nwt', std: -420, dst: true, permanentDst: true },
  { id: 'cst', std: -360, dst: false },
  { id: 'central', std: -360, dst: true },
  { id: 'manitoba', std: -360, dst: true, permanentDst: true },
  { id: 'eastern', std: -300, dst: true },
  { id: 'atlantic', std: -240, dst: true },
  { id: 'ast', std: -240, dst: false },
  { id: 'nst', std: -210, dst: true },
];

/** Index into ZONES + 1 (0 = outside Canada). */
export const zoneIndex = (id: string) => ZONES.findIndex((z) => z.id === id) + 1;

/** Nth (1-based) Sunday of a month, as a UTC day-of-month. */
export function nthSunday(year: number, month: number, n: number): number {
  const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
  return 1 + ((7 - first) % 7) + (n - 1) * 7;
}

/** North-American DST: 2nd Sunday of March 2:00 local → 1st Sunday of November 2:00 local. */
export function isNorthAmericanDst(utcMs: number, stdOffsetMin: number): boolean {
  const year = new Date(utcMs).getUTCFullYear();
  const start = Date.UTC(year, 2, nthSunday(year, 2, 2), 2) - stdOffsetMin * 60000;
  const end = Date.UTC(year, 10, nthSunday(year, 10, 1), 2) - (stdOffsetMin + 60) * 60000;
  return utcMs >= start && utcMs < end;
}

/**
 * Zone for a point, from its province and a few geographic rules. Boundaries are approximate:
 * small enclaves (Atikokan, Lloydminster, Southampton Island, …) are ignored.
 */
export function zoneIdAt(province: string, lon: number, lat: number): string {
  switch (province) {
    case 'British Columbia':
      if ((lat >= 55.5 && lon > -125.5) || (lat >= 53.5 && lon > -121.9)) return 'mtn-fixed'; // Peace River
      if (lon > -117.6 && lat < 52.5) return 'mountain'; // Kootenays
      return 'pacific';
    case 'Yukon Territory':
      return 'yukon';
    case 'Alberta':
      return 'alberta';
    case 'Northwest Territories':
      return 'nwt';
    case 'Saskatchewan':
      return 'cst';
    case 'Manitoba':
      return 'manitoba';
    case 'Ontario':
      return lon < -90 ? 'central' : 'eastern';
    case 'Nunavut':
      return lon > -85.5 ? 'eastern' : lon > -102 ? 'central' : 'mountain';
    case 'Quebec':
      if (lon <= -63) return 'eastern';
      return lat < 49 ? 'atlantic' : 'ast'; // Magdalen Islands : Lower North Shore
    case 'New Brunswick':
    case 'Nova Scotia':
    case 'Prince Edward Island':
      return 'atlantic';
    case 'Newfoundland and Labrador': {
      const island = lat < 51.8 && lon > -59.6 && (lon > -56.6 || lat < 51.2);
      return island ? 'nst' : 'atlantic';
    }
    default:
      return 'eastern';
  }
}

/** UTC offset in minutes of a zone at an instant under a mode. */
export function utcOffsetMin({ mode, recent }: Rules, utcMs: number, zoneId: string): number {
  const z = ZONES.find((x) => x.id === zoneId)!;
  if (!z.dst) return z.std;
  // Regions that adopted permanent DST keep it in every scenario while the option is on.
  if (recent && z.permanentDst) return z.std + 60;
  if (mode === 'std') return z.std;
  if (mode === 'dst') return z.std + 60;
  return isNorthAmericanDst(utcMs, z.std) ? z.std + 60 : z.std;
}
