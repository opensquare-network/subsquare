import useTokenFiatValue from "next-common/hooks/balance/useTokenFiatValue";

export default function ValueFiatPriceDisplay({ amount, symbol }) {
  const valueFiatPrice = useTokenFiatValue(amount, symbol);

  if (!valueFiatPrice) {
    return null;
  }

  return `( ≈ $${valueFiatPrice} )`;
}
