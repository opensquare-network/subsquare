import AddressUser from "next-common/components/user/addressUser";

export function useStatisticsClaimantColumn() {
  return {
    name: "Claimant",
    cellRender(data) {
      return <AddressUser key={data.who} add={data.who} />;
    },
  };
}
