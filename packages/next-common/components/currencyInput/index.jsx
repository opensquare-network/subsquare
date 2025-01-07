// packages/next-common/components/balanceInput.js

import NumberInput from "next-common/lib/input/number";
import { forwardRef } from "react";

const CurrencyInput = forwardRef(CurrencyInputImpl);
export default CurrencyInput;

/**
 * @param {NumberInputProps} props
 */
function CurrencyInputImpl(props, ref) {
  return <NumberInput ref={ref} allowDecimals controls={false} {...props} />;
}
