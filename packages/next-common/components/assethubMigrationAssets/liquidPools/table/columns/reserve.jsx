import ValueDisplay from "next-common/components/valueDisplay";

export const colReserve = {
  name: "Reserve",
  style: { textAlign: "right", width: "180px", minWidth: "180px" },
  render: (item) => (
    <div className="flex flex-col items-end gap-0.5">
      <ValueDisplay
        key={`${item.poolAssetId}-1`}
        value={item.reserve1}
        symbol={item.token1.symbol}
      />
      <ValueDisplay
        key={`${item.poolAssetId}-2`}
        value={item.reserve2}
        symbol={item.token2.symbol}
      />
    </div>
  ),
};
