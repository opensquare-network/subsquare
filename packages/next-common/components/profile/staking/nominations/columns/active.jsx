export function useStakingNominationsActiveColumn() {
  return {
    name: "Active",
    style: { textAlign: "right", width: "80px", minWidth: "80px" },
    render: (item) => (
      <span
        key="active"
        className={`text14Medium ${
          item.active ? "text-green500" : "text-textTertiary"
        }`}
      >
        {item.active ? "Yes" : "No"}
      </span>
    ),
  };
}
