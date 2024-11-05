import AddressUser from "next-common/components/user/addressUser";
import { useChainSettings } from "next-common/context/chain";

const TRIANGLE_SIZE = 8;

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

  const offsetLeft = x - TRIANGLE_SIZE - 3;
  const offsetTop = y - TRIANGLE_SIZE - 3;

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
          className="absolute left-1/2 bottom-0 bg-tooltipBg rotate-45 -translate-x-1/2 translate-y-1/2"
          style={{
            width: TRIANGLE_SIZE,
            height: TRIANGLE_SIZE,
          }}
        />
      </div>
    </div>
  );
}
