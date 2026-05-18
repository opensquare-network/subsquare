import AddressUser from "next-common/components/user/addressUser";

export function useStakingNominationsValidatorColumn() {
  return {
    name: "Validator",
    style: { textAlign: "left", minWidth: "160px" },
    render: (item) => <AddressUser key="validator" add={item.address} />,
  };
}
