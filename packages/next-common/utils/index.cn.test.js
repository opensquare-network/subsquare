import { describe, expect, it } from "vitest";
import { cn } from ".";

describe("utils/index.cn", () => {
  it("text classes", () => {
    expect(cn("text12Medium", "text14Medium")).toBe("text14Medium");
    expect(cn("text12Medium", "text14Medium", "text16Bold", "text20Bold")).toBe(
      "text20Bold",
    );
  });

  it("real case", () => {
    expect(
      cn(
        "flex items-center",
        "bg-theme500",
        "text12Medium text-theme500",
        "text14Medium",
      ),
    ).toBe("flex items-center bg-theme500 text-theme500 text14Medium");
  });

  it("real case 2", () => {
    expect(
      cn(
        "flex items-center",
        "block",
        "bg-theme500 bg-theme300",
        "text16Medium text14Bold",
      ),
    ).toBe("items-center block bg-theme300 text14Bold");
  });
});
