import useCoretimeSaleEnd from "next-common/context/coretime/hooks/useCoretimeSaleEnd";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import CoretimeSalePanelChartPeriodProgress from "./periodProgress";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { Skeleton } from "next-common/components/skeleton";
import useCoretimeSaleStart, {
  useCoretimeSaleFixedStart,
} from "next-common/hooks/coretime/useCoretimeSaleStart";
import useIsCoretimeUseRCBlockNumber from "next-common/hooks/coretime/useIsCoretimeUseRCBlockNumber";

const CoretimeSalePanelChartStatistics = dynamicClientOnly(
  () => import("./statistics"),
  {
    loading: () => <Skeleton className="w-full rounded-lg h-52 mb-4" />,
  },
);

export default function CoretimeSalePanelChart({ className = "" }) {
  const coretimeSale = useCoretimeSale();
  const { relayIndexer, initIndexer, id } = coretimeSale;
  const isUseRCBlockNumber = useIsCoretimeUseRCBlockNumber(id);
  const saleStart = useCoretimeSaleStart();
  const endSale = useCoretimeSaleEnd();
  const fixedStart = useCoretimeSaleFixedStart();

  const initBlockHeight = !isUseRCBlockNumber
    ? initIndexer.blockHeight
    : relayIndexer?.blockHeight;

  const endBlockHeight = endSale?.indexer?.blockHeight;
  const totalBlocks = endBlockHeight - initBlockHeight;
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
