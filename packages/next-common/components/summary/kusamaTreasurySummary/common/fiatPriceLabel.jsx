import { useChainSettings } from "next-common/context/chain";
import { isNil } from "lodash-es";
import ValueDisplay from "next-common/components/valueDisplay";
import BigNumber from "bignumber.js";
import { useFiatPriceSnapshot } from "next-common/hooks/useFiatPrice";

export default function FiatPriceLabel({ free = 0 }) {
  const { price: fiatPrice } = useFiatPriceSnapshot();
  const { decimals } = useChainSettings();

  const totalPrice = BigNumber(free)
    .dividedBy(Math.pow(10, decimals))
    .multipliedBy(fiatPrice);

  return (
    <div>
      {!isNil(fiatPrice) && (
        <ValueDisplay value={totalPrice} symbol={""} prefix={"$"} />
      )}
    </div>
  );
}
