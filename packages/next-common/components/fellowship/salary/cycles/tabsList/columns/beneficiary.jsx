import { AddressUser } from "next-common/components/user";

export function useFellowshipSalaryCycleBeneficiaryColumn() {
  return {
    name: "Beneficiary",
    width: 212,
    cellRender(data) {
      return <AddressUser add={data.beneficiary} />;
    },
  };
}
