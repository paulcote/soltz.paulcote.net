import { describe, expect, it } from 'vitest';
import { dstMarks, seasonMarks } from './astro';

describe('marks', () => {
  it('2026 seasons', () => {
    expect(seasonMarks(2026).map((m) => `${m.day.m + 1}-${m.day.d}`)).toEqual(['3-20', '6-21', '9-22', '12-21']);
  });
  it('2026 DST changes', () => {
    expect(dstMarks(2026).map((m) => `${m.day.m + 1}-${m.day.d}`)).toEqual(['3-8', '11-1']);
  });
});
