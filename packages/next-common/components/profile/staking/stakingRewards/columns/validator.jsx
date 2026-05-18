import AddressUser from "next-common/components/user/addressUser";

export function useStakingRewardsValidatorColumn() {
  return {
    name: "Validator",
    style: { textAlign: "left", minWidth: "212px" },
    render: (item) =>
      item.validator ? (
        <AddressUser key="validator" add={item.validator} />
      ) : (
        <span key="validator" className="text-textTertiary">
          -
        </span>
      ),
  };
}
