import { describe, expect, it } from "vitest";
import isMalformedRouteParam, {
  hasMalformedRouteParam,
} from "./isMalformedRouteParam";

describe("isMalformedRouteParam", () => {
  it("accepts the ids our detail pages use", () => {
    expect(isMalformedRouteParam("123")).toBe(false);
    expect(isMalformedRouteParam("0x3f1a2b3c4d_0")).toBe(false);
    expect(
      isMalformedRouteParam("15roJ4ZrgrZam5BQWJgiGHpgp7ShFQBRNLq6qUfiNqXDZjMK"),
    ).toBe(false);
    expect(
      isMalformedRouteParam("QmYyQSo1c1Ym7orWxLYvCrM2EmxFTANf8wXmmE7DWjhx5N"),
    ).toBe(false);
    expect(isMalformedRouteParam("2026-11-04")).toBe(false);
    expect(isMalformedRouteParam("summary")).toBe(false);
  });

  it("rejects scanner payloads appended to a detail url", () => {
    // /democracy/externals/%3Fphpinfo=1 and friends: Next.js decodes the segment first,
    // so the page receives the query string as part of the id.
    expect(isMalformedRouteParam("?phpinfo=1")).toBe(true);
    expect(isMalformedRouteParam("15%0Aexpr%20795715446152%0A")).toBe(true);
    expect(isMalformedRouteParam("15\nexpr 795715446152\n")).toBe(true);
    expect(isMalformedRouteParam("..")).toBe(true);
    expect(isMalformedRouteParam(".")).toBe(true);
    expect(isMalformedRouteParam("../etc/passwd")).toBe(true);
    expect(isMalformedRouteParam("abc#fragment")).toBe(true);
    expect(isMalformedRouteParam("<script>alert(1)</script>")).toBe(true);
  });

  it("accepts catch-all params that carry a trailing route", () => {
    // /user/15roJ4.../evidences is a real profile tab.
    expect(
      isMalformedRouteParam([
        "15roJ4ZrgrZam5BQWJgiGHpgp7ShFQBRNLq6qUfiNqXDZjMK",
      ]),
    ).toBe(false);
    expect(isMalformedRouteParam([])).toBe(false);
  });

  it("rejects a malformed segment of a catch-all route", () => {
    expect(isMalformedRouteParam(["15roJ4", "../etc/passwd"])).toBe(true);
  });

  it("ignores values that are not route segments", () => {
    expect(isMalformedRouteParam(undefined)).toBe(false);
    expect(isMalformedRouteParam(null)).toBe(false);
    expect(isMalformedRouteParam(1)).toBe(false);
  });
});

describe("hasMalformedRouteParam", () => {
  it("checks every param of the route", () => {
    expect(hasMalformedRouteParam(undefined)).toBe(false);
    expect(hasMalformedRouteParam({})).toBe(false);
    expect(hasMalformedRouteParam({ id: "123" })).toBe(false);
    expect(hasMalformedRouteParam({ id: "123", evidenceId: "QmYyQSo" })).toBe(
      false,
    );
    expect(hasMalformedRouteParam({ id: "123", evidenceId: "?x=1" })).toBe(
      true,
    );
    expect(hasMalformedRouteParam({ params: ["15roJ4", "?x=1"] })).toBe(true);
  });
});
