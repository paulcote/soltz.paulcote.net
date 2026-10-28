import { getTimes } from 'suncalc';
import { Rules, utcOffsetMin } from './tz';

export interface Day {
  y: number;
  m: number; // 0-based
  d: number;
}

export interface SolarInfo {
  sunrise: number | null; // UTC ms
  solarNoon: number;
  sunset: number | null;
  offsetMin: number; // UTC offset of the clock in effect
  noonOffsetMin: number; // clock time of solar noon minus 12:00, minutes
}

const valid = (d: Date | null) => (d === null || Number.isNaN(d.getTime()) ? null : d.getTime());

/** Solar noon in UTC ms for the calendar day, near the given longitude. */
export function solarNoonUtc(day: Day, lat: number, lon: number): number {
  const anchor = Date.UTC(day.y, day.m, day.d, 12) - (lon / 15) * 3600000;
  return getTimes(new Date(anchor), lat, lon).solarNoon.getTime();
}

export function solarInfo(day: Day, lat: number, lon: number, rules: Rules, zoneId: string): SolarInfo {
  const anchor = Date.UTC(day.y, day.m, day.d, 12) - (lon / 15) * 3600000;
  const t = getTimes(new Date(anchor), lat, lon);
  const solarNoon = t.solarNoon.getTime();
  const offsetMin = utcOffsetMin(rules, solarNoon, zoneId);
  const clockMin = ((solarNoon + offsetMin * 60000) / 60000) % 1440;
  return {
    sunrise: valid(t.sunrise),
    solarNoon,
    sunset: valid(t.sunset),
    offsetMin,
    noonOffsetMin: (((clockMin % 1440) + 1440) % 1440) - 720,
  };
}

export function fmtClock(utcMs: number | null, offsetMin: number): string {
  if (utcMs === null) return '—';
  const d = new Date(utcMs + offsetMin * 60000);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`;
}
