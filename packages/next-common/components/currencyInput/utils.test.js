import { describe, expect, it } from "vitest";
import { currencyInputUtils } from "./utils";

describe("count", () => {
  it("one ,", () => {
    expect(currencyInputUtils.count("1,234", ",")).toBe(1);
  });

  it("two ,", () => {
    expect(currencyInputUtils.count("1,234,567", ",")).toBe(2);
  });
});

describe("cleanValue", () => {
  it("1,234 > 1234", () => {
    expect(currencyInputUtils.cleanValue("1,234")).toBe("1234");
  });

  it("clean non-numeric 1asd234 > 1234", () => {
    expect(currencyInputUtils.cleanValue("1asd234")).toBe("1234");
  });

  it("1234.1.2.3 > 1234.1.2.3", () => {
    expect(currencyInputUtils.cleanValue("1234.1.2.3")).toBe("1234.1.2.3");
  });

  it("not allow decimals 1234.1.2.3 > 1234123", () => {
    expect(
      currencyInputUtils.cleanValue("1234.1.2.3", { allowDecimals: false }),
    ).toBe("1234123");
  });
});

describe("formatValue", () => {
  it("1234 > 1,234", () => {
    expect(currencyInputUtils.formatValue("1234")).toBe("1,234");
  });

  it("1234.56 > 1,234.56", () => {
    expect(currencyInputUtils.formatValue("1234.56")).toBe("1,234.56");
  });

  it("duplicated(.) 1234.56.78 > 1,234.56", () => {
    expect(currencyInputUtils.formatValue("1234.56.78")).toBe("1,234.56");
  });

  it("ends with(.) 1234. > 1,234.", () => {
    expect(currencyInputUtils.formatValue("1234.")).toBe("1,234.");
  });

  it("1234.5678 > 1,234.5678", () => {
    expect(currencyInputUtils.formatValue("1234.5678")).toBe("1,234.5678");
  });

  it("ends with 0, 1230 > 1,230", () => {
    expect(currencyInputUtils.formatValue("1230")).toBe("1,230");
  });

  it("ends with decimal 0, 1234567.890 > 1,234,567.890", () => {
    expect(currencyInputUtils.formatValue("1234567.890")).toBe("1,234,567.890");
  });
});
