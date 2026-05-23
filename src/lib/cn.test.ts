import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('combines multiple class names into a single string', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('returns an empty string when called with no arguments', () => {
    expect(cn()).toBe('');
  });

  it('filters out falsy values', () => {
    expect(cn('foo', false && 'bar', undefined, null, '')).toBe('foo');
  });

  it('includes truthy conditional classes', () => {
    expect(cn('foo', true && 'bar')).toBe('foo bar');
  });

  it('merges conflicting Tailwind utility classes, keeping the last one', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });

  it('does not merge non-conflicting Tailwind classes', () => {
    expect(cn('px-2', 'py-4')).toBe('px-2 py-4');
    expect(cn('text-sm', 'font-bold')).toBe('text-sm font-bold');
  });

  it('accepts an array of class names', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('accepts an object mapping class names to booleans', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('handles a mix of strings, arrays, and objects', () => {
    expect(cn('base', ['extra'], { active: true, disabled: false })).toBe('base extra active');
  });

  it('handles deeply nested arrays', () => {
    expect(cn([['a', 'b'], 'c'])).toBe('a b c');
  });

  it('returns only the winning class when multiple conflicting variants are given', () => {
    expect(cn('rounded', 'rounded-full', 'rounded-md')).toBe('rounded-md');
  });
});
