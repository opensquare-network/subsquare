import { describe, expect, it } from "vitest";
import { withBoundedArrayLength } from "./boundedArray.mjs";

describe("utils/callDecoder/boundedArray", () => {
  it("allocates arrays within the limit", () => {
    expect(withBoundedArrayLength(10, () => new Array(10).length)).toBe(10);
    expect(withBoundedArrayLength(10, () => Array(10).length)).toBe(10);
    expect(withBoundedArrayLength(10, () => new Array().length)).toBe(0);
    expect(withBoundedArrayLength(0, () => new Array(0).length)).toBe(0);
  });

  it("refuses to allocate arrays above the limit", () => {
    expect(() =>
      withBoundedArrayLength(10, () => new Array(202067340)),
    ).toThrow(RangeError);
    expect(() => withBoundedArrayLength(10, () => Array(11))).toThrow(
      RangeError,
    );
  });

  it("keeps the rest of the array behaviour", () => {
    const result = withBoundedArrayLength(10, () => {
      const array = new Array(2);
      array[0] = 1;
      array[1] = 2;
      return {
        isArray: Array.isArray(array),
        from: Array.from([1, 2, 3]),
        of: Array.of(1, 2),
        map: array.map((item) => item * 2),
        spread: [...array],
        plain: new Array(1, 2, 3),
      };
    });

    expect(result.isArray).toBe(true);
    expect(result.from).toEqual([1, 2, 3]);
    expect(result.of).toEqual([1, 2]);
    expect(result.map).toEqual([2, 4]);
    expect(result.spread).toEqual([1, 2]);
    expect(result.plain).toEqual([1, 2, 3]);
  });

  it("restores the global array afterwards, also when it throws", () => {
    const before = Array;
    expect(() => withBoundedArrayLength(1, () => new Array(2))).toThrow();
    expect(Array).toBe(before);
    withBoundedArrayLength(1, () => null);
    expect(Array).toBe(before);
  });

  it("returns what the decoder returned", () => {
    expect(withBoundedArrayLength(10, () => "value")).toBe("value");
  });
});
