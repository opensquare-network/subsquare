import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { isNil } from "lodash-es";
import ValueDisplay from "next-common/components/valueDisplay";
import BigNumber from "bignumber.js";
import useBifrostPolkadotFiatPrice from "./useBifrostPolkadotFiatPrice";

export default function FiatPriceLabel({ free = 0 }) {
  const fiatPrice = useBifrostPolkadotFiatPrice();
  const { decimals } = useChainSettings();
  const value = toPrecision(free || 0, decimals);
  const bn = BigNumber(value);
  const totalPrice = bn.multipliedBy(fiatPrice);

  return (
    <div>
      {!isNil(fiatPrice) && (
        <ValueDisplay
          showApproximationSymbol={false}
          value={totalPrice}
          symbol={""}
          prefix={"$"}
        />
      )}
    </div>
  );
}
