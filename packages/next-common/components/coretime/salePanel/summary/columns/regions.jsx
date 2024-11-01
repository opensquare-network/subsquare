import SummaryItem from "next-common/components/summary/layout/item";
import { SummaryColumnGap } from "../common";
import { useCoretimeSaleInfo } from "next-common/context/coretime/sale/provider";

export default function Regions() {
  const info = useCoretimeSaleInfo();

  const regionBegin = info?.regionBegin?.toLocaleString();
  const regionEnd = info?.regionEnd?.toLocaleString();

  return (
    <SummaryColumnGap>
      <SummaryItem title="Regions">
        <div>
          {regionBegin} - {regionEnd}
        </div>
      </SummaryItem>
    </SummaryColumnGap>
  );
}
