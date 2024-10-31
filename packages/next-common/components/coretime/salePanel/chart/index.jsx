import useCoretimeSaleEnd from "next-common/context/coretime/hooks/useCoretimeSaleEnd";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import CoretimeSalePanelChartPeriodProgress from "./periodProgress";
import CoretimeSalePanelChartStatistics from "./statistics";

export default function CoretimeSalePanelChart() {
  const coretimeSale = useCoretimeSale();
  const {
    initIndexer: { blockHeight: initBlockHeight } = {},
    info: { saleStart, leadinLength },
  } = coretimeSale;
  const endSale = useCoretimeSaleEnd();

  const endBlockHeight = endSale?.indexer?.blockHeight;
  const totalBlocks = endBlockHeight - initBlockHeight;
  const fixedStart = saleStart + leadinLength;

  const isLoading = endSale?.isLoading;

  return (
    <div>
      <CoretimeSalePanelChartStatistics
        className="h-52 -ml-0.5"
        initBlockHeight={initBlockHeight}
        totalBlocks={totalBlocks}
        coretimeSale={coretimeSale}
        saleStart={saleStart}
        fixedStart={fixedStart}
        isLoading={isLoading}
      />

      <CoretimeSalePanelChartPeriodProgress
        className="mt-2"
        initBlockHeight={initBlockHeight}
        endBlockHeight={endBlockHeight}
        totalBlocks={totalBlocks}
        saleStart={saleStart}
        fixedStart={fixedStart}
        isLoading={isLoading}
      />
    </div>
  );
}
