import { describe, expect, it } from "vitest";
import sortTimeline from "./sort";

describe("sortTimeline", () => {
  it("orders events in the same block by event index", () => {
    const canceled = {
      indexer: { blockTime: 1000, blockHeight: 10, eventIndex: 12 },
      method: "BountyCanceled",
    };
    const valueIncreased = {
      indexer: { blockTime: 1000, blockHeight: 10, eventIndex: 5 },
      method: "BountyValueIncreased",
    };

    expect(sortTimeline([canceled, valueIncreased])).toEqual([
      valueIncreased,
      canceled,
    ]);
  });

  it("orders blocks before using event index when block times match", () => {
    const laterBlock = {
      indexer: { blockTime: 1000, blockHeight: 11, eventIndex: 1 },
    };
    const earlierBlock = {
      indexer: { blockTime: 1000, blockHeight: 10, eventIndex: 12 },
    };

    expect(sortTimeline([laterBlock, earlierBlock])).toEqual([
      earlierBlock,
      laterBlock,
    ]);
  });
});
