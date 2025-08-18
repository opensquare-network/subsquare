import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";

export default function NumberWithComma({ value, symbol = "" }) {
  if (isNil(value)) {
    return null;
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
