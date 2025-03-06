import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import { formatTimeAgo } from "./formatTimeAgo";

describe("pass time", () => {
  it("2 years ago", () => {
    expect(formatTimeAgo(dayjs().subtract(730, "day"))).toBe("2yrs ago");
  });

  it("a year ago", () => {
    expect(formatTimeAgo(dayjs().subtract(365, "day"))).toBe("1yr ago");
  });
  it("a year 2 months 3 days ago", () => {
    expect(formatTimeAgo(dayjs().subtract(425, "day"))).toBe("1yr ago");
  });

  it("3 months ago", () => {
    expect(formatTimeAgo(dayjs().subtract(90, "day"))).toBe("3mos ago");
  });
  it("3 month 14 days ago", () => {
    expect(formatTimeAgo(dayjs().subtract(104, "day"))).toBe("3mos ago");
  });

  it("1 month ago", () => {
    expect(formatTimeAgo(dayjs().subtract(30, "day"))).toBe("1mo ago");
  });
  it("1 month 14 days ago", () => {
    expect(formatTimeAgo(dayjs().subtract(44, "day"))).toBe("1mo ago");
  });

  it("3 days ago", () => {
    expect(formatTimeAgo(dayjs().subtract(3, "day"))).toBe("3d ago");
  });
  it("3 days 4 hours ago", () => {
    expect(formatTimeAgo(dayjs().subtract(3, "day").subtract(4, "hour"))).toBe(
      "3d ago",
    );
  });

  it("2 days ago", () => {
    expect(formatTimeAgo(dayjs().subtract(2, "day"))).toBe("2d ago");
  });
  it("2 days 4 hours ago", () => {
    expect(formatTimeAgo(dayjs().subtract(2, "day").subtract(4, "hour"))).toBe(
      "2d 4hrs ago",
    );
  });

  it("1 day ago", () => {
    expect(formatTimeAgo(dayjs().subtract(1, "day"))).toBe("1d ago");
  });

  it("1 hour ago", () => {
    expect(formatTimeAgo(dayjs().subtract(1, "hour"))).toBe("1hr ago");
  });

  it("1 hour 30 minutes ago", () => {
    expect(
      formatTimeAgo(dayjs().subtract(1, "hour").subtract(30, "minute")),
    ).toBe("1hr 30mins ago");
  });

  it("1 minute ago", () => {
    expect(formatTimeAgo(dayjs().subtract(1, "minute"))).toBe("1min ago");
  });

  it("now/pass within 60 seconds", () => {
    expect(formatTimeAgo(dayjs().subtract(30, "second"))).toBe("now");
    expect(formatTimeAgo(dayjs().subtract(15, "second"))).toBe("now");
    expect(formatTimeAgo(dayjs().subtract(10, "second"))).toBe("now");
    expect(formatTimeAgo(dayjs().subtract(9, "second"))).toBe("now");
    expect(formatTimeAgo(dayjs().subtract(3, "second"))).toBe("now");
  });
});

describe("future time", () => {
  function d() {
    return dayjs().add(5, "second");
  }

  it("in 2 years", () => {
    expect(formatTimeAgo(d().add(730, "day"))).toBe("in 2yrs");
  });

  it("in 2 months", () => {
    expect(formatTimeAgo(d().add(60, "day"))).toBe("in 2mos");
  });
  it("in 2 months 14 days", () => {
    expect(formatTimeAgo(d().add(74, "day"))).toBe("in 2mos");
  });

  it("in 3 days", () => {
    expect(formatTimeAgo(d().add(3, "day"))).toBe("in 3d");
  });
  it("in 3 days 4 hours", () => {
    expect(formatTimeAgo(d().add(3, "day").add(4, "hour"))).toBe("in 3d");
  });

  it("in 2 days", () => {
    expect(formatTimeAgo(d().add(2, "day"))).toBe("in 2d");
  });
  it("in 2 days 4 hours", () => {
    expect(formatTimeAgo(d().add(2, "day").add(4, "hour"))).toBe("in 2d 4hrs");
  });

  it("in 1 day", () => {
    expect(formatTimeAgo(d().add(1, "day"))).toBe("in 1d");
  });
  it("in 1 day 4 hours", () => {
    expect(formatTimeAgo(d().add(1, "day").add(4, "hour"))).toBe("in 1d 4hrs");
  });

  it("in 2 hours", () => {
    expect(formatTimeAgo(d().add(2, "hour"))).toBe("in 2hrs");
  });

  it("in 2 minutes", () => {
    expect(formatTimeAgo(d().add(2, "minute"))).toBe("in 2mins");
  });

  it("in a minute", () => {
    expect(formatTimeAgo(d().add(1, "minute"))).toBe("in 1min");
  });

  it("now/future within 60 seconds", () => {
    expect(formatTimeAgo(d().add(30, "second"))).toBe("now");
    expect(formatTimeAgo(d().add(15, "second"))).toBe("now");
    expect(formatTimeAgo(d().add(10, "second"))).toBe("now");
    expect(formatTimeAgo(d().add(9, "second"))).toBe("now");
    expect(formatTimeAgo(d().add(3, "second"))).toBe("now");
  });
});

describe("unknown time", () => {
  it("falsy value", () => {
    expect(formatTimeAgo(null)).toBe("unknown time");
    expect(formatTimeAgo(undefined)).toBe("unknown time");
    expect(formatTimeAgo(false)).toBe("unknown time");
  });
});
