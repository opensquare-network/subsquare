import { describe, expect, it } from "vitest";
import isReportableErrorStatus from "./isReportableErrorStatus";

describe("isReportableErrorStatus", () => {
  it("reports server failures", () => {
    expect(isReportableErrorStatus(500)).toBe(true);
    expect(isReportableErrorStatus(502)).toBe(true);
    expect(isReportableErrorStatus(503)).toBe(true);
    expect(isReportableErrorStatus("500")).toBe(true);
    expect(isReportableErrorStatus(undefined)).toBe(true);
    expect(isReportableErrorStatus(null)).toBe(true);
    expect(isReportableErrorStatus("")).toBe(true);
  });

  it("skips statuses that come from the request itself", () => {
    // 400: a path Next.js cannot decode, e.g. the `%c0%ae` scanner traffic
    expect(isReportableErrorStatus(400)).toBe(false);
    // 404: a page that does not exist
    expect(isReportableErrorStatus(404)).toBe(false);
    // 405: a non-GET request to a static chunk
    expect(isReportableErrorStatus(405)).toBe(false);
    expect(isReportableErrorStatus(401)).toBe(false);
    expect(isReportableErrorStatus(403)).toBe(false);
    expect(isReportableErrorStatus("404")).toBe(false);
  });
});
