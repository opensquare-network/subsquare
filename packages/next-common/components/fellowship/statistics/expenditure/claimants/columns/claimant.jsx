import AddressUser from "next-common/components/user/addressUser";

export function useStatisticsClaimantColumn() {
  return {
    name: "Claimant",
    flexGrow: 1,
    minWidth: 240,
    cellRender(data) {
      return <AddressUser key={data.who} add={data.who} />;
    },
  };
}
