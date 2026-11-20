import { describe, expect, it } from "vitest";
import { announcementText } from "./announcementText";

describe("announcementText", () => {
  it("passes text through", () => {
    expect(announcementText("hello")).toBe("hello");
  });

  it("treats anything that is not text as absent", () => {
    // A delegate on Hydration published `{"$ne": 1}` as its short description, which React
    // refused to render and took the delegation page down with it.
    expect(announcementText({ $ne: 1 })).toBeNull();
    expect(announcementText(["a"])).toBeNull();
    expect(announcementText(42)).toBeNull();
    expect(announcementText(true)).toBeNull();
    expect(announcementText(null)).toBeNull();
    expect(announcementText(undefined)).toBeNull();
  });

  it("treats blank text as absent", () => {
    expect(announcementText("")).toBeNull();
    expect(announcementText("   ")).toBeNull();
  });
});
