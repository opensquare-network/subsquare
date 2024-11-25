import useCoretimeSaleEnd from "next-common/context/coretime/hooks/useCoretimeSaleEnd";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import CoretimeSalePanelChartPeriodProgress from "./periodProgress";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import CoretimeSalePanelChartSkeleton from "./skeleton";

const CoretimeSalePanelChartStatistics = dynamicClientOnly(
  () => import("./statistics"),
  {
    loading: () => <CoretimeSalePanelChartSkeleton className="h-52 mb-4" />,
  },
);

export default function CoretimeSalePanelChart({ className = "" }) {
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
    <div className={className}>
      <CoretimeSalePanelChartStatistics
        className="h-52"
        initBlockHeight={initBlockHeight}
        totalBlocks={totalBlocks}
        coretimeSale={coretimeSale}
        saleStart={saleStart}
        fixedStart={fixedStart}
        isLoading={isLoading}
      />

      <CoretimeSalePanelChartPeriodProgress
        className="mt-2"
        coretimeSale={coretimeSale}
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
