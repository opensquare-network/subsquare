import ValueDisplay from "next-common/components/valueDisplay";

export const colTvl = {
  name: "TVL",
  style: { textAlign: "right", minWidth: "180px" },
  render: (item) =>
    item.tvl ? (
      <ValueDisplay value={item.tvl} symbol={item.tvlSymbol} />
    ) : (
      <span className="text14Medium text-textTertiary">-</span>
    ),
};
