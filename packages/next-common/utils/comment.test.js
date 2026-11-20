import { describe, expect, it } from "vitest";
import {
  getCommentContentLength,
  getCommentsSummaryStats,
  shouldShowCommentsAiSummary,
} from "./comment";

describe("getCommentContentLength", () => {
  it("strips html tags", () => {
    expect(
      getCommentContentLength({
        contentType: "html",
        content: "<p>hello <strong>world</strong></p>",
      }),
    ).toBe("hello world".length);
  });

  it("ignores markdown base64 images", () => {
    expect(
      getCommentContentLength({
        contentType: "markdown",
        content: "hello ![image](data:image/png;base64,AAAA)",
      }),
    ).toBe("hello image".length);
  });
});

describe("getCommentsSummaryStats", () => {
  it("counts only comments linked to the post and includes replies", () => {
    const stats = getCommentsSummaryStats(
      [
        { post: "id", contentType: "markdown", content: "1234" },
        { contentType: "markdown", content: "ignored" },
        {
          post: "id",
          contentType: "markdown",
          content: "56",
          replies: [
            { post: "id", contentType: "markdown", content: "789" },
            { contentType: "markdown", content: "ignored" },
          ],
        },
        { post: "id", contentType: "markdown", content: "x", spam: true },
      ],
      "post",
    );

    expect(stats).toEqual({ count: 3, textLength: 9 });
  });
});

describe("shouldShowCommentsAiSummary", () => {
  it("requires at least 5 comments and 1000 characters", () => {
    const shortComments = Array.from({ length: 5 }, () => ({
      post: "id",
      contentType: "markdown",
      content: "a".repeat(100),
    }));
    expect(shouldShowCommentsAiSummary(shortComments, "post")).toBe(false);

    const fourLongComments = Array.from({ length: 4 }, () => ({
      post: "id",
      contentType: "markdown",
      content: "a".repeat(300),
    }));
    expect(shouldShowCommentsAiSummary(fourLongComments, "post")).toBe(false);

    const enoughComments = Array.from({ length: 5 }, () => ({
      post: "id",
      contentType: "markdown",
      content: "a".repeat(200),
    }));
    expect(shouldShowCommentsAiSummary(enoughComments, "post")).toBe(true);
  });
});
