import { describe, expect, it } from "vitest";
import { formatTimeAgo } from "./formatTimeAgo";
import dayjs from "dayjs";

describe("pass time", () => {
  it("2 years ago", () => {
    expect(formatTimeAgo(dayjs().subtract(2, "year"))).toBe("2y ago");
  });

  it("a year ago", () => {
    expect(formatTimeAgo(dayjs().subtract(1, "year"))).toBe("1y ago");
  });

  it("3 months ago", () => {
    expect(formatTimeAgo(dayjs().subtract(3, "month"))).toBe("3mo ago");
  });

  it("1 month ago", () => {
    expect(formatTimeAgo(dayjs().subtract(1, "month"))).toBe("1mo ago");
  });

  it("2 days ago", () => {
    expect(formatTimeAgo(dayjs().subtract(2, "day"))).toBe("2d ago");
  });

  it("1 day ago", () => {
    expect(formatTimeAgo(dayjs().subtract(1, "day"))).toBe("1d ago");
  });

  it("1 hour ago", () => {
    expect(formatTimeAgo(dayjs().subtract(1, "hour"))).toBe("1hr ago");
  });

  it("1 minute ago", () => {
    expect(formatTimeAgo(dayjs().subtract(1, "minute"))).toBe("1min ago");
  });

  it("now/pass within a minute", () => {
    expect(formatTimeAgo(dayjs().subtract(20, "second"))).toBe("now");
  });
});

describe("future time", () => {
  const time = dayjs().add(10, "second");

  it("in 2 years", () => {
    expect(formatTimeAgo(time.add(2, "year"))).toBe("in 2y");
  });

  it("in 2 months", () => {
    expect(formatTimeAgo(time.add(2, "month"))).toBe("in 2mo");
  });

  it("in 2 days", () => {
    expect(formatTimeAgo(time.add(2, "day"))).toBe("in 2d");
  });

  it("in 2 hours", () => {
    expect(formatTimeAgo(time.add(2, "hour"))).toBe("in 2hr");
  });

  it("in 2 minutes", () => {
    expect(formatTimeAgo(time.add(2, "minute"))).toBe("in 2min");
  });

  it("in a minute", () => {
    expect(formatTimeAgo(time.add(1, "minute"))).toBe("in 1min");
  });

  it("now/future within a minute", () => {
    expect(formatTimeAgo(time.add(20, "second"))).toBe("now");
  });
});

describe("unknown time", () => {
  it("unknown", () => {
    expect(formatTimeAgo(null)).toBe("unknown");
    expect(formatTimeAgo(undefined)).toBe("unknown");
    expect(formatTimeAgo(false)).toBe("unknown");
  });
});
