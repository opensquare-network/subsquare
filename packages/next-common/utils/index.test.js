import dayjs from "dayjs";
import { timeDurationFromNow } from ".";
import { describe, expect, test } from "vitest";

describe("timeDurationFromNow", () => {
  test("unknown", () => {
    expect(timeDurationFromNow()).toBe("Unknown time");
  });

  test("now", () => {
    const time = dayjs().toDate();

    expect(timeDurationFromNow(time)).toMatch("0 secs");
  });

  test("a second ago", () => {
    const time = dayjs().add(-1, "second").toDate();

    expect(timeDurationFromNow(time)).toBe("1s ago");
  });

  test("1 hour ago", () => {
    const time = dayjs().add(-1, "hour").toDate();

    expect(timeDurationFromNow(time)).toBe("1h ago");
  });

  test("3 hour and 14 minutes ago", () => {
    const time = dayjs().add(-3, "hour").add(-14, "minute").toDate();

    expect(timeDurationFromNow(time)).toBe("3hrs 14mins ago");
  });

  test("8 hours ago", () => {
    const time = dayjs().add(-8, "hours").toDate();

    expect(timeDurationFromNow(time)).toBe("8hrs ago");
  });

  test("a day ago", () => {
    const time = dayjs().add(-1, "day").toDate();

    expect(timeDurationFromNow(time)).toBe("1d ago");
  });

  test("7 days ago", () => {
    const time = dayjs().add(-7, "day").toDate();

    expect(timeDurationFromNow(time)).toBe("7d ago");
  });

  test("14 days ago", () => {
    const time = dayjs().add(-14, "day").toDate();

    expect(timeDurationFromNow(time)).toBe("14d ago");
  });

  test("a month ago", () => {
    const time = dayjs().add(-1, "month").toDate();

    expect(timeDurationFromNow(time)).toBe("1mo ago");
  });

  test("2 month ago", () => {
    const time = dayjs().add(-2, "month").toDate();

    expect(timeDurationFromNow(time)).toBe("2mos ago");
  });

  test("a year ago", () => {
    const time = dayjs().add(-1, "year").toDate();

    expect(timeDurationFromNow(time)).toBe("1y ago");
  });

  test("8 years ago", () => {
    const time = dayjs().add(-8, "year").toDate();

    expect(timeDurationFromNow(time)).toBe("8y ago");
  });

  test("in 14 seconds", () => {
    const time = dayjs().add(14, "second").toDate();

    expect(timeDurationFromNow(time)).toBe("in 14 secs");
  });

  test("in a day", () => {
    const time = dayjs().add(1, "day").toDate();

    expect(timeDurationFromNow(time)).toBe("in 1 d");
  });

  test("in 6 days", () => {
    const time = dayjs().add(6, "day").toDate();

    expect(timeDurationFromNow(time)).toBe("in 6d");
  });

  test("in 8 years", () => {
    const time = dayjs().add(8, "year").toDate();

    expect(timeDurationFromNow(time)).toBe("in 8 y");
  });
});
