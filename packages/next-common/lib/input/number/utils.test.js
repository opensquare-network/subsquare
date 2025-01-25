import { describe, expect, it } from "vitest";
import { numberInputUtils } from "./utils";

const localeConfig = {
  groupSeparator: ",",
  decimalSeparator: ".",
};

describe("count", () => {
  it("one ,", () => {
    expect(numberInputUtils.count("1,234", ",")).toBe(1);
  });

  it("two ,", () => {
    expect(numberInputUtils.count("1,234,567", ",")).toBe(2);
  });
});

describe("cleanValue", () => {
  it("1,234 > 1234", () => {
    expect(numberInputUtils.cleanValue("1,234", localeConfig)).toBe("1234");
  });

  it("clean non-numeric 1asd234 > 1234", () => {
    expect(numberInputUtils.cleanValue("1asd234", localeConfig)).toBe("1234");
  });

  it("1234.1.2.3 > 1234.1.2.3", () => {
    expect(numberInputUtils.cleanValue("1234.1.2.3", localeConfig)).toBe(
      "1234.1.2.3",
    );
  });

  it("not allow decimals 1234.1.2.3 > 1234123", () => {
    expect(
      numberInputUtils.cleanValue("1234.1.2.3", {
        allowDecimals: false,
        ...localeConfig,
      }),
    ).toBe("1234123");
  });
});

describe("formatValue", () => {
  it("1234 > 1,234", () => {
    expect(numberInputUtils.formatValue("1234", localeConfig)).toBe("1,234");
  });

  it("1234.56 > 1,234.56", () => {
    expect(numberInputUtils.formatValue("1234.56", localeConfig)).toBe(
      "1,234.56",
    );
  });

  it("duplicated(.) 1234.56.78 > 1,234.56", () => {
    expect(numberInputUtils.formatValue("1234.56.78", localeConfig)).toBe(
      "1,234.56",
    );
  });

  it("ends with(.) 1234. > 1,234", () => {
    expect(numberInputUtils.formatValue("1234.", localeConfig)).toBe("1,234.");
  });

  it("1234.5678 > 1,234.5678", () => {
    expect(numberInputUtils.formatValue("1234.5678", localeConfig)).toBe(
      "1,234.5678",
    );
  });

  it("ends with 0, 1230 > 1,230", () => {
    expect(numberInputUtils.formatValue("1230", localeConfig)).toBe("1,230");
  });

  it("ends with decimal 0, 1234567.890 > 1,234,567.890", () => {
    expect(numberInputUtils.formatValue("1234567.890", localeConfig)).toBe(
      "1,234,567.890",
    );
  });
});
