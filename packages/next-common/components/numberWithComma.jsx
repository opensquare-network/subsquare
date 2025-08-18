import BigNumber from "bignumber.js";

export default function NumberWithComma({ value, symbol = "" }) {
  if (!value) {
    return value;
  }

  const fmt = {
    decimalSeparator: ".",
    groupSeparator: ",",
    groupSize: 3,
  };

  BigNumber.config({ FORMAT: fmt });
  const formattedNumber = new BigNumber(value).toFormat();

  return (
    <span>
      {formattedNumber}
      {symbol && ` ${symbol}`}
    </span>
  );
}
