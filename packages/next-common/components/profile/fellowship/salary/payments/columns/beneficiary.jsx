import AddressUser from "next-common/components/user/addressUser";

export function useProfileFellowshipSalaryPaymentBeneficiaryColumn(props = {}) {
  return {
    name: "Beneficiary",
    width: 240,
    cellRender(data) {
      return <AddressUser key={data.beneficiary} add={data.beneficiary} />;
    },
    ...props,
  };
}
