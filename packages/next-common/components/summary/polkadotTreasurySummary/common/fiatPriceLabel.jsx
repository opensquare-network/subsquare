import { useChainSettings } from "next-common/context/chain";
import { isNil } from "lodash-es";
import ValueDisplay from "next-common/components/valueDisplay";
import BigNumber from "bignumber.js";
import useFiatPrice, {
  useFiatPriceBySymbol,
} from "next-common/hooks/useFiatPrice";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";

export default function FiatPriceLabel({
  free = 0,
  usdcBalance = 0,
  usdtBalance = 0,
  mythTokenBalance = 0,
}) {
  const { price: fiatPrice } = useFiatPrice();
  const { decimals } = useChainSettings();
  const { price: MYTHFiatPrice, isLoading: isMYTHFiatPriceLoading } =
    useFiatPriceBySymbol("MYTH");

  const mythTokenFiatValue = BigNumber(mythTokenBalance)
    .dividedBy(Math.pow(10, 18))
    .multipliedBy(MYTHFiatPrice);

  const totalPrice = BigNumber(free)
    .dividedBy(Math.pow(10, decimals))
    .multipliedBy(fiatPrice)
    .plus(toPrecision(usdcBalance, SYMBOL_DECIMALS.USDC))
    .plus(toPrecision(usdtBalance, SYMBOL_DECIMALS.USDT))
    .plus(mythTokenFiatValue);

  return (
    <div>
      {!isNil(fiatPrice) && !isMYTHFiatPriceLoading && (
        <ValueDisplay value={totalPrice} symbol={""} prefix={"$"} />
      )}
    </div>
  );
}
