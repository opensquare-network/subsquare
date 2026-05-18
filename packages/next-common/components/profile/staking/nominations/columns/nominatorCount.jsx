export function useStakingNominationsNominatorCountColumn() {
  return {
    name: "Nominator Count",
    style: { textAlign: "right", width: "150px", minWidth: "150px" },
    render: (item) => (
      <span key="nominatorCount" className="text14Medium text-textPrimary">
        {item.nominator_count}
      </span>
    ),
  };
}
