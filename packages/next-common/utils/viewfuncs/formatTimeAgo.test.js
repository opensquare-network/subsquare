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

  it("30 seconds ago", () => {
    expect(formatTimeAgo(dayjs().subtract(30, "second"))).toBe("30s ago");
  });

  it("15 seconds ago", () => {
    expect(formatTimeAgo(dayjs().subtract(15, "second"))).toBe("15s ago");
  });

  it("now/pass within 10 seconds", () => {
    expect(formatTimeAgo(dayjs().subtract(10, "second"))).toBe("now");
    expect(formatTimeAgo(dayjs().subtract(9, "second"))).toBe("now");
    expect(formatTimeAgo(dayjs().subtract(3, "second"))).toBe("now");
  });
});

describe("future time", () => {
  function d() {
    return dayjs().add(200, "millisecond");
  }

  it("in 2 years", () => {
    expect(formatTimeAgo(d().add(2, "year"))).toBe("in 2y");
  });

  it("in 2 months", () => {
    expect(formatTimeAgo(d().add(2, "month"))).toBe("in 2mo");
  });

  it("in 2 days", () => {
    expect(formatTimeAgo(d().add(2, "day"))).toBe("in 2d");
  });

  it("in 2 hours", () => {
    expect(formatTimeAgo(d().add(2, "hour"))).toBe("in 2hr");
  });

  it("in 2 minutes", () => {
    expect(formatTimeAgo(d().add(2, "minute"))).toBe("in 2min");
  });

  it("in a minute", () => {
    expect(formatTimeAgo(d().add(1, "minute"))).toBe("in 1min");
  });

  it("in 30 seconds", () => {
    expect(formatTimeAgo(d().add(30, "second"))).toBe("in 30s");
  });

  it("in 15 seconds", () => {
    expect(formatTimeAgo(d().add(15, "second"))).toBe("in 15s");
  });

  it("now/future within 10 seconds", () => {
    expect(formatTimeAgo(d().add(10, "second"))).toBe("now");
    expect(formatTimeAgo(d().add(9, "second"))).toBe("now");
    expect(formatTimeAgo(d().add(3, "second"))).toBe("now");
  });
});

describe("unknown time", () => {
  it("unknown", () => {
    expect(formatTimeAgo(null)).toBe("unknown");
    expect(formatTimeAgo(undefined)).toBe("unknown");
    expect(formatTimeAgo(false)).toBe("unknown");
  });
});
