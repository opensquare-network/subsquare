import AddressUser from "next-common/components/user/addressUser";
import { useChainSettings } from "next-common/context/chain";

const TRIANGLE_SIZE = 6;

export default function CoretimeSalePanelChartStatisticsTooltip({
  x,
  y,
  visible,
  data,
}) {
  const { symbol } = useChainSettings();

  if (!visible || !data) {
    return null;
  }

  const offsetLeft = x - TRIANGLE_SIZE - 4;
  const offsetTop = y - TRIANGLE_SIZE - 4;

  return (
    <div
      className="absolute z-50 pointer-events-none -translate-x-1/2 -translate-y-full"
      style={{
        left: offsetLeft,
        top: offsetTop,
      }}
    >
      <div className="rounded py-1.5 px-3 text12Normal text-textPrimaryContrast bg-tooltipBg">
        {data.source && <div>Type: {data.source}</div>}
        {data.blockHeight && (
          <div>Block: {Number(data.blockHeight).toLocaleString()}</div>
        )}
        {data.price && (
          <div>
            Price: ≈{data.price?.toFixed?.(2)} {symbol}
          </div>
        )}
        {data.who && (
          <div className="flex items-center">
            <span className="mr-1">Who:</span>
            <AddressUser
              add={data.who}
              fontSize={12}
              addressClassName="!text12Medium !text-textPrimaryContrast"
              noEvent
              noTooltip
            />
          </div>
        )}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: `${TRIANGLE_SIZE}px solid transparent`,
            borderRight: `${TRIANGLE_SIZE}px solid transparent`,
            borderTop: `${TRIANGLE_SIZE}px solid var(--tooltipBg)`,
            bottom: -TRIANGLE_SIZE + 0.5,
          }}
        />
      </div>
    </div>
  );
}
