import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import { formatTimeDuration } from "./formatTimeDuration";

describe("formatTimeDuration", () => {
  it("3yrs 2mos", () => {
    const input = dayjs.duration({ years: 3, months: 2 }).asMilliseconds();
    const result = formatTimeDuration(input);
    expect(result).toBe("3yrs");
  });

  it("1yr 2mos", () => {
    const input = dayjs.duration({ years: 1, months: 2 }).asMilliseconds();
    const result = formatTimeDuration(input);
    expect(result).toBe("1yr");
  });

  it("3d 4hrs", () => {
    const input = dayjs.duration({ days: 3, hours: 4 }).asMilliseconds();
    const result = formatTimeDuration(input);
    expect(result).toBe("3d");
  });

  it("2d 4hrs", () => {
    const input = dayjs.duration({ days: 2, hours: 4 }).asMilliseconds();
    const result = formatTimeDuration(input);
    expect(result).toBe("2d 4hrs");
  });

  it("4hrs 33mins", () => {
    const input = dayjs.duration({ hours: 4, minutes: 33 }).asMilliseconds();
    const result = formatTimeDuration(input);
    expect(result).toBe("4hrs 33mins");
  });

  it("1hr 23mins", () => {
    const input = dayjs.duration({ hours: 1, minutes: 23 }).asMilliseconds();
    const result = formatTimeDuration(input);
    expect(result).toBe("1hr 23mins");
  });

  it("23mins 12s", () => {
    const input = dayjs.duration({ minutes: 23, seconds: 12 }).asMilliseconds();
    const result = formatTimeDuration(input);
    expect(result).toBe("23mins 12s");
  });

  it("12s", () => {
    const input = dayjs.duration({ seconds: 12 }).asMilliseconds();
    const result = formatTimeDuration(input);
    expect(result).toBe("12s");
  });
});
