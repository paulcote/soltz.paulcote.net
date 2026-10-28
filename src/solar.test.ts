import { describe, expect, it } from 'vitest';
import { fmtClock, solarInfo } from './solar';
import type { Mode, Rules } from './tz';

const rules = (mode: Mode, recent = true): Rules => ({ mode, recent });

describe('solarInfo', () => {
  // Montréal, 2026-06-21: sunrise ≈ 05:05 EDT, sunset ≈ 20:47 EDT
  it('matches known Montréal times', () => {
    const s = solarInfo({ y: 2026, m: 5, d: 21 }, 45.5, -73.57, rules('current'), 'eastern');
    expect(s.offsetMin).toBe(-240);
    expect(fmtClock(s.sunrise, s.offsetMin)).toMatch(/^05:0\d$/);
    expect(fmtClock(s.sunset, s.offsetMin)).toMatch(/^20:4\d$/);
  });
  it('permanent DST shifts noon by exactly 60 min in winter', () => {
    const day = { y: 2026, m: 0, d: 15 };
    const a = solarInfo(day, 46, -72, rules('current'), 'eastern').noonOffsetMin;
    const b = solarInfo(day, 46, -72, rules('dst'), 'eastern').noonOffsetMin;
    expect(b - a).toBeCloseTo(60, 5);
  });
  it('lower north shore stays on AST', () => {
    const day = { y: 2026, m: 0, d: 15 };
    expect(solarInfo(day, 51.4, -57.1, rules('dst'), 'ast').offsetMin).toBe(-240);
  });
  it('Saskatchewan and Yukon ignore DST modes', () => {
    const day = { y: 2026, m: 6, d: 1 };
    expect(solarInfo(day, 50.4, -104.6, rules('std'), 'cst').offsetMin).toBe(-360);
    expect(solarInfo(day, 60.7, -135, rules('dst'), 'yukon').offsetMin).toBe(-420);
  });
  it('Newfoundland is UTC−2:30 in summer', () => {
    expect(solarInfo({ y: 2026, m: 6, d: 1 }, 47.56, -52.7, rules('current'), 'nst').offsetMin).toBe(-150);
  });
  it('Alberta and BC: permanent DST in every mode with the option on, normal rules with it off', () => {
    const winter = { y: 2026, m: 0, d: 15 };
    expect(solarInfo(winter, 51, -114, rules('current'), 'alberta').offsetMin).toBe(-360);
    expect(solarInfo(winter, 51, -114, rules('current', false), 'alberta').offsetMin).toBe(-420);
    expect(solarInfo(winter, 51, -114, rules('std'), 'alberta').offsetMin).toBe(-360);
    expect(solarInfo(winter, 51, -114, rules('std', false), 'alberta').offsetMin).toBe(-420);
    expect(solarInfo(winter, 49, -123, rules('std'), 'pacific').offsetMin).toBe(-420);
    expect(solarInfo(winter, 49, -123, rules('current'), 'pacific').offsetMin).toBe(-420);
    expect(solarInfo(winter, 49, -123, rules('current', false), 'pacific').offsetMin).toBe(-480);
    expect(solarInfo(winter, 62.45, -114.4, rules('std'), 'nwt').offsetMin).toBe(-360);
    expect(solarInfo(winter, 49.9, -97, rules('std'), 'manitoba').offsetMin).toBe(-300);
    expect(solarInfo(winter, 49.9, -97, rules('current', false), 'manitoba').offsetMin).toBe(-360);
  });
});
