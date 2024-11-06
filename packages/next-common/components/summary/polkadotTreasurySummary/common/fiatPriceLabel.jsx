import { useChainSettings } from "next-common/context/chain";
import { isNil } from "lodash-es";
import ValueDisplay from "next-common/components/valueDisplay";
import BigNumber from "bignumber.js";
import useFiatPrice from "next-common/hooks/useFiatPrice";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";

// TODO: fetch Myth Token fiat price
const mythTokenFiatPrice = 0.2168;

export default function FiatPriceLabel({
  free = 0,
  usdcBalance = 0,
  usdtBalance = 0,
  mythTokenBalance = 0,
}) {
  const { price: fiatPrice } = useFiatPrice();
  const { decimals } = useChainSettings();

  const mythTokenFiatValue = BigNumber(mythTokenBalance || 0)
    .dividedBy(Math.pow(10, SYMBOL_DECIMALS.MYTH))
    .multipliedBy(mythTokenFiatPrice);

  const totalPrice = BigNumber(free || 0)
    .dividedBy(Math.pow(10, decimals))
    .multipliedBy(fiatPrice)
    .plus(toPrecision(usdcBalance, SYMBOL_DECIMALS.USDC))
    .plus(toPrecision(usdtBalance, SYMBOL_DECIMALS.USDT))
    .plus(mythTokenFiatValue);

  return (
    <div>
      {!isNil(fiatPrice) && (
        <ValueDisplay value={totalPrice} symbol={""} prefix={"$"} />
      )}
    </div>
  );
}
