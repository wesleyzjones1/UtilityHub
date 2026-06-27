import { describe, it, expect } from 'vitest';
import {
  MAX_DURATION,
  clampDuration,
  computeOutputHeight,
  estimateFrameCount,
  frameDelayMs,
  formatBytes,
  estimateGifBytes,
} from './videoToGifUtils';

describe('clampDuration', () => {
  it('keeps values inside the range', () => expect(clampDuration(3)).toBe(3));
  it('clamps above the max', () => expect(clampDuration(50)).toBe(MAX_DURATION));
  it('clamps below the minimum', () => expect(clampDuration(0)).toBe(0.1));
  it('falls back to 1 for non-numeric input', () => expect(clampDuration('abc')).toBe(1));
  it('respects a custom max', () => expect(clampDuration(8, 5)).toBe(5));
});

describe('computeOutputHeight', () => {
  it('preserves aspect ratio', () => expect(computeOutputHeight(1920, 1080, 480)).toBe(270));
  it('rounds odd results up to even', () => expect(computeOutputHeight(100, 99, 101)).toBe(100));
  it('returns 0 when a dimension is missing', () => expect(computeOutputHeight(0, 1080, 480)).toBe(0));
});

describe('estimateFrameCount', () => {
  it('multiplies duration by fps', () => expect(estimateFrameCount(3, 10)).toBe(30));
  it('never returns less than one', () => expect(estimateFrameCount(0.1, 1)).toBe(1));
  it('clamps long durations', () => expect(estimateFrameCount(100, 10)).toBe(100));
});

describe('frameDelayMs', () => {
  it('computes delay for 10 fps', () => expect(frameDelayMs(10)).toBe(100));
  it('computes delay for 25 fps', () => expect(frameDelayMs(25)).toBe(40));
  it('guards against zero fps', () => expect(frameDelayMs(0)).toBe(1000));
});

describe('formatBytes', () => {
  it('formats bytes', () => expect(formatBytes(512)).toBe('512 B'));
  it('formats kilobytes', () => expect(formatBytes(2048)).toBe('2.0 KB'));
  it('formats megabytes', () => expect(formatBytes(5 * 1024 * 1024)).toBe('5.0 MB'));
});

describe('estimateGifBytes', () => {
  it('scales with pixels and frames', () => {
    const small = estimateGifBytes(100, 100, 1, 10);
    const big = estimateGifBytes(200, 200, 1, 10);
    expect(big).toBeGreaterThan(small);
  });
});
