import useCoretimeSaleInterludeEndHeight from "next-common/context/coretime/hooks/heights/useCoretimeSaleInterludeEndHeight";
import useCoretimeSaleEnd from "next-common/context/coretime/hooks/useCoretimeSaleEnd";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import CoretimeSalePanelChartPeriodProgress from "./periodProgress";
import CoretimeSalePanelChartStatistics from "./statistics";

export default function CoretimeSalePanelChart() {
  const coretimeSale = useCoretimeSale();
  const { initIndexer: { blockHeight: initBlockHeight } = {} } = coretimeSale;
  const endSale = useCoretimeSaleEnd();
  const interludeEndHeight = useCoretimeSaleInterludeEndHeight();

  const endBlockHeight = endSale?.indexer?.blockHeight;
  const totalBlocks = endBlockHeight - initBlockHeight;
  const fixedBlockHeight =
    coretimeSale.info.saleStart + coretimeSale.info.leadinLength;

  return (
    <div>
      <CoretimeSalePanelChartStatistics
        className="h-52"
        initBlockHeight={initBlockHeight}
        endBlockHeight={endBlockHeight}
        totalBlocks={totalBlocks}
        interludeEndHeight={interludeEndHeight}
        coretimeSale={coretimeSale}
        fixedBlockHeight={fixedBlockHeight}
      />

      <CoretimeSalePanelChartPeriodProgress
        className="mt-2"
        endBlockHeight={endBlockHeight}
        totalBlocks={totalBlocks}
        interludeEndHeight={interludeEndHeight}
      />
    </div>
  );
}
