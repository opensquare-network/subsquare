export function useStakingNominationsCommissionColumn() {
  return {
    name: "Commission",
    style: { textAlign: "right", width: "120px", minWidth: "120px" },
    render: (item) => (
      <span key="commission" className="text14Medium text-textPrimary">
        {(parseFloat(item.commission) / 10000000).toFixed(2)}%
      </span>
    ),
  };
}
