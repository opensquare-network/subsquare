import BigNumber from "bignumber.js";

export default function NumberWithComma({ value, symbol = "", otherContent }) {
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
    <>
      {formattedNumber}
      {symbol && ` ${symbol}`}
      {otherContent}
    </>
  );
}
