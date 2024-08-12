export function useStatisticsClaimantsCycleColumn() {
  return {
    name: "Cycles",
    width: 160,
    cellRender(data) {
      return (
        <span className="text14Medium text-textPrimary">{data.cycles}</span>
      );
    },
  };
}
