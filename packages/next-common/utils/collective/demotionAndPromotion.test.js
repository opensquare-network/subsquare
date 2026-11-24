import { describe, expect, it } from "vitest";
import {
  isDemotionAboutToExpire,
  isDemotionExpired,
  isPromotable,
} from "./demotionAndPromotion";

const member = {
  rank: 1,
  lastProof: 100,
  lastPromotion: 100,
  blockTime: 6000,
  params: { demotionPeriod: [10], minPromotionPeriod: [0, 10] },
};

describe("Fellowship period eligibility", () => {
  it.each([null, undefined])(
    "waits for the relay height (%s)",
    (latestHeight) => {
      const input = { ...member, latestHeight };

      expect(isDemotionAboutToExpire(input)).toBe(false);
      expect(isDemotionExpired(input)).toBe(false);
      expect(isPromotable(input)).toBe(false);
    },
  );

  it("changes eligibility when the relay height reaches the deadline", () => {
    const beforeDeadline = { ...member, latestHeight: 109 };
    const atDeadline = { ...member, latestHeight: 110 };

    expect(isDemotionAboutToExpire(beforeDeadline)).toBe(true);
    expect(isDemotionExpired(beforeDeadline)).toBe(false);
    expect(isPromotable(beforeDeadline)).toBe(false);
    expect(isDemotionAboutToExpire(atDeadline)).toBe(false);
    expect(isDemotionExpired(atDeadline)).toBe(true);
    expect(isPromotable(atDeadline)).toBe(true);
  });
});
