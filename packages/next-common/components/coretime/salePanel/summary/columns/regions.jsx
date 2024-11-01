import SummaryItem from "next-common/components/summary/layout/item";
import { SummaryColumnGap } from "../common";
import useCoretimeSale from "next-common/context/coretime/sale/provider";

export default function Regions() {
  const { info = {} } = useCoretimeSale();

  if (!info) {
    throw new Error(
      "Coretime sale info should be available on Regions: Regions",
    );
  }

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
