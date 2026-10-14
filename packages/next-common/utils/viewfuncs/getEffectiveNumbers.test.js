import { describe, expect, it } from "vitest";
import { getEffectiveNumbers } from "./getEffectiveNumbers";

describe("getEffectiveNumbers", () => {
  it("returns the digits with the decimal point and trailing zeros dropped", () => {
    expect(getEffectiveNumbers("0.00255")).toBe("000255");
    expect(getEffectiveNumbers("1.2040")).toBe("1204");
    expect(getEffectiveNumbers("25.49745")).toBe("2549745");
    expect(getEffectiveNumbers("100")).toBe("1");
    expect(getEffectiveNumbers("0")).toBe("");
  });

  it("counts digits, not separators", () => {
    // The callers compare this length against 11 to decide on abbreviation. Joining with the
    // default separator added a comma per digit, so six digits used to come back as an eleven
    // character string and tripped that test: 0.00255 was abbreviated to 0 and 25.49745 to
    // 25.5, both well under the length the callers meant.
    expect(getEffectiveNumbers("0.00255")).toHaveLength(6);
    expect(getEffectiveNumbers("25.49745")).toHaveLength(7);
    expect(getEffectiveNumbers("0.00255")).not.toContain(",");
  });
});
