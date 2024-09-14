import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { isNil } from "lodash-es";
import ValueDisplay from "next-common/components/valueDisplay";
import BigNumber from "bignumber.js";
import useBifrostPolkadotFiatPrice from "./useBifrostPolkadotFiatPrice";

export default function FiatPriceLabel({
  free = 0,
  USDCBalance = 0,
  USDtBalance = 0,
}) {
  const { price: fiatPrice } = useBifrostPolkadotFiatPrice();
  const { decimals } = useChainSettings();
  const value = toPrecision(free || 0, decimals);
  const bn = BigNumber(value);
  const totalPrice = bn
    .multipliedBy(fiatPrice)
    .plus(USDCBalance)
    .plus(USDtBalance);

  return (
    <div>
      {!isNil(fiatPrice) && (
        <ValueDisplay value={totalPrice} symbol={""} prefix={"$"} />
      )}
    </div>
  );
}
