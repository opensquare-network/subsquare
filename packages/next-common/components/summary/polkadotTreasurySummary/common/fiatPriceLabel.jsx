import { useChainSettings } from "next-common/context/chain";
import { isNil } from "lodash-es";
import ValueDisplay from "next-common/components/valueDisplay";
import BigNumber from "bignumber.js";
import { useFiatPriceSnapshot } from "next-common/hooks/useFiatPrice";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";

function FiatPriceLabelInner({
  free,
  usdcBalance,
  usdtBalance,
  hollarBalance,
  fiatPrice,
}) {
  const { decimals } = useChainSettings();
  const totalPrice = BigNumber(free)
    .dividedBy(Math.pow(10, decimals))
    .multipliedBy(fiatPrice)
    .plus(toPrecision(usdcBalance, SYMBOL_DECIMALS.USDC))
    .plus(toPrecision(usdtBalance, SYMBOL_DECIMALS.USDT))
    .plus(toPrecision(hollarBalance, SYMBOL_DECIMALS.HOLLAR));

  return (
    <div>
      {!isNil(fiatPrice) && (
        <ValueDisplay value={totalPrice} symbol={""} prefix={"$"} />
      )}
    </div>
  );
}

function FiatPriceLabelWithHook({
  free,
  usdcBalance,
  usdtBalance,
  hollarBalance,
}) {
  const { price: fiatPrice } = useFiatPriceSnapshot();
  return (
    <FiatPriceLabelInner
      free={free}
      usdcBalance={usdcBalance}
      usdtBalance={usdtBalance}
      hollarBalance={hollarBalance}
      fiatPrice={fiatPrice}
    />
  );
}

export default function FiatPriceLabel({
  free = 0,
  usdcBalance = 0,
  usdtBalance = 0,
  hollarBalance = 0,
  fiatPrice,
}) {
  if (!isNil(fiatPrice)) {
    return (
      <FiatPriceLabelInner
        free={free}
        usdcBalance={usdcBalance}
        usdtBalance={usdtBalance}
        hollarBalance={hollarBalance}
        fiatPrice={fiatPrice}
      />
    );
  }

  return (
    <FiatPriceLabelWithHook
      free={free}
      usdcBalance={usdcBalance}
      usdtBalance={usdtBalance}
      hollarBalance={hollarBalance}
    />
  );
}
