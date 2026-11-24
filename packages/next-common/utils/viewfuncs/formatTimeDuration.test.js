import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import { formatTimeDuration } from "./formatTimeDuration";

describe("formatTimeDuration", () => {
  it("3yrs 2mos", () => {
    const input = dayjs.duration({ years: 3, months: 2 }).asMilliseconds();
    expect(formatTimeDuration(input)).toBe("3yrs 2mos");
    expect(formatTimeDuration(input, { slice: 1 })).toBe("3yrs");
  });

  it("1yr 2mos", () => {
    const input = dayjs.duration({ years: 1, months: 2 }).asMilliseconds();
    expect(formatTimeDuration(input)).toBe("1yr 2mos");
    expect(formatTimeDuration(input, { slice: 1 })).toBe("1yr");
  });

  it("3d 4hrs", () => {
    const input = dayjs.duration({ days: 3, hours: 4 }).asMilliseconds();
    expect(formatTimeDuration(input)).toBe("3d 4hrs");
    expect(formatTimeDuration(input, { slice: 1 })).toBe("3d");
  });

  it("2d 4hrs", () => {
    const input = dayjs.duration({ days: 2, hours: 4 }).asMilliseconds();
    expect(formatTimeDuration(input)).toBe("2d 4hrs");
    expect(formatTimeDuration(input, { slice: 1 })).toBe("2d 4hrs");
  });

  it("4hrs 33mins", () => {
    const input = dayjs.duration({ hours: 4, minutes: 33 }).asMilliseconds();
    expect(formatTimeDuration(input)).toBe("4hrs 33mins");
    expect(formatTimeDuration(input, { slice: 1 })).toBe("4hrs 33mins");
  });

  it("1hr 23mins", () => {
    const input = dayjs.duration({ hours: 1, minutes: 23 }).asMilliseconds();
    expect(formatTimeDuration(input)).toBe("1hr 23mins");
    expect(formatTimeDuration(input, { slice: 1 })).toBe("1hr 23mins");
  });

  it("23mins 12s", () => {
    const input = dayjs.duration({ minutes: 23, seconds: 12 }).asMilliseconds();
    expect(formatTimeDuration(input)).toBe("23mins 12s");
    expect(formatTimeDuration(input, { slice: 1 })).toBe("23mins 12s");
  });

  it("12s", () => {
    const input = dayjs.duration({ seconds: 12 }).asMilliseconds();
    expect(formatTimeDuration(input)).toBe("12s");
  });

  it("drops insignificant trailing units", () => {
    const oneYearSixHours = dayjs
      .duration({ years: 1, hours: 6 })
      .asMilliseconds();
    expect(
      formatTimeDuration(oneYearSixHours, { dropInsignificant: true }),
    ).toBe("1yr");
    expect(
      formatTimeDuration(oneYearSixHours, {
        withUnitSpace: true,
        dropInsignificant: true,
      }),
    ).toBe("1 yr");

    const sixMonthsTwoDays = dayjs
      .duration({ months: 6, days: 2 })
      .asMilliseconds();
    expect(
      formatTimeDuration(sixMonthsTwoDays, { dropInsignificant: true }),
    ).toBe("6mos");

    const nineMonthsTwentyTwoDays = dayjs
      .duration({ months: 9, days: 22 })
      .asMilliseconds();
    expect(
      formatTimeDuration(nineMonthsTwentyTwoDays, { dropInsignificant: true }),
    ).toBe("9mos 22d");
  });

  it("keeps significant trailing units", () => {
    const input = dayjs.duration({ days: 3, hours: 4 }).asMilliseconds();
    expect(formatTimeDuration(input, { dropInsignificant: true })).toBe(
      "3d 4hrs",
    );
  });

  it("32d 1hr", () => {
    const input = dayjs
      .duration({ months: 1, days: 2, hours: 1 })
      .asMilliseconds();
    expect(formatTimeDuration(input, { showMonths: false })).toBe("32d 1hr");
  });

  it("397d 1hr 23mins", () => {
    const input = dayjs
      .duration({ year: 1, months: 1, days: 2, hours: 1, minutes: 23 })
      .asMilliseconds();
    expect(formatTimeDuration(input, { showMonths: false })).toBe("397d 1hr");
    expect(formatTimeDuration(input, { showMonths: false, slice: 3 })).toBe(
      "397d 1hr 23mins",
    );
  });
});
