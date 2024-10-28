import useCoretimeSalePrice from "next-common/context/coretime/hooks/useCoretimeSalePrice";
import SummaryItem from "next-common/components/summary/layout/item";
import FieldLoading from "next-common/components/icons/fieldLoading";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";

export default function PriceItem() {
  const { isLoading, price } = useCoretimeSalePrice();
  const { decimals, symbol } = useChainSettings();

  return (
    <SummaryItem title="Current Price">
      {
        isLoading ? <FieldLoading /> : price ?
          (<ValueDisplay value={toPrecision(price, decimals)} symbol={symbol} />) :
          <div className="text-textTertiary">-</div>
      }
    </SummaryItem>
  );
}
