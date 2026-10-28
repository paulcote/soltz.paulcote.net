import type { Day } from './solar';
import { nthSunday } from './tz';

// Meeus, Astronomical Algorithms ch. 27 (valid 1000–3000): [JDE0, a1, a2, a3, a4] with Y = (year − 2000) / 1000.
const TERMS: [string, number[]][] = [
  ['mark.mar', [2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057]],
  ['mark.jun', [2451716.56767, 365241.62603, 0.00325, 0.00888, -0.0003]],
  ['mark.sep', [2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078]],
  ['mark.dec', [2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032]],
];

export interface Mark {
  /** i18n key */
  label: string;
  day: Day;
}

/** Equinoxes and solstices as calendar days in eastern time (UTC−5, ΔT ignored: day-level accuracy). */
export function seasonMarks(year: number): Mark[] {
  const Y = (year - 2000) / 1000;
  return TERMS.map(([label, c]) => {
    const jd = c[0] + c[1] * Y + c[2] * Y ** 2 + c[3] * Y ** 3 + c[4] * Y ** 4;
    const dt = new Date((jd - 2440587.5) * 86400000 - 5 * 3600000);
    return { label, day: { y: dt.getUTCFullYear(), m: dt.getUTCMonth(), d: dt.getUTCDate() } };
  });
}

/** North-American DST changes (same rule as isNorthAmericanDst). */
export function dstMarks(year: number): Mark[] {
  return [
    { label: 'mark.dstStart', day: { y: year, m: 2, d: nthSunday(year, 2, 2) } },
    { label: 'mark.dstEnd', day: { y: year, m: 10, d: nthSunday(year, 10, 1) } },
  ];
}
