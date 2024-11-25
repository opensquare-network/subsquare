import { SummaryColumnGap } from "../common";
import { useCoretimeSaleInfo } from "next-common/context/coretime/sale/provider";

export default function Regions() {
  const info = useCoretimeSaleInfo();

  const regionBegin = info?.regionBegin?.toLocaleString();
  const regionEnd = info?.regionEnd?.toLocaleString();

  return (
    <SummaryColumnGap>
      <div className="text12Medium text-textTertiary">
        <span className="text-textTertiary">Regions</span>
        <span className="text-textPrimary ml-1">{regionBegin}</span>
        {" - "}
        <span className="text-textPrimary">{regionEnd}</span>
      </div>
    </SummaryColumnGap>
  );
}
