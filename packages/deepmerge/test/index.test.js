import { describe, expect, it } from "vitest";
import deepmerge from "../dist/cjs.js";

describe("patched deepmerge", () => {
  it("does not copy a __proto__ key", () => {
    const result = deepmerge({}, JSON.parse('{"__proto__":{"polluted":true}}'));
    expect(result.polluted).toBeUndefined();
    expect({}.polluted).toBeUndefined();
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  });

  it("does not copy constructor or prototype keys", () => {
    const result = deepmerge(
      {},
      {
        constructor: { prototype: { polluted: true } },
        prototype: { polluted: true },
      },
    );
    expect(Object.hasOwn(result, "constructor")).toBe(false);
    expect(Object.hasOwn(result, "prototype")).toBe(false);
    expect({}.polluted).toBeUndefined();
  });

  it("keeps the normal merge behaviour", () => {
    expect(
      deepmerge({ a: { b: 1, c: [1] } }, { a: { b: 2, c: [2], d: 3 } }),
    ).toEqual({ a: { b: 2, c: [1, 2], d: 3 } });
  });
});
